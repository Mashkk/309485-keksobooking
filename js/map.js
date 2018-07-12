'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var fragment = document.createDocumentFragment();
  var filterContainer = document.querySelector('.map__filters-container');

  // Globals
  window.globals = {
    PIN_HEIGHT: 84,
    PIN_WIDTH: 62,
    MAP_WIDTH: 1200,
    ESC_KEYCODE: 27,
    setInitAddress: function () {
      return (mapPinMain.offsetLeft + window.globals.PIN_WIDTH / 2) + ' ' + (mapPinMain.offsetTop + window.globals.PIN_HEIGHT);
    },
    pinInitCoord: function () {
      mapPinMain.style.top = 375 + 'px';
      mapPinMain.style.left = 570 + 'px';
    },
    MAX_PINS: 5,

    currentOffer: null,
    currentOfferHandler: function () {
      if (window.globals.currentOffer) {
        window.globals.currentOffer.remove();
      }
    }
  };

  // Массив с пинами
  var renderedPins = [];
  // Хранение эл-та с окном описания объявления
  var popupCloseButton = null;
  var mapCard = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var formAddressInput = document.querySelector('#address');
  // Стартовое значения поля адреса
  formAddressInput.value = window.globals.setInitAddress();

  // Активация страницы
  var showUI = function () {
    window.getData(function () {
      window.updateAds();
      renderPins(window.adAround, mapPins);
    });
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = false;
    }
    mapPinMain.removeEventListener('mouseup', showUI);
  };

  mapPinMain.addEventListener('mouseup', showUI);

  // Фэйд страницы
  window.globals.hideUI = function () {
    map.classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = true;
    }
    window.adAround = [];
    renderedPins.forEach(function (pin) {
      pin.remove();
    })
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
        var INDENT_TOP = 130 - window.globals.PIN_HEIGHT;
        var INDENT_BOTTOM = 630 - window.globals.PIN_HEIGHT;

        // Проверка на область координат
        if (moveEvt.clientX >= (map.offsetLeft + window.globals.PIN_WIDTH / 2) && moveEvt.clientX <= (map.offsetLeft + window.globals.MAP_WIDTH - window.globals.PIN_WIDTH / 2) && regulationCoordsY >= INDENT_TOP && regulationCoordsY <= INDENT_BOTTOM) {
          startCoords = {
            // Перезаписываем стартовые координаты
            x: moveEvt.clientX,
            y: moveEvt.clientY
          };
          // Заполение поля адреса
          formAddressInput.value = (mapPinMain.offsetLeft - shift.x + window.globals.PIN_WIDTH / 2) + ' ' + (mapPinMain.offsetTop - shift.y + window.globals.PIN_HEIGHT);
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
    if (window.globals.currentOffer && popupCloseButton) {
      popupCloseButton.removeEventListener('click', closeHandler);
      document.removeEventListener('keydown', closeEventHandler);
      window.globals.currentOffer.remove();
      window.globals.currentOffer = null;
      popupCloseButton = null;
    }
  };
  // Закрытие по клавише Esc
  var closeEventHandler = function (evt) {
    if (evt.keyCode === window.globals.ESC_KEYCODE) {
      closeHandler();
    }
  };

  // Рендер пинов, открытие объявления по клику на соотвествующий пин и закрытие
  var renderPins = window.render = function (ads, target) {
    renderedPins.forEach(function (pin) {
      pin.remove();
    })
    renderedPins = [];
    // Идем по массиву с объявлениями и создаем объекты для массива с пинами
    ads = ads || [];
    var i = 0;
    ads.forEach(function(item) {
      if (i < window.globals.MAX_PINS && i < ads.length) {
        var pin = window.createPin(item);
        fragment.appendChild(pin); // Добавляем во фрагмент каждый созданный пин
        renderedPins.push(pin); // Добавляем в массив объект, с данными на каждый созданный пин

        // Слушатель для открытия объявления по нажатию на пин
        pin.addEventListener('click', function (evt) {

          window.globals.currentOfferHandler();
          window.globals.currentOffer = window.createCard(item); // Вызываем функцию создания карточки объявления для каждого объекта в массиве объявлений
          popupCloseButton = window.globals.currentOffer.querySelector('.popup__close');
          popupCloseButton.addEventListener('click', closeHandler); // Добавляем слушатель для закрытия по нажатию на крестик
          document.addEventListener('keydown', closeEventHandler);
          mapCard.insertBefore(window.globals.currentOffer, filterContainer); // Добавлем в разметку выбранную карточку-объявление
        });
      }
      i++
    })
    target.appendChild(fragment);
  };
})();
