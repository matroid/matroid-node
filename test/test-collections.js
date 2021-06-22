const chai = require('chai');
const expect = chai.expect;
const { setUpClient, sleep, waitIndexDone, waitCollectionTaskStop } = require('./utils');
const {
  INVALID_QUERY_ERR,
  EVERYDAY_OBJECT_ID,
  RANDOM_MONGO_ID,
  S3_BUCKET_URL,
} = require('./data');

describe('Collections', function () {
  this.timeout(10000);

  let collectionId, collectionIndexId;
  const indexesToDelete = [];
  const collectionsToDelete = [];

  before(async function () {
    this.api = setUpClient();
    await this.api.retrieveToken();
  });

  after(async function () {
    // clean up all collection indexes
    await Promise.all(indexesToDelete.map(async (indexId) => {
      await this.api.killCollectionIndex(indexId);
      await this.api.deleteCollectionIndex(indexId);
    }));

    // clean up all collections
    await Promise.all(collectionsToDelete.map(async (collectionId) => {
      await this.api.deleteCollection(collectionId);
    }));
  });

  describe('createCollection', function () {
    it('should create a collection with correct params', async function () {
      const collectionName = `collection-node-${Date.now()}`;
      const sourceType = 's3';

      const res = await this.api.createCollection(
        collectionName,
        S3_BUCKET_URL,
        sourceType,
        { indexWithDefault: false },
      );

      expect(res.collection).to.be.an('object', JSON.stringify(res));
      expect(res.collection.name).to.equal(collectionName);
      expect(res.collection.url).to.equal(S3_BUCKET_URL);
      expect(res.collection.sourceType).to.equal(sourceType);
      expect(res.collection.detectingTasks).to.have.lengthOf(0);

      collectionId = res.collection._id;
      collectionsToDelete.push(collectionId);
    });

    it('should create a collection with default indexes if specified', async function () {
      const collectionName = `collection-node-${Date.now()}`;
      const sourceType = 's3';

      const res = await this.api.createCollection(
        collectionName,
        S3_BUCKET_URL,
        sourceType,
        { indexWithDefault: true },
      );

      expect(res.collection).to.be.an('object', JSON.stringify(res));
      expect(res.collection.name).to.equal(collectionName);
      expect(res.collection.url).to.equal(S3_BUCKET_URL);
      expect(res.collection.sourceType).to.equal(sourceType);
      // Should have created default indexes as detecting tasks
      expect(res.collection.detectingTasks).to.have.lengthOf.above(0);

      res.collection.detectingTasks.forEach(({ _id }) => indexesToDelete.push(_id));

      collectionsToDelete.push(res.collection._id);
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
      expect(res.collection._id).to.equal(collectionId);
    });

    it('should get an error with incorrect collection ID', async function () {
      const res = await this.api.getCollection(RANDOM_MONGO_ID);

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
    });
  });

  describe('createCollectionIndex', function () {
    it('should create collection index with correct params', async function () {
      const fileTypes = 'images';
      const res = await this.api.createCollectionIndex(
        collectionId,
        EVERYDAY_OBJECT_ID,
        fileTypes
      );

      expect(res.collectionTask).to.be.an('object', JSON.stringify(res));
      expect(res.collectionTask.collectionToProcess).to.equal(collectionId);
      expect(res.collectionTask.network._id).to.equal(EVERYDAY_OBJECT_ID);
      expect(res.collectionTask.fileTypes).to.equal(fileTypes);

      collectionIndexId = res.collectionTask._id;
      indexesToDelete.push(collectionIndexId);
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
      expect(res.collectionTask._id).to.equal(collectionIndexId);
    });

    it('should get an error with invalid collection task ID', async function () {
      const res = await this.api.getCollectionTask(RANDOM_MONGO_ID);

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
    });
  });

  describe('killCollectionIndex', function () {
    it('should kill collection task', async function () {
      const res = await this.api.killCollectionIndex(collectionIndexId);

      expect(res.collectionTask).to.be.an('object', JSON.stringify(res));
      expect(res.collectionTask._id).to.equal(collectionIndexId);
      expect(res.collectionTask.kill).to.equal(true);
    });

    it('should get an error with an invalid collection task ID', async function () {
      const res = await this.api.killCollectionIndex(RANDOM_MONGO_ID);

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
    });
  });

  describe('updateCollectionIndex', function () {
    it('should update collection index', async function () {
      await waitIndexDone(this.api, collectionIndexId);

      const res = await this.api.updateCollectionIndex(collectionIndexId, true);

      expect(res.collectionTask).to.be.an('object', JSON.stringify(res));
      expect(res.collectionTask.retryTime).to.be.a('string');
      
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

    it('should get an error with an invalid collection task ID', async function () {
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

    it('should get an error with an invalid collection ID', async function () {
      const res = await this.api.deleteCollection(RANDOM_MONGO_ID);

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
    });
  });
});