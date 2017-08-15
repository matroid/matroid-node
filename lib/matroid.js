const request = require('request');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const util = require('util');

class Matroid {
  constructor(opts) {
    let options = opts;
    if (!options) options = {};

    this.baseUrl = options.baseUrl || 'https://www.matroid.com/api/v1';
    this.clientId = options.clientId || process.env.MATROID_CLIENT_ID;
    this.clientSecret = options.clientSecret || process.env.MATROID_CLIENT_SECRET;

    this.endpoints = {
      token: this._makeEndpoint('POST', 'oauth/token'),
      accountInfo: this._makeEndpoint('GET', 'account'),
      createDetector: this._makeEndpoint('POST', 'detectors'),
      trainDetector: this._makeEndpoint('POST', 'detectors/:key/finalize'),
      detectorInfo: this._makeEndpoint('GET', 'detectors/:key'),
      classifyImage: this._makeEndpoint('POST', 'detectors/:key/classify_image'),
      classifyVideo: this._makeEndpoint('POST', 'detectors/:key/classify_video'),
      getVideoResults: this._makeEndpoint('GET', 'videos/:key'),
      listDetectors: this._makeEndpoint('GET', 'detectors'),
      registerStream: this._makeEndpoint('POST', 'streams'),
      monitorStream: this._makeEndpoint('POST', 'streams/:feed_id/monitor/:detector_id')
    };

    this.baseHeaders = {
      'User-Agent': 'request'
    };

    this._fileSizeLimits = {
      image: 50 * 1024 * 1024,
      video: 300 * 1024 * 1024,
      imageBatch: 50 * 1024 * 1024,
      zip: 300 * 1024 * 1024
    };
  }

  /*
    Generates an OAuth token. The API client will intelligently refresh the Access Token for you
    However, if you would like to manually expire an existing token and create a new token,
    call this method manually and pass in 'expireToken': true in the options argument.

    In addition, you would have to refresh manually if another client has expi your access token.

    You can pass the 'requestFromServer': true option to make a request
    to the server for the access token without invalidating it. This is useful if you are running
    multiple clients with the same token so they don't endlessly refresh each others' tokens
  */
  retrieveToken(opts) {
    return new Promise((resolve, reject) => {
      let options = opts;
      if (!options) options = {};

      let { expireToken, requestFromServer } = options;

      if (this.authorizationHeader && !(expireToken || requestFromServer)) {
        return resolve(this.authorizationHeader);
      }

      let requestConfigs = {
        action: 'token',
        data: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials'
        },
        noAuth: true
      };

      if (requestFromServer) {
        requestConfigs.data.refresh = 'true';
      }

      this._genericRequest(requestConfigs, this._setAuthToken.bind(this, resolve), reject);
    });
  }

  accountInfo() {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'accountInfo'
      };

      this._genericRequest(options, resolve, reject);
    });
  }

  createDetector(zipFile, name, detectorType) {
    return new Promise((resolve, reject) => {
      if (!this._checkFilePayloadSize(zipFile, 0, this._fileSizeLimits.zip)) {
        throw new Error(`Individual file size must be under ${this._fileSizeLimits.zip / 1024 / 1024}MB`);
      }

      let options = {
        action: 'createDetector',
        data: { name: name, detector_type: detectorType },
        filePaths: { file: zipFile }
      };

      this._genericRequest(options, resolve, reject);
    });
  }

  trainDetector(detectorId, name, detectorType) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'trainDetector',
        uriParams: { ':key': detectorId },
        data: { name: name, detector_type: detectorType }
      };

      this._genericRequest(options, resolve, reject);
    });
  }

  detectorInfo(detectorId) {
    return new Promise((resolve, reject) => {

      let options = {
        action: 'detectorInfo',
        uriParams: { ':key': detectorId }
      };

      this._genericRequest(options, resolve, reject);
    });
  }

  /*
    Expected image format: { url: 'https://www.matroid.com/logo.png'} OR { file: ['/home/user/image.jpg', '/home/user/other_image.png'] }
  */
  classifyImage(detectorId, image) {
    return new Promise((resolve, reject) => {
      if (!detectorId) {
        throw new Error('Please pass in the ID of the detector you want to use');
      }

      if (!image || typeof image.url === 'undefined' && typeof image.file === 'undefined') {
        throw new Error('No image provided');
      }

      if (image.url && image.file) {
        throw new Error('Can only handle either url or local file classification in a single request');
      }

      if (!image.url && !this._checkFilePayloadSize(image.file,
        this._fileSizeLimits.imageBatch, this._fileSizeLimits.image)) {
        throw new Error(`Individual file size must be under ${this._fileSizeLimits.image / 1024 / 1024}MB; Batch size under ${this._fileSizeLimits.imageBatch / 1024 / 1024}MB`);
      }

      let options = {
        action: 'classifyImage',
        uriParams: { ':key': detectorId }
      };

      if (image.file) options.filePaths = image.file;
      if (image.url) options.data = { url: image.url };

      this._genericRequest(options, resolve, reject);
    });
  }

  /*
    Expected image format: { url: 'https://www.matroid.com/logo.png'} OR { file: ['/home/user/image.jpg', '/home/user/other_image.png'] }
  */
  classifyVideo(detectorId, video, threshold, format) {
    return new Promise((resolve, reject) => {
      if (!detectorId) {
        throw new Error('Please pass in the ID of the detector you want to use');
      }

      if (!video || typeof video.url === 'undefined' && typeof video.file === 'undefined') {
        throw new Error('No video provided');
      }

      if (video.file && Array.isArray(video.file)) {
        throw new Error('Can only classify one local video at a time');
      }

      if (!video.url && !this._checkFilePayloadSize(video.file, 0, this._fileSizeLimits.video)) {
        throw new Error(`Individual file size must be under ${this._fileSizeLimits.video / 1024 / 1024}MB`);
      }

      let options = {
        action: 'classifyVideo',
        uriParams: { ':key': detectorId }
      };

      if (video.file) options.filePaths = video.file;
      if (video.url) options.data = { url: video.url };

      this._genericRequest(options, resolve, reject);
    });
  }

  getVideoResults(videoId, threshold, responseFormat) {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'getVideoResults',
        data: { threshold: threshold, format: responseFormat },
        uriParams: { ':key': videoId }
      };

      if (responseFormat === 'csv') options.shouldNotParse = true;

      this._genericRequest(options, resolve, reject);
    });
  }

  listDetectors() {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'listDetectors'
      };

      this._genericRequest(options, resolve, reject);
    });
  }

  registerStream(streamUrl, streamName) {
    return new Promise((resolve, reject) => {
      if (!streamUrl || !streamName) {
        throw new Error(`Need to pass in a stream url and a name for your stream`);
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
  }

  monitorStream(streamId, detectorId, configs) {
    configs = configs || {};
    return new Promise((resolve, reject) => {
      if (!streamId || !detectorId) {
        throw new Error(`Need to pass in a stream id and a detector id`);
      }

      let options = {
        action: 'monitorStream',
        uriParams: {
          ':feed_id': streamId,
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
  }

  _genericRequest(options, resolve, reject) {
    let { action, data, filePaths, uriParams, shouldNotParse, noAuth } = options;

    let { method, uri } = this.endpoints[action];

    let headers = {
      'Authorization': this.authorizationHeader
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
      let result;
      shouldNotParse ? result = body : result = safeParse(body);

      if (err) return reject(err);

      return resolve(result);
    });
  }

  _makeEndpoint(method, resource) {
    return { method: method, uri: `${this.baseUrl}/${resource}` };
  }

  _replaceParamsInUri(uri, uriParams) {
    if (!uriParams || typeof uriParams !== 'object') return uri;

    let modifiedUri = uri;
    for (let param in uriParams) {
      modifiedUri = modifiedUri.replace(new RegExp(param, 'g'), uriParams[param]);
    }

    return modifiedUri;
  }

  _setData(config, data, method, filePaths) {
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
  }

  _setFileData(filePaths) {
    if (Array.isArray(filePaths)) {
      return { file: this._createFilesData(filePaths) };
    } else {
      return { file: this._createFileData(filePaths) };
    }
  }

  _createFileData(filePath) {
    let contentType = mime.lookup(filePath);
    let filename = path.basename(filePath);

    let result = {
      value: fs.createReadStream(filePath),
      options: { filename }
    };

    if (contentType) result.options.contentType = contentType;

    return result;
  }

  _createFilesData(filePaths) {
    return filePaths.map(this._createFileData);
  }

  // returns the maximum file size and total size
  _checkFilePayloadSize(filePaths, batchLimit, singleLimit) {
    if (Array.isArray(filePaths)) {
      return filePaths.reduce((sum, filePath) => sum + fs.statSync(filePath).size, 0) <= batchLimit;
    } else {
      return fs.statSync(filePaths).size <= singleLimit;
    }
  }

  _setAuthToken(callback, token) {
    if (!token || !token.token_type || !token.access_token) {
      throw new Error(`Unable to extract token from ${util.inspect(token, false, null)}`);
    }
    this.authorizationHeader = `${token.token_type} ${token.access_token}`;

    return callback(token);
  }
}

function safeParse(response) {
  let result;
  try {
    if (typeof response === 'string') {
      result = JSON.parse(response);
    } else {
      result = response
    }
  } catch (e) {
    result = { code: 'server_err', message: 'Unable to parse server response' };
    console.error(`Server response ${response}`);
  }

  return result;
}

exports = module.exports = Matroid;
