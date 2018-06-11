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

var map = document.querySelector('.map');
var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var fragment = document.createDocumentFragment();
var filterContainer = document.querySelector('.map__filters-container');

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
  var container;
  var temp;
  for (var i = arr.length - 1; i > 0; i--) {
    container = Math.floor(Math.random() * (i + 1));
    temp = arr[container];
    arr[container] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

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
  var locationX = getRandomNumber(300, 900);
  var locationY = getRandomNumber(130, 630);

  adAround.push(
      {
        author: {
          // Оставила такую запись, тк там еще надо что бы не было повторений в цифрах.
          avatar: 'img/avatars/user0' + getRandom(avatarOpt, true) + '.png'
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
          features: featuresOpt.splice(getRandomNumber(0, featuresOpt.length - 1)),
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
map.classList.remove('map--faded');

// Отрисовка пинов на карте
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

var createFragment = function (renderArr, workArr, direct) {
  for (i = 0; i < adAround.length; i++) {
    fragment.appendChild(renderArr(workArr[i]));
  }
  direct.appendChild(fragment);
};
createFragment(renderPin, adAround, mapPins);

// Заполнение объявления
var mapCard = document.querySelector('.map');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

var renderCard = function (card) {
  var cardElement = mapCardTemplate.cloneNode(true);
  var cardPhoto = cardElement.querySelector('.popup__photo');
  var l10nTypeOffer = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

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
mapCard.insertBefore(renderCard(adAround[0]), filterContainer);
