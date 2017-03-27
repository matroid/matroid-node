const request = require('request');

class Matroid {
  constructor(options) {
    this.baseUrl = options.baseUrl;
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;

    this.endpoints = {
      token: { method: 'POST', uri: `${this.baseUrl}/oauth/token` },
      accountInfo: { method: 'GET', uri: `${this.baseUrl}/account` }
    }

    this.baseHeaders = {
      'User-Agent': 'request'
    };
  }

  retrieveToken(callback = () => {}) {
    let self = this;
    let { method, uri } = this.endpoints.token;
    let headers = {};
    let config = {
      url: uri,
      method: method,
      headers: Object.assign({}, this.baseHeaders, headers),
      form: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    };
    request(config, (err, res, body) => {
      let result = safeParse(body);
      if (result.access_token) {
        self.authorization_header = `${result.token_type} ${result.access_token}`;
      }

      callback(err, result);
    });
  }

  accountInfo(callback) {
    if (!callback) {
      throw new Error('Please provide a callback function');
    }
    let { method, uri } = this.endpoints.accountInfo;
    let headers = {
      'Authorization': this.authorization_header
    };
    let config = {
      url: uri,
      method: method,
      headers: Object.assign({}, this.baseHeaders, headers)
    };

    request(config, (err, res, body) => {
      let result = safeParse(body);
      callback(err, result);
    });
  }
}

function safeParse(response) {
  let result;
  try {
    result = JSON.parse(response);
  } catch(e) {
    result = { code: 'server_err', message: 'Unable to parse server response' };
    console.error(`Server response ${response}`);
  }

  return result;
}

exports = module.exports = Matroid;
