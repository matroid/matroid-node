const addImagesApi = matroid => {
  /*
    Expected image format: { url: 'https://www.matroid.com/logo.png'} OR { file: ['/home/user/image.jpg', '/home/user/other_image.png'] }
  */
  matroid.classifyImage = function(detectorId, image, configs = {}) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId });

      // TODO-- better naming for helpers
      this._validateImage(image);
      this._checkImageSize(image.file);

      let options = {
        action: 'classifyImage',
        uriParams: { ':key': detectorId },
        data: {}
      };

      if (image.file) options.filePaths = image.file;
      if (image.url) {
        if (Array.isArray(image.url)) {
          Object.assign(options.data, { urls: image.url });
        } else {
          Object.assign(options.data, { url: image.url });
        }
      }

      Object.assign(options.data, configs);

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.localizeImage = function(localizer, localizerLabel, configs = {}) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ localizer, localizerLabel });

      const { update } = configs;

      let options = {
        action: 'localizeImage',
        data: { localizer, localizerLabel }
      };

      if (!update) {
        const { file, url } = configs;
        this._validateImage({ file, url });
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
