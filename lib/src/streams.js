const addStreamsApi = matroid => {
  matroid.registerStream = function(streamUrl, streamName) {
    return new Promise((resolve, reject) => {
      if (!streamUrl || !streamName) {
        throw new Error(
          `Need to pass in a stream url and a name for your stream`
        );
      }

      let options = {
        action: 'registerStream',
        data: {
          name: streamName,
          url: streamUrl
        }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.monitorStream = function(streamId, detectorId, configs = {}) {
    return new Promise((resolve, reject) => {
      if (!streamId || !detectorId) {
        throw new Error(`Need to pass in a stream id and a detector id`);
      }

      let options = {
        action: 'monitorStream',
        uriParams: {
          ':stream_id': streamId,
          ':detector_id': detectorId
        },
        data: {
          thresholds: JSON.stringify(configs.thresholds),
          startTime: configs.startTime,
          endTime: configs.endTime,
          endpoint: configs.endpoint
        }
      };

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addStreamsApi;
