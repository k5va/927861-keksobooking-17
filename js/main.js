'use strict';

var ADS_NUMBER = 8;
var AVATAR_IMAGE_SOURCE = 'img/avatars/user{{xx}}.png';
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var USERS_SORT_THRESHOLD = 0.5;
var USER_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08']
  .sort(function () {
    return Math.random() > USERS_SORT_THRESHOLD ? 1 : -1;
  });
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];

/**
 * Returns random element of an array
 * @param {Array} elements - array of some elements
 * @return {object} - random element of the given array
 */
var getRandomElementFromArray = function (elements) {
  return elements[Math.floor(Math.random() * elements.length)];
};
