'use strict';

var addAccountsApi = function addAccountsApi(matroid) {
  // https://www.matroid.com/docs/api/index.html#api-Accounts-RefreshToken
  matroid.retrieveToken = function () {
    var _this = this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    /*
    Generates an OAuth token. The API client will intelligently refresh the Access Token for you
    However, if you would like to manually expire an existing token and create a new token,
    call this method manually and pass in 'expireToken': true in the options argument.
     In addition, you would have to refresh manually if another client has expired your access token.
     You can pass the 'requestFromServer': true option to make a request
    to the server for the access token without invalidating it. This is useful if you are running
    multiple clients with the same token so they don't endlessly refresh each others' tokens
    */
    return new Promise(function (resolve, reject) {
      var options = opts;
      if (!options) options = {};

      var _options = options,
          expireToken = _options.expireToken,
          requestFromServer = _options.requestFromServer;


      if (_this.authorizationHeader && !(expireToken || requestFromServer)) {
        return resolve(_this.authorizationHeader);
      }

      var requestConfigs = {
        action: 'token',
        data: {
          client_id: _this.clientId,
          client_secret: _this.clientSecret,
          grant_type: 'client_credentials'
        },
        noAuth: true
      };

      if (requestFromServer) {
        requestConfigs.data.refresh = 'true';
      }

      _this._genericRequest(requestConfigs, _this._setAuthToken.bind(_this, resolve, reject), reject);
    });
  };

  // https://www.matroid.com/docs/api/index.html#api-Accounts-GetAccount
  matroid.getAccountInfo = function () {
    var _this2 = this;

    return new Promise(function (resolve, reject) {
      var options = {
        action: 'getAccountInfo'
      };

      _this2._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addAccountsApi;