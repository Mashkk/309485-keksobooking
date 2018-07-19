'use strict';

(function () {

  var constants = {
    PIN_START_TOP: 375,
    PIN_START_LEFT: 570,
    MAX_PINS: 5,
    MAP_WIDTH: 1200
  };

  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var fragment = document.createDocumentFragment();
  var filterContainer = document.querySelector('.map__filters-container');

  // Globals
  window.globals.map = {
    PIN_HEIGHT: 84,
    PIN_WIDTH: 62,
    ESC_KEYCODE: 27,

    setInitAddress: function () {
      return (mapPinMain.offsetLeft + window.globals.map.PIN_WIDTH / 2) + ' ' + (mapPinMain.offsetTop + window.globals.map.PIN_HEIGHT);
    },

    pinInitCoord: function () {
      mapPinMain.style.top = constants.PIN_START_TOP + 'px';
      mapPinMain.style.left = constants.PIN_START_LEFT + 'px';
    },

    currentOffer: null,
    currentOfferHandler: function () {
      if (window.globals.map.currentOffer) {
        window.globals.map.currentOffer.remove();
      }
    }
  };

  // Массив с пинами
  var renderedPins = [];
  // Хранение эл-та с окном описания объявления
  var popupCloseButton = null;
  var mapCard = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = Array.from(adForm.querySelectorAll('fieldset'));
  var formAddressInput = document.querySelector('#address');

  // Стартовое значения поля адреса
  formAddressInput.value = window.globals.map.setInitAddress();

  // Активация страницы
  var showUI = function () {
    window.globalFunction.getData(function () {
      window.globalFunction.filterHandler();
    });
    window.globalFunction.addFilterEl();
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');

    adFormFieldsets.forEach(function (input) {
      input.disabled = false;
    });
    mapPinMain.removeEventListener('mouseup', showUI);
  };

  mapPinMain.addEventListener('mouseup', showUI);

  // Фэйд страницы
  var hideUI = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');

    adFormFieldsets.forEach(function (input) {
      input.disabled = true;
    });

    window.adsAround = [];
    renderedPins.forEach(function (pin) {
      pin.remove();
    });
    window.globals.map.currentOfferHandler();
    window.globalFunction.removeFilterEl();
    renderedPins = [];
    mapPinMain.addEventListener('mouseup', showUI);
    window.scrollTo(0, 0);
  };

  // Drag & Drop
  mapPinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    // Объявляем стартовые координаты
    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };
    // Высчитываем координаты после перемещения мыши
    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      var regulationCoordsY = mapPinMain.offsetTop - shift.y;
      var INDENT_TOP = 130 - window.globals.map.PIN_HEIGHT;
      var INDENT_BOTTOM = 630 - window.globals.map.PIN_HEIGHT;

      // Проверка на область координат
      if (moveEvt.clientX >= (map.offsetLeft + window.globals.map.PIN_WIDTH / 2) && moveEvt.clientX <= (map.offsetLeft + constants.MAP_WIDTH - window.globals.map.PIN_WIDTH / 2) && regulationCoordsY >= INDENT_TOP && regulationCoordsY <= INDENT_BOTTOM) {
        startCoords = {
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
        // Заполение поля адреса
        formAddressInput.value = (mapPinMain.offsetLeft - shift.x + window.globals.map.PIN_WIDTH / 2) + ' ' + (mapPinMain.offsetTop - shift.y + window.globals.map.PIN_HEIGHT);
        // Меняем координаты в CSS
        mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
        mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      }
    };
    // Drop
    var mouseUPHandler = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUPHandler);
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUPHandler);
  });

  // Удаление листенера при закрытии окна с объявлением
  var closeHandler = function () {
    if (window.globals.map.currentOffer && popupCloseButton) {
      document.removeEventListener('keydown', closeEventHandler);
      window.globals.map.currentOffer.remove();
      window.globals.map.currentOffer = null;
      popupCloseButton = null;
    }
  };
  // Закрытие по клавише Esc
  var closeEventHandler = function (evt) {
    if (evt.keyCode === window.globals.map.ESC_KEYCODE) {
      closeHandler();
    }
  };

  var shuffle = function (array) {
    var length = array === null ? 0 : array.length;
    if (!length) {
      return [];
    }
    var index = -1;
    var lastIndex = length - 1;
    var result = array.slice();
    while (++index < length) {
      var rand = index + Math.floor(Math.random() * (lastIndex - index + 1));
      var value = result[rand];
      result[rand] = result[index];
      result[index] = value;
    }
    return result;
  };
  var getRandom = function (ads, adsCount) {
    var shuffledAds = shuffle(ads);

    return shuffledAds.length < adsCount ? shuffledAds : shuffledAds.slice(0, adsCount);
  };

  // Рендер пинов, открытие объявления по клику на соотвествующий пин и закрытие
  var render = function (ads, target) {
    renderedPins.forEach(function (pin) {
      pin.remove();
    });
    renderedPins = [];
    ads = ads || [];
    var renderedAds = getRandom(ads, constants.MAX_PINS);
    renderedAds.forEach(function (item) {
      var pin = window.createPin(item);
      fragment.appendChild(pin);
      renderedPins.push(pin);

      pin.addEventListener('click', function () {
        window.globals.map.currentOfferHandler();
        window.globals.map.currentOffer = window.createCard(item);
        popupCloseButton = window.globals.map.currentOffer.querySelector('.popup__close');
        popupCloseButton.addEventListener('click', closeHandler);
        document.addEventListener('keydown', closeEventHandler);
        mapCard.insertBefore(window.globals.map.currentOffer, filterContainer);
      });
    });
    target.appendChild(fragment);
  };

  Object.assign(window.globalFunction, {
    hideUI: hideUI,
    render: render
  });
})();
