"use strict";

var addVideosApi = function addVideosApi(matroid) {
  // https://www.matroid.com/docs/api/index.html#api-Videos-PostDetectorsDetector_idClassify_video
  matroid.classifyVideo = function (detectorId, video) {
    var _this = this;

    var configs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    /*
    - Expected video format: { url: 'https://online-video-url'} OR { file: '/home/user/video.mp4'}
    - videoId, fps, and annotationThresholds are the three parameters passed in the configs object
    */
    return new Promise(function (resolve, reject) {
      _this._checkRequiredParams({
        detectorId: detectorId,
        video: video
      });

      if (typeof video.url === 'undefined' && typeof video.file === 'undefined') {
        throw new Error('No video provided');
      }

      if (video.file && Array.isArray(video.file)) {
        throw new Error('Can only classify one local video at a time');
      }

      if (!video.url && !_this._checkFilePayloadSize(video.file, 0, _this._fileSizeLimits.video)) {
        throw new Error("Individual file size must be under ".concat(_this._fileSizeLimits.video / 1024 / 1024, "MB"));
      }

      var options = {
        action: 'classifyVideo',
        uriParams: {
          ':key': detectorId
        }
      };
      if (video.file) options.filePaths = video.file;
      if (video.url) options.data = {
        url: video.url
      };
      Object.assign(options.data, configs);

      _this._genericRequest(options, resolve, reject);
    });
  }; // https://www.matroid.com/docs/api/index.html#api-Videos-GetVideosVideo_idQuery


  matroid.getVideoResults = function (videoId, threshold, format) {
    var _this2 = this;

    var configs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    /*
    - Get video classification results
    - annotations is the parameter passed in the configs object
    */
    return new Promise(function (resolve, reject) {
      _this2._checkRequiredParams({
        videoId: videoId
      });

      var options = {
        action: 'getVideoResults',
        uriParams: {
          ':key': videoId
        },
        data: {
          threshold: threshold,
          format: format
        }
      };
      Object.assign(options.data, configs);
      if (format === 'csv') options.shouldNotParse = true;

      _this2._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addVideosApi;