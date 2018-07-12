'use strict';

(function () {
  var mapPins = document.querySelector('.map__pins');
  var filters = document.querySelector('.map__filters');
  var typeFilter = filters.querySelector('#housing-type');
  var priceFilter = filters.querySelector('#housing-price');
  var priceMap = {
    low: 10000,
    middle: 50000,
    high: 50000
  };
  var roomsFilter = filters.querySelector('#housing-rooms');
  var guestsFilter = filters.querySelector('#housing-guests');
  var checkboxes = filters.querySelectorAll('input[type="checkbox"]');
  var DEBOUNCE_INTERVAL = 500;
  
  var removeItem = function(array, item){
    var index = array.indexOf(item);
    if (index !== -1) array.splice(index, 1);
  }

  var filterAds = function(ads) {
    var filteredAds = ads.slice();
    ads.forEach(function(data){
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

      if (parseInt(roomsFilter.value) !== data.offer.rooms && roomsFilter.value !== 'any') {
        removeItem(filteredAds, data);
      } 
  
      if (data.offer.guests !== parseInt(guestsFilter.value) && guestsFilter.value !== 'any')  {
        removeItem(filteredAds, data);
      } 

      checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          if (!gotFeature(data.offer.features, checkbox.value)) {
            removeItem(filteredAds, data);
          }
        }  
      });
    })    
    return filteredAds;
  };


  var gotFeature = function (features,  val) {
    return features.indexOf(val) != -1;
  }

  var updateAds = window.updateAds = function () {
    var sorted = filterAds(window.adAround);
    window.globals.currentOfferHandler();
    window.render(sorted, mapPins);
  }
  var lastTimeout;
  var debounce = function (fun) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(fun, DEBOUNCE_INTERVAL);
  }

  typeFilter.addEventListener('change', function(evt) {
    debounce(updateAds);
  });
  priceFilter.addEventListener('change', function(evt) {
    debounce(updateAds);
  });
  typeFilter.addEventListener('change', function(evt) {
    debounce(updateAds);
  });
  roomsFilter.addEventListener('change', function(evt) {
    debounce(updateAds);
  });
  guestsFilter.addEventListener('change', function(evt) {
    debounce(updateAds);
  });
  checkboxes.forEach (function (checkbox) {
    checkbox.addEventListener('change', function(evt) {
      debounce(updateAds);
    })
  });
})();
