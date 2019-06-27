'use strict';

(function () {
  var PinLocation = {
    X_MIN: 0,
    X_MAX: 1200,
    Y_MIN: 130,
    Y_MAX: 630
  };
  var mockData = window.data.generateMockData(PinLocation);
  var mapElement = document.querySelector('.map');
  var pinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');
  var mapPinsElement = document.querySelector('.map__pins');
  var mapPinMainElement = mapPinsElement.querySelector('.map__pin--main');

  /**
   * Creates Map pins DOM elements and renders them to the DOM
   */
  var renderMapPins = function () {
    var fragment = document.createDocumentFragment();

    mockData.forEach(function (ad) {
      fragment.appendChild(window.pin.createPinElement(pinTemplateElement, ad));
    });

    mapPinsElement.appendChild(fragment);
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
   * Enables pin map
   */
  var enableMap = function () {
    mapElement.classList.remove('map--faded');
  };

  /**
   * Disables pin map
   */
  var disableMap = function () {
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
    renderMapPins: renderMapPins,
    initMainPinDragAndDrop: initMainPinDragAndDrop,
    enableMap: enableMap,
    disableMap: disableMap,
    getMainPinPositionX: getMainPinPositionX,
    getMainPinPositionY: getMainPinPositionY
  };
})();
