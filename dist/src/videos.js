'use strict';

var addVideosApi = function addVideosApi(matroid) {
  // https://www.matroid.com/docs/api/index.html#api-Videos-PostDetectorsDetector_idClassify_video
  matroid.classifyVideo = function (detectorId, video) {
    var _this = this;

    /*
    Expected video format: { url: 'https://online-video-url'} OR { file: '/home/user/video.mp4'}
    */
    return new Promise(function (resolve, reject) {
      _this._checkRequiredParams({ detectorId: detectorId, video: video });

      if (typeof video.url === 'undefined' && typeof video.file === 'undefined') {
        throw new Error('No video provided');
      }

      if (video.file && Array.isArray(video.file)) {
        throw new Error('Can only classify one local video at a time');
      }

      if (!video.url && !_this._checkFilePayloadSize(video.file, 0, _this._fileSizeLimits.video)) {
        throw new Error('Individual file size must be under ' + _this._fileSizeLimits.video / 1024 / 1024 + 'MB');
      }

      var options = {
        action: 'classifyVideo',
        uriParams: { ':key': detectorId }
      };

      if (video.file) options.filePaths = video.file;
      if (video.url) options.data = { url: video.url };

      _this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Videos-GetVideosVideo_idQuery
  matroid.getVideoResults = function (videoId) {
    var _this2 = this;

    var configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    /*
    Get video classification results
    */
    return new Promise(function (resolve, reject) {
      _this2._checkRequiredParams({ videoId: videoId });

      var options = {
        action: 'getVideoResults',
        uriParams: { ':key': videoId },
        data: {}
      };

      Object.assign(options.data, configs);
      if (configs.format === 'csv') options.shouldNotParse = true;

      _this2._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addVideosApi;