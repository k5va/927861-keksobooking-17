'use strict';

(function () {
  var KeyCodes = {
    ESC: 27
  };

  var mainElement = document.querySelector('main');
  var errorElementTemplate = document.querySelector('#error').content.querySelector('.error');

  /**
   * Displays error message popup
   * @param {string} message - error message
   * @param {function} onClose - popup close callback
   */
  var show = function (message, onClose) {
    var errorElement = errorElementTemplate.cloneNode(true);

    errorElement.querySelector('.error__message').textContent = message;

    /**
     * Popup click handler
     */
    var onClick = function () {
      close();
    };

    /**
     * Popup key handler
     * @param {Event} evt - DOM event object
     */
    var onKey = function (evt) {
      if (evt.keyCode === KeyCodes.ESC) {
        close();
      }
    };

    /**
     * Closes popup
     */
    var close = function () {
      mainElement.removeChild(errorElement);
      errorElement.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      onClose();
    };
    errorElement.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);

    mainElement.insertAdjacentElement('afterbegin', errorElement);
  };

  window.errorMessage = {
    show: show
  };
})();
