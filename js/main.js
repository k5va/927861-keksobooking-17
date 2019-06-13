'use strict';

var ADS_NUMBER = 8;
var AVATAR_IMAGE_SOURCE = 'img/avatars/user{{xx}}.png';
var LOCATION_X_MIN = 0;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;
var USERS_SORT_THRESHOLD = 0.5;
var USER_NUMBERS = ['01', '02', '03', '04', '05', '06', '07', '08'];
var OFFER_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var MAP_PINS_ELEMENT = document.querySelector('.map__pins');
var MAP_ELEMENT = document.querySelector('.map');
var PIN_TEMPLATE_ELEMENT = document.querySelector('#pin').content.querySelector('.map__pin');
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;

/**
 * Returns random element of an array
 * @param {Array} elements - array of some elements
 * @return {object} - random element of the given array
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
 * Generates Ads mock data
 * @param {number} containerWidth - width of the containing block to set location.x
 * @return {Array} - Ads objects array
 */
var generateMockData = function (containerWidth) {
  //sort users
  USER_NUMBERS = USER_NUMBERS.sort(function () {
    return Math.random() > USERS_SORT_THRESHOLD ? 1 : -1;
  });
  // initialize ads data array
  var ads = [];
  // populate ads with data
  for (var i = 0; i < ADS_NUMBER; i++) {
    ads.push({
      author: {
        avatar: AVATAR_IMAGE_SOURCE.replace('{{xx}}', USER_NUMBERS[i])
      },
      offer: {
        type: getRandomElementFromArray(OFFER_TYPES)
      },
      location: {
        x: generateRandomNumberFromRange(LOCATION_X_MIN, containerWidth),
        y: generateRandomNumberFromRange(LOCATION_Y_MIN, LOCATION_Y_MAX)
      }
    });
  }

  return ads;
};

/**
 * Creates map pin DOM Element from given template and ad object
 * @param {Node} pinTemplate - template for creating map pin element
 * @param {object} ad - ad object containing data
 *
 * @return {Node} pin Element - created pin DOM element
 */
var createPinElement = function (pinTemplate, ad) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = (ad.location.x - MAP_PIN_WIDTH / 2) + 'px';
  pinElement.style.top = (ad.location.y - MAP_PIN_HEIGHT) + 'px';
  pinElement.querySelector('img').src = ad.author.avatar;
  pinElement.querySelector('img').alt = ad.offer.type;

  return pinElement;
};


/**
 * Creates Map pins DOM elements and renders them to the DOM
 * @param {Array} ads - ads data array
 */
var renderMapPins = function (ads) {
  var fragment = document.createDocumentFragment();

  ads.forEach(function (ad, i) {
    fragment.appendChild(createPinElement(PIN_TEMPLATE_ELEMENT, ad));
  });

  MAP_PINS_ELEMENT.appendChild(fragment);
};

renderMapPins(generateMockData(MAP_PINS_ELEMENT.offsetWidth));
MAP_ELEMENT.classList.remove('map--faded');


