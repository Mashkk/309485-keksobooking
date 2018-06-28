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
  var checkin = document.querySelector('#timein');
  var checkout = document.querySelector('#timeout');
  var roomNumber = document.querySelector('#room_number');
  var capacity = document.querySelector('#capacity');
  var price = document.querySelector('#price');
  var type = document.querySelector('#type');

  // Валидация полей кол-ва-гостей и комнат
  var roomSelectHandler = function () {
    var selectedCapacity = selector[roomNumber.value].capacity;// Получаем значение value option гостей и берем значение capacity соответствущего объекта
    if (selectedCapacity.indexOf(capacity.value) === -1) { // Проверка на отсутствие в этом массиве значения value гостей
      capacity.setCustomValidity(selector[roomNumber.value].error); // Вывод соотвествующего предупреждения об ошибке
    } else {
      capacity.setCustomValidity(''); // Сброс предупреждения
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
})();