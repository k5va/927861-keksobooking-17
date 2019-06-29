'use strict';

(function () {
  var LOAD_DATA_URL = 'https://js.dump.academy/keksobooking/data';
  var SAVE_DATA_URL = 'https://js.dump.academy/keksobooking';
  var REQUEST_TIMEOUT = 10000; // 10s

  /**
   * Creates XMLHttpRequest object and initialize it.
   *
   * @param {function} onLoad - success callback function
   * @param {function} onError - error callback function
   * @return {XMLHttpRequest} - XMLHttpRequest object
   */
  var createRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = REQUEST_TIMEOUT;

    onError = onError || function (errorMessage) { // default error handler
      throw new Error(errorMessage);
    };

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
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

    return xhr;
  };

  /**
   * Loads data from remote server
   * @param {function} onLoad - success callback function
   * @param {function} onError - error callback function
   */
  var load = function (onLoad, onError) {
    var xhr = createRequest(onLoad, onError);
    xhr.open('GET', LOAD_DATA_URL);
    xhr.send();
  };

  /**
   * Uploads form data to backend server
   * @param {FormData} data - data to be loaded
   * @param {*} onLoad - success callback function
   * @param {*} onError - error callback function
   */
  var save = function (data, onLoad, onError) {
    var xhr = createRequest(onLoad, onError);
    xhr.open('POST', SAVE_DATA_URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    save: save
  };
})();
