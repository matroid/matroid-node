const request = require('request');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const util = require('util');

const addEndPoints = matroid => {
  matroid.endpoints = {
    // accounts
    token: matroid._makeEndpoint('POST', 'oauth/token'),
    accountInfo: matroid._makeEndpoint('GET', 'account'),

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
    getCollectionTask: matroid._makeEndpoint('GET', 'collections/:key'),
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
    detectorInfo: matroid._makeEndpoint('GET', 'detectors/:key'),
    listDetectors: matroid._makeEndpoint('GET', 'detectors'),

    // images
    classifyImage: matroid._makeEndpoint(
      'POST',
      'detectors/:key/classify_image'
    ),

    // videos
    classifyVideo: matroid._makeEndpoint(
      'POST',
      'detectors/:key/classify_video'
    ),
    getVideoResults: matroid._makeEndpoint('GET', 'videos/:key'),

    // streams
    registerStream: matroid._makeEndpoint('POST', 'streams'),
    monitorStream: matroid._makeEndpoint(
      'POST',
      'streams/:stream_id/monitor/:detector_id'
    )
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
    } else {
      return { file: this._createFileData(filePaths) };
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
      image.file &&
      !this._checkFilePayloadSize(
        image.file,
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

  matroid._validateImage = function(image) {
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