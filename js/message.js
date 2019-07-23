'use strict';

(function () {
  var mainElement = document.querySelector('main');
  var errorElementTemplate = document.querySelector('#error').content.querySelector('.error');
  var successElementTemplate = document.querySelector('#success').content.querySelector('.success');

  /**
   * Displays error message popup
   * @param {string} message - error message
   * @param {function} onClose - popup close callback
   */
  var error = function (message, onClose) {
    var errorElement = errorElementTemplate.cloneNode(true);
    errorElement.querySelector('.error__message').textContent = message;
    show(errorElement, onClose);
  };

  /**
   * Displays success message popup
   * @param {function} onClose - popup close callback
   */
  var success = function (onClose) {
    var successElement = successElementTemplate.cloneNode(true);
    show(successElement, onClose);
  };

  /**
   * Displays message popup
   * @param {HTMLElement} messageElement - message DOM element
   * @param {function} onClose - popup close callback
   */
  var show = function (messageElement, onClose) {
    onClose = onClose || function () {}; // set default value if no callback is passed

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
      if (evt.keyCode === window.utils.KeyCodes.ESC) {
        close();
      }
    };

    /**
     * Closes popup
     */
    var close = function () {
      mainElement.removeChild(messageElement);
      messageElement.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
      onClose();
    };
    messageElement.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);

    mainElement.insertAdjacentElement('afterbegin', messageElement);
  };

  window.message = {
    success: success,
    error: error
  };
})();
