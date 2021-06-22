'use strict';

var addVideoSummaryApi = function addVideoSummaryApi(matroid) {
  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-GetSummariesSummaryid
  matroid.getVideoSummary = function (summaryId) {
    var _this = this;

    return new Promise(function (resolve, reject) {
      _this._checkRequiredParams({ summaryId: summaryId });

      var options = {
        action: 'getVideoSummary',
        uriParams: { ':summaryId': summaryId }
      };

      _this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-GetSummariesSummaryidTracksCsv
  matroid.getVideoSummaryTracks = function (summaryId) {
    var _this2 = this;

    /*
    Downloads video summary tracks CSV file as stream
    */
    return new Promise(function (resolve, reject) {
      _this2._checkRequiredParams({ summaryId: summaryId });

      var options = {
        action: 'getVideoSummaryTracks',
        uriParams: { ':summaryId': summaryId }
      };

      _this2._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-GetSummariesSummaryidVideoMp4
  matroid.getVideoSummaryFile = function (summaryId) {
    var _this3 = this;

    /*
    Downloads video summary mp4 file as stream
    */
    return new Promise(function (resolve, reject) {
      _this3._checkRequiredParams({ summaryId: summaryId });

      var options = {
        action: 'getVideoSummaryFile',
        uriParams: { ':summaryId': summaryId }
      };

      _this3._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-PostSummarize
  matroid.createVideoSummary = function (video) {
    var _this4 = this;

    /*
    Can accept a url and optional videoId, or a local file
    */
    return new Promise(function (resolve, reject) {
      _this4._validateVideoObj(video);

      var options = {
        action: 'createVideoSummary',
        data: {}
      };

      if (video.file) options.filePaths = video.file;
      if (video.url) {
        Object.assign(options.data, {
          url: video.url,
          videoId: video.videoId
        });
      }

      _this4._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-DeleteSummariesSummaryid
  matroid.deleteVideoSummary = function (summaryId) {
    var _this5 = this;

    return new Promise(function (resolve, reject) {
      _this5._checkRequiredParams({ summaryId: summaryId });

      var options = {
        action: 'deleteVideoSummary',
        uriParams: { ':summaryId': summaryId },
        data: {}
      };

      _this5._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-GetStreamsStreamidSummaries
  matroid.getStreamSummaries = function (streamId) {
    var _this6 = this;

    return new Promise(function (resolve, reject) {
      _this6._checkRequiredParams({ streamId: streamId });

      var options = {
        action: 'getStreamSummaries',
        uriParams: { ':streamId': streamId }
      };

      _this6._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Video_Summary-PostStreamsStreamidSummarize
  matroid.createStreamSummary = function (streamId) {
    var _this7 = this;

    var configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new Promise(function (resolve, reject) {
      _this7._checkRequiredParams({ streamId: streamId });

      var options = {
        action: 'createStreamSummary',
        uriParams: { ':streamId': streamId },
        data: {}
      };

      Object.assign(options.data, configs);

      _this7._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addVideoSummaryApi;