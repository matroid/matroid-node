const addCollectionsApi = matroid => {
  matroid.createCollectionIndex = function(
    collectionId,
    detectorId,
    fileTypes
  ) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'createCollectionIndex',
        uriParams: { ':key': collectionId },
        data: { detectorId, fileTypes }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.createCollection = function(name, url, sourceType) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'createCollection',
        data: { name, url, sourceType }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.deleteCollectionIndex = function(collectionTaskId) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'deleteCollectionIndex',
        uriParams: { ':key': collectionTaskId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.deleteCollection = function(collectionId) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'deleteCollection',
        uriParams: { ':key': collectionId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.getCollectionTask = function(collectionTaskId) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'getCollectionTask',
        uriParams: { ':key': collectionTaskId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.getCollection = function(collectionId) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'getCollection',
        uriParams: { ':key': collectionId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.killCollectionIndex = function(collectionTaskId) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'killCollectionIndex',
        uriParams: { ':key': collectionTaskId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.queryCollectionByScores = function(taskId, thresholds, numResults) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'queryCollectionByScores',
        uriParams: { ':key': taskId },
        data: { thresholds, numResults }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.queryCollectionByImage = function(
    taskId,
    taskType,
    numResults,
    image,
    configs = {}
  ) {
    return new Promise((resolve, reject) => {
      this._validateImage(image);
      this._checkImageSize(image.file);

      let options = {
        action: 'queryCollectionByImage',
        uriParams: { ':key': taskId },
        data: { taskType, numResults }
      };

      if (image.file) options.filePaths = image.file;
      if (image.url) Object.assign(options.data, { url: image.url });

      let processedConfigs = configs;
      let bbox = processedConfigs.boundingBox;
      if (bbox) processedConfigs.boundingBox = JSON.stringify(bbox);

      Object.assign(options.data, processedConfigs);

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.updateCollectionIndex = function(collectionTaskId) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'updateCollectionIndex',
        uriParams: { ':key': collectionTaskId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addCollectionsApi;
