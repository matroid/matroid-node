const request = require('request');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const util = require('util');

const addEndPoints = matroid => {
  matroid.endpoints = {
    // accounts
    token: matroid._makeEndpoint('POST', 'oauth/token'),
    getAccountInfo: matroid._makeEndpoint('GET', 'account'),

    // collections
    createCollectionIndex: matroid._makeEndpoint(
      'POST',
      'collections/:key/collection-tasks'
    ),
    createCollection: matroid._makeEndpoint('POST', 'collections'),
    deleteCollectionIndex: matroid._makeEndpoint(
      'DELETE',
      'collection-tasks/:key'
    ),
    deleteCollection: matroid._makeEndpoint('DELETE', 'collections/:key'),
    getCollectionTask: matroid._makeEndpoint('GET', 'collection-tasks/:key'),
    getCollection: matroid._makeEndpoint('GET', 'collections/:key'),
    killCollectionIndex: matroid._makeEndpoint(
      'POST',
      'collection-tasks/:key/kill'
    ),
    queryCollectionByScores: matroid._makeEndpoint(
      'POST',
      'collection-tasks/:key/scores-query'
    ),
    queryCollectionByImage: matroid._makeEndpoint(
      'POST',
      'collection-tasks/:key/image-query'
    ),
    updateCollectionIndex: matroid._makeEndpoint(
      'PUT',
      'collection-tasks/:key'
    ),

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
    classifyImage: matroid._makeEndpoint(
      'POST',
      'detectors/:key/classify_image'
    ),
    localizeImage: matroid._makeEndpoint('POST', 'localize'),

    // labels
    createLabelWithImages: matroid._makeEndpoint(
      'POST',
      'detectors/:key/labels'
    ),
    deleteLabel: matroid._makeEndpoint(
      'DELETE',
      'detectors/:detectorId/labels/:labelId'
    ),
    getAnnotations: matroid._makeEndpoint('GET', 'images/annotations'),
    getLabelImages: matroid._makeEndpoint(
      'GET',
      'detectors/:detectorId/labels/:labelId'
    ),
    updateAnnotations: matroid._makeEndpoint(
      'PATCH',
      'detectors/:detectorId/labels/:labelId'
    ),
    updateLabelWithImages: matroid._makeEndpoint(
      'POST',
      'detectors/:detectorId/labels/:labelId/images'
    ),

    // videos
    classifyVideo: matroid._makeEndpoint(
      'POST',
      'detectors/:key/classify_video'
    ),
    getVideoResults: matroid._makeEndpoint('GET', 'videos/:key'),

    // streams
    createStream: matroid._makeEndpoint('POST', 'streams'),
    deleteMonitoring: matroid._makeEndpoint('DELETE', 'monitorings/:key'),
    deleteStream: matroid._makeEndpoint('DELETE', 'streams/:key'),
    getMonitoringResult: matroid._makeEndpoint('GET', 'monitorings/:key'),
    killMonitoring: matroid._makeEndpoint('POST', 'monitorings/:key/kill'),
    searchMonitorings: matroid._makeEndpoint('GET', 'monitorings'),
    monitorStream: matroid._makeEndpoint(
      'POST',
      'streams/:streamId/monitor/:detectorId'
    ),
    searchStreams: matroid._makeEndpoint('GET', 'streams')
  };
};

const addHelpers = matroid => {
  matroid._genericRequest = function(options, resolve, reject) {
    let {
      action,
      data,
      filePaths,
      uriParams,
      shouldNotParse,
      noAuth
    } = options;

    let { method, uri } = matroid.endpoints[action];

    let headers = {
      Authorization: this.authorizationHeader
    };

    if (noAuth) delete headers['Authorization'];

    uri = this._replaceParamsInUri(uri, uriParams);

    let config = {
      uri: uri,
      method: method,
      headers: Object.assign({}, this.baseHeaders, headers)
    };

    config = this._setData(config, data, method, filePaths);

    request(config, (err, res, body) => {
      if (err) return reject(err);

      let result;
      shouldNotParse ? (result = body) : (result = safeParse(body));

      return resolve(result);
    });
  };

  matroid._makeEndpoint = function(method, resource) {
    return { method: method, uri: `${matroid.baseUrl}/${resource}` };
  };

  matroid._replaceParamsInUri = function(uri, uriParams) {
    if (!uriParams || typeof uriParams !== 'object') return uri;

    let modifiedUri = uri;
    for (let param in uriParams) {
      modifiedUri = modifiedUri.replace(
        new RegExp(param, 'g'),
        uriParams[param]
      );
    }

    return modifiedUri;
  };

  matroid._setData = function(config, data, method, filePaths) {
    if (!data && !filePaths) return config;

    if (method === 'GET') {
      config.qs = data;
    } else if (filePaths) {
      let fileData = this._setFileData(filePaths);
      let combinedData = Object.assign({}, data, fileData);
      config.formData = combinedData;
    } else {
      config.form = data;
    }

    return config;
  };

  matroid._setFileData = function(filePaths) {
    if (Array.isArray(filePaths)) {
      return { file: this._createFilesData(filePaths) };
    } else if (typeof filePaths === 'string') {
      return { file: this._createFileData(filePaths) };
    } else {
      // filePaths is an object, where keys are keywords for file names
      let filesObjs = {};

      Object.keys(filePaths).forEach(keyword => {
        if (Array.isArray(filePaths[keyword])) {
          filesObjs[keyword] = this._createFilesData(filePaths[keyword]);
        } else {
          filesObjs[keyword] = this._createFileData(filePaths[keyword]);
        }
      });

      return filesObjs;
    }
  };

  matroid._createFileData = function(filePath) {
    let contentType = mime.lookup(filePath);
    let filename = path.basename(filePath);

    let result = {
      value: fs.createReadStream(filePath),
      options: { filename }
    };

    if (contentType) result.options.contentType = contentType;

    return result;
  };

  matroid._createFilesData = function(filePaths) {
    return filePaths.map(this._createFileData);
  };

  // returns the maximum file size and total size
  matroid._checkFilePayloadSize = function(filePaths, batchLimit, singleLimit) {
    if (Array.isArray(filePaths)) {
      return (
        filePaths.reduce(
          (sum, filePath) => sum + fs.statSync(filePath).size,
          0
        ) <= batchLimit
      );
    } else {
      return fs.statSync(filePaths).size <= singleLimit;
    }
  };

  matroid._checkImageSize = function(image) {
    if (
      image &&
      !this._checkFilePayloadSize(
        image,
        this._fileSizeLimits.imageBatch,
        this._fileSizeLimits.image
      )
    ) {
      throw new Error(
        `Individual file size must be under ${this._fileSizeLimits.image /
          1024 /
          1024}MB; Batch size under ${this._fileSizeLimits.imageBatch /
          1024 /
          1024}MB`
      );
    }
  };

  matroid._validateImageObj = function(image) {
    if (
      !image ||
      (typeof image.url === 'undefined' && typeof image.file === 'undefined')
    ) {
      throw new Error('No image provided');
    }

    if (image.url && image.file) {
      throw new Error(
        'Can only handle either url or local file classification in a single request'
      );
    }
  };

  matroid._setAuthToken = function(resolve, reject, token) {
    if (!token || !token.token_type || !token.access_token) {
      reject(
        Error(
          `Unable to extract token from ${util.inspect(token, false, null)}`
        )
      );
    }
    this.authorizationHeader = `${token.token_type} ${token.access_token}`;

    return resolve(token);
  };

  matroid._checkRequiredParams = function(params) {
    let missingParams = [];

    Object.entries(params).forEach(paramInfo => {
      const [paramName, paramValue] = paramInfo;
      if (!paramValue) {
        missingParams.push(paramName);
      }
    });

    if (missingParams.length) {
      const errorMsg = `Please provide data: ${missingParams.join(', ')}`;
      throw new Error(errorMsg);
    }
  };

  matroid.convertConfigsSnakeCase = function(configs) {
    let snakeCaseConfigs = {};

    for (let key in configs) {
      snakeCaseConfigs[this.toSnakeCase(key)] = configs[key];
    }

    return snakeCaseConfigs;
  };

  matroid.toSnakeCase = function(string) {
    return string
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase();
  };
};

function safeParse(response) {
  let result;
  try {
    if (typeof response === 'string') {
      result = JSON.parse(response);
    } else {
      result = response;
    }
  } catch (e) {
    result = { code: 'server_err', message: 'Unable to parse server response' };
    console.error(`Server response ${response}`);
  }

  return result;
}

module.exports = { addHelpers, addEndPoints };
