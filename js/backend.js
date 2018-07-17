'use strict';

(function () {
  var SUCCESS_CODE = 200;
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';

  window.globals = {};
  window.globalFunction = {};

  var setupAndRun = function (onLoad, onError, url, cb, method, data, isUpload) {
    data = data || null;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        if (isUpload) {
          onLoad(cb);
        } else {
          onLoad(xhr.response, cb);
        }
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.open(method, url);
    xhr.send(data);
  };

  // Получение данных с сервера
  var load = function (onLoad, onError, cb) {
    setupAndRun(onLoad, onError, DOWNLOAD_URL, cb, 'GET');
  };

  // Отправка данных на сервер
  var upload = function (onLoad, onError, data, cb, isUpload) {
    setupAndRun(onLoad, onError, UPLOAD_URL, cb, 'POST', data, isUpload);
  };

  Object.assign(window.globalFunction, {
    load: load,
    upload: upload
  });
})();
