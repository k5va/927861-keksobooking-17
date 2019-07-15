'use strict';

// Needs to be true in order to corectly deactivate later
var isBookingPageActive = true;

/**
 * Activates booking page
 */
var activateBookingPage = function () {
  if (!isBookingPageActive) {
    window.map.enableMap(function (errorMessage) {
      window.message.error(errorMessage, function () {
        deactivateBookingPage();
      });
    });
    window.noticeForm.enableAddNoticeForm(
        function () { // on form data save success
          deactivateBookingPage();
          window.message.success();
        },
        function (errorMessage) { // on form data save error
          window.message.error(errorMessage);
        }
    );
    window.filtersForm.enableMapFiltersForm(function (filters) {
      window.map.renderMapPins(filters);
    });

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
