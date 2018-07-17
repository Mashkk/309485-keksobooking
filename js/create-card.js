'use strict';

(function () {
  var l10nTypeOffer = {
    'flat': 'Квартира',
    'palace': 'Дворец',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

  window.createCard = function (card) {
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

    if (card.offer.features.length) {
      card.offer.features.forEach(function (item) {
        var featureLi = document.createElement('li');
        featureLi.classList.add('popup__feature');
        featureLi.classList.add('popup__feature--' + item);

        cardOfferFeatures.appendChild(featureLi);
      });
    } else {
      cardOfferFeatures.classList.add('hidden');
    }

    // Отрисовка 3х фото
    photosContainer.removeChild(cardPhoto);

    if (card.offer.photos.length) {
      card.offer.photos.forEach(function (photo) {
        var tempPhoto = cardPhoto.cloneNode();
        tempPhoto.src = photo;

        photosContainer.appendChild(tempPhoto);
      });
    } else {
      photosContainer.classList.add('hidden');
    }


    return cardElement;
  };
})();
