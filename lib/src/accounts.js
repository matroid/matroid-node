const addAccountsApi = matroid => {
  matroid.retrieveToken = function(opts) {
    /*
    Generates an OAuth token. The API client will intelligently refresh the Access Token for you
    However, if you would like to manually expire an existing token and create a new token,
    call this method manually and pass in 'expireToken': true in the options argument.

    In addition, you would have to refresh manually if another client has expi your access token.

    You can pass the 'requestFromServer': true option to make a request
    to the server for the access token without invalidating it. This is useful if you are running
    multiple clients with the same token so they don't endlessly refresh each others' tokens
  */
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

      this._genericRequest(
        requestConfigs,
        this._setAuthToken.bind(this, resolve, reject),
        reject
      );
    });
  };

  matroid.accountInfo = function() {
    return new Promise((resolve, reject) => {
      let options = {
        action: 'accountInfo'
      };

      this._genericRequest(options, resolve, reject);
    });
  };
};

exports = module.exports = addAccountsApi;