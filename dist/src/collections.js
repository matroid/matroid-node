"use strict";

const addCollectionsApi = matroid => {
  // https://app.matroid.com/docs/api/index.html#api-Collections-PostApiVersionCollectionsCollectionidCollectionTasks
  matroid.createCollectionIndex = function (collectionId, detectorId, fileTypes) {
    /*
    Creates an index on a collection with a detector.
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        collectionId,
        detectorId,
        fileTypes
      });

      let options = {
        action: 'createCollectionIndex',
        uriParams: {
          ':key': collectionId
        },
        data: {
          detectorId,
          fileTypes
        }
      };

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/index.html#api-Collections-PostCollections


  matroid.createCollection = function (name, url, sourceType) {
    let configs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    /*
    Creates a new collection from a web or S3 url.
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        name,
        url,
        sourceType
      });

      let options = {
        action: 'createCollection',
        data: {
          name,
          url,
          sourceType
        }
      };
      const {
        indexWithDefault
      } = configs;

      if (indexWithDefault) {
        options.data.indexWithDefault = indexWithDefault;
      }

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/index.html#api-Collections-DeleteCollectionTasksTaskid


  matroid.deleteCollectionIndex = function (collectionTaskId) {
    /*
    Deletes a completed collection task.
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        collectionTaskId
      });

      let options = {
        action: 'deleteCollectionIndex',
        uriParams: {
          ':key': collectionTaskId
        }
      };

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/index.html#api-Collections-DeleteCollectionsCollectionid


  matroid.deleteCollection = function (collectionId) {
    /*
    Deletes a collection with no active indexing tasks.
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        collectionId
      });

      let options = {
        action: 'deleteCollection',
        uriParams: {
          ':key': collectionId
        }
      };

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/index.html#api-Collections-GetCollectionTasksTaskid


  matroid.getCollectionTask = function (collectionTaskId) {
    /*
    Retrieves information about a specific collection task.
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        collectionTaskId
      });

      let options = {
        action: 'getCollectionTask',
        uriParams: {
          ':key': collectionTaskId
        }
      };

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/index.html#api-Collections-GetCollectionsCollectionid


  matroid.getCollection = function (collectionId) {
    /*
    Retrieves information about a specific collection.
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        collectionId
      });

      let options = {
        action: 'getCollection',
        uriParams: {
          ':key': collectionId
        }
      };

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/index.html#api-Collections-PostCollectionTasksTaskidKill


  matroid.killCollectionIndex = function (collectionTaskId, includeCollectionInfo) {
    /*
    Kills an active collection indexing task.
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        collectionTaskId
      });

      let options = {
        action: 'killCollectionIndex',
        uriParams: {
          ':key': collectionTaskId
        },
        data: {
          includeCollectionInfo
        }
      };

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/index.html#api-Collections-PostApiVersionCollectionTasksTaskidScoresQuery


  matroid.queryCollectionByScores = function (taskId, thresholds, configs) {
    /*
    Queries against a collection index using a set of labels and scores.
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        taskId,
        thresholds
      });

      let options = {
        action: 'queryCollectionByScores',
        uriParams: {
          ':key': taskId
        },
        data: {
          thresholds
        }
      };
      Object.assign(options.data, configs);

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/index.html#api-Collections-PostApiCollectionTasksTaskidImageQuery


  matroid.queryCollectionByImage = function (taskId, image) {
    let configs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    /*
    Queries against a collection index using an image.
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        taskId,
        image
      });

      this._validateImageObj(image);

      this._checkImageSize(image.file);

      let options = {
        action: 'queryCollectionByImage',
        uriParams: {
          ':key': taskId
        },
        data: {}
      };

      if (image.file) {
        options.filePaths = image.file;
      }

      if (image.url) {
        Object.assign(options.data, {
          url: image.url
        });
      }

      const {
        numResults,
        boundingBox,
        shouldIndicateDuplicates
      } = configs;

      if (numResults) {
        options.data.numResults = numResults;
      }

      if (boundingBox) {
        options.data.boundingBox = JSON.stringify(boundingBox);
      }

      if (shouldIndicateDuplicates) {
        options.data.shouldIndicateDuplicates = shouldIndicateDuplicates;
      }

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/index.html#api-Collections-PutApiVersionCollectionTasksTaskid


  matroid.updateCollectionIndex = function (collectionTaskId, updateIndex) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        collectionTaskId
      });

      let options = {
        action: 'updateCollectionIndex',
        uriParams: {
          ':key': collectionTaskId
        },
        data: {
          updateIndex
        }
      };

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addCollectionsApi;