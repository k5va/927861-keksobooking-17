'use strict';

(function () {
  var addNoticeForm = document.querySelector('.ad-form');
  var addNoticeFormFields = addNoticeForm.querySelectorAll('fieldset');
  var addNoticePriceField = addNoticeForm.querySelector('#price');
  var addNoticeTimeInField = addNoticeForm.querySelector('#timein');
  var addNoticeTimeOutField = addNoticeForm.querySelector('#timeout');
  var addNoticeAddressField = addNoticeForm.querySelector('#address');
  var addNoticeRoomNumberField = addNoticeForm.querySelector('#room_number');
  var capacityField = addNoticeForm.querySelector('#capacity');
  var capacityRoomNumberMap = {
    0: [100],
    1: [1, 2, 3],
    2: [2, 3],
    3: [3]
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

  var fieldChangeHandlerMap = {
    'type': function (field) {
      updateAddNoticeMinPrice(field.value);
    },
    'timein': function (field) {
      addNoticeTimeOutField.value = field.value;
    },
    'timeout': function (field) {
      addNoticeTimeInField.value = field.value;
    },
    'capacity': function (field) {
      // TODO: + or parseInt?
      if (!capacityRoomNumberMap[field.value].includes(+addNoticeRoomNumberField.value)) {
        field.setCustomValidity('Количество мест не соответствует количеству комнат');
      } else {
        field.setCustomValidity('');
      }
    },
    'room_number': function (field) {
      // in case user changes room_number field to fix capacity error
      if (capacityRoomNumberMap[capacityField.value].includes(+field.value)) {
        capacityField.setCustomValidity('');
      }
    }
  };

  addNoticeForm.addEventListener('input', function (evt) {
    if (fieldChangeHandlerMap[evt.target.id]) {
      fieldChangeHandlerMap[evt.target.id](evt.target);
    }
  });

  window.noticeForm = {
    enableAddNoticeForm: enableAddNoticeForm,
    disableAddNoticeForm: disableAddNoticeForm,
    setNoticeAddress: setNoticeAddress
  };
})();
