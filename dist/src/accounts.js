"use strict";

var addAccountsApi = function addAccountsApi(matroid) {
  // https://www.matroid.com/docs/api/index.html#api-Accounts-RefreshToken
  matroid.retrieveToken = function () {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    /*
    Generates an OAuth token. The API client will intelligently refresh the Access Token for you
    However, if you would like to manually create a new token,
    call this method manually and pass in 'refresh': true in the options argument.
    */
    return new Promise(function (resolve, reject) {
      var refresh = options.refresh;

      if (_this.authorizationHeader && !refresh) {
        return resolve(_this.authorizationHeader);
      }

      var requestOptions = {
        action: 'token',
        data: {
          client_id: _this.clientId,
          client_secret: _this.clientSecret,
          grant_type: 'client_credentials'
        },
        noAuth: true
      };

      if (refresh) {
        requestOptions.data.refresh = 'true';
      }

      _this._genericRequest(requestOptions, _this._setAuthToken.bind(_this, resolve, reject), reject);
    });
  }; // https://www.matroid.com/docs/api/index.html#api-Accounts-GetAccount
  // Formerly called accountInfo (now deprecated), use getAccountInfo


  matroid.getAccountInfo = matroid.accountInfo = function () {
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