'use strict';

var isBookingPageActive = false;

/**
 * Activates booking page
 */
var activateBookingPage = function () {
  if (!isBookingPageActive) {
    window.map.enableMap(function (errorMessage) {
      window.errorMessage.show(errorMessage, function () {
        deactivateBookingPage();
      });
    });
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
// page should not be active when opened
deactivateBookingPage();
// initialize main pin drag and drop feature
window.map.initMainPinDragAndDrop(
    function (x, y) { // onDrag handler
      activateBookingPage();
      window.noticeForm.setNoticeAddress(x, y);
    },
    function (x, y) { // onDrop handler
      window.noticeForm.setNoticeAddress(x, y);
    }
);
