"use strict";

const addVideosApi = matroid => {
  // https://app.matroid.com/docs/api/documentation#api-Videos-PostDetectorsDetector_idClassify_video
  matroid.classifyVideo = function (detectorId, video) {
    let configs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    /*
    - Expected video format: { url: 'https://online-video-url'} OR { file: '/home/user/video.mp4'}
    - videoId, fps, and annotationThresholds are the three parameters passed in the configs object
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        detectorId,
        video
      });

      if (typeof video.url === 'undefined' && typeof video.file === 'undefined') {
        throw new Error('No video provided');
      }

      if (video.file && Array.isArray(video.file)) {
        throw new Error('Can only classify one local video at a time');
      }

      if (!video.url && !this._checkFilePayloadSize(video.file, 0, this._fileSizeLimits.video)) {
        throw new Error("Individual file size must be under ".concat(this._fileSizeLimits.video / 1024 / 1024, "MB"));
      }

      let options = {
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

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/documentation#api-Videos-GetVideosVideo_idQuery


  matroid.getVideoResults = function (videoId, threshold, format) {
    let configs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    /*
    - Get video classification results
    - annotations is the parameter passed in the configs object
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        videoId
      });

      let options = {
        action: 'getVideoResults',
        uriParams: {
          ':key': videoId
        },
        data: {
          threshold,
          format
        }
      };
      Object.assign(options.data, configs);
      if (format === 'csv') options.shouldNotParse = true;

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addVideosApi;