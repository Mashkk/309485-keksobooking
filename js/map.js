'use strict';

// Массивы
var titleOpt = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var typeOpt = ['palace', 'flat', 'house', 'bungalo'];
// Несмотря на то, что 2 массива одинаковы, они не объеденены в 1, тк отражают время для разных событий и могут изменяться не зависимо друг от друга
var checkinOpt = ['12:00', '13:00', '14:00'];
var checkoutOpt = ['12:00', '13:00', '14:00'];
var featuresOpt = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photosOpt = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

// Переmенные
var adCount = 8;
var minPrice = 1000;
var maxPrice = 1000000;
var minRooms = 1;
var maxRooms = 5;
var minAvatarCount = 1;
var maxAvatarCount = 8;

// Константы
var PIN_HEIGHT = 70;
var PIN_WIDTH = 50 / 2;

// Итоговый массив с 8 сгенерированными объектами
var adAround = [];

// Функции для рандома
var getRandom = function (arr, doRemove) {
  var randomIdx = Math.floor(Math.random() * arr.length);
  var randomItem = arr[randomIdx];
  if (doRemove) {
    arr.splice(randomIdx, 1);
  }

  return randomItem;
};

var getRandomNumber = function (min, max) {
  var rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};

var shuffleArray = function (arr) {
  var j;
  var temp;
  for (var i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

// генератор для ав
var generateAvatar = function (min, max) {
  var result = [];

  for (var i = min; i <= max; i++) {
    if (i < 10 && i > 0) {
      result.push('0' + i);
    } else {
      result.push(i + '');
    }
  }
  return result;
};

// Вычисление переменных
var avatarOpt = generateAvatar(minAvatarCount, maxAvatarCount);

// Сборка массива
for (var i = 0; i < adCount; i++) {
  var locationX = getRandomNumber(300, 900);
  var locationY = getRandomNumber(130, 630);

  adAround.push(
      {
        author: {
          avatar: 'img/avatars/user' + getRandom(avatarOpt, true) + '.png'
        },

        offer: {
          title: getRandom(titleOpt, true),
          address: locationX + ', ' + locationY,
          price: getRandomNumber(minPrice, maxPrice),
          type: getRandom(typeOpt),
          rooms: getRandomNumber(minRooms, maxRooms),
          guests: getRandomNumber(1, 15),
          checkin: getRandom(checkinOpt),
          checkout: getRandom(checkoutOpt),
          features: featuresOpt.splice(getRandomNumber(1, featuresOpt.length - 1)),
          description: '',
          photos: shuffleArray(photosOpt)
        },

        location: {
          x: locationX,
          y: locationY
        }
      }
  );
}

// Переключение карты в интерактивное состояние
var map = document.querySelector('.map');
map.classList.remove('map--faded');

// Отрисовка пинов на карте
var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

var renderPin = function (pin) {
  var pinElement = mapPinTemplate.cloneNode(true);
  var pinLocationX = pin.location.x - PIN_WIDTH;
  var pinLocationY = pin.location.y - PIN_HEIGHT;

  pinElement.style.left = pinLocationX + 'px';
  pinElement.style.top = pinLocationY + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;

  return pinElement;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < adAround.length; i++) {
  fragment.appendChild(renderPin(adAround[i]));
}
mapPins.appendChild(fragment);

// Заполнение объявления
var mapCard = document.querySelector('.map');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

var renderCard = function (card) {
  var cardElement = mapCardTemplate.cloneNode(true);
  var cardOfferType = cardElement.querySelector('.popup__type');

  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ', выезд до ' + card.offer.checkout;
  cardElement.querySelector('.popup__description').textContent = card.offer.description;
  cardElement.querySelector('img').src = card.author.avatar;

  // Тип жилья
  if (card.offer.type === 'flat') {
    cardOfferType.textContent = 'Квартира';
  } else if (card.offer.type === 'bungalo') {
    cardOfferType.textContent = 'Бунгало';
  } else if (card.offer.type === 'house') {
    cardOfferType.textContent = 'Дом';
  } else {
    cardOfferType.textContent = 'Дворец';
  }

  // Удобства
  var cardOfferFeatures = cardElement.querySelectorAll('.popup__feature');
  for (i = 0; i < cardOfferFeatures.length; i++) {
    cardOfferFeatures[i].style.display = 'none';
    if (i < card.offer.features.length) {
      cardOfferFeatures[i].style.display = 'inline-block';
    }
  }

  // Фото надо придумать как добавлять 3 img
  for (i = 0; i < card.offer.photos.length; i++) {
    cardElement.querySelector('.popup__photo').src = card.offer.photos[i];
  }

  return cardElement;
};
// надо понять как встроить блок до блока .map__filters-container
fragment.appendChild(renderCard(adAround[0]));
mapCard.appendChild(fragment);
