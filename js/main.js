'use strict';

var ADS_NUMBER = 8;
var AVATAR_IMAGE_SOURCE = 'img/avatars/user{{xx}}.png';
var MAP_PIN_WIDTH = 50;
var MAP_PIN_HEIGHT = 70;

var PinLocation = {
  X_MIN: 0,
  X_MAX: 1200,
  Y_MIN: 130,
  Y_MAX: 630
};
var OfferTypes = {
  PALACE: {
    name: 'Дворец',
    minPrice: 10000
  },
  FLAT: {
    name: 'Квартира',
    minPrice: 1000
  },
  HOUSE: {
    name: 'Дом',
    minPrice: 5000
  },
  BUNGALO: {
    name: 'Бунгало',
    minPrice: 0
  }
};

var mapPinsElement = document.querySelector('.map__pins');
var mapElement = document.querySelector('.map');
var pinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPinMainElement = mapPinsElement.querySelector('.map__pin--main');
var addNoticeForm = document.querySelector('.ad-form');
var addNoticeFormFields = addNoticeForm.querySelectorAll('fieldset');
var mapFiltersForm = mapElement.querySelector('.map__filters');
var mapFiltersFormFields = mapFiltersForm.querySelectorAll('fieldset, select');

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
        type: getRandomElementFromArray(Object.keys(OfferTypes)).toLowerCase()
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
    fragment.appendChild(createPinElement(pinTemplateElement, ad));
  });

  mapPinsElement.appendChild(fragment);
};

/**
 * Disables Add notice form and fields
 */
var disableAddNoticeForm = function () {
  addNoticeForm.classList.add('ad-form--disabled');
  addNoticeFormFields.forEach(function (element) {
    element.disabled = true;
  });
};

/**
 * Enable Add notice form and fields
 */
var enableAddNoticeForm = function () {
  addNoticeForm.classList.remove('ad-form--disabled');
  addNoticeFormFields.forEach(function (element) {
    element.disabled = false;
  });
};

/**
 * Disables Map filters form
 */
var disableMapFiltersForm = function () {
  mapFiltersFormFields.forEach(function (element) {
    element.disabled = true;
  });
};

/**
 * Enables Map filters form
 */
var enableMapFiltersForm = function () {
  mapFiltersFormFields.forEach(function (element) {
    element.disabled = false;
  });
};

var isBookingPageActive = false;
/**
 * Activates booking page
 */
var activateBookingPage = function () {
  if (!isBookingPageActive) {
    renderMapPins(generateMockData(ADS_NUMBER));
    mapElement.classList.remove('map--faded');
    enableAddNoticeForm();
    enableMapFiltersForm();

    isBookingPageActive = true;
  }
};

/**
 * Deactivates booking page
 */
var deactivateBookingPage = function () {
  if (isBookingPageActive) {
    mapElement.classList.add('map--faded');
    disableAddNoticeForm();
    disableMapFiltersForm();

    isBookingPageActive = false;
  }
};

var addNoticePriceField = addNoticeForm.querySelector('#price');
var addNoticeTimeInField = addNoticeForm.querySelector('#timein');
var addNoticeTimeOutField = addNoticeForm.querySelector('#timeout');
var addNoticeAddressField = addNoticeForm.querySelector('#address');

/**
 * Sets add notice form address field to given cooridinates
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 */
var setNoticeAddress = function (x, y) {
  addNoticeAddressField.value = Math.floor(x) + ', ' + Math.floor(y);
};
// set add form address field to initial position
setNoticeAddress(
    (mapPinMainElement.offsetLeft + mapPinMainElement.offsetWidth / 2),
    (mapPinMainElement.offsetTop + mapPinMainElement.offsetHeight / 2)
);
deactivateBookingPage();

/**
 * Changes Add Notice form price field min value based on offer type
 * @param {string} offerType - given offer type
 */
var updateAddNoticeMinPrice = function (offerType) {
  addNoticePriceField.min = OfferTypes[offerType.toUpperCase()].minPrice;
  addNoticePriceField.placeholder = addNoticePriceField.min;
};

/**
 * Add notice form field change event handler
 * @param {InputEvent} evt - HTML Element input event
 */
var onAddNoticeFormFieldChange = function (evt) {
  switch (evt.target.id) {
    case 'type':
      updateAddNoticeMinPrice(evt.target.value);
      break;
    case 'timein':
      addNoticeTimeOutField.value = evt.target.value;
      break;
    case 'timeout':
      addNoticeTimeInField.value = evt.target.value;
      break;
  }
};
addNoticeForm.addEventListener('input', onAddNoticeFormFieldChange);

/**
 * Moves main pin element to specifeed X, Y position within fixed boundaries.
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 */
var moveMainPinToPosition = function (x, y) {
  if (x >= (PinLocation.X_MIN - mapPinMainElement.offsetWidth / 2)
    && x <= (PinLocation.X_MAX - mapPinMainElement.offsetWidth / 2)) {

    mapPinMainElement.style.left = x + 'px';
  }

  if (y >= (PinLocation.Y_MIN - mapPinMainElement.offsetHeight)
    && y <= (PinLocation.Y_MAX - mapPinMainElement.offsetHeight)) {

    mapPinMainElement.style.top = y + 'px';
  }
};

mapPinMainElement.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var setupElementCurrentPosition = {
    x: mapPinMainElement.offsetLeft,
    y: mapPinMainElement.offsetTop
  };

  /**
   * Mouse move handler
   * @param {MouseEvent} moveEvt - Mouse event DOM object
   */
  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    activateBookingPage();

    var shift = {
      x: moveEvt.clientX - evt.clientX,
      y: moveEvt.clientY - evt.clientY,
    };

    moveMainPinToPosition(
        setupElementCurrentPosition.x + shift.x,
        setupElementCurrentPosition.y + shift.y
    );
    setNoticeAddress(
        (mapPinMainElement.offsetLeft + mapPinMainElement.offsetWidth / 2),
        (mapPinMainElement.offsetTop + mapPinMainElement.offsetHeight)
    );
  };
  document.addEventListener('mousemove', onMouseMove);

  /**
   * Mouse Up handler
   * @param {MouseEvent} upEvt - Mouse event DOM object
   */
  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    setNoticeAddress(
        (mapPinMainElement.offsetLeft + mapPinMainElement.offsetWidth / 2),
        (mapPinMainElement.offsetTop + mapPinMainElement.offsetHeight)
    );

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };
  document.addEventListener('mouseup', onMouseUp);
});
