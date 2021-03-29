const addLabelsApi = (matroid) => {
  // https://www.matroid.com/docs/api/index.html#api-Labels-PostDetectorsDetector_idLabels
  matroid.createLabelWithImages = function (
    detectorId,
    name,
    imageFiles,
    configs = {}
  ) {
    /*
    Create a label and upload images to it
    Requires processing=false. Creates label asynchronously (turn processing to true)
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId, name, imageFiles });

      let options = {
        action: 'createLabelWithImages',
        uriParams: { ':key': detectorId },
        data: { name },
      };

      this._checkImageSize(imageFiles);
      options.filePaths = { imageFiles };

      const processedConfigs = configs;
      if (processedConfigs.bboxes) {
        processedConfigs.bboxes = JSON.stringify(processedConfigs.bboxes);
      }

      Object.assign(options.data, processedConfigs);

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Labels-DeleteDetectorsDetector_idLabelsLabel_id
  matroid.deleteLabel = function (detectorId, labelId) {
    /*
    Requires processing=false
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId, labelId });

      const options = {
        action: 'deleteLabel',
        uriParams: { ':detectorId': detectorId, ':labelId': labelId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Labels-GetImagesAnnotationsQuery
  matroid.getAnnotations = function (configs = {}) {
    /*
    Requires processing=false. Note: you need to provide at least one of the three ids to query
    */
    return new Promise((resolve, reject) => {
      const { detectorId, labelIds, imageId } = configs;

      if (!detectorId && !labelIds && !imageId) {
        throw new Error(
          'Please pass in one of the following IDs: detectorId, labelIds, or imageId'
        );
      }

      const options = {
        action: 'getAnnotations',
        data: {
          detectorId,
          labelIds,
          imageId,
        },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Labels-GetDetectorsDetector_idLabelsLabel_id
  matroid.getLabelImages = function (detectorId, labelId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId, labelId });

      const options = {
        action: 'getLabelImages',
        uriParams: { ':detectorId': detectorId, ':labelId': labelId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Labels-UpdateAnnotations
  matroid.updateAnnotations = function (
    detectorId,
    labelId,
    images,
    configs = {}
  ) {
    /*
    Update bounding boxes of label images
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId, labelId, images });

      const options = {
        action: 'updateAnnotations',
        uriParams: { ':detectorId': detectorId, ':labelId': labelId },
        data: {},
      };

      Object.assign(options.data, { images: JSON.stringify(images) });
      Object.assign(options.data, configs);

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Labels-PostDetectorsDetector_idLabelsLabel_idImages
  matroid.updateLabelWithImages = function (
    detectorId,
    labelId,
    imageFiles,
    configs = {}
  ) {
    /*
    Requires processing=false. Updates label asynchronously (turn processing to true)
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId, labelId, imageFiles });

      const options = {
        action: 'updateLabelWithImages',
        uriParams: { ':detectorId': detectorId, ':labelId': labelId },
        data: {},
      };

      options.filePaths = { imageFiles: imageFiles };

      const processedConfigs = configs;
      if (processedConfigs.bboxes) {
        processedConfigs.bboxes = JSON.stringify(processedConfigs.bboxes);
      }

      Object.assign(options.data, processedConfigs);

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addLabelsApi;
