'use strict';

(function () {
  var setupEventListener = function (xhr, onLoad, onError, cb) {
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response, cb);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
  };

  // Получение данных с сервера
  window.load = function (onLoad, onError, DOWNLOAD_URL, cb) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    setupEventListener(xhr, onLoad, onError, cb);

    xhr.open('GET', DOWNLOAD_URL);
    xhr.send();
  };

  // Отправка данных на сервер
  window.upload = function (data, onLoad, UPLOAD_URL, onError, cb) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    setupEventListener(xhr, onLoad, onError, cb);

    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };
})();
