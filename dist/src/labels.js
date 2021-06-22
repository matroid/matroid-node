"use strict";

var addLabelsApi = function addLabelsApi(matroid) {
  // https://www.matroid.com/docs/api/index.html#api-Labels-PostDetectorsDetector_idLabels
  matroid.createLabelWithImages = function (detectorId, name, imageFiles) {
    var _this = this;

    var configs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    /*
    Create a label and upload images to it
    Requires processing=false. Creates label asynchronously (turn processing to true)
    */
    return new Promise(function (resolve, reject) {
      _this._checkRequiredParams({
        detectorId: detectorId,
        name: name,
        imageFiles: imageFiles
      });

      var options = {
        action: 'createLabelWithImages',
        uriParams: {
          ':key': detectorId
        },
        data: {
          name: name
        }
      };

      _this._checkImageSize(imageFiles);

      options.filePaths = {
        imageFiles: imageFiles
      };
      var processedConfigs = configs;

      if (processedConfigs.bboxes) {
        processedConfigs.bboxes = JSON.stringify(processedConfigs.bboxes);
      }

      Object.assign(options.data, processedConfigs);

      _this._genericRequest(options, resolve, reject);
    });
  }; // https://www.matroid.com/docs/api/index.html#api-Labels-DeleteDetectorsDetector_idLabelsLabel_id


  matroid.deleteLabel = function (detectorId, labelId) {
    var _this2 = this;

    /*
    Requires processing=false
    */
    return new Promise(function (resolve, reject) {
      _this2._checkRequiredParams({
        detectorId: detectorId,
        labelId: labelId
      });

      var options = {
        action: 'deleteLabel',
        uriParams: {
          ':detectorId': detectorId,
          ':labelId': labelId
        }
      };

      _this2._genericRequest(options, resolve, reject);
    });
  }; // https://www.matroid.com/docs/api/index.html#api-Labels-GetImagesAnnotationsQuery


  matroid.getAnnotations = function () {
    var _this3 = this;

    var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    /*
    Requires processing=false. Note: you need to provide at least one of the three ids to query
    */
    return new Promise(function (resolve, reject) {
      var detectorId = configs.detectorId,
          labelIds = configs.labelIds,
          imageId = configs.imageId;

      if (!detectorId && !labelIds && !imageId) {
        throw new Error('Please pass in one of the following IDs: detectorId, labelIds, or imageId');
      }

      var options = {
        action: 'getAnnotations',
        data: {
          detectorId: detectorId,
          labelIds: labelIds,
          imageId: imageId
        }
      };

      _this3._genericRequest(options, resolve, reject);
    });
  }; // https://www.matroid.com/docs/api/index.html#api-Labels-GetDetectorsDetector_idLabelsLabel_id


  matroid.getLabelImages = function (detectorId, labelId) {
    var _this4 = this;

    return new Promise(function (resolve, reject) {
      _this4._checkRequiredParams({
        detectorId: detectorId,
        labelId: labelId
      });

      var options = {
        action: 'getLabelImages',
        uriParams: {
          ':detectorId': detectorId,
          ':labelId': labelId
        }
      };

      _this4._genericRequest(options, resolve, reject);
    });
  }; // https://www.matroid.com/docs/api/index.html#api-Labels-UpdateAnnotations


  matroid.updateAnnotations = function (detectorId, labelId, images) {
    var _this5 = this;

    var configs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    /*
    Update bounding boxes of label images
    */
    return new Promise(function (resolve, reject) {
      _this5._checkRequiredParams({
        detectorId: detectorId,
        labelId: labelId,
        images: images
      });

      var options = {
        action: 'updateAnnotations',
        uriParams: {
          ':detectorId': detectorId,
          ':labelId': labelId
        },
        data: {}
      };
      Object.assign(options.data, {
        images: JSON.stringify(images)
      });
      Object.assign(options.data, configs);

      _this5._genericRequest(options, resolve, reject);
    });
  }; // https://www.matroid.com/docs/api/index.html#api-Labels-PostDetectorsDetector_idLabelsLabel_idImages


  matroid.updateLabelWithImages = function (detectorId, labelId, imageFiles) {
    var _this6 = this;

    var configs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    /*
    Requires processing=false. Updates label asynchronously (turn processing to true)
    */
    return new Promise(function (resolve, reject) {
      _this6._checkRequiredParams({
        detectorId: detectorId,
        labelId: labelId,
        imageFiles: imageFiles
      });

      var options = {
        action: 'updateLabelWithImages',
        uriParams: {
          ':detectorId': detectorId,
          ':labelId': labelId
        },
        data: {}
      };
      options.filePaths = {
        imageFiles: imageFiles
      };
      var processedConfigs = configs;

      if (processedConfigs.bboxes) {
        processedConfigs.bboxes = JSON.stringify(processedConfigs.bboxes);
      }

      Object.assign(options.data, processedConfigs);

      _this6._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addLabelsApi;