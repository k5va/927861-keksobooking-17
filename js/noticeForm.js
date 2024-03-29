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
  var avatarFileInput = form.querySelector('.ad-form-header__input');
  var avatarDropZone = form.querySelector('.ad-form-header__drop-zone');
  var avatarImage = form.querySelector('.ad-form-header__preview img');
  var photosFileInput = form.querySelector('.ad-form__input');
  var photosDropZone = form.querySelector('.ad-form__drop-zone');
  var photosContainer = form.querySelector('.ad-form__photo-container');
  var photoTemplate = document.querySelector('#photo').content.querySelector('.ad-form__photo');
  var capacityRoomNumberMap = {
    0: [100],
    1: [1, 2, 3],
    2: [2, 3],
    3: [3]
  };
  var offerMinPriceMap = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };
  var onError;
  var onSuccess;
  var onReset;

  /**
   * Avatar image loaded callback
   * @param {Array} readerFiles - Array pf loaded files data
   */
  var onAvatarImageLoaded = function (readerFiles) {
    avatarImage.src = readerFiles[0];
  };

  /**
   * Clears loaded photos
   */
  var clearPhotos = function () {
    photosContainer.querySelectorAll('.ad-form__photo')
    .forEach(function (photo) {
      photosContainer.removeChild(photo);
    });
  };

  /**
   * Photos loaded callback
   * @param {Array} readerFiles - Array pf loaded files data
   */
  var onPhotosLoaded = function (readerFiles) {
    // clear previously loaded photos
    clearPhotos();
    // add new photos
    var photosFragment = new DocumentFragment();
    readerFiles.forEach(function (fileData) {
      var photo = photoTemplate.cloneNode(true);
      photo.querySelector('img').src = fileData;
      photosFragment.appendChild(photo);
    });
    photosContainer.appendChild(photosFragment);
  };


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
   * @param {function} onFormSuccess - on form data sucessfuly save callback
   * @param {function} onFormReset - on form reset callback
   * @param {function} onFormError - on form data save error callback
   */
  var enableAddNoticeForm = function (onFormSuccess, onFormReset, onFormError) {
    form.classList.remove('ad-form--disabled');
    formFields.forEach(function (element) {
      element.disabled = false;
    });
    onSuccess = onFormSuccess || function () {};
    onError = onFormError || function () {};
    onReset = onFormReset || function () {};
  };

  /**
   * Sets add notice form address field to given cooridinates
   * @param {number} x - x coordinate
   * @param {number} y - y coordinate
   */
  var setNoticeAddress = function (x, y) {
    addressField.value = Math.floor(x) + ', ' + Math.floor(y);
    addressField.placeholder = addressField.value;
  };

  /**
   * Changes Add Notice form price field min value based on offer type
   * @param {string} offerType - given offer type
   */
  var updateAddNoticeMinPrice = function (offerType) {
    priceField.min = offerMinPriceMap[offerType];
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
    window.backend.save(new FormData(form), onSuccess, onError);
  });

  form.addEventListener('reset', function () {
    // clear avatar image
    avatarImage.src = 'img/muffin-grey.svg';
    // clear photos
    clearPhotos();
    // add empty photo placeholder
    photosContainer.appendChild(photoTemplate.cloneNode(false));
    // reset price field placeholder to default
    priceField.placeholder = offerMinPriceMap.flat;
    // fire callback
    if (onReset) {
      onReset();
    }
  });

  window.fileLoader.setup(avatarFileInput, avatarDropZone, onAvatarImageLoaded);
  window.fileLoader.setup(photosFileInput, photosDropZone, onPhotosLoaded);

  window.noticeForm = {
    enableAddNoticeForm: enableAddNoticeForm,
    disableAddNoticeForm: disableAddNoticeForm,
    setNoticeAddress: setNoticeAddress
  };
})();
