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
var minPrice = 1000;
var maxPrice = 1000000;
var minRooms = 1;
var maxRooms = 5;
var minAvatarCount = 1;
var maxAvatarCount = 8;

// Итоговый массив с 8 объектами
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


for (var i = 0; i < adCount; i++) {
  var locationX = getRandomNumber(300, 900);
  var locationY = getRandomNumber(130, 630);
  var featuresTemp = shuffleArray(Object.assign([], featuresOpt));
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
          features: featuresTemp.splice(getRandomNumber(1, featuresOpt.length - 1)),
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

var map = document.querySelector('.map');
map.classList.remove('map--faded');

// Отрисовка пинов на карте
var mapPins = document.querySelector('.map__pins');
var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

var renderPin = function (pin) {
  var pinElement = mapPinTemplate.cloneNode(true);

  pinElement.querySelector('.map__pin').style.left = location.x + 'px';
  pinElement.querySelector('.map__pin').style.top = location.y + 'px';

  // Непеределанная часть. Найти как выбирать эл-т рядом с известным или взять по img внутри класса .map__pin
  pinElement.querySelector('.wizard-coat').style.fill = pin.coatColor;
  pinElement.querySelector('.wizard-eyes').style.fill = pin.eyesColor;

  return wizardElement;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < wizardsArray.length; i++) {
  fragment.appendChild(renderWizards(wizardsArray[i]));
}
similarListElement.appendChild(fragment);
