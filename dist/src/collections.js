'use strict';

var addCollectionsApi = function addCollectionsApi(matroid) {
  // https://www.matroid.com/docs/api/index.html#api-Collections-PostApiVersionCollectionsCollectionidCollectionTasks
  matroid.createCollectionIndex = function (collectionId, detectorId, fileTypes) {
    var _this = this;

    /*
    Create an index on a collection with a detector
    */
    return new Promise(function (resolve, reject) {
      _this._checkRequiredParams({ collectionId: collectionId, detectorId: detectorId, fileTypes: fileTypes });

      var options = {
        action: 'createCollectionIndex',
        uriParams: { ':key': collectionId },
        data: { detectorId: detectorId, fileTypes: fileTypes }
      };

      _this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-PostCollections
  matroid.createCollection = function (name, url, sourceType) {
    var _this2 = this;

    /*
    Creates a new collection from a web or S3 url. Automatically kick off default indexes
    */
    return new Promise(function (resolve, reject) {
      _this2._checkRequiredParams({ name: name, url: url, sourceType: sourceType });

      var options = {
        action: 'createCollection',
        data: { name: name, url: url, sourceType: sourceType }
      };

      _this2._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-DeleteCollectionTasksTaskid
  matroid.deleteCollectionIndex = function (collectionTaskId) {
    var _this3 = this;

    /*
    Deletes a completed collection manager task
    */
    return new Promise(function (resolve, reject) {
      _this3._checkRequiredParams({ collectionTaskId: collectionTaskId });

      var options = {
        action: 'deleteCollectionIndex',
        uriParams: { ':key': collectionTaskId }
      };

      _this3._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-DeleteCollectionsCollectionid
  matroid.deleteCollection = function (collectionId) {
    var _this4 = this;

    /*
    Deletes a collection with no active indexing tasks
    */
    return new Promise(function (resolve, reject) {
      _this4._checkRequiredParams({ collectionId: collectionId });

      var options = {
        action: 'deleteCollection',
        uriParams: { ':key': collectionId }
      };

      _this4._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-GetCollectionTasksTaskid
  matroid.getCollectionTask = function (collectionTaskId) {
    var _this5 = this;

    /*
    Creates a new collection from a web or S3 url
    */
    return new Promise(function (resolve, reject) {
      _this5._checkRequiredParams({ collectionTaskId: collectionTaskId });

      var options = {
        action: 'getCollectionTask',
        uriParams: { ':key': collectionTaskId }
      };

      _this5._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-GetCollectionsCollectionid
  matroid.getCollection = function (collectionId) {
    var _this6 = this;

    /*
    Get information about a specific collection
    */
    return new Promise(function (resolve, reject) {
      _this6._checkRequiredParams({ collectionId: collectionId });

      var options = {
        action: 'getCollection',
        uriParams: { ':key': collectionId }
      };

      _this6._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-PostCollectionTasksTaskidKill
  matroid.killCollectionIndex = function (collectionTaskId) {
    var _this7 = this;

    /*
    Kills an active collection indexing task
    */
    return new Promise(function (resolve, reject) {
      _this7._checkRequiredParams({ collectionTaskId: collectionTaskId });

      var options = {
        action: 'killCollectionIndex',
        uriParams: { ':key': collectionTaskId }
      };

      _this7._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-PostApiVersionCollectionTasksTaskidScoresQuery
  matroid.queryCollectionByScores = function (taskId, thresholds, numResults) {
    var _this8 = this;

    /*
    Query against a collection index using a set of labels and scores as a query
    */
    return new Promise(function (resolve, reject) {
      _this8._checkRequiredParams({ taskId: taskId, thresholds: thresholds, numResults: numResults });

      var options = {
        action: 'queryCollectionByScores',
        uriParams: { ':key': taskId },
        data: { thresholds: thresholds, numResults: numResults }
      };

      _this8._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-PostApiCollectionTasksTaskidImageQuery
  matroid.queryCollectionByImage = function (taskId, taskType, numResults, image) {
    var _this9 = this;

    var configs = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

    /*
    Query against a collection index (CollectionManagerTask) using an image as key
    */
    return new Promise(function (resolve, reject) {
      _this9._checkRequiredParams({ taskId: taskId, taskType: taskType, numResults: numResults, image: image });

      _this9._validateImageObj(image);
      _this9._checkImageSize(image.file);

      var options = {
        action: 'queryCollectionByImage',
        uriParams: { ':key': taskId },
        data: { taskType: taskType, numResults: numResults }
      };

      if (image.file) options.filePaths = image.file;
      if (image.url) Object.assign(options.data, { url: image.url });

      var processedConfigs = configs;
      var bbox = processedConfigs.boundingBox;
      if (bbox) processedConfigs.boundingBox = JSON.stringify(bbox);

      Object.assign(options.data, processedConfigs);

      _this9._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Collections-PutApiVersionCollectionTasksTaskid
  matroid.updateCollectionIndex = function (collectionTaskId) {
    var _this10 = this;

    return new Promise(function (resolve, reject) {
      _this10._checkRequiredParams({ collectionTaskId: collectionTaskId });

      var options = {
        action: 'updateCollectionIndex',
        uriParams: { ':key': collectionTaskId }
      };

      _this10._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addCollectionsApi;