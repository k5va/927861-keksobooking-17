'use strict';

(function () {
  var ADS_NUMBER = 8;
  var AVATAR_IMAGE_SOURCE = 'img/avatars/user{{xx}}.png';

  var OfferTypes = {
    PALACE: {
      name: 'Дворец',
      minPrice: 10000
    },
    FLAT: {
      name: 'Квартира',
      minPrice: 1000
    },
    HOUSE: {
      name: 'Дом',
      minPrice: 5000
    },
    BUNGALO: {
      name: 'Бунгало',
      minPrice: 0
    }
  };

  /**
   * Generates Ads mock data
   * @param {number} dataNumber - Number of mock data to generate
   * @param {Object} locationBounds - min and max bounds of ads location
   * @return {Array} - Ads objects array
   */
  var generateMockData = function (dataNumber, locationBounds) {
    // initialize ads data array
    var ads = [];
    // populate ads with data
    for (var i = 0; i < dataNumber; i++) {
      ads.push({
        author: {
          avatar: AVATAR_IMAGE_SOURCE.replace('{{xx}}', (i + 1) < 10 ? '0' + (i + 1) : (i + 1))
        },
        offer: {
          type: window.utils.getRandomElementFromArray(Object.keys(OfferTypes)).toLowerCase()
        },
        location: {
          x: window.utils.generateRandomNumberFromRange(locationBounds.X_MIN, locationBounds.X_MAX),
          y: window.utils.generateRandomNumberFromRange(locationBounds.Y_MIN, locationBounds.Y_MAX)
        }
      });
    }

    return ads;
  };

  window.data = {
    generateMockData: function (locationBounds) {
      return generateMockData(ADS_NUMBER, locationBounds);
    },
    OfferTypes: OfferTypes
  };
})();
