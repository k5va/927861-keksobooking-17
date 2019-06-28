'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mapFiltersForm = mapElement.querySelector('.map__filters');
  var mapFiltersFormFields = mapFiltersForm.querySelectorAll('fieldset, select');

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

  window.filtersForm = {
    enableMapFiltersForm: enableMapFiltersForm,
    disableMapFiltersForm: disableMapFiltersForm
  };
})();
