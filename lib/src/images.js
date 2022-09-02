const addImagesApi = (matroid) => {
  // https://app.matroid.com/docs/api/index.html#api-Images-Classify
  matroid.classifyImage = function (detectorId, image, configs = {}) {
    /*
    Classify one or more images using a detector. Expected image format: { url: 'https://app.matroid.com/logo.png'} OR { file: ['/home/user/image.jpg', '/home/user/other_image.png'] }.
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId });

      this._validateImageObj(image);
      this._checkImageSize(image.file);

      let options = {
        action: 'classifyImage',
        uriParams: { ':key': detectorId },
        data: {},
      };

      if (image.file) options.filePaths = image.file;
      if (image.url) {
        Object.assign(options.data, { url: image.url });
      }

      Object.assign(options.data, configs);

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://app.matroid.com/docs/api/index.html#api-Images-PostLocalize
  matroid.localizeImage = function (localizer, localizerLabel, configs = {}) {
    /*
    This API is very similar to [Images/Classify](#api-Images-Classify). However, it can be used to update bounding boxes of existing training images by supplying `update=true`, `labelId`, and one of `imageId` or `imageIds`. It also has access to the internal face localizer (`localizer="DEFAULT_FACE"` and `localizerLabel="face"`). After receiving the results, perform the actual update using [Labels/Update Annotations](#api-Labels-UpdateAnnotations).
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ localizer, localizerLabel });

      const { update } = configs;

      let options = {
        action: 'localizeImage',
        data: { localizer, localizerLabel },
      };

      if (!update) {
        const { file, url } = configs;
        this._validateImageObj({ file, url });
        this._checkImageSize(file);

        if (file) options.filePaths = file;
        if (url) {
          if (Array.isArray(url)) {
            Object.assign(options.data, { urls: url });
          } else {
            Object.assign(options.data, { url });
          }
        }
      } else {
        const { labelId, imageId, imageIds } = configs;

        if (!labelId || (!imageId && !imageIds)) {
          throw new Error(
            'Please provide labelId and one of imageId/imageIds when setting update to true'
          );
        }
      }

      Object.assign(options.data, configs);

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addImagesApi;
