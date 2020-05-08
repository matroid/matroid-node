const chai = require('chai');
const expect = chai.expect;
const { setUpClient, sleep } = require('./utils');
const {
  INVALID_QUERY_ERR,
  EVERYDAY_OBJECT_ID,
  RANDOM_MONGO_ID,
  S3_BUCKET_URL,
} = require('./data');

describe('Collections', function () {
  this.timeout(10000);

  let collectionId, collectionIndexId;

  before(async function () {
    this.api = setUpClient();
    await this.api.retrieveToken();
  });

  after(async function () {
    // clean up - kill/delete collection index/collection
    if (collectionIndexId) {
      await this.api.killCollectionIndex(collectionIndexId);
      await this.api.deleteCollectionIndex(collectionIndexId);
      collectionIndexId = null;
    }
    if (collectionId) {
      await this.api.deleteCollection(collectionId);
      collectionId = null;
    }
  });

  describe('createCollection', function () {
    it('should create a collection with correct params', async function () {
      const collectionName = `collection-node-${Date.now()}`;

      const res = await this.api.createCollection(
        collectionName,
        S3_BUCKET_URL,
        's3'
      );

      expect(res.collection).to.be.an('object', JSON.stringify(res));

      collectionId = res.collection._id;
    });

    it('should get an error with incorrect params', async function () {
      const res = await this.api.createCollection(
        'test-collection',
        'invalid-url',
        's3'
      );

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
    });
  });

  describe('getCollection', function () {
    it('should get the correct collection information', async function () {
      const res = await this.api.getCollection(collectionId);

      expect(res.collection).to.be.an('object', JSON.stringify(res));
    });

    it('should get an error with incorrect collectId', async function () {
      const res = await this.api.getCollection(RANDOM_MONGO_ID);

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
    });
  });

  describe('createCollectionIndex', function () {
    it('should create collection index with correct params', async function () {
      const res = await this.api.createCollectionIndex(
        collectionId,
        EVERYDAY_OBJECT_ID,
        'images'
      );

      expect(res.collectionTask).to.be.an('object', JSON.stringify(res));

      collectionIndexId = res.collectionTask._id;
    });

    it('should get an error with incorrect params', async function () {
      const res = await this.api.createCollectionIndex(
        collectionId,
        RANDOM_MONGO_ID,
        'images'
      );

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
    });
  });

  describe('getCollectionTask', function () {
    it('should get the correct collection task information', async function () {
      const res = await this.api.getCollectionTask(collectionIndexId);

      expect(res.collectionTask).to.be.an('object', JSON.stringify(res));
    });

    it('should get an error with incorrect collectionIndexId', async function () {
      const res = await this.api.getCollectionTask(RANDOM_MONGO_ID);

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
    });
  });

  describe('queryCollectionByScores');
  describe('queryCollectionByImage');

  describe('KillCollectionIndex', function () {
    it('should stop collection task', async function () {
      const res = await this.api.killCollectionIndex(collectionIndexId);

      expect(res.collectionTask).to.be.an('object', JSON.stringify(res));
    });

    it('should get an error with an invalid collection task id', async function () {
      const res = await this.api.killCollectionIndex(RANDOM_MONGO_ID);

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
    });
  });

  describe('updateCollectionIndex', function () {
    it('should update collection index', async function () {
      const res = await this.api.updateCollectionIndex(collectionIndexId);

      expect(res.collectionTask).to.be.an('object', JSON.stringify(res));
      // kill task before deleting
      await this.api.killCollectionIndex(collectionIndexId);
    });

    it('should get an error with an invalid collection task id', async function () {
      const res = await this.api.updateCollectionIndex(RANDOM_MONGO_ID);

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
    });
  });

  describe('deleteCollectionIndex', function () {
    this.timeout(30000);

    it('should delete collection index', async function () {
      await waitCollectionTaskStop(this.api, collectionIndexId);

      const res = await this.api.deleteCollectionIndex(collectionIndexId);

      expect(res.collectionTask).to.be.an('object', JSON.stringify(res));
      expect(res.message).to.equal('Successfully deleted');

      collectionIndexId = null;
    });

    it('should get an error with an invalid collection task id', async function () {
      const res = await this.api.deleteCollectionIndex(RANDOM_MONGO_ID);

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
    });
  });

  describe('deleteCollection', function () {
    it('should delete collection', async function () {
      const res = await this.api.deleteCollection(collectionId);

      expect(res.collection).to.be.an('object', JSON.stringify(res));
      expect(res.message).to.equal('Successfully deleted');

      collectionId = null;
    });
  });
});

// helpers

async function waitCollectionTaskStop(api, collectionIndexId) {
  // wait until collection task state is failed so it can be deleted
  let res = await api.getCollectionTask(collectionIndexId);
  let tries = 0;
  const maxTries = 10;

  while (res.collectionTask.state !== 'failed') {
    if (tries > maxTries) {
      throw new Error('Timeout when waiting for collection task to stop');
    }

    await sleep(2000);
    tries++;

    res = await api.getCollectionTask(collectionIndexId);
  }
}
