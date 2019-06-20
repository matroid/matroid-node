const addVideosApi = matroid => {
  // https://staging.dev.matroid.com/docs/api/index.html#api-Videos-PostDetectorsDetector_idClassify_video
  matroid.classifyVideo = function(detectorId, video) {
    /*
    Expected video format: { url: 'https://online-video-url'} OR { file: '/home/user/video.mp4'}
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ detectorId, video });

      if (
        typeof video.url === 'undefined' &&
        typeof video.file === 'undefined'
      ) {
        throw new Error('No video provided');
      }

      if (video.file && Array.isArray(video.file)) {
        throw new Error('Can only classify one local video at a time');
      }

      if (
        !video.url &&
        !this._checkFilePayloadSize(video.file, 0, this._fileSizeLimits.video)
      ) {
        throw new Error(
          `Individual file size must be under ${this._fileSizeLimits.video /
            1024 /
            1024}MB`
        );
      }

      let options = {
        action: 'classifyVideo',
        uriParams: { ':key': detectorId }
      };

      if (video.file) options.filePaths = video.file;
      if (video.url) options.data = { url: video.url };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://staging.dev.matroid.com/docs/api/index.html#api-Videos-GetVideosVideo_idQuery
  matroid.getVideoResults = function(videoId, configs = {}) {
    /*
    Get video classification results
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ videoId });

      let options = {
        action: 'getVideoResults',
        uriParams: { ':key': videoId },
        data: {}
      };

      Object.assign(options.data, configs);
      if (configs.format === 'csv') options.shouldNotParse = true;

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addVideosApi;
