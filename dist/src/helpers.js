'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var request = require('request');
var fs = require('fs');
var path = require('path');
var mime = require('mime-types');
var util = require('util');

var addEndPoints = function addEndPoints(matroid) {
  matroid.endpoints = {
    // accounts
    token: matroid._makeEndpoint('POST', 'oauth/token'),
    getAccountInfo: matroid._makeEndpoint('GET', 'account'),

    // collections
    createCollectionIndex: matroid._makeEndpoint('POST', 'collections/:key/collection-tasks'),
    createCollection: matroid._makeEndpoint('POST', 'collections'),
    deleteCollectionIndex: matroid._makeEndpoint('DELETE', 'collection-tasks/:key'),
    deleteCollection: matroid._makeEndpoint('DELETE', 'collections/:key'),
    getCollectionTask: matroid._makeEndpoint('GET', 'collection-tasks/:key'),
    getCollection: matroid._makeEndpoint('GET', 'collections/:key'),
    killCollectionIndex: matroid._makeEndpoint('POST', 'collection-tasks/:key/kill'),
    queryCollectionByScores: matroid._makeEndpoint('POST', 'collection-tasks/:key/scores-query'),
    queryCollectionByImage: matroid._makeEndpoint('POST', 'collection-tasks/:key/image-query'),
    updateCollectionIndex: matroid._makeEndpoint('PUT', 'collection-tasks/:key'),

    // detectors
    createDetector: matroid._makeEndpoint('POST', 'detectors'),
    deleteDetector: matroid._makeEndpoint('DELETE', 'detectors/:key'),
    trainDetector: matroid._makeEndpoint('POST', 'detectors/:key/finalize'),
    getDetectorInfo: matroid._makeEndpoint('GET', 'detectors/:key'),
    importDetector: matroid._makeEndpoint('POST', 'detectors/upload'),
    redoDetector: matroid._makeEndpoint('POST', 'detectors/:key/redo'),
    searchDetectors: matroid._makeEndpoint('GET', 'detectors/search'),
    listDetectors: matroid._makeEndpoint('GET', 'detectors'),

    // detector feedback
    addFeedbackFromFile: matroid._makeEndpoint('POST', 'detectors/:detectorId/feedback'),
    addFeedbackFromURL: matroid._makeEndpoint('POST', 'detectors/:detectorId/feedback'),
    deleteFeedback: matroid._makeEndpoint('DELETE', 'detectors/:detectorId/feedback/:feedbackId'),

    // images
    classifyImage: matroid._makeEndpoint('POST', 'detectors/:key/classify_image'),
    localizeImage: matroid._makeEndpoint('POST', 'localize'),

    // labels
    createLabelWithImages: matroid._makeEndpoint('POST', 'detectors/:key/labels'),
    deleteLabel: matroid._makeEndpoint('DELETE', 'detectors/:detectorId/labels/:labelId'),
    getAnnotations: matroid._makeEndpoint('GET', 'images/annotations'),
    getLabelImages: matroid._makeEndpoint('GET', 'detectors/:detectorId/labels/:labelId'),
    updateAnnotations: matroid._makeEndpoint('PATCH', 'detectors/:detectorId/labels/:labelId'),
    updateLabelWithImages: matroid._makeEndpoint('POST', 'detectors/:detectorId/labels/:labelId/images'),

    // videos
    classifyVideo: matroid._makeEndpoint('POST', 'detectors/:key/classify_video'),
    getVideoResults: matroid._makeEndpoint('GET', 'videos/:key'),

    // streams
    createStream: matroid._makeEndpoint('POST', 'streams'),
    deleteMonitoring: matroid._makeEndpoint('DELETE', 'monitorings/:key'),
    deleteStream: matroid._makeEndpoint('DELETE', 'streams/:key'),
    getMonitoringResult: matroid._makeEndpoint('GET', 'monitorings/:key'),
    killMonitoring: matroid._makeEndpoint('POST', 'monitorings/:key/kill'),
    searchMonitorings: matroid._makeEndpoint('GET', 'monitorings'),
    monitorStream: matroid._makeEndpoint('POST', 'streams/:streamId/monitor/:detectorId'),
    searchStreams: matroid._makeEndpoint('GET', 'streams')
  };
};

var addHelpers = function addHelpers(matroid) {
  matroid._genericRequest = function (options, resolve, reject) {
    var action = options.action,
        data = options.data,
        filePaths = options.filePaths,
        uriParams = options.uriParams,
        shouldNotParse = options.shouldNotParse,
        noAuth = options.noAuth;
    var _matroid$endpoints$ac = matroid.endpoints[action],
        method = _matroid$endpoints$ac.method,
        uri = _matroid$endpoints$ac.uri;


    var headers = {
      Authorization: this.authorizationHeader
    };

    if (noAuth) delete headers['Authorization'];

    uri = this._replaceParamsInUri(uri, uriParams);

    var config = {
      uri: uri,
      method: method,
      headers: Object.assign({}, this.baseHeaders, headers)
    };

    config = this._setData(config, data, method, filePaths);

    request(config, function (err, res, body) {
      if (err) return reject(err);

      var result = void 0;
      shouldNotParse ? result = body : result = safeParse(body);

      return resolve(result);
    });
  };

  matroid._makeEndpoint = function (method, resource) {
    return { method: method, uri: matroid.baseUrl + '/' + resource };
  };

  matroid._replaceParamsInUri = function (uri, uriParams) {
    if (!uriParams || (typeof uriParams === 'undefined' ? 'undefined' : _typeof(uriParams)) !== 'object') return uri;

    var modifiedUri = uri;
    for (var param in uriParams) {
      modifiedUri = modifiedUri.replace(new RegExp(param, 'g'), uriParams[param]);
    }

    return modifiedUri;
  };

  matroid._setData = function (config, data, method, filePaths) {
    if (!data && !filePaths) return config;

    if (method === 'GET') {
      config.qs = data;
    } else if (filePaths) {
      var fileData = this._setFileData(filePaths);
      var combinedData = Object.assign({}, data, fileData);
      config.formData = combinedData;
    } else {
      config.form = data;
    }

    return config;
  };

  matroid._setFileData = function (filePaths) {
    var _this = this;

    if (Array.isArray(filePaths)) {
      return { file: this._createFilesData(filePaths) };
    } else if (typeof filePaths === 'string') {
      return { file: this._createFileData(filePaths) };
    } else {
      // filePaths is an object, where keys are keywords for file names
      var filesObjs = {};

      Object.keys(filePaths).forEach(function (keyword) {
        if (Array.isArray(filePaths[keyword])) {
          filesObjs[keyword] = _this._createFilesData(filePaths[keyword]);
        } else {
          filesObjs[keyword] = _this._createFileData(filePaths[keyword]);
        }
      });

      return filesObjs;
    }
  };

  matroid._createFileData = function (filePath) {
    var contentType = mime.lookup(filePath);
    var filename = path.basename(filePath);

    var result = {
      value: fs.createReadStream(filePath),
      options: { filename: filename }
    };

    if (contentType) result.options.contentType = contentType;

    return result;
  };

  matroid._createFilesData = function (filePaths) {
    return filePaths.map(this._createFileData);
  };

  // returns the maximum file size and total size
  matroid._checkFilePayloadSize = function (filePaths, batchLimit, singleLimit) {
    if (Array.isArray(filePaths)) {
      return filePaths.reduce(function (sum, filePath) {
        return sum + fs.statSync(filePath).size;
      }, 0) <= batchLimit;
    } else {
      return fs.statSync(filePaths).size <= singleLimit;
    }
  };

  matroid._checkImageSize = function (image) {
    if (image && !this._checkFilePayloadSize(image, this._fileSizeLimits.imageBatch, this._fileSizeLimits.image)) {
      throw new Error('Individual file size must be under ' + this._fileSizeLimits.image / 1024 / 1024 + 'MB; Batch size under ' + this._fileSizeLimits.imageBatch / 1024 / 1024 + 'MB');
    }
  };

  matroid._validateImageObj = function (image) {
    if (!image || typeof image.url === 'undefined' && typeof image.file === 'undefined') {
      throw new Error('No image provided');
    }

    if (image.url && image.file) {
      throw new Error('Can only handle either url or local file classification in a single request');
    }
  };

  matroid._setAuthToken = function (resolve, reject, token) {
    if (!token || !token.token_type || !token.access_token) {
      reject(Error('Unable to extract token from ' + util.inspect(token, false, null)));
    }
    this.authorizationHeader = token.token_type + ' ' + token.access_token;

    return resolve(token);
  };

  matroid._checkRequiredParams = function (params) {
    var missingParams = [];

    Object.entries(params).forEach(function (paramInfo) {
      var _paramInfo = _slicedToArray(paramInfo, 2),
          paramName = _paramInfo[0],
          paramValue = _paramInfo[1];

      if (!paramValue) {
        missingParams.push(paramName);
      }
    });

    if (missingParams.length) {
      var errorMsg = 'Please provide data: ' + missingParams.join(', ');
      throw new Error(errorMsg);
    }
  };

  matroid.convertConfigsSnakeCase = function (configs) {
    var snakeCaseConfigs = {};

    for (var key in configs) {
      snakeCaseConfigs[this.toSnakeCase(key)] = configs[key];
    }

    return snakeCaseConfigs;
  };

  matroid.toSnakeCase = function (string) {
    return string.split(/(?=[A-Z])/).join('_').toLowerCase();
  };
};

function safeParse(response) {
  var result = void 0;
  try {
    if (typeof response === 'string') {
      result = JSON.parse(response);
    } else {
      result = response;
    }
  } catch (e) {
    result = { code: 'server_err', message: 'Unable to parse server response' };
    console.error('Server response ' + response);
  }

  return result;
}

module.exports = { addHelpers: addHelpers, addEndPoints: addEndPoints };