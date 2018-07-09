'use strict';

(function () {
  // var _data;
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var loadHandler = function (data, cb) {
    // _data = data;
    // window.getAdAround = function () {
    //   return _data;
    // };
    window.adAround = data;
    cb();
  };

  // Облако ошибки
  var errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; padding: 20px; text-align: center; background-color: white; color: red; border-radius: 10px; border: 1px solid #c0c0c0';
    node.style.position = 'absolute';
    node.style.left = '50%';
    node.style.top = '200px';
    node.style.transform = 'translateX(-50%)';
    node.style.width = '300px';
    node.style.height = 'auto';

    node.textContent = errorMessage;
    node.className = 'errorMessage';
    document.body.insertAdjacentElement('afterbegin', node);
  };
  window.getData = function (cb) {
    window.load(loadHandler, errorHandler, DOWNLOAD_URL, cb);
  };
  //                            form  elements инфо об успешной отправке
  window.uploadData = function (data, elements, cb) {
    //                      формдата   онлоад - когда загружен контент на сервер
    window.upload(new FormData(data), function (response, callback) {
      elements.title.value = '';
      elements.checkin.value = '12:00';
      elements.checkout.value = '12:00';
      elements.roomNumber.value = '1';
      elements.capacity.value = '1';
      elements.price.value = '';
      elements.type.value = 'flat';
      elements.description.value = '';
      callback();
    }, UPLOAD_URL, errorHandler, cb);
  };

  var ads = null;
  window.data = {
    get: function () {
      return ads;
    },
    set: function (newAds) {
      ads = newAds;
    }
  };
})();
