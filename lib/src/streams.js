const addStreamsApi = (matroid) => {
  // https://app.matroid.com/docs/api/index.html#api-Streams-PostStreams
  matroid.createStream = matroid.registerStream = function (
    url,
    name,
    configs = {}
  ) {
    /*
    - Create a stream of a online video url
    - detectionFps, recordingEnabled, and retentionEnabled are the three parameters passed in the configs object
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ url, name });

      let options = {
        action: 'createStream',
        data: { name, url },
      };

      Object.assign(options.data, configs);

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://app.matroid.com/docs/api/index.html#api-Streams-DeleteMonitoringsMonitoring_id
  matroid.deleteMonitoring = function (monitoringId) {
    /*
    Requires monitoring to not be in active states
    activeStates = ['requested', 'toprepare', 'preparing', 'ready']
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ monitoringId });

      let options = {
        action: 'deleteMonitoring',
        uriParams: { ':key': monitoringId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://app.matroid.com/docs/api/index.html#api-Streams-DeleteStreamsStream_id
  matroid.deleteStream = function (streamId) {
    /*
    requires no active monitorings
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ streamId });

      let options = {
        action: 'deleteStream',
        uriParams: { ':key': streamId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://app.matroid.com/docs/api/index.html#api-Streams-GetMonitoringsMonitoring_idQuery
  matroid.getMonitoringResult = function (monitoringId, configs = {}) {
    /*
    - format, statusOnly, startTime, and endTime are parameters passed in the configs object
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ monitoringId });

      let options = {
        action: 'getMonitoringResult',
        uriParams: { ':key': monitoringId },
        data: {},
      };

      const processedConfigs = this.convertConfigsSnakeCase(configs);
      Object.assign(options.data, processedConfigs);
      if (configs.format && configs.format.toUpperCase() !== 'JSON') {
        options.shouldNotParse = true;
      }

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://app.matroid.com/docs/api/index.html#api-Streams-PostMonitoringsMonitoring_idKill
  matroid.killMonitoring = function (monitoringId) {
    /*
    It might take some time for the monitoring to actually go to 'failed' state
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ monitoringId });

      let options = {
        action: 'killMonitoring',
        uriParams: { ':key': monitoringId },
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://app.matroid.com/docs/api/index.html#api-Streams-GetMonitoringsQuery
  matroid.monitorStream = function (streamId, detectorId, configs = {}) {
    /*
    - thresholds, endpoint, startTime, endTime, taskName, notificationTimezone, minEmailInterval, sendEmailNotifications, regionEnabled, regionCoords, regionNegativeCoords, monitoringHours, and colors are the parameters passed in the configs object
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ streamId, detectorId });

      let options = {
        action: 'monitorStream',
        uriParams: {
          ':streamId': streamId,
          ':detectorId': detectorId,
        },
        data: {},
      };

      const processedConfigs = configs;
      if (processedConfigs.thresholds) {
        processedConfigs.thresholds = JSON.stringify(
          processedConfigs.thresholds
        );
      }

      Object.assign(options.data, processedConfigs);

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://app.matroid.com/docs/api/index.html#api-Streams-PostStreamsStream_idMonitorDetector_id
  matroid.searchMonitorings = function (configs = {}) {
    /*
    - streamId, monitoringId, detectorId, name, startTime, endTime, and state are the parameters passed in the configs object
    */
    return new Promise((resolve, reject) => {
      let options = {
        action: 'searchMonitorings',
        data: {},
      };

      const processedConfigs = this.convertConfigsSnakeCase(configs);
      Object.assign(options.data, processedConfigs);

      this._genericRequest(options, resolve, reject);
    });
  };

  // https://app.matroid.com/docs/api/index.html#api-Streams-GetStreamsQuery
  matroid.searchStreams = function (configs = {}) {
    /*
    - streamId, name, and permission are the three parameters passed in the configs object
    */
    return new Promise((resolve, reject) => {
      let options = {
        action: 'searchStreams',
        data: {},
      };

      const processedConfigs = this.convertConfigsSnakeCase(configs);
      Object.assign(options.data, processedConfigs);

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addStreamsApi;
