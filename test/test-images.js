const chai = require('chai');
const expect = chai.expect;
const { setUpClient } = require('./utils');
const {
  CAT_FILE,
  DOG_FILE,
  CAT_URL,
  DOG_URL,
  EVERYDAY_OBJECT_ID
} = require('./data');

describe('Images', function() {
  this.timeout(8000);

  before(async function() {
    this.api = setUpClient();
    await this.api.retrieveToken();
  });

  describe('classifyImage', function() {
    it('should classify a local image', async function() {
      const res = await this.api.classifyImage(EVERYDAY_OBJECT_ID, {
        file: CAT_FILE
      });

      expect(res.results).to.be.an('array', JSON.stringify(res));
    });

    it('should classify an array of local images', async function() {
      const res = await this.api.classifyImage(EVERYDAY_OBJECT_ID, {
        file: [CAT_FILE, DOG_FILE]
      });

      expect(res.results).to.be.an('array', JSON.stringify(res));
    });

    it('should classify an online url', async function() {
      const res = await this.api.classifyImage(EVERYDAY_OBJECT_ID, {
        url: CAT_URL
      });

      expect(res.results).to.be.an('array', JSON.stringify(res));
    });

    it('should classify an array online urls', async function() {
      const res = await this.api.classifyImage(EVERYDAY_OBJECT_ID, {
        url: [CAT_URL, DOG_URL]
      });

      expect(res.results).to.be.an('array', JSON.stringify(res));
    });

    it('should get an error if no images are provided', async function() {
      try {
        await this.api.classifyImage(EVERYDAY_OBJECT_ID);
      } catch (e) {
        expect(e).to.be.an('Error');
        expect(e.message).to.equal('No image provided');
      }
    });
  });

  describe('localizeImage', function() {
    it('should localize an image', async function() {
      const res = await this.api.localizeImage(EVERYDAY_OBJECT_ID, 'cat', {
        url: CAT_URL
      });

      expect(res.results).to.be.an('array', JSON.stringify(res));
      expect(res.results).to.have.lengthOf(1);
    });

    // { update: true } positive case is tested in test-labels.js

    it('should get an error with invalid parameters', async function() {
      try {
        await this.api.localizeImage(EVERYDAY_OBJECT_ID, 'cat', {
          update: true
        });
      } catch (e) {
        expect(e).to.be.an('Error');
        expect(e.message).to.equal(
          'Please provide labelId and one of imageId/imageIds when setting update to true'
        );
      }
    });
  });
});
