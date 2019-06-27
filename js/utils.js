'use strict';

(function () {
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

  window.utils = {
    getRandomElementFromArray: getRandomElementFromArray,
    generateRandomNumberFromRange: generateRandomNumberFromRange
  };
})();
