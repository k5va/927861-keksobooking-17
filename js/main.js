'use strict';

var ADS_NUMBER = 8;
var AVATAR_IMAGE_SOURCE = 'img/avatars/user{{xx}}.png';
var PinLocation = {
  X_MIN: 0,
  X_MAX: 1200,
  Y_MIN: 130,
  Y_MAX: 630
};
var OfferTypes = {
  PALACE: 'Дворец',
  FLAT: 'Квартира',
  HOUSE: 'Дом',
  BUNGALO: 'Бунгало'
};
var MAP_PINS_ELEMENT = document.querySelector('.map__pins');
var MAP_ELEMENT = document.querySelector('.map');
var PIN_TEMPLATE_ELEMENT = document.querySelector('#pin').content.querySelector('.map__pin');
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;
var MAP_PIN_MAIN_ELEMENT = MAP_PINS_ELEMENT.querySelector('.map__pin--main');
var ADD_NOTICE_FORM = document.querySelector('.ad-form');
var ADD_NOTICE_FORM_FIELDS = ADD_NOTICE_FORM.querySelectorAll('fieldset');
var MAP_FILTERS_FORM = MAP_ELEMENT.querySelector('.map__filters');
var MAP_FILTERS_FORM_FIELDS = MAP_FILTERS_FORM.querySelectorAll('fieldset, select');

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
 * Generates Ads mock data
 * @param {number} dataNumber - Number of mock data to generate
 * @return {Array} - Ads objects array
 */
var generateMockData = function (dataNumber) {
  // initialize ads data array
  var ads = [];
  // populate ads with data
  for (var i = 0; i < dataNumber; i++) {
    ads.push({
      author: {
        avatar: AVATAR_IMAGE_SOURCE.replace('{{xx}}', (i + 1) < 10 ? '0' + (i + 1) : (i + 1))
      },
      offer: {
        type: getRandomElementFromArray(Object.keys(OfferTypes))
      },
      location: {
        x: generateRandomNumberFromRange(PinLocation.X_MIN, PinLocation.X_MAX),
        y: generateRandomNumberFromRange(PinLocation.Y_MIN, PinLocation.Y_MAX)
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
  var pinImageElement = pinElement.querySelector('img');

  pinElement.style.left = (ad.location.x - MAP_PIN_WIDTH / 2) + 'px';
  pinElement.style.top = (ad.location.y - MAP_PIN_HEIGHT) + 'px';
  pinImageElement.src = ad.author.avatar;
  pinImageElement.alt = ad.offer.type;

  return pinElement;
};

/**
 * Creates Map pins DOM elements and renders them to the DOM
 * @param {Array} ads - ads data array
 */
var renderMapPins = function (ads) {
  var fragment = document.createDocumentFragment();

  ads.forEach(function (ad) {
    fragment.appendChild(createPinElement(PIN_TEMPLATE_ELEMENT, ad));
  });

  MAP_PINS_ELEMENT.appendChild(fragment);
};

/**
 * Disables Add notice form and fields
 */
var disableAddNoticeForm = function () {
  ADD_NOTICE_FORM.classList.add('ad-form--disabled');
  ADD_NOTICE_FORM_FIELDS.forEach(function (element) {
    element.disabled = true;
  });
};

/**
 * Enable Add notice form and fields
 */
var enableAddNoticeForm = function () {
  ADD_NOTICE_FORM.classList.remove('ad-form--disabled');
  ADD_NOTICE_FORM_FIELDS.forEach(function (element) {
    element.disabled = false;
  });
};

/**
 * Disables Map filters form
 */
var disableMapFiltersForm = function () {
  MAP_FILTERS_FORM_FIELDS.forEach(function (element) {
    element.disabled = true;
  });
};

/**
 * Enables Map filters form
 */
var enableMapFiltersForm = function () {
  MAP_FILTERS_FORM_FIELDS.forEach(function (element) {
    element.disabled = false;
  });
};

/**
 * Activates booking page
 */
var activateBookingPage = function () {
  renderMapPins(generateMockData(ADS_NUMBER));
  MAP_ELEMENT.classList.remove('map--faded');
  enableAddNoticeForm();
  enableMapFiltersForm();
};

/**
 * Deactivates booking page
 */
var deactivateBookingPage = function () {
  MAP_ELEMENT.classList.add('map--faded');
  disableAddNoticeForm();
  disableMapFiltersForm();
};

/**
 * Sets Add notice form's address field to initial value (center of map__pin--main)
 */
var initializeNoticeAddress = function () {
  ADD_NOTICE_FORM.querySelector('#address').value =
    Math.floor((MAP_PIN_MAIN_ELEMENT.offsetLeft + MAP_PIN_MAIN_ELEMENT.offsetWidth / 2)) + ', '
    + Math.floor((MAP_PIN_MAIN_ELEMENT.offsetTop + MAP_PIN_MAIN_ELEMENT.offsetHeight / 2));
};

initializeNoticeAddress();
deactivateBookingPage();
MAP_PIN_MAIN_ELEMENT.addEventListener('click', function () {
  activateBookingPage();
});

var addNoticePriceField = ADD_NOTICE_FORM.querySelector('#price');
/**
 * Changes Add Notice form price field min value based on offer type
 * @param {string} offerType - given offer type
 */
var updateAddNoticeMinPrice = function (offerType) {
  // TODO: move magic numbers to constants
  switch (offerType) {
    case 'bungalo':
      addNoticePriceField.min = 0;
      addNoticePriceField.placeholder = 0;
      break;
    case 'flat':
      addNoticePriceField.min = 1000;
      addNoticePriceField.placeholder = 1000;
      break;
    case 'house':
      addNoticePriceField.min = 5000;
      addNoticePriceField.placeholder = 5000;
      break;
    case 'palace':
      addNoticePriceField.min = 10000;
      addNoticePriceField.placeholder = 10000;
      break;
    default:
      addNoticePriceField.min = 0;
      addNoticePriceField.placeholder = 0;
      break;
  }
};
/**
 * Add notice form field change event handler
 * @param {InputEvent} evt - HTML Element input event
 */
var onAddNoticeFormFieldChange = function (evt) {
  if (evt.target.id === 'type') {
    updateAddNoticeMinPrice(evt.target.value);
  }
};
ADD_NOTICE_FORM.addEventListener('input', onAddNoticeFormFieldChange);

