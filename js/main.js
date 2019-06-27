'use strict';

var isBookingPageActive = false;

/**
 * Activates booking page
 */
var activateBookingPage = function () {
  if (!isBookingPageActive) {
    window.map.renderMapPins();
    window.map.enableMap();
    window.noticeForm.enableAddNoticeForm();
    window.filtersForm.enableMapFiltersForm();

    isBookingPageActive = true;
  }
};

/**
 * Deactivates booking page
 */
var deactivateBookingPage = function () {
  if (isBookingPageActive) {
    window.map.disableMap();
    window.noticeForm.disableAddNoticeForm();
    window.filtersForm.disableMapFiltersForm();

    isBookingPageActive = false;
  }
};

// set add form address field to initial position
window.noticeForm.setNoticeAddress(window.map.getMainPinPositionX(), window.map.getMainPinPositionY());
deactivateBookingPage();
window.map.initMainPinDragAndDrop(
    function (x, y) { // onDrag handler
      activateBookingPage();
      window.noticeForm.setNoticeAddress(x, y);
    },
    function (x, y) { // onDrop handler
      window.noticeForm.setNoticeAddress(x, y);
    }
);
