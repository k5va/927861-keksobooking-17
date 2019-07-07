'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;

  var pinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinCardTemplateElement = document.querySelector('#card').content.querySelector('.map__card');
  var mapFiltersContainer = document.querySelector('.map__filters-container');

  /**
   * Creates map pin DOM Element from given template and ad object
   * @param {object} ad - ad object containing data
   * @return {Node} pin Element - created pin DOM element
   */
  var createPinElement = function (ad) {
    var pinElement = pinTemplateElement.cloneNode(true);
    var pinImageElement = pinElement.querySelector('img');

    pinElement.style.left = (ad.location.x - MAP_PIN_WIDTH / 2) + 'px';
    pinElement.style.top = (ad.location.y - MAP_PIN_HEIGHT) + 'px';
    pinImageElement.src = ad.author.avatar;
    pinImageElement.alt = ad.offer.type;

    pinElement.addEventListener('click', function () {
      showDetails(ad);
    });

    return pinElement;
  };

  /**
   * Sets textContent of the DOM element defined by the given parent cotainer and selector
   * @param {HTMLElement} parent - parent container to tun query selectors on
   * @param {*} selector - query selector
   * @param {*} value - value to set
   */
  var setTextContent = function (parent, selector, value) {
    parent = parent || document;
    parent.querySelector(selector).textContent = value;
  };

  var adCardFieldMap = {
    'popup__title': function (card, ad) {
      setTextContent(card, '.popup__title', ad.offer.title);
    },
    'popup__text--address': function (card, ad) {
      setTextContent(card, '.popup__text--address', ad.offer.address);
    },
    'popup__text--price': function (card, ad) {
      setTextContent(card, '.popup__text--price', ad.offer.price + '₽/ночь');
    },
    'popup__type': function (card, ad) {
      setTextContent(card, '.popup__type', window.data.OfferTypes[ad.offer.type.toUpperCase()].name);
    },
    'popup__text--capacity': function (card, ad) {
      setTextContent(card, '.popup__text--capacity',
          ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей');
    },
    'popup__text--time': function (card, ad) {
      setTextContent(card, '.popup__text--time',
          'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout);
    },
    'popup__description': function (card, ad) {
      setTextContent(card, '.popup__description', ad.offer.description);
    },
    'popup__avatar': function (card, ad) {
      card.querySelector('.popup__avatar').src = ad.author.avatar;
    },
    'popup__features': function (card, ad) {
      var featuresElement = card.querySelector('.popup__features');
      featuresElement.innerHTML = '';

      ad.offer.features.forEach(function (feature) {
        featuresElement.innerHTML += '<li class="popup__feature popup__feature--' + feature + '"></li>';
      });
    },
    'popup__photos': function (card, ad) {
      var photosElement = card.querySelector('.popup__photos');
      photosElement.innerHTML = '';

      ad.offer.photos.forEach(function (photo) {
        photosElement.innerHTML +=
            '<img src="' + photo + '" class="popup__photo" width="45" height="40" alt="Фотография жилья">';
      });
    }
  };

  /**
   * Displays ad details popup
   * @param {Object} ad - ad object
   */
  var showDetails = function (ad) {
    var cardElement = pinCardTemplateElement.cloneNode(true);
    // fill details fields with Ad's data
    Object.keys(adCardFieldMap).forEach(function (field) {
      adCardFieldMap[field](cardElement, ad);
    });
    // render popup to the DOM
    mapFiltersContainer.insertAdjacentElement('beforebegin', cardElement);
  };

  window.pin = {
    createPinElement: createPinElement
  };
})();
