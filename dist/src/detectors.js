'use strict';

var addDetectorApi = function addDetectorApi(matroid) {
  // https://www.matroid.com/docs/api/index.html#api-Detectors-PostDetectors
  matroid.createDetector = function (zipFile, name, detectorType) {
    var _this = this;

    var configs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    /*
    Creates detector asynchronously (turn processing to true) Note: calling this API creates a pending detector, and you can update this detector with more images by calling this API with detector_id; however, creating more than one pending detector is not allowed, so you need to finalize or delete your existing pending detector before creating a new one.
     It might take some time for the detector to become editable(add labels etc)
    */
    return new Promise(function (resolve, reject) {
      _this._checkRequiredParams({ zipFile: zipFile, name: name, detectorType: detectorType });

      if (!_this._checkFilePayloadSize(zipFile, 0, _this._fileSizeLimits.zip)) {
        throw new Error('Individual file size must be under ' + _this._fileSizeLimits.zip / 1024 / 1024 + 'MB');
      }

      var options = {
        action: 'createDetector',
        data: { name: name, detectorType: detectorType },
        filePaths: zipFile
      };

      Object.assign(options.data, configs);

      _this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Detectors-DeleteDetectorsDetector_id
  matroid.deleteDetector = function (detectorId) {
    var _this2 = this;

    /*
    Requires processing=false. 
    */
    return new Promise(function (resolve, reject) {
      _this2._checkRequiredParams({ detectorId: detectorId });

      var options = {
        action: 'deleteDetector',
        uriParams: { ':key': detectorId }
      };

      _this2._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Detectors-PostDetectorsDetector_idFinalize
  matroid.trainDetector = function (detectorId) {
    var _this3 = this;

    /*
    Requires processing=false. Starts training asynchronously (turn processing to true)
    */
    return new Promise(function (resolve, reject) {
      _this3._checkRequiredParams({ detectorId: detectorId });

      var options = {
        action: 'trainDetector',
        uriParams: { ':key': detectorId }
      };

      _this3._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Detectors-GetDetectorsDetector_id
  // Formerly called detectorInfo (now deprecated), use getDetectorInfo
  matroid.getDetectorInfo = matroid.detectorInfo = function (detectorId) {
    var _this4 = this;

    return new Promise(function (resolve, reject) {
      _this4._checkRequiredParams({ detectorId: detectorId });

      var options = {
        action: 'getDetectorInfo',
        uriParams: { ':key': detectorId }
      };

      _this4._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Detectors-PostDetectorsUpload
  matroid.importDetector = function (name) {
    var _this5 = this;

    var configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    /* 
    Certain combination of parameters can be supplied: 
    file_detector, fileProto + fileLabel(+ fileLabel_ind), 
    or fileProto + labels(+ label_inds).
    Parentheses part can be optionally supplied for object detection.
    */

    return new Promise(function (resolve, reject) {
      _this5._checkRequiredParams({ name: name });

      var options = {
        action: 'importDetector',
        data: { name: name },
        filePaths: {}
      };

      if (configs.fileDetector) {
        // .matroid file
        Object.assign(options.filePaths, {
          file_detector: configs.fileDetector
        });
      } else {
        var inputTensor = configs.inputTensor,
            outputTensor = configs.outputTensor,
            detectorType = configs.detectorType;

        if (!inputTensor || !outputTensor || !detectorType) {
          throw new Error('Please provide info: inputTensor, outputTensor, detectorType');
        }

        var fileProto = configs.fileProto,
            fileLabel = configs.fileLabel,
            labels = configs.labels;


        if (fileProto && fileLabel) {
          var fileLabelInd = configs.fileLabelInd;


          Object.assign(options.filePaths, {
            fileProto: fileProto,
            fileLabel: fileLabel
          });
          Object.assign(options.data, {
            input_tensor: inputTensor,
            output_tensor: outputTensor,
            detector_type: detectorType
          });
          if (fileLabelInd) {
            Object.assign(options.filePaths, {
              fileLabel_ind: fileLabelInd
            });
          }
        } else if (fileProto && labels) {
          var labelInds = configs.labelInds;


          Object.assign(options.filePaths, {
            fileProto: fileProto
          });
          Object.assign(options.data, {
            labels: labels,
            input_tensor: inputTensor,
            output_tensor: outputTensor,
            detector_type: detectorType
          });
          if (labelInds) {
            Object.assign(options.data, { label_inds: labelInds });
          }
        } else {
          throw new Error('Invalid parameter combination');
        }
      }

      _this5._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Detectors-PostDetectorsDetector_idRedo
  matroid.redoDetector = function (detectorId, feedbackOnly) {
    var _this6 = this;

    /*
    A deep copy of the trained detector with different detector_id will be made
    */
    return new Promise(function (resolve, reject) {
      _this6._checkRequiredParams({ detectorId: detectorId });

      var options = {
        action: 'redoDetector',
        uriParams: { ':key': detectorId },
        data: { feedbackOnly: feedbackOnly }
      };

      _this6._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Detectors-Search
  matroid.searchDetectors = function () {
    var _this7 = this;

    var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    /*
    Search for detectors based on the provided params.
    */
    return new Promise(function (resolve, reject) {
      var options = {
        action: 'searchDetectors',
        data: {}
      };

      Object.assign(options.data, configs);

      _this7._genericRequest(options, resolve, reject);
    });
  };

  // DEPRECATED - use searchDetectors now
  matroid.listDetectors = function () {
    var _this8 = this;

    /*
    Lists all detectors that are public or owned by the user.
    */
    return new Promise(function (resolve, reject) {
      var options = {
        action: 'listDetectors'
      };

      _this8._genericRequest(options, resolve, reject);
    });
  };

  matroid.addFeedback = function (detectorId, image, feedback) {
    var _this9 = this;

    /*
     * Add feedback to a Matroid detector from an image
     */
    return new Promise(function (resolve, reject) {
      var feedbackToAdd = Array.isArray(feedback) ? feedback : [feedback];

      _this9._checkRequiredParams({ detectorId: detectorId });

      _this9._validateImageObj(image);
      _this9._checkImageSize(image.file);

      var options = {
        action: 'addFeedback',
        uriParams: { ':detectorId': detectorId },
        data: {
          feedback: feedbackToAdd.map(function (item) {
            return JSON.stringify(item);
          })
        }
      };

      if (image.file) {
        options.filePaths = image.file;
      } else {
        Object.assign(options.data, { url: image.url });
      }

      _this9._genericRequest(options, resolve, reject);
    });
  };

  matroid.deleteFeedback = function (feedbackId, detectorId) {
    var _this10 = this;

    /*
     * Delete Matroid detector feedback
     */
    return new Promise(function (resolve, reject) {
      _this10._checkRequiredParams({ feedbackId: feedbackId, detectorId: detectorId });

      var options = {
        action: 'deleteFeedback',
        uriParams: {
          ':detectorId': detectorId,
          ':feedbackId': feedbackId
        }
      };

      _this10._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addDetectorApi;