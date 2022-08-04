"use strict";

const addAccountsApi = matroid => {
  // https://www.matroid.com/docs/api/index.html#api-Accounts-RefreshToken
  matroid.retrieveToken = function () {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    /*
    Generates an OAuth token. The API client will intelligently refresh the Access Token for you
    However, if you would like to manually create a new token,
    call this method manually and pass in 'refresh': true in the options argument.
    */
    return new Promise((resolve, reject) => {
      let {
        refresh
      } = options;

      if (this.authorizationHeader && !refresh) {
        return resolve(this.authorizationHeader);
      }

      let requestOptions = {
        action: 'token',
        data: {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials'
        },
        noAuth: true
      };

      if (refresh) {
        requestOptions.data.refresh = 'true';
      }

      this._genericRequest(requestOptions, this._setAuthToken.bind(this, resolve, reject), reject);
    });
  }; // https://www.matroid.com/docs/api/index.html#api-Accounts-GetAccount
  // Formerly called accountInfo (now deprecated), use getAccountInfo


  matroid.getAccountInfo = matroid.accountInfo = function () {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'getAccountInfo'
      };

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addAccountsApi;