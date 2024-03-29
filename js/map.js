'use strict';

(function () {

  var MAX_PIN_NUMBER = 5;

  var MainPinDefalutPosition = { // TODO: refactor to Position object
    X: 570,
    Y: 375
  };
  var PinLocation = {
    X_MIN: 0,
    X_MAX: 1200,
    Y_MIN: 130,
    Y_MAX: 630
  };
  var mapElement = document.querySelector('.map');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapPinMainElement = mapPinsElement.querySelector('.map__pin--main');
  var ads = null;

  /**
   * Removes all map pins from the DOM (except main pin)
   */
  var clearPins = function () {
    mapPinsElement
      .querySelectorAll('.map__pin:not(.map__pin--main)')
      .forEach(function (pin) {
        mapPinsElement.removeChild(pin);
      });
    window.pin.hideDetails();
  };

  /**
   * Filters ads data, creates Map pins DOM elements and renders them to the DOM
   * @param {Array} filters - array of selected filters
   */
  var renderPins = function (filters) {
    var filteredAds = ads;
    if (filters) {
      filters.forEach(function (filter) {
        filteredAds = filteredAds.filter(filter);
      });
    }

    clearPins();
    var pinsFragment = document.createDocumentFragment();

    filteredAds.slice(0, MAX_PIN_NUMBER).forEach(function (ad) {
      pinsFragment.appendChild(window.pin.create(ad));
    });

    mapPinsElement.appendChild(pinsFragment);
  };

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

  /**
   * Ads data load success handler.
   * @param {Array} data - backend data
   */
  var onAdsDataLoadSuccess = function (data) {
    // filter ads with no offer
    ads = data.filter(function (ad) {
      return ad.offer;
    });
    renderPins();
    mapElement.classList.remove('map--faded');
  };


  /**
   * Enables pin map and renders pins, if not rendered before.
   * @param {function} onError - error callback
   */
  var enable = function (onError) {
    window.backend.load(onAdsDataLoadSuccess, onError);
  };

  /**
   * Disables pin map
   */
  var disable = function () {
    ads = null;
    clearPins();
    moveMainPinToPosition(MainPinDefalutPosition.X, MainPinDefalutPosition.Y);
    mapElement.classList.add('map--faded');
  };

  /**
   * Returns Main pin's X coordinate
   * @return {number} - Main pin's X coordinate
   */
  var getMainPinPositionX = function () {
    return mapPinMainElement.offsetLeft + mapPinMainElement.offsetWidth / 2;
  };

  /**
   * Returns Main pin's Y coordinate
   * @return {number} - Main pin's X coordinate
   */
  var getMainPinPositionY = function () {
    return mapPinMainElement.offsetTop + mapPinMainElement.offsetHeight / 2;
  };

  /**
   * Initializes main pin drag and drop feature
   * @param {function} onDrag - main pin dragg handler. Called everytime user moves a mouse while dragging main pin
   * @param {Function} onDrop - main pin drop handler. Called when user drops main pin.
   */
  var initMainPinDragAndDrop = function (onDrag, onDrop) {
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

        var shift = {
          x: moveEvt.clientX - evt.clientX,
          y: moveEvt.clientY - evt.clientY,
        };

        moveMainPinToPosition(
            setupElementCurrentPosition.x + shift.x,
            setupElementCurrentPosition.y + shift.y
        );
        onDrag(mapPinMainElement.offsetLeft + mapPinMainElement.offsetWidth / 2,
            mapPinMainElement.offsetTop + mapPinMainElement.offsetHeight);
      };
      document.addEventListener('mousemove', onMouseMove);

      /**
       * Mouse Up handler
       * @param {MouseEvent} upEvt - Mouse event DOM object
       */
      var onMouseUp = function (upEvt) {
        upEvt.preventDefault();

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);

        onDrop(mapPinMainElement.offsetLeft + mapPinMainElement.offsetWidth / 2,
            mapPinMainElement.offsetTop + mapPinMainElement.offsetHeight);
      };
      document.addEventListener('mouseup', onMouseUp);
    });
  };

  window.map = {
    initMainPinDragAndDrop: initMainPinDragAndDrop,
    enable: enable,
    disable: disable,
    getMainPinPositionX: getMainPinPositionX,
    getMainPinPositionY: getMainPinPositionY,
    renderPins: window.utils.debounce(renderPins)
  };
})();
