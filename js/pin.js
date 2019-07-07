'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;

  var pinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');

  /**
   * Creates map pin DOM Element from given template and ad object
   * @param {object} ad - ad object containing data
   * @param {number} i - ad's number
   * @return {Node} pin Element - created pin DOM element
   */
  var createPinElement = function (ad, i) {
    var pinElement = pinTemplateElement.cloneNode(true);
    var pinImageElement = pinElement.querySelector('img');

    pinElement.style.left = (ad.location.x - MAP_PIN_WIDTH / 2) + 'px';
    pinElement.style.top = (ad.location.y - MAP_PIN_HEIGHT) + 'px';
    pinImageElement.src = ad.author.avatar;
    pinImageElement.alt = ad.offer.type;
    pinElement.dataset.adId = i;

    return pinElement;
  };

  window.pin = {createPinElement: createPinElement};
})();
