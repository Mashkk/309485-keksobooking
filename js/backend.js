'use strict';

(function () {
  window.globals = {};
  window.globalFunction = {};
  var setupEventListener = function (xhr, onError) {
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
  };

  // Получение данных с сервера
  var load = function (onLoad, onError, DOWNLOAD_URL, cb) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    setupEventListener(xhr, onError);

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response, cb);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.open('GET', DOWNLOAD_URL);
    xhr.send();
  };

  // Отправка данных на сервер
  var upload = function (data, onLoad, UPLOAD_URL, onError, cb) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    setupEventListener(xhr, onError);
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(cb);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  Object.assign(window.globalFunction, {
    load: load,
    upload: upload
  });
})();
