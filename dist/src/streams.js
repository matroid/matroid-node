"use strict";

const addStreamsApi = matroid => {
  // https://app.matroid.com/docs/api/documentation#api-Streams-PostStreams
  matroid.createStream = matroid.registerStream = function (url, name) {
    let configs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    /*
    - Create a stream of a online video url
    - detectionFps, recordingEnabled, and retentionEnabled are the three parameters passed in the configs object
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        url,
        name
      });

      let options = {
        action: 'createStream',
        data: {
          name,
          url
        }
      };
      Object.assign(options.data, configs);

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/documentation#api-Streams-DeleteMonitoringsMonitoring_id


  matroid.deleteMonitoring = function (monitoringId) {
    /*
    Requires monitoring to not be in active states
    activeStates = ['requested', 'toprepare', 'preparing', 'ready']
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        monitoringId
      });

      let options = {
        action: 'deleteMonitoring',
        uriParams: {
          ':key': monitoringId
        }
      };

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/documentation#api-Streams-DeleteStreamsStream_id


  matroid.deleteStream = function (streamId) {
    /*
    requires no active monitorings
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        streamId
      });

      let options = {
        action: 'deleteStream',
        uriParams: {
          ':key': streamId
        }
      };

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/documentation#api-Streams-GetMonitoringsMonitoring_idQuery


  matroid.getMonitoringResult = function (monitoringId) {
    let configs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    /*
    - format, statusOnly, startTime, and endTime are parameters passed in the configs object
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        monitoringId
      });

      let options = {
        action: 'getMonitoringResult',
        uriParams: {
          ':key': monitoringId
        },
        data: {}
      };
      const processedConfigs = this.convertConfigsSnakeCase(configs);
      Object.assign(options.data, processedConfigs);

      if (configs.format && configs.format.toUpperCase() !== 'JSON') {
        options.shouldNotParse = true;
      }

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/documentation#api-Streams-PostMonitoringsMonitoring_idKill


  matroid.killMonitoring = function (monitoringId) {
    /*
    It might take some time for the monitoring to actually go to 'failed' state
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        monitoringId
      });

      let options = {
        action: 'killMonitoring',
        uriParams: {
          ':key': monitoringId
        }
      };

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/documentation#api-Streams-GetMonitoringsQuery


  matroid.monitorStream = function (streamId, detectorId) {
    let configs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    /*
    - thresholds, endpoint, startTime, endTime, taskName, notificationTimezone, minEmailInterval, sendEmailNotifications, regionEnabled, regionCoords, regionNegativeCoords, monitoringHours, and colors are the parameters passed in the configs object
    */
    return new Promise((resolve, reject) => {
      this._checkRequiredParams({
        streamId,
        detectorId
      });

      let options = {
        action: 'monitorStream',
        uriParams: {
          ':streamId': streamId,
          ':detectorId': detectorId
        },
        data: {}
      };
      const processedConfigs = configs;

      if (processedConfigs.thresholds) {
        processedConfigs.thresholds = JSON.stringify(processedConfigs.thresholds);
      }

      if (Number.isInteger(parseInt(processedConfigs.minDetectionInterval))) {
        processedConfigs.minDetectionInterval = parseInt(processedConfigs.minDetectionInterval);
      } else {
        delete processedConfigs.minDetectionInterval;
      }

      Object.assign(options.data, processedConfigs);

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/documentation#api-Streams-PostStreamsStream_idMonitorDetector_id


  matroid.searchMonitorings = function () {
    let configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    /*
    - streamId, monitoringId, detectorId, name, startTime, endTime, and state are the parameters passed in the configs object
    */
    return new Promise((resolve, reject) => {
      let options = {
        action: 'searchMonitorings',
        data: {}
      };
      const processedConfigs = this.convertConfigsSnakeCase(configs);
      Object.assign(options.data, processedConfigs);

      this._genericRequest(options, resolve, reject);
    });
  }; // https://app.matroid.com/docs/api/documentation#api-Streams-GetStreamsQuery


  matroid.searchStreams = function () {
    let configs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    /*
    - streamId, name, and permission are the three parameters passed in the configs object
    */
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