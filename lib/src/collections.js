const addCollectionsApi = (matroid) => {
  // https://www.matroid.com/docs/api/index.html#api-Collections-PostApiVersionCollectionsCollectionidCollectionTasks
  matroid.createCollectionIndex = function (
    collectionId,
    detectorId,
    fileTypes
  ) {
    /*
    Create an index on a collection with a detector
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ collectionId, detectorId, fileTypes });

      let options = {
        action: 'createCollectionIndex',
        uriParams: { ':key': collectionId },
        data: { detectorId, fileTypes },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-PostCollections
  matroid.createCollection = function (name, url, sourceType) {
    /*
    Creates a new collection from a web or S3 url. Automatically kick off default indexes
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ name, url, sourceType });

      let options = {
        action: 'createCollection',
        data: { name, url, sourceType },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-DeleteCollectionTasksTaskid
  matroid.deleteCollectionIndex = function (collectionTaskId) {
    /*
    Deletes a completed collection manager task
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ collectionTaskId });

      let options = {
        action: 'deleteCollectionIndex',
        uriParams: { ':key': collectionTaskId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-DeleteCollectionsCollectionid
  matroid.deleteCollection = function (collectionId) {
    /*
    Deletes a collection with no active indexing tasks
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ collectionId });

      let options = {
        action: 'deleteCollection',
        uriParams: { ':key': collectionId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-GetCollectionTasksTaskid
  matroid.getCollectionTask = function (collectionTaskId) {
    /*
    Creates a new collection from a web or S3 url
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ collectionTaskId });

      let options = {
        action: 'getCollectionTask',
        uriParams: { ':key': collectionTaskId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-GetCollectionsCollectionid
  matroid.getCollection = function (collectionId) {
    /*
    Get information about a specific collection
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ collectionId });

      let options = {
        action: 'getCollection',
        uriParams: { ':key': collectionId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-PostCollectionTasksTaskidKill
  matroid.killCollectionIndex = function (collectionTaskId) {
    /*
    Kills an active collection indexing task
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ collectionTaskId });

      let options = {
        action: 'killCollectionIndex',
        uriParams: { ':key': collectionTaskId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-PostApiVersionCollectionTasksTaskidScoresQuery
  matroid.queryCollectionByScores = function (taskId, thresholds, numResults) {
    /*
    Query against a collection index using a set of labels and scores as a query
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ taskId, thresholds, numResults });

      let options = {
        action: 'queryCollectionByScores',
        uriParams: { ':key': taskId },
        data: { thresholds, numResults },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-PostApiCollectionTasksTaskidImageQuery
  matroid.queryCollectionByImage = function (
    taskId,
    numResults,
    image,
    configs = {}
  ) {
    /*
    Query against a collection index (CollectionManagerTask) using an image as key
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ taskId, numResults, image });

      this._validateImageObj(image);
      this._checkImageSize(image.file);

      let options = {
        action: 'queryCollectionByImage',
        uriParams: { ':key': taskId },
        data: { numResults },
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

  // https://www.matroid.com/docs/api/index.html#api-Collections-PutApiVersionCollectionTasksTaskid
  matroid.updateCollectionIndex = function (collectionTaskId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ collectionTaskId });

      let options = {
        action: 'updateCollectionIndex',
        uriParams: { ':key': collectionTaskId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addCollectionsApi;
