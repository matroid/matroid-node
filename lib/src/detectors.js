const addDetectorApi = matroid => {
  matroid.createDetector = function(zipFile, name, detectorType) {
    return new Promise((resolve, reject) => {
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
      let options = {
        action: 'deleteDetector',
        uriParams: { ':key': detectorId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.trainDetector = function(detectorId, name, detectorType) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'trainDetector',
        uriParams: { ':key': detectorId },
        data: { name: name, detector_type: detectorType }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.detectorInfo = function(detectorId) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'detectorInfo',
        uriParams: { ':key': detectorId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.listDetectors = function() {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'listDetectors'
      };

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addDetectorApi;
