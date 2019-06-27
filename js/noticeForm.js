'use strict';

(function () {
  var addNoticeForm = document.querySelector('.ad-form');
  var addNoticeFormFields = addNoticeForm.querySelectorAll('fieldset');
  var addNoticePriceField = addNoticeForm.querySelector('#price');
  var addNoticeTimeInField = addNoticeForm.querySelector('#timein');
  var addNoticeTimeOutField = addNoticeForm.querySelector('#timeout');
  var addNoticeAddressField = addNoticeForm.querySelector('#address');

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
   * Sets add notice form address field to given cooridinates
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   */
  var setNoticeAddress = function (x, y) {
    addNoticeAddressField.value = Math.floor(x) + ', ' + Math.floor(y);
  };

  /**
   * Changes Add Notice form price field min value based on offer type
   * @param {string} offerType - given offer type
   */
  var updateAddNoticeMinPrice = function (offerType) {
    addNoticePriceField.min = window.data.OfferTypes[offerType.toUpperCase()].minPrice;
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

  window.noticeForm = {
    enableAddNoticeForm: enableAddNoticeForm,
    disableAddNoticeForm: disableAddNoticeForm,
    setNoticeAddress: setNoticeAddress
  };
})();
