'use strict';

(function () {
  var form = document.querySelector('.ad-form');
  var formFields = form.querySelectorAll('fieldset');
  var priceField = form.querySelector('#price');
  var timeInField = form.querySelector('#timein');
  var timeOutField = form.querySelector('#timeout');
  var addressField = form.querySelector('#address');
  var roomNumberField = form.querySelector('#room_number');
  var capacityField = form.querySelector('#capacity');
  var capacityRoomNumberMap = {
    0: [100],
    1: [1, 2, 3],
    2: [2, 3],
    3: [3]
  };
  var onSaveError;
  var onSaveSuccess;

  /**
   * Disables Add notice form and fields
   */
  var disableAddNoticeForm = function () {
    form.classList.add('ad-form--disabled');
    form.reset();
    formFields.forEach(function (element) {
      element.disabled = true;
    });
  };

  /**
   * Enable Add notice form and fields
   * @param {function} onSuccess - on form data sucessfuly save callback
   * @param {function} onError - on form data save error callback
   */
  var enableAddNoticeForm = function (onSuccess, onError) {
    form.classList.remove('ad-form--disabled');
    formFields.forEach(function (element) {
      element.disabled = false;
    });
    onSaveSuccess = onSuccess || function () {};
    onSaveError = onError || function () {};
  };

  /**
   * Sets add notice form address field to given cooridinates
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   */
  var setNoticeAddress = function (x, y) {
    addressField.value = Math.floor(x) + ', ' + Math.floor(y);
  };

  /**
   * Changes Add Notice form price field min value based on offer type
   * @param {string} offerType - given offer type
   */
  var updateAddNoticeMinPrice = function (offerType) {
    priceField.min = window.data.OfferTypes[offerType.toUpperCase()].minPrice;
    priceField.placeholder = priceField.min;
  };

  var fieldChangeHandlerMap = {
    'type': function (field) {
      updateAddNoticeMinPrice(field.value);
    },
    'timein': function (field) {
      timeOutField.value = field.value;
    },
    'timeout': function (field) {
      timeInField.value = field.value;
    },
    'capacity': function (field) {
      if (!capacityRoomNumberMap[field.value].includes(+roomNumberField.value)) {
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

  form.addEventListener('input', function (evt) {
    if (fieldChangeHandlerMap[evt.target.id]) {
      fieldChangeHandlerMap[evt.target.id](evt.target);
    }
  });

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(form), onSaveSuccess, onSaveError);
  });

  window.noticeForm = {
    enableAddNoticeForm: enableAddNoticeForm,
    disableAddNoticeForm: disableAddNoticeForm,
    setNoticeAddress: setNoticeAddress
  };
})();
