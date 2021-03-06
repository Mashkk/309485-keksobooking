'use strict';

(function () {
  var selector = {
    '100': {
      capacity: ['0'],
      error: 'Для 100 комнат гостей указывать нельзя'
    },
    '1': {
      capacity: ['1'],
      error: 'Для 1 комнаты можно указать 1 гостя'
    },
    '2': {
      capacity: ['1', '2'],
      error: 'Для 2 комнат, можно указать 1 или 2 гостей'
    },
    '3': {
      capacity: ['1', '2', '3'],
      error: 'Для 3 комнат можно указать 1, 2 или 3 гостей'
    }
  };
  var minPriceForType = {
    'bungalo': '0',
    'flat': '1000',
    'house': '5000',
    'palace': '10000'
  };
  var form = document.querySelector('.ad-form');
  var resetButton = document.querySelector('.ad-form__reset');
  var checkin = form.querySelector('#timein');
  var checkout = form.querySelector('#timeout');
  var roomNumber = form.querySelector('#room_number');
  var capacity = form.querySelector('#capacity');
  var price = form.querySelector('#price');
  var type = form.querySelector('#type');
  var address = form.querySelector('#address');
  var successMessage = document.querySelector('.success');

  // Отправка формы
  form.addEventListener('submit', function (evt) {
    window.globalFunction.uploadData(form, function () {
      successMessage.classList.remove('hidden');
      document.addEventListener('click', closeSuccessHandler);
      document.addEventListener('keydown', closeSuccessEventHandler);
    });
    window.globals.filter.filterForm.reset();
    window.globalFunction.hideUI();
    evt.preventDefault();
  });

  var closeSuccessHandler = function () {
    document.removeEventListener('click', closeSuccessHandler);
    document.removeEventListener('keydown', closeSuccessEventHandler);
    successMessage.classList.add('hidden');
  };

  var closeSuccessEventHandler = function (evt) {
    if (evt.keyCode === window.globals.map.ESC_KEYCODE) {
      closeSuccessHandler();
    }
  };

  var resetForm = function () {
    form.reset();
    address.value = window.globals.map.setInitAddress();
  };

  // Reset
  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.globals.map.pinInitCoord();
    resetForm();
    window.globals.filter.filterForm.reset();
    window.globalFunction.hideUI();
  });

  // Валидация полей кол-ва-гостей и комнат
  var roomSelectHandler = function () {
    var selectedCapacity = selector[roomNumber.value].capacity;
    if (selectedCapacity.indexOf(capacity.value) === -1) {
      capacity.setCustomValidity(selector[roomNumber.value].error);
    } else {
      capacity.setCustomValidity('');
    }
  };
  // Подписываемся на изменения select гостей и комнат
  roomNumber.addEventListener('change', roomSelectHandler);
  capacity.addEventListener('change', roomSelectHandler);

  // Синхронизация времени заезда/выезда
  var checkinHandler = function () {
    if (checkin.value !== checkout.value) {
      checkout.value = checkin.value;
    }
  };
  var checkoutHandler = function () {
    if (checkin.value !== checkout.value) {
      checkin.value = checkout.value;
    }
  };
  checkin.addEventListener('change', checkinHandler);
  checkout.addEventListener('change', checkoutHandler);

  // Установка минимальной цены в зависимости от выбранного типа жилья
  var minPriceHandler = function () {
    var minPrice = minPriceForType[type.value];
    price.min = minPrice;
    price.placeholder = minPrice;
  };
  type.addEventListener('change', minPriceHandler);

  price.addEventListener('invalid', function () {
    if (price.validity.rangeUnderflow) {
      price.setCustomValidity('Минимальная цена для данного типа жилья ' + price.min);
    } else if (price.validity.rangeOverflow) {
      price.setCustomValidity('Максимальная цена для данного типа жилья ' + price.max);
    } else {
      price.setCustomValidity('');
    }
  });

  Object.assign(window.globalFunction, {
    resetForm: resetForm
  });
})();
