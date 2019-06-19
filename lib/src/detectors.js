const addDetectorApi = matroid => {
  matroid.createDetector = function(zipFile, name, detectorType) {
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

  matroid.deleteDetector = function(detectorId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId });

      let options = {
        action: 'deleteDetector',
        uriParams: { ':key': detectorId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.finalizeDetector = function(detectorId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId });

      let options = {
        action: 'finalizeDetector',
        uriParams: { ':key': detectorId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

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

  matroid.importDetector = function(name, configs = {}) {
    /* 
    Note: certain combination of parameters can be supplied: 
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

  matroid.redoDetector = function(detectorId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId });

      let options = {
        action: 'redoDetector',
        uriParams: { ':key': detectorId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.searchDetectors = function(configs = {}) {
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
