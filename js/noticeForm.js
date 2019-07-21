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
  var onSaveError;
  var onSaveSuccess;

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

  form.addEventListener('reset', function () {
    // clear avatar image
    avatarImage.src = 'img/muffin-grey.svg';
    // clear photos
    clearPhotos();
    // add empty photo placeholder
    photosContainer.appendChild(photoTemplate.cloneNode(false));
  });

  window.fileLoader.setupFileLoader(avatarFileInput, avatarDropZone, onAvatarImageLoaded);
  window.fileLoader.setupFileLoader(photosFileInput, photosDropZone, onPhotosLoaded);

  window.noticeForm = {
    enableAddNoticeForm: enableAddNoticeForm,
    disableAddNoticeForm: disableAddNoticeForm,
    setNoticeAddress: setNoticeAddress
  };
})();
