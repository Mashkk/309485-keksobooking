'use strict';

(function () {
  var mapPinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  window.createPin = function (pin) {
    var pinElement = mapPinTemplate.cloneNode(true);
    var pinLocationX = pin.location.x - window.globals.PIN_WIDTH;
    var pinLocationY = pin.location.y - window.globals.PIN_HEIGHT;

    pinElement.style.left = pinLocationX + 'px';
    pinElement.style.top = pinLocationY + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;

    return pinElement;
  };
})();
