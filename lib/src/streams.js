const addStreamsApi = matroid => {
  matroid.createStream = function(url, name) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ url, name });

      let options = {
        action: 'createStream',
        data: { name, url }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.deleteMonitoring = function(monitoringId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams(monitoringId);

      let options = {
        action: 'deleteMonitoring',
        uriParams: { ':key': monitoringId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.deleteStream = function(streamId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams(streamId);

      let options = {
        action: 'deleteStream',
        uriParams: { ':key': streamId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.getMonitoringResult = function(monitoringId, configs) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ monitoringId });

      let options = {
        action: 'getMonitoringResult',
        uriParams: { ':key': monitoringId },
        data: {}
      };

      const processedConfigs = this.convertConfigsSnakeCase(configs);
      Object.assign(options.data, processedConfigs);

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.killMonitoring = function(monitoringId) {
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({ monitoringId });

      let options = {
        action: 'killMonitoring',
        uriParams: { ':key': monitoringId }
      };

      this._genericRequest(options, resolve, reject);
    });
  };

  matroid.searchMonitorings = function(configs) {
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

  matroid.searchStreams = function(configs) {
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
