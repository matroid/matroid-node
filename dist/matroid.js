'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var addAccountsApi = require('./src/accounts');
var addCollectionsApi = require('./src/collections');
var addDetectorsApi = require('./src/detectors');
var addImagesApi = require('./src/images');
var addLabelsApi = require('./src/labels');
var addVideosApi = require('./src/videos');
var addStreamsApi = require('./src/streams');

var _require = require('./src/helpers'),
    addHelpers = _require.addHelpers,
    addEndPoints = _require.addEndPoints;

var Matroid = function Matroid(opts) {
  _classCallCheck(this, Matroid);

  var options = opts;
  if (!options) options = {};

  this.baseUrl = options.baseUrl || 'https://www.matroid.com/api/v1';
  this.clientId = options.clientId || process.env.MATROID_CLIENT_ID;
  this.clientSecret = options.clientSecret || process.env.MATROID_CLIENT_SECRET;

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
  addVideosApi(this);
  addStreamsApi(this);
};

exports = module.exports = Matroid;