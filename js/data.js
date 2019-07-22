'use strict';

(function () {

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


  window.data = {
    OfferTypes: OfferTypes
  };
})();
