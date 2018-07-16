'use strict';

(function () {
  var mapPins = document.querySelector('.map__pins');
  var filterForm = document.querySelector('.map__filters');
  var typeFilter = filterForm.querySelector('#housing-type');
  var priceFilter = filterForm.querySelector('#housing-price');
  var priceMap = {
    low: 10000,
    middle: 50000,
    high: 50000
  };
  var roomsFilter = filterForm.querySelector('#housing-rooms');
  var guestsFilter = filterForm.querySelector('#housing-guests');
  var checkboxes = filterForm.querySelectorAll('input[type="checkbox"]');
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;

  window.globals.filter = {
    filterForm: filterForm
  };

  var removeItem = function (array, item) {
    var index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    }
  };

  var filterAds = function (ads) {
    var filteredAds = ads.slice();
    ads.forEach(function (data) {
      if (typeFilter.value !== data.offer.type && typeFilter.value !== 'any') {
        removeItem(filteredAds, data);
      }

      if (data.offer.price > priceMap[priceFilter.value] && priceMap[priceFilter.value] === priceMap.low) {
        removeItem(filteredAds, data);
      } else if (data.offer.price > priceMap.high || data.offer.price < priceMap.low && priceFilter.value === 'middle') {
        removeItem(filteredAds, data);
      } else if (data.offer.price < priceMap[priceFilter.value] && priceMap[priceFilter.value] === priceMap.high) {
        removeItem(filteredAds, data);
      }

      if (parseInt(roomsFilter.value, 10) !== data.offer.rooms && roomsFilter.value !== 'any') {
        removeItem(filteredAds, data);
      }

      if (data.offer.guests !== parseInt(guestsFilter.value, 10) && guestsFilter.value !== 'any') {
        removeItem(filteredAds, data);
      }

      checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          if (!gotFeature(data.offer.features, checkbox.value)) {
            removeItem(filteredAds, data);
          }
        }
      });
    });
    return filteredAds;
  };


  var gotFeature = function (features, val) {
    return features.indexOf(val) !== -1;
  };

  var updateAds = window.updateAds = function () {
    var sorted = filterAds(window.adAround);
    window.globals.map.currentOfferHandler();
    window.globalFunction.render(sorted, mapPins);
  };

  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  };

  var filterHandler = function () {
    debounce(updateAds);
  };

  var removeFilterEl = function () {
    filterForm.removeEventListener('change', changeHandler);
  };

  var addFilterEl = function () {
    filterForm.addEventListener('change', changeHandler);
  };

  var changeHandler = function () {
    debounce(updateAds);
  };

  Object.assign(window.globalFunction, {
    filterHandler: filterHandler,
    removeFilterEl: removeFilterEl,
    addFilterEl: addFilterEl
  });
})();
