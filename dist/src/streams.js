'use strict';

var addStreamsApi = function addStreamsApi(matroid) {
  // https://www.matroid.com/docs/api/index.html#api-Streams-PostStreams
  matroid.createStream = function (url, name) {
    var _this = this;

    /*
    Create a stream of a online video url
    */
    return new Promise(function (resolve, reject) {
      _this._checkRequiredParams({ url: url, name: name });

      var options = {
        action: 'createStream',
        data: { name: name, url: url }
      };

      _this._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Streams-DeleteMonitoringsMonitoring_id
  matroid.deleteMonitoring = function (monitoringId) {
    var _this2 = this;

    /*
    Requires monitoring to not be in active states
    activeStates = ['requested', 'toprepare', 'preparing', 'ready']
    */
    return new Promise(function (resolve, reject) {
      _this2._checkRequiredParams({ monitoringId: monitoringId });

      var options = {
        action: 'deleteMonitoring',
        uriParams: { ':key': monitoringId }
      };

      _this2._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Streams-DeleteStreamsStream_id
  matroid.deleteStream = function (streamId) {
    var _this3 = this;

    /*
    requires no active monitorings
    */
    return new Promise(function (resolve, reject) {
      _this3._checkRequiredParams({ streamId: streamId });

      var options = {
        action: 'deleteStream',
        uriParams: { ':key': streamId }
      };

      _this3._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Streams-GetMonitoringsMonitoring_idQuery
  matroid.getMonitoringResult = function (monitoringId) {
    var _this4 = this;

    var configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    return new Promise(function (resolve, reject) {
      _this4._checkRequiredParams({ monitoringId: monitoringId });

      var options = {
        action: 'getMonitoringResult',
        uriParams: { ':key': monitoringId },
        data: {}
      };

      var processedConfigs = _this4.convertConfigsSnakeCase(configs);
      Object.assign(options.data, processedConfigs);
      if (configs.format && configs.format.toUpperCase() !== 'JSON') {
        options.shouldNotParse = true;
      }

      _this4._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Streams-PostMonitoringsMonitoring_idKill
  matroid.killMonitoring = function (monitoringId) {
    var _this5 = this;

    /*
    It might take some time for the monitoring to actually go to 'failed' state
    */
    return new Promise(function (resolve, reject) {
      _this5._checkRequiredParams({ monitoringId: monitoringId });

      var options = {
        action: 'killMonitoring',
        uriParams: { ':key': monitoringId }
      };

      _this5._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Streams-GetMonitoringsQuery
  matroid.monitorStream = function (streamId, detectorId, thresholds) {
    var _this6 = this;

    var configs = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    return new Promise(function (resolve, reject) {
      _this6._checkRequiredParams({ streamId: streamId, detectorId: detectorId, thresholds: thresholds });

      var options = {
        action: 'monitorStream',
        uriParams: {
          ':streamId': streamId,
          ':detectorId': detectorId
        },
        data: {}
      };

      Object.assign(options.data, { thresholds: JSON.stringify(thresholds) });
      Object.assign(options.data, configs);

      _this6._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Streams-PostStreamsStream_idMonitorDetector_id
  matroid.searchMonitorings = function () {
    var _this7 = this;

    var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new Promise(function (resolve, reject) {
      var options = {
        action: 'searchMonitorings',
        data: {}
      };

      var processedConfigs = _this7.convertConfigsSnakeCase(configs);
      Object.assign(options.data, processedConfigs);

      _this7._genericRequest(options, resolve, reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Streams-GetStreamsQuery
  matroid.searchStreams = function () {
    var _this8 = this;

    var configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new Promise(function (resolve, reject) {
      var options = {
        action: 'searchStreams',
        data: {}
      };

      var processedConfigs = _this8.convertConfigsSnakeCase(configs);
      Object.assign(options.data, processedConfigs);

      _this8._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addStreamsApi;