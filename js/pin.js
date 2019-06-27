'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;

  /**
   * Creates map pin DOM Element from given template and ad object
   * @param {Node} pinTemplate - template for creating map pin element
   * @param {object} ad - ad object containing data
   *
   * @return {Node} pin Element - created pin DOM element
   */
  var createPinElement = function (pinTemplate, ad) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinImageElement = pinElement.querySelector('img');

    pinElement.style.left = (ad.location.x - MAP_PIN_WIDTH / 2) + 'px';
    pinElement.style.top = (ad.location.y - MAP_PIN_HEIGHT) + 'px';
    pinImageElement.src = ad.author.avatar;
    pinImageElement.alt = ad.offer.type;

    return pinElement;
  };

  window.pin = {createPinElement: createPinElement};
})();
