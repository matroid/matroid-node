const addVideoSummaryApi = (matroid) => {
  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-GetSummariesSummaryid
  matroid.getVideoSummary = function (summaryId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ summaryId });

      const options = {
        action: 'getVideoSummary',
        uriParams: { ':summaryId': summaryId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-GetSummariesSummaryidTracksCsv
  matroid.getVideoSummaryTracks = function (summaryId) {
    /*
    Downloads video summary tracks CSV file as stream */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ summaryId });

      const options = {
        action: 'getVideoSummaryTracks',
        uriParams: { ':summaryId': summaryId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-GetSummariesSummaryidVideoMp4
  matroid.getVideoSummaryFile = function (summaryId) {
    /*
    Downloads video summary mp4 file as stream
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ summaryId });

      const options = {
        action: 'getVideoSummaryFile',
        uriParams: { ':summaryId': summaryId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-PostSummarize
  matroid.createVideoSummary = function (video, configs) {
    /*
    Can accept a url and optional videoId, or a local file.

    Configs:
      - fps
      - featureWeight
      - motionWeight
      - matchingDistance
    */
    return new Promise((resolve, reject) => {
      this._validateVideoObj(video);

      const { detectorId } = configs;

      if (!detectorId) {
        throw new Error(`Missing required parameter: detectorId`);
      }

      const options = {
        action: 'createVideoSummary',
        data: {},
      };

      if (video.file) options.filePaths = video.file;
      if (video.url) {
        Object.assign(options.data, {
          url: video.url,
          videoId: video.videoId,
        });
      }

      Object.assign(options.data, configs);

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-DeleteSummariesSummaryid
  matroid.deleteVideoSummary = function (summaryId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ summaryId });

      const options = {
        action: 'deleteVideoSummary',
        uriParams: { ':summaryId': summaryId },
        data: {},
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-GetStreamsStreamidSummaries
  matroid.getStreamSummaries = function (streamId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ streamId });

      const options = {
        action: 'getStreamSummaries',
        uriParams: { ':streamId': streamId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-PostStreamsStreamidSummarize
  matroid.createStreamSummary = function (streamId, configs = {}) {
    return new Promise((resolve, reject) => {
      /*
      Configs:
        - fps
        - featureWeight
        - motionWeight
        - matchingDistance
      */
      this._checkRequiredParams({ streamId });

      const options = {
        action: 'createStreamSummary',
        uriParams: { ':streamId': streamId },
        data: {},
      };

      Object.assign(options.data, configs);

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addVideoSummaryApi;
