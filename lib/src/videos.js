const addVideosApi = matroid => {
  /*
    Expected image format: { url: 'https://www.matroid.com/logo.png'} OR { file: ['/home/user/image.jpg', '/home/user/other_image.png'] }
  */
  matroid.classifyVideo = function(detectorId, video) {
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

  matroid.getVideoResults = function(videoId, configs = {}) {
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
