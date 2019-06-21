const addDetectorApi = matroid => {
  // https://www.matroid.com/docs/api/index.html#api-Detectors-PostDetectors
  matroid.createDetector = function(zipFile, name, detectorType) {
    /*
    Creates detector asynchronously (turn processing to true) Note: calling this API creates a pending detector, and you can update this detector with more images by calling this API with detector_id; however, creating more than one pending detector is not allowed, so you need to finalize or delete your existing pending detector before creating a new one.

    It might take some time for the detector to become editable(add labels etc)
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ zipFile, name, detectorType });

      if (!this._checkFilePayloadSize(zipFile, 0, this._fileSizeLimits.zip)) {
        throw new Error(
          `Individual file size must be under ${this._fileSizeLimits.zip /
            1024 /
            1024}MB`
        );
      }

      let options = {
        action: 'createDetector',
        data: { name: name, detector_type: detectorType },
        filePaths: zipFile
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Detectors-DeleteDetectorsDetector_id
  matroid.deleteDetector = function(detectorId) {
    /*
    Requires processing=false. 
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId });

      let options = {
        action: 'deleteDetector',
        uriParams: { ':key': detectorId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Detectors-PostDetectorsDetector_idFinalize
  matroid.finalizeDetector = function(detectorId) {
    /*
    Requires processing=false. Starts training asynchronously (turn processing to true)
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId });

      let options = {
        action: 'finalizeDetector',
        uriParams: { ':key': detectorId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Detectors-GetDetectorsDetector_id
  matroid.getDetectorInfo = function(detectorId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId });

      let options = {
        action: 'getDetectorInfo',
        uriParams: { ':key': detectorId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Detectors-PostDetectorsUpload
  matroid.importDetector = function(name, configs = {}) {
    /* 
    Certain combination of parameters can be supplied: 
    file_detector, file_proto + file_label(+ file_label_ind), 
    or file_proto + labels(+ label_inds).
    Parentheses part can be optionally supplied for object detection.
    */

    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ name });

      let options = {
        action: 'importDetector',
        data: { name },
        filePaths: {}
      };

      if (configs.fileDetector) {
        // .matroid file
        Object.assign(options.filePaths, {
          file_detector: configs.fileDetector
        });
      } else {
        const { inputTensor, outputTensor, detectorType } = configs;
        if (!inputTensor || !outputTensor || !detectorType) {
          throw new Error(
            'Please provide info: inputTensor, outputTensor, detectorType'
          );
        }

        const { fileProto, fileLabel, labels } = configs;

        if (fileProto && fileLabel) {
          const { fileLabelInd } = configs;

          Object.assign(options.filePaths, {
            file_proto: fileProto,
            file_label: fileLabel
          });
          Object.assign(options.data, {
            input_tensor: inputTensor,
            output_tensor: outputTensor,
            detector_type: detectorType
          });
          if (fileLabelInd) {
            Object.assign(options.filePaths, {
              file_label_ind: fileLabelInd
            });
          }
        } else if (fileProto && labels) {
          const { labelInds } = configs;

          Object.assign(options.filePaths, {
            file_proto: fileProto
          });
          Object.assign(options.data, {
            labels,
            input_tensor: inputTensor,
            output_tensor: outputTensor,
            detector_type: detectorType
          });
          if (labelInds) {
            Object.assign(options.data, { label_inds: labelInds });
          }
        } else {
          throw new Error('Invalid paramter combination');
        }
      }

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Detectors-PostDetectorsDetector_idRedo
  matroid.redoDetector = function(detectorId) {
    /*
    A deep copy of the trained detector with different detector_id will be made
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId });

      let options = {
        action: 'redoDetector',
        uriParams: { ':key': detectorId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Detectors-Search
  matroid.searchDetectors = function(configs = {}) {
    /*
    Search for detectors based on the provided params.
    */
    return new Promise((resolve, reject) => {
      let options = {
        action: 'searchDetectors',
        data: {}
      };

      Object.assign(options.data, configs);

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addDetectorApi;
