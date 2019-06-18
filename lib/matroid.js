const request = require('request');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const util = require('util');

const addAccountsApi = require('./src/accounts');
const addCollectionsApi = require('./src/collections');
const addDetectorsApi = require('./src/detectors');
const addImagesApi = require('./src/images');
const addLabelsApi = require('./src/labels');
// const addVideosApi = require('./src/videos');
const addStreamsApi = require('./src/streams');
const { addHelpers, addEndPoints } = require('./src/helpers');

class Matroid {
  constructor(opts) {
    let options = opts;
    if (!options) options = {};

    this.baseUrl = options.baseUrl || 'https://www.matroid.com/api/v1';
    this.clientId = options.clientId || process.env.MATROID_CLIENT_ID;
    this.clientSecret =
      options.clientSecret || process.env.MATROID_CLIENT_SECRET;

    this.baseHeaders = {
      'User-Agent': 'request'
    };

    /* eslint-disable no-magic-numbers */
    this._fileSizeLimits = {
      image: 50 * 1024 * 1024,
      video: 300 * 1024 * 1024,
      imageBatch: 50 * 1024 * 1024,
      zip: 300 * 1024 * 1024
    };
    /* eslint-enable no-magic-numbers */

    addHelpers(this);
    addEndPoints(this);
    addAccountsApi(this);
    addCollectionsApi(this);
    addDetectorsApi(this);
    addImagesApi(this);
    addLabelsApi(this);
    // addVideosApi(this);
    addStreamsApi(this);
  }
}

exports = module.exports = Matroid;
