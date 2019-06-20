const addStreamsApi = matroid => {
  // https://staging.dev.matroid.com/docs/api/index.html#api-Streams-PostStreams
  matroid.createStream = function(url, name) {
    /*
    Create a stream of a online video url
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ url, name });

      let options = {
        action: 'createStream',
        data: { name, url }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://staging.dev.matroid.com/docs/api/index.html#api-Streams-DeleteMonitoringsMonitoring_id
  matroid.deleteMonitoring = function(monitoringId) {
    /*
    Requires monitoring to not be in active states
    activeStates = ['requested', 'toprepare', 'preparing', 'ready']
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ monitoringId });

      let options = {
        action: 'deleteMonitoring',
        uriParams: { ':key': monitoringId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://staging.dev.matroid.com/docs/api/index.html#api-Streams-DeleteStreamsStream_id
  matroid.deleteStream = function(streamId) {
    /*
    requires no active monitorings
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ streamId });

      let options = {
        action: 'deleteStream',
        uriParams: { ':key': streamId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://staging.dev.matroid.com/docs/api/index.html#api-Streams-GetMonitoringsMonitoring_idQuery
  matroid.getMonitoringResult = function(monitoringId, configs = {}) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ monitoringId });

      let options = {
        action: 'getMonitoringResult',
        uriParams: { ':key': monitoringId },
        data: {}
      };

      const processedConfigs = this.convertConfigsSnakeCase(configs);
      Object.assign(options.data, processedConfigs);
      if (configs.format && configs.format.toUpperCase() !== 'JSON') {
        options.shouldNotParse = true;
      }

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://staging.dev.matroid.com/docs/api/index.html#api-Streams-PostMonitoringsMonitoring_idKill
  matroid.killMonitoring = function(monitoringId) {
    /*
    It might take some time for the monitoring to actually go to 'failed' state
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ monitoringId });

      let options = {
        action: 'killMonitoring',
        uriParams: { ':key': monitoringId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://staging.dev.matroid.com/docs/api/index.html#api-Streams-GetMonitoringsQuery
  matroid.monitorStream = function(
    streamId,
    detectorId,
    thresholds,
    configs = {}
  ) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ streamId, detectorId, thresholds });

      let options = {
        action: 'monitorStream',
        uriParams: {
          ':streamId': streamId,
          ':detectorId': detectorId
        },
        data: {}
      };

      Object.assign(options.data, { thresholds: JSON.stringify(thresholds) });
      Object.assign(options.data, configs);

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://staging.dev.matroid.com/docs/api/index.html#api-Streams-PostStreamsStream_idMonitorDetector_id
  matroid.searchMonitorings = function(configs = {}) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'searchMonitorings',
        data: {}
      };

      const processedConfigs = this.convertConfigsSnakeCase(configs);
      Object.assign(options.data, processedConfigs);

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://staging.dev.matroid.com/docs/api/index.html#api-Streams-GetStreamsQuery
  matroid.searchStreams = function(configs = {}) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'searchStreams',
        data: {}
      };

      const processedConfigs = this.convertConfigsSnakeCase(configs);
      Object.assign(options.data, processedConfigs);

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addStreamsApi;
