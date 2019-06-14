const addImagesApi = matroid => {
  /*
    Expected image format: { url: 'https://www.matroid.com/logo.png'} OR { file: ['/home/user/image.jpg', '/home/user/other_image.png'] }
  */
  matroid.classifyImage = function(detectorId, image, configs) {
    return new Promise((resolve, reject) => {
      if (!detectorId) {
        throw new Error(
          'Please pass in the ID of the detector you want to use'
        );
      }
      // TODO-- better naming for helpers
      this._validateImage(image);
      this._checkImageSize(image);

      let options = {
        action: 'classifyImage',
        uriParams: { ':key': detectorId }
      };

      if (image.file) options.filePaths = image.file;
      if (image.url) options.data = { url: image.url };

      Object.assign(options.data, configs);

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addImageApi;
