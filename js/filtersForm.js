'use strict';

(function () {
  var PriceRange = {
    low: {
      min: 0,
      max: 10000
    },
    middle: {
      min: 10000,
      max: 50000
    },
    high: {
      min: 50000,
      max: 50000
    }
  };

  var mapElement = document.querySelector('.map');
  var mapFiltersForm = mapElement.querySelector('.map__filters');
  var mapFiltersFormFields = mapFiltersForm.querySelectorAll('fieldset, select');
  var onFilterChange = null;

  /**
   * Default filter used if no filter is set for field
   * @return {boolean} - always true
   */
  var defaultFilter = function () {
    return true;
  };
  /**
   * Filters ads by given feature
   * @param {string} feature - feature to filter
   * @return {function} - filter function
   */
  var featureFilter = function (feature) {
    return function (ad) {
      return ad.offer.features.includes(feature);
    };
  };
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
        return ad.offer.rooms === +rooms;
      };
    },
    // guests field filter
    'housing-guests': function (guests) {
      return function (ad) {
        return ad.offer.guests === +guests;
      };
    },
    // price field filter
    'housing-price': function (price) {
      return function (ad) {
        return ad.offer.price === price;
      };
    },
    // wifi feature filter
    'wifi': featureFilter,
    'dishwasher': featureFilter,
    'parking': featureFilter,
    'washer': featureFilter,
    'elevator': featureFilter,
    'conditioner': featureFilter
  };
  var currentFilter = {};

  /**
   * Disables Map filters form
   */
  var disableMapFiltersForm = function () {
    mapFiltersForm.reset();
    mapFiltersFormFields.forEach(function (element) {
      element.disabled = true;
    });
  };

  /**
   * Enables Map filters form
   * @param {function} onChange - callback on filter change
   */
  var enableMapFiltersForm = function (onChange) {
    mapFiltersFormFields.forEach(function (element) {
      element.disabled = false;
    });
    onFilterChange = onChange;
  };

  /**
   * Updates current filter with given values
   * @param {string} name - filter field name
   * @param {string} value - filter field value
   */
  var updateCurrentFilter = function (name, value) {
    // features fields
    if (name === 'features') {
      // in case of features (checkboxes) values will act as filter keys
      if (currentFilter[value]) {
        delete currentFilter[value];
      } else {
        // if no filter is set for given field use default filter
        currentFilter[value] = fieldFilterMap[value] ? fieldFilterMap[value](value) : defaultFilter;
      }
      return;
    }

    // other fields
    if (value === 'any') {
      delete currentFilter[name];
    } else {
      // if no filter is set for given field use default filter
      currentFilter[name] = fieldFilterMap[name] ? fieldFilterMap[name](value) : defaultFilter;
    }
  };

  mapFiltersForm.addEventListener('input', function (evt) {
    updateCurrentFilter(evt.target.name, evt.target.value);
    onFilterChange(Object.values(currentFilter));
  });

  window.filtersForm = {
    enableMapFiltersForm: enableMapFiltersForm,
    disableMapFiltersForm: disableMapFiltersForm
  };
})();
