'use strict';

var addImagesApi = function addImagesApi(matroid) {
  // https://www.matroid.com/docs/api/index.html#api-Images-Classify
  matroid.classifyImage = function (detectorId, image) {
    var _this = this;

    var configs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    /*
    Expected image format: { url: 'https://www.matroid.com/logo.png'} OR { file: ['/home/user/image.jpg', '/home/user/other_image.png'] }
    */
    return new Promise(function (resolve, reject) {
      _this._checkRequiredParams({ detectorId: detectorId });

      _this._validateImageObj(image);
      _this._checkImageSize(image.file);

      var options = {
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

      _this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Images-PostLocalize
  matroid.localizeImage = function (localizer, localizerLabel) {
    var _this2 = this;

    var configs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    /*
    Note: this API is very similar to Images/Classify; however, it can be used to update bounding boxes of existing training images by supplying update=true, labelId, and one of imageId or imageIds, and it has access to the internal face localizer (localizer="DEFAULT_FACE" and localizerLabel="face"). After receiving the results, perform the actual update with the results using Labels/UpdateAnnotations
    */
    return new Promise(function (resolve, reject) {
      _this2._checkRequiredParams({ localizer: localizer, localizerLabel: localizerLabel });

      var update = configs.update;


      var options = {
        action: 'localizeImage',
        data: { localizer: localizer, localizerLabel: localizerLabel }
      };

      if (!update) {
        var file = configs.file,
            url = configs.url;

        _this2._validateImageObj({ file: file, url: url });
        _this2._checkImageSize(file);

        if (file) options.filePaths = file;
        if (url) {
          if (Array.isArray(url)) {
            Object.assign(options.data, { urls: url });
          } else {
            Object.assign(options.data, { url: url });
          }
        }
      } else {
        var labelId = configs.labelId,
            imageId = configs.imageId,
            imageIds = configs.imageIds;


        if (!labelId || !imageId && !imageIds) {
          throw new Error('Please provide labelId and one of imageId/imageIds when setting update to true');
        }
      }

      Object.assign(options.data, configs);

      _this2._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addImagesApi;