const addLabelsApi = matroid => {
  matroid.createLabelWithImages = function(
    detectorId,
    name,
    imageFiles,
    configs = {}
  ) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId, name, imageFiles });

      let options = {
        action: 'createLabelWithImages',
        uriParams: { ':key': detectorId },
        data: { name }
      };

      this._checkImageSize(imageFiles);
      options.filePaths = { image_files: imageFiles };

      let processedConfigs = configs;
      if (processedConfigs.bboxes) {
        processedConfigs.bboxes = JSON.stringify(processedConfigs.bboxes);
      }

      Object.assign(options.data, processedConfigs);

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.deleteLabel = function(detectorId, labelId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId, labelId });

      let options = {
        action: 'deleteLabel',
        uriParams: { ':detectorId': detectorId, ':labelId': labelId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.getAnnotations = function(configs = {}) {
    return new Promise((resolve, reject) => {
      const { detectorId, labelIds, imageId } = configs;

      if (!detectorId && !labelIds && !imageId) {
        throw new Error(
          'Please pass in one of the ids: detectorId, labelIds, or imageId'
        );
      }

      let options = {
        action: 'getAnnotations',
        data: {
          detector_id: detectorId,
          label_ids: labelIds,
          image_id: imageId
        }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.getLabelImages = function(detectorId, labelId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId, labelId });

      let options = {
        action: 'getLabelImages',
        uriParams: { ':detectorId': detectorId, ':labelId': labelId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.updateAnnotations = function(
    detectorId,
    labelId,
    images,
    configs = {}
  ) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId, labelId, images });

      let options = {
        action: 'updateAnnotations',
        uriParams: { ':detectorId': detectorId, ':labelId': labelId },
        data: {}
      };

      Object.assign(options.data, { images: JSON.stringify(images) });
      Object.assign(options.data, configs);

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.updateLabelWithImages = function(
    detectorId,
    labelId,
    imageFiles,
    configs = {}
  ) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId, labelId, imageFiles });

      let options = {
        action: 'updateLabelWithImages',
        uriParams: { ':detectorId': detectorId, ':labelId': labelId },
        data: {}
      };

      options.filePaths = { image_files: imageFiles };

      let processedConfigs = configs;
      if (processedConfigs.bboxes) {
        processedConfigs.bboxes = JSON.stringify(processedConfigs.bboxes);
      }

      Object.assign(options.data, processedConfigs);

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addLabelsApi;
