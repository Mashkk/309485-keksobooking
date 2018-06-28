'use strict';

(function () {
  window.randomFunction = {

    getRandom: function (arr, doRemove) {
      var randomIdx = Math.floor(Math.random() * arr.length);
      var randomItem = arr[randomIdx];
      if (doRemove) {
        arr.splice(randomIdx, 1);
      }
      return randomItem;
    },

    getRandomNumber: function (min, max) {
      var rand = min - 0.5 + Math.random() * (max - min + 1);
      rand = Math.round(rand);
      return rand;
    },

    shuffleArray: function (arr) {
      var container;
      var temp;
      for (var i = arr.length - 1; i > 0; i--) {
        container = Math.floor(Math.random() * (i + 1));
        temp = arr[container];
        arr[container] = arr[i];
        arr[i] = temp;
      }
      return arr;
    }
  };
})();

