'use strict';

(function () {
  var DEBOUNCE_INTERVAL = 500; // ms

  /**
   * Returns random element of an array
   * @param {Array} elements - array of some elements
   * @return {*} - random element of the given array
   */
  var getRandomElementFromArray = function (elements) {
    return elements[Math.floor(Math.random() * elements.length)];
  };

  /**
   * Returns random number form the given range
   * @param {number} min - minimum of the range
   * @param {number} max - maximum of the range
   * @return {number} - random number from the given range
   */
  var generateRandomNumberFromRange = function (min, max) {
    return min + Math.floor(Math.random() * (max - min));
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
    getRandomElementFromArray: getRandomElementFromArray,
    generateRandomNumberFromRange: generateRandomNumberFromRange,
    debounce: debounce
  };
})();
