const chai = require('chai');
const expect = chai.expect;
const { setUpClient } = require('./utils');

describe('Accounts', function() {
  this.timeout(10000);

  before(function() {
    this.api = setUpClient();
  });

  describe('retrieveToken', function() {
    it('should retrieve token', async function() {
      const res = await this.api.retrieveToken();

      expect(res).to.be.an('object');
    });
  });

  describe('getAccountInfo', function() {
    it('get account info', async function() {
      const res = await this.api.getAccountInfo();

      expect(res.account).to.be.an('object');
    });
  });
});
