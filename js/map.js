'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPinMain = document.querySelector('.map__pin--main');
  var fragment = document.createDocumentFragment();
  var filterContainer = document.querySelector('.map__filters-container');

  // Константы
  var constants = {
    PIN_START_TOP: 375,
    PIN_START_LEFT: 570,
    MAX_PINS: 5,
    MAP_WIDTH: 1200
  };

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

    window.adAround = [];
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
  (function () {
    mapPinMain.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      // Объявляем стартовые координаты
      var startCoords = {
        x: evt.clientX,
        y: evt.clientY
      };
      // Высчитываем координаты после перемещения мыши
      var onMouseMove = function (moveEvt) {
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
            // Перезаписываем стартовые координаты
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
      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  })();

  // Удаление листенера при закрытии окна с объявлением
  var closeHandler = function () {
    if (window.globals.map.currentOffer && popupCloseButton) {
      popupCloseButton.removeEventListener('click', closeHandler);
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
    // Идем по массиву с объявлениями и создаем объекты для массива с пинами
    ads = ads || [];
    var renderedAds = getRandom(ads, constants.MAX_PINS);
    renderedAds.forEach(function (item) {
      var pin = window.createPin(item);
      fragment.appendChild(pin); // Добавляем во фрагмент каждый созданный пин
      renderedPins.push(pin); // Добавляем в массив объект, с данными на каждый созданный пин

      // Слушатель для открытия объявления по нажатию на пин
      pin.addEventListener('click', function () {
        window.globals.map.currentOfferHandler();
        window.globals.map.currentOffer = window.createCard(item); // Вызываем функцию создания карточки объявления для каждого объекта в массиве объявлений
        popupCloseButton = window.globals.map.currentOffer.querySelector('.popup__close');
        popupCloseButton.addEventListener('click', closeHandler); // Добавляем слушатель для закрытия по нажатию на крестик
        document.addEventListener('keydown', closeEventHandler);
        mapCard.insertBefore(window.globals.map.currentOffer, filterContainer); // Добавлем в разметку выбранную карточку-объявление
      });
    });
    target.appendChild(fragment);
  };

  Object.assign(window.globalFunction, {
    hideUI: hideUI,
    render: render
  });
})();
