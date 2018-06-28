'use strict';

// Массивы
var titleOpt = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var typeOpt = ['palace', 'flat', 'house', 'bungalo'];
var checkinOpt = ['12:00', '13:00', '14:00'];
var checkoutOpt = ['12:00', '13:00', '14:00'];
var featuresOpt = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photosOpt = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

// Переmенные
var adCount = 8;
var minPriceMock = 1000;
var maxPrice = 1000000;
var minRooms = 1;
var maxRooms = 5;
var minAvatarCount = 1;
var maxAvatarCount = 8;

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var mapPinMain = document.querySelector('.map__pin--main');
var fragment = document.createDocumentFragment();
var filterContainer = document.querySelector('.map__filters-container');

var l10nTypeOffer = {
  'flat': 'Квартира',
  'palace': 'Дворец',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

// var checkin = document.querySelector('#timein');
// var checkout = document.querySelector('#timeout');
// var roomNumber = document.querySelector('#room_number');
// var capacity = document.querySelector('#capacity');
// var price = document.querySelector('#price');
// var type = document.querySelector('#type');

// var minPriceForType = {
//   'bungalo': '0',
//   'flat': '1000',
//   'house': '5000',
//   'palace': '10000'
// };

// var selector = {
//   '100': {
//     capacity: ['0'],
//     error: 'Для 100 комнат гостей указывать нельзя'
//   },
//   '1': {
//     capacity: ['1'],
//     error: 'Для 1 комнаты можно указать 1 гостя'
//   },
//   '2': {
//     capacity: ['1', '2'],
//     error: 'Для 2 комнат, можно указать 1 или 2 гостей'
//   },
//   '3': {
//     capacity: ['1', '2', '3'],
//     error: 'Для 3 комнат можно указать 1, 2 или 3 гостей'
//   }
// };

// Константы
var PIN_HEIGHT = 84;
var PIN_WIDTH = 62;
var MAP_WIDTH = 1200;
var ESC_KEYCODE = 27;

// Итоговый массив с 8 сгенерированными объектами
var adAround = [];
// Массив с пинами
var renderedPins = [];
// Хранение эл-та с окном описания объявления
var currentOffer = null;
var popupCloseButton = null;

// Функции для рандома
// var getRandom = function (arr, doRemove) {
//   var randomIdx = Math.floor(Math.random() * arr.length);
//   var randomItem = arr[randomIdx];
//   if (doRemove) {
//     arr.splice(randomIdx, 1);
//   }

//   return randomItem;
// };

// var getRandomNumber = function (min, max) {
//   var rand = min - 0.5 + Math.random() * (max - min + 1);
//   rand = Math.round(rand);
//   return rand;
// };

// var shuffleArray = function (arr) {
//   var container;
//   var temp;
//   for (var i = arr.length - 1; i > 0; i--) {
//     container = Math.floor(Math.random() * (i + 1));
//     temp = arr[container];
//     arr[container] = arr[i];
//     arr[i] = temp;
//   }
//   return arr;
// };

// генератор для ав
var generateAvatar = function (min, max) {
  var result = [];
  for (var i = min; i <= max; i++) {
    result.push(i);
  }
  return result;
};

// Вычисление переменных
var avatarOpt = generateAvatar(minAvatarCount, maxAvatarCount);

// Сборка массива
for (var i = 0; i < adCount; i++) {
  var locationX = window.randomFunction.getRandomNumber(300, 900);
  var locationY = window.randomFunction.getRandomNumber(130, 630);

  adAround.push(
      {
        author: {
          avatar: 'img/avatars/user0' + window.randomFunction.getRandom(avatarOpt, true) + '.png'
        },

        offer: {
          title: window.randomFunction.getRandom(titleOpt, true),
          address: locationX + ', ' + locationY,
          price: window.randomFunction.getRandomNumber(minPriceMock, maxPrice),
          type: window.randomFunction.getRandom(typeOpt),
          rooms: window.randomFunction.getRandomNumber(minRooms, maxRooms),
          guests: window.randomFunction.getRandomNumber(1, 15),
          checkin: window.randomFunction.getRandom(checkinOpt),
          checkout: window.randomFunction.getRandom(checkoutOpt),
          features: featuresOpt.splice(window.randomFunction.getRandomNumber(0, featuresOpt.length - 1)),
          description: '',
          photos: window.randomFunction.shuffleArray(photosOpt)
        },

        location: {
          x: locationX,
          y: locationY
        }
      }
  );
}

// Создание пинов
var createPin = function (pin) {
  var pinElement = mapPinTemplate.cloneNode(true);
  var pinLocationX = pin.location.x - PIN_WIDTH;
  var pinLocationY = pin.location.y - PIN_HEIGHT;

  pinElement.style.left = pinLocationX + 'px';
  pinElement.style.top = pinLocationY + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;

  return pinElement;
};

// Заполнение объявления
var mapCard = document.querySelector('.map');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

var createCard = function (card) {
  var cardElement = mapCardTemplate.cloneNode(true);
  var cardPhoto = cardElement.querySelector('.popup__photo');

  var cardOfferFeaturesArray = cardElement.querySelectorAll('.popup__feature');
  var cardOfferFeatures = cardElement.querySelector('.popup__features');

  var photosContainer = cardElement.querySelector('.popup__photos');

  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = card.offer.description;
  cardElement.querySelector('.popup__avatar').src = card.author.avatar;


  // Тип жилья
  cardElement.querySelector('.popup__type').textContent = l10nTypeOffer[card.offer.type];

  // Удобства
  cardOfferFeaturesArray.forEach(function (node) {
    node.remove();
  });

  card.offer.features.forEach(function (item) {
    var featureLi = document.createElement('li');
    featureLi.classList.add('popup__feature');
    featureLi.classList.add('popup__feature--' + item);

    cardOfferFeatures.appendChild(featureLi);
  });

  // Отрисовка 3х фото
  photosContainer.removeChild(cardPhoto);

  card.offer.photos.forEach(function (photo) {
    var tempPhoto = cardPhoto.cloneNode();
    tempPhoto.src = photo;

    photosContainer.appendChild(tempPhoto);
  });

  return cardElement;
};
// mapCard.insertBefore(renderCard(adAround[0]), filterContainer);

var adForm = document.querySelector('.ad-form');
var adFormFieldsets = adForm.querySelectorAll('fieldset');
var formAddressInput = document.querySelector('#address');

// Стартовое значения поля адреса
formAddressInput.value = (mapPinMain.offsetLeft + PIN_WIDTH / 2) + ' ' + (mapPinMain.offsetTop + PIN_HEIGHT);

// Активация страницы
var showUI = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (i = 0; i < adFormFieldsets.length; i++) {
    adFormFieldsets[i].disabled = false;
  }
  // Отрисовка пинов
  renderPins(adAround, mapPins);
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
      var INDENT_TOP = 130 - PIN_HEIGHT;
      var INDENT_BOTTOM = 630 - PIN_HEIGHT;

      // Проверка на область координат
      if (moveEvt.clientX >= (map.offsetLeft + PIN_WIDTH / 2) && moveEvt.clientX <= (map.offsetLeft + MAP_WIDTH - PIN_WIDTH / 2) && regulationCoordsY >= INDENT_TOP && regulationCoordsY <= INDENT_BOTTOM) {
        startCoords = {
          // Перезаписываем стартовые координаты
          x: moveEvt.clientX,
          y: moveEvt.clientY
        };
        // Заполение поля адреса
        formAddressInput.value = (mapPinMain.offsetLeft - shift.x + PIN_WIDTH / 2) + ' ' + (mapPinMain.offsetTop - shift.y + PIN_HEIGHT);
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
  if (evt.keyCode === ESC_KEYCODE) {
    closeHandler();
  }
};
document.addEventListener('keydown', closeEventHandler);
// Рендер пинов, открытие объявления по клику на соотвествующий пин и закрытие
var renderPins = function (ads, target) {
  // Идем по массиву с объявлениями и создаем объекты для массива с пинами
  ads.forEach(function (item) {
    var pin = createPin(item);
    fragment.appendChild(pin); // Добавляем во фрагмент каждый созданный пин
    renderedPins.push(pin); // Добавляем в массив объект, с данными на каждый созданный пин

    // Слушатель для открытия объявления по нажатию на пин
    pin.addEventListener('click', function () {
      if (currentOffer) {
        currentOffer.remove(); // Вначале функции убираем объявление, если есть открытое
      }
      currentOffer = createCard(item); // Вызываем функцию создания карточки объявления для каждого объекта в массиве объявлений
      popupCloseButton = currentOffer.querySelector('.popup__close');
      popupCloseButton.addEventListener('click', closeHandler); // Добавляем слушатель для закрытия по нажатию на крестик
      mapCard.insertBefore(currentOffer, filterContainer); // Добавлем в разметку выбранную карточку-объявление
    });
  });
  target.appendChild(fragment);
};

// // Валидация полей кол-ва-гостей и комнат
// var roomSelectHandler = function () {
//   var selectedCapacity = selector[roomNumber.value].capacity;// Получаем значение value option гостей и берем значение capacity соответствущего объекта
//   if (selectedCapacity.indexOf(capacity.value) === -1) { // Проверка на отсутствие в этом массиве значения value гостей
//     capacity.setCustomValidity(selector[roomNumber.value].error); // Вывод соотвествующего предупреждения об ошибке
//   } else {
//     capacity.setCustomValidity(''); // Сброс предупреждения
//   }
// };
// // Подписываемся на изменения select гостей и комнат
// roomNumber.addEventListener('change', roomSelectHandler);
// capacity.addEventListener('change', roomSelectHandler);

// // Синхронизация времени заезда/выезда
// var checkinHandler = function () {
//   if (checkin.value !== checkout.value) {
//     checkout.value = checkin.value;
//   }
// };
// var checkoutHandler = function () {
//   if (checkin.value !== checkout.value) {
//     checkin.value = checkout.value;
//   }
// };
// checkin.addEventListener('change', checkinHandler);
// checkout.addEventListener('change', checkoutHandler);

// // Установка минимальной цены в зависимости от выбранного типа жилья
// var minPriceHandler = function () {
//   var minPrice = minPriceForType[type.value];
//   price.min = minPrice;
//   price.placeholder = minPrice;
// };
// type.addEventListener('change', minPriceHandler);

// price.addEventListener('invalid', function () {
//   if (price.validity.rangeUnderflow) {
//     price.setCustomValidity('Минимальная цена для данного типа жилья ' + price.min);
//   } else if (price.validity.rangeOverflow) {
//     price.setCustomValidity('Максимальная цена для данного типа жилья ' + price.max);
//   } else {
//     price.setCustomValidity('');
//   }
// });
