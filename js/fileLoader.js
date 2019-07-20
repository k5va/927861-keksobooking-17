'use strict';

(function () {
  var SUPPORTED_FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  /**
   * Filters selected files removing not supported file types
   * @param {FileList} files - list of selected files
   * @return {Array} - array of supported files
   */
  var filterSupportedFiles = function (files) {
    return Array.prototype.filter.call(
        files,
        function (file) {
          var fileName = file.name.toLowerCase();
          var isSupported = SUPPORTED_FILE_TYPES.some(
              function (fileType) {
                return fileName.endsWith(fileType);
              }
          );
          return isSupported;
        }
    );
  };

  /**
   * Start listening to change event on file input DOM object
   * and fire callback when all files are loaded
   * @param {HTMLElement} fileInput - file input DOM object
   * @param {Function} onfileLoaded - file loaded callback
   */
  var startFileLoader = function (fileInput, onfileLoaded) {

    fileInput.addEventListener('change', function () {
      var readerResults = [];
      // remove not supported file types
      var supportedFiles = filterSupportedFiles(fileInput.files);
      // iterate through files
      supportedFiles.forEach(function (file) {
        var reader = new FileReader();
        reader.addEventListener('load', function () {
          // save file data to array
          readerResults.push(reader.result);
          // if all files are loaded fire callback
          if (readerResults.length === supportedFiles.length) {
            onfileLoaded(readerResults);
          }
        });
        // read file
        reader.readAsDataURL(file);
      });
    });
  };

  /**
   * Stop listening to change event on file input DOM object
   * @param {HTMLElement} fileInput - file input DOM object
   * @param {Function} onfileLoaded - file loaded callback
   */
  var stopFileLoader = function (fileInput, onfileLoaded) {
    fileInput.removeEventListener('change', onfileLoaded);
  };

  window.fileLoader = {
    startFileLoader: startFileLoader,
    stopFileLoader: stopFileLoader
  };
})();
