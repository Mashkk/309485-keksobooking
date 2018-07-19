'use strict';

(function () {
  var loadHandler = function (data, cb) {
    window.adsAround = data;
    cb();
  };

  // Облако ошибки
  var errorHandler = function (errorMessage) {
    var TIMEOUT = 3000;
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; padding: 20px; text-align: center; background-color: white; color: red; border-radius: 10px; border: 1px solid #c0c0c0';
    node.style.position = 'absolute';
    node.style.left = '50%';
    node.style.top = '200px';
    node.style.transform = 'translateX(-50%)';
    node.style.width = '300px';
    node.style.height = 'auto';

    node.textContent = errorMessage;
    node.classList.add('errorMessage');
    document.body.insertAdjacentElement('afterbegin', node);

    setTimeout(function () {
      node.remove();
    }, TIMEOUT);
  };
  var getData = function (cb) {
    window.globalFunction.load(loadHandler, errorHandler, cb);
  };

  var uploadData = function (data, cb) {
    window.globalFunction.upload(function (callback) {
      window.globalFunction.resetForm();
      callback();
    }, errorHandler, new FormData(data), cb, true);
  };

  Object.assign(window.globalFunction, {
    getData: getData,
    uploadData: uploadData
  });
})();
