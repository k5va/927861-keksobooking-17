'use strict';

(function () {
  var MAP_PIN_WIDTH = 50;
  var MAP_PIN_HEIGHT = 70;

  var KeyCode = {
    ESC: 27
  };
  var pinTemplateElement = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinCardTemplateElement = document.querySelector('#card').content.querySelector('.map__card');
  var cardElement = pinCardTemplateElement.cloneNode(true);
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
   * @param {HTMLElement} parent - parent container to run query selectors on
   * @param {*} selector - query selector
   * @param {*} value - value to set
   */
  var setTextContent = function (parent, selector, value, displayValue) {
    parent = parent || document;
    var element = parent.querySelector(selector);

    if (value) {
      displayValue = displayValue || value;
      element.textContent = displayValue;
    } else { // no value - hide block
      element.style.display = 'none';
    }
  };

  /**
   * Sets children of the given DOM element based on the given data array
   * @param {HTMLElement} parent - container to run query selectors on
   * @param {string} selector - query selector for parent element
   * @param {Array} data - data array used to create children
   * @param {function} createChildElement - callback function that creates child element
   */
  var setChildContent = function (parent, selector, data, createChildElement) {
    parent = parent || document;

    var element = parent.querySelector(selector);
    element.innerHTML = '';

    // hide block if no features
    if (data.length === 0) {
      element.style.display = 'none';
      return;
    }

    element.style.display = 'block';
    var dataFragment = document.createDocumentFragment();
    data.forEach(function (item) {
      var itemElement = createChildElement(item);
      dataFragment.appendChild(itemElement);
    });

    element.appendChild(dataFragment);
  };

  var adCardFieldMap = {
    'popup__title': function (card, ad) {
      setTextContent(card, '.popup__title', ad.offer.title);
    },
    'popup__text--address': function (card, ad) {
      setTextContent(card, '.popup__text--address', ad.offer.address);
    },
    'popup__text--price': function (card, ad) {
      setTextContent(card, '.popup__text--price', ad.offer.price, ad.offer.price + '₽/ночь');
    },
    'popup__type': function (card, ad) {
      setTextContent(card, '.popup__type', ad.offer.type, window.data.OfferTypes[ad.offer.type.toUpperCase()].name);
    },
    'popup__text--capacity': function (card, ad) {
      setTextContent(card, '.popup__text--capacity', ad.offer.rooms,
          ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей');
    },
    'popup__text--time': function (card, ad) {
      setTextContent(card, '.popup__text--time', ad.offer.checkin,
          'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout);
    },
    'popup__description': function (card, ad) {
      setTextContent(card, '.popup__description', ad.offer.description);
    },
    'popup__avatar': function (card, ad) {
      var avatar = card.querySelector('.popup__avatar');

      if (ad.author.avatar) {
        avatar.src = ad.author.avatar;
      } else {
        avatar.style.display = 'none';
      }
    },
    'popup__features': function (card, ad) {
      setChildContent(card, '.popup__features', ad.offer.features,
          function (feature) { // creates child element
            var featureElement = document.createElement('li');
            featureElement.classList.add('popup__feature', 'popup__feature--' + feature);

            return featureElement;
          }
      );
    },
    'popup__photos': function (card, ad) {
      setChildContent(card, '.popup__photos', ad.offer.photos,
          function (photo) { // creates child element
            var photoElement = document.createElement('img');
            photoElement.src = photo;
            photoElement.classList.add('popup__photo');
            photoElement.width = 45;
            photoElement.height = 40;
            photoElement.alt = 'Фотография жилья';

            return photoElement;
          }
      );
    }
  };

  /**
   * Displays ad details popup
   * @param {Object} ad - ad object
   */
  var showDetails = function (ad) {
    // fill details fields with Ad's data
    Object.keys(adCardFieldMap).forEach(function (field) {
      adCardFieldMap[field](cardElement, ad);
    });

    /**
     * Closes popup
     */
    var closePopup = function () {
      cardElement.remove();
    };

    cardElement
      .querySelector('.popup__close')
      .addEventListener('click', function () {
        closePopup();
      });

    /**
     * Key handler
     * @param {Event} evt - DOM event object
     */
    var onKeyPressed = function (evt) {
      // close popup on Esc key
      if (evt.keyCode === KeyCode.ESC) {
        closePopup();
        document.removeEventListener('keydown', onKeyPressed);
      }
    };

    document.addEventListener('keydown', onKeyPressed);
    // render popup to the DOM
    mapFiltersContainer.insertAdjacentElement('beforebegin', cardElement);
  };

  window.pin = {
    createPinElement: createPinElement
  };
})();
