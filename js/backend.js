'use strict';

(function () {
  var SUCCESS_CODE = 200;
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';

  window.globals = {};
  window.globalFunction = {};

  var setupAndRun = function (loadSuccess, loadError, url, cb, method, data, isUpload) {
    data = data || null;
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('error', function () {
      loadError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      loadError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        if (isUpload) {
          loadSuccess(cb);
        } else {
          loadSuccess(xhr.response, cb);
        }
      } else {
        loadError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.open(method, url);
    xhr.send(data);
  };

  // Получение данных с сервера
  var load = function (loadSuccess, loadError, cb) {
    setupAndRun(loadSuccess, loadError, DOWNLOAD_URL, cb, 'GET');
  };

  // Отправка данных на сервер
  var upload = function (loadSuccess, loadError, data, cb, isUpload) {
    setupAndRun(loadSuccess, loadError, UPLOAD_URL, cb, 'POST', data, isUpload);
  };

  Object.assign(window.globalFunction, {
    load: load,
    upload: upload
  });
})();
