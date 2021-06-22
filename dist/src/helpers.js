"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
    addFeedback: matroid._makeEndpoint('POST', 'detectors/:detectorId/feedback'),
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
    searchStreams: matroid._makeEndpoint('GET', 'streams'),
    // video summary
    getVideoSummary: matroid._makeEndpoint('GET', 'summaries/:summaryId'),
    getVideoSummaryTracks: matroid._makeEndpoint('GET', 'summaries/:summaryId/tracks.csv'),
    getVideoSummaryFile: matroid._makeEndpoint('GET', 'summaries/:summaryId/video.mp4'),
    createVideoSummary: matroid._makeEndpoint('POST', 'summarize'),
    deleteVideoSummary: matroid._makeEndpoint('DELETE', 'summaries/:summaryId'),
    getStreamSummaries: matroid._makeEndpoint('GET', 'streams/:streamId/summaries'),
    createStreamSummary: matroid._makeEndpoint('POST', 'streams/:streamId/summarize')
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
      var result;
      shouldNotParse ? result = body : result = safeParse(body);
      return resolve(result);
    });
  };

  matroid._makeEndpoint = function (method, resource) {
    return {
      method: method,
      uri: "".concat(matroid.baseUrl, "/").concat(resource)
    };
  };

  matroid._replaceParamsInUri = function (uri, uriParams) {
    if (!uriParams || _typeof(uriParams) !== 'object') return uri;
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
      return {
        file: this._createFilesData(filePaths)
      };
    } else if (typeof filePaths === 'string') {
      return {
        file: this._createFileData(filePaths)
      };
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
      options: {
        filename: filename
      }
    };
    if (contentType) result.options.contentType = contentType;
    return result;
  };

  matroid._createFilesData = function (filePaths) {
    return filePaths.map(this._createFileData);
  }; // returns the maximum file size and total size


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
      throw new Error("Individual file size must be under ".concat(this._fileSizeLimits.image / 1024 / 1024, "MB; Batch size under ").concat(this._fileSizeLimits.imageBatch / 1024 / 1024, "MB"));
    }
  };

  matroid._validateImageObj = function (image) {
    validateMediaObj(image, 'image');
  };

  matroid._validateVideoObj = function (video) {
    validateMediaObj(video, 'video');
  };

  matroid._setAuthToken = function (resolve, reject, token) {
    if (!token || !token.token_type || !token.access_token) {
      reject(Error("Unable to extract token from ".concat(util.inspect(token, false, null))));
    }

    this.authorizationHeader = "".concat(token.token_type, " ").concat(token.access_token);
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
      var errorMsg = "Please provide data: ".concat(missingParams.join(', '));
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

function validateMediaObj(media, mediaType) {
  if (!media || typeof media.url === 'undefined' && typeof media.file === 'undefined') {
    throw new Error("No ".concat(mediaType, " provided"));
  }

  if (media.url && media.file) {
    throw new Error('Can only handle either url or local file classification in a single request');
  }
}

function safeParse(response) {
  var result;

  try {
    if (typeof response === 'string') {
      result = JSON.parse(response);
    } else {
      result = response;
    }
  } catch (e) {
    result = {
      code: 'server_err',
      message: 'Unable to parse server response'
    };
    console.error("Server response ".concat(response));
  }

  return result;
}

module.exports = {
  addHelpers: addHelpers,
  addEndPoints: addEndPoints
};