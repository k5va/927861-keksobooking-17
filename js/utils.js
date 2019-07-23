'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms
  var KeyCodes = {
    ESC: 27
  };

  /**
   * Debounces given function - returns new function, that calls callback only after DEBOUNCE_INTERVAL is passed
   * @param {function} callback - callback function
   * @return {function} - debounced function
   */
  var debounce = function (callback) {
    var lastTimeout = null;

    return function () {
      var parameters = arguments;

      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(function () {
        callback.apply(null, parameters);
      }, DEBOUNCE_INTERVAL);
    };
  };

  window.utils = {
    debounce: debounce,
    KeyCodes: KeyCodes
  };
})();
