'use strict';

(function () {
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

  // Генератор для ав
  var generateAvatar = function (min, max) {
    var result = [];
    for (var i = min; i <= max; i++) {
      result.push(i);
    }
    return result;
  };
  var avatarOpt = generateAvatar(minAvatarCount, maxAvatarCount);
  // Итоговый массив с 8 сгенерированными объектами
  window.adAround = [];

  // Сборка массива
  for (var i = 0; i < adCount; i++) {
    var locationX = window.randomFunction.getRandomNumber(300, 900);
    var locationY = window.randomFunction.getRandomNumber(130, 630);

    window.adAround.push(
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
})();
