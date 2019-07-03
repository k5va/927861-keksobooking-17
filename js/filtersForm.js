'use strict';

(function () {
  var PARSE_INT_BASE = 10;

  var mapElement = document.querySelector('.map');
  var mapFiltersForm = mapElement.querySelector('.map__filters');
  var mapFiltersFormFields = mapFiltersForm.querySelectorAll('fieldset, select');
  var fieldFilterMap = {
    // housing type field filter
    'housing-type': function (type) {
      return function (ad) {
        return ad.offer.type === type;
      };
    },
    // rooms field filter
    'housing-rooms': function (rooms) {
      return function (ad) {
        return ad.offer.rooms === parseInt(rooms, PARSE_INT_BASE);
      };
    }
  };
  var currentFilter = {};

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

  mapFiltersForm.addEventListener('input', function (evt) {
    if (evt.target.value === 'any') {
      delete currentFilter[evt.target.name];
    } else {
      currentFilter[evt.target.name] = fieldFilterMap[evt.target.name](evt.target.value);
    }

    window.map.renderMapPins(Object.values(currentFilter));
  });

  window.filtersForm = {
    enableMapFiltersForm: enableMapFiltersForm,
    disableMapFiltersForm: disableMapFiltersForm
  };
})();
