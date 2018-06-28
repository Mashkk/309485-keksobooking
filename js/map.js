'use strict';

(function () {
  var map = document.querySelector('.map');
  var mapPins = document.querySelector('.map__pins');
  var mapPinMain = document.querySelector('.map__pin--main');
  var fragment = document.createDocumentFragment();
  var filterContainer = document.querySelector('.map__filters-container');

  // Константы
  window.constants = {
    PIN_HEIGHT: 84,
    PIN_WIDTH: 62,
    MAP_WIDTH: 1200,
    ESC_KEYCODE: 27
  };

  // Массив с пинами
  var renderedPins = [];
  // Хранение эл-та с окном описания объявления
  var currentOffer = null;
  var popupCloseButton = null;
  var mapCard = document.querySelector('.map');
  var adForm = document.querySelector('.ad-form');
  var adFormFieldsets = adForm.querySelectorAll('fieldset');
  var formAddressInput = document.querySelector('#address');

  // Стартовое значения поля адреса
  formAddressInput.value = (mapPinMain.offsetLeft + window.constants.PIN_WIDTH / 2) + ' ' + (mapPinMain.offsetTop + window.constants.PIN_HEIGHT);

  // Активация страницы
  var showUI = function () {
    map.classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    for (var i = 0; i < adFormFieldsets.length; i++) {
      adFormFieldsets[i].disabled = false;
    }
    // Отрисовка пинов
    renderPins(window.adAround, mapPins);
    mapPinMain.removeEventListener('mouseup', showUI);
  };

  mapPinMain.addEventListener('mouseup', showUI);

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
        var INDENT_TOP = 130 - window.constants.PIN_HEIGHT;
        var INDENT_BOTTOM = 630 - window.constants.PIN_HEIGHT;

        // Проверка на область координат
        if (moveEvt.clientX >= (map.offsetLeft + window.constants.PIN_WIDTH / 2) && moveEvt.clientX <= (map.offsetLeft + window.constants.MAP_WIDTH - window.constants.PIN_WIDTH / 2) && regulationCoordsY >= INDENT_TOP && regulationCoordsY <= INDENT_BOTTOM) {
          startCoords = {
            // Перезаписываем стартовые координаты
            x: moveEvt.clientX,
            y: moveEvt.clientY
          };
          // Заполение поля адреса
          formAddressInput.value = (mapPinMain.offsetLeft - shift.x + window.constants.PIN_WIDTH / 2) + ' ' + (mapPinMain.offsetTop - shift.y + window.constants.PIN_HEIGHT);
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
    if (currentOffer && popupCloseButton) {
      popupCloseButton.removeEventListener('click', closeHandler);
      document.removeEventListener('keydown', closeEventHandler);
      currentOffer.remove();
      currentOffer = null;
      popupCloseButton = null;
    }
  };
  // Закрытие по клавише Esc
  var closeEventHandler = function (evt) {
    if (evt.keyCode === window.constants.ESC_KEYCODE) {
      closeHandler();
    }
  };
  document.addEventListener('keydown', closeEventHandler);
  // Рендер пинов, открытие объявления по клику на соотвествующий пин и закрытие
  var renderPins = function (ads, target) {
    // Идем по массиву с объявлениями и создаем объекты для массива с пинами
    ads.forEach(function (item) {
      var pin = window.createPin(item);
      fragment.appendChild(pin); // Добавляем во фрагмент каждый созданный пин
      renderedPins.push(pin); // Добавляем в массив объект, с данными на каждый созданный пин

      // Слушатель для открытия объявления по нажатию на пин
      pin.addEventListener('click', function () {
        if (currentOffer) {
          currentOffer.remove(); // Вначале функции убираем объявление, если есть открытое
        }
        currentOffer = window.createCard(item); // Вызываем функцию создания карточки объявления для каждого объекта в массиве объявлений
        popupCloseButton = currentOffer.querySelector('.popup__close');
        popupCloseButton.addEventListener('click', closeHandler); // Добавляем слушатель для закрытия по нажатию на крестик
        mapCard.insertBefore(currentOffer, filterContainer); // Добавлем в разметку выбранную карточку-объявление
      });
    });
    target.appendChild(fragment);
  };
})();
