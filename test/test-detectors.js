const chai = require('chai');
const expect = chai.expect;
const {
  setUpClient,
  sleep,
  printInfo,
  waitDetectorReadyForEdit,
  deletePendingDetector,
} = require('./utils');
const {
  DETECTOR_ZIP,
  RANDOM_MONGO_ID,
  INVALID_QUERY_ERR,
  EVERYDAY_OBJECT_ID,
  DOG_FILE,
  CAT_URL,
  COCO_ZIP,
} = require('./data');

const TIME_CREATE_MS = 300000;

describe('Detectors', function () {
  this.timeout(10000);

  let detectorId, redoDetectorId;
  const detectorName = `node-detector-${Date.now()}`;

  before(async function () {
    this.api = setUpClient();
    await this.api.retrieveToken();
    await deletePendingDetector(this.api);
  });

  after(async function () {
    // clean up - make sure all new detectors created by tests are deleted
    await cleanUpDetector(this.api, detectorId);
    await cleanUpDetector(this.api, redoDetectorId);
  });

  describe('createDetector', function () {
    this.timeout(TIME_CREATE_MS);

    it('should create detector', async function () {
      const res = await this.api.createDetector(
        DETECTOR_ZIP,
        detectorName,
        'general'
      );
      expect(res.detectorId).to.be.a('string', JSON.stringify(res));
      detectorId = res.detectorId;
      // wait until detector can be edited
      await waitDetectorReadyForEdit(this.api, detectorId);
    });
    it('should create a new studio detector', async function () {
      const res = await this.api.createDetector(
        COCO_ZIP,
        detectorName,
        'general',
        { useNewStudio: 'true' }
      );
      expect(res.detectorId).to.be.a('string', JSON.stringify(res));
      // wait until detector can be edited
      await waitDetectorReadyForEdit(this.api, detectorId);
    });
  });

  describe('trainDetector', function () {
    this.timeout(300000);

    it('should start detector training', async function () {
      const res = await this.api.trainDetector(detectorId);

      expect(res.detectorId).to.equal(detectorId, JSON.stringify(res));
      expect(res.message).to.equal('training began successfully');

      await waitDetectorTraining(this.api, detectorId);
    });

    it('should get an error with an invalid detector ID', async function () {
      const res = await this.api.trainDetector(RANDOM_MONGO_ID);

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
    });
  });

  describe('getDetectorInfo', function () {
    it('should get detector info', async function () {
      const res = await this.api.getDetectorInfo(detectorId);

      expect(res.id).to.equal(detectorId, JSON.stringify(res));
    });

    it('should get detector info using detectorInfo (deprecated for getDetectorInfo)', async function () {
      const res = await this.api.detectorInfo(detectorId);

      expect(res.id).to.equal(detectorId, JSON.stringify(res));
    });

    it('should get an error with an invalid detector ID', async function () {
      const res = await this.api.getDetectorInfo(RANDOM_MONGO_ID);

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
    });
  });

  function checkFeedback(expectedFeedback, feedbackItem) {
    expect(feedbackItem.id || feedbackItem._id).to.be.a(
      'string',
      JSON.stringify(feedbackItem)
    );

    expect(feedbackItem.feedbackType).to.equal(
      expectedFeedback.feedbackType,
      JSON.stringify(feedbackItem)
    );
    expect(feedbackItem.label).to.equal(
      expectedFeedback.label,
      JSON.stringify(feedbackItem)
    );

    expect(feedbackItem.boundingBox.top).to.equal(
      expectedFeedback.boundingBox.top,
      JSON.stringify(feedbackItem)
    );
    expect(feedbackItem.boundingBox.left).to.equal(
      expectedFeedback.boundingBox.left,
      JSON.stringify(feedbackItem)
    );
    expect(feedbackItem.boundingBox.width).to.equal(
      expectedFeedback.boundingBox.width,
      JSON.stringify(feedbackItem)
    );
    expect(feedbackItem.boundingBox.height).to.equal(
      expectedFeedback.boundingBox.height,
      JSON.stringify(feedbackItem)
    );
  }

  const boundingBox1 = {
    top: 0.08,
    left: 0.17,
    height: 0.89,
    width: 0.64,
  };

  const boundingBox2 = {
    top: 0.1,
    left: 0.36,
    height: 0.84,
    width: 0.62,
  };

  const feedbackIds = [];

  describe('addFeedback', function () {
    it('should add feedback from a local file', async function () {
      const feedback = {
        label: 'cat',
        feedbackType: 'negative',
        boundingBox: boundingBox1,
      };

      const image = { file: DOG_FILE };

      const res = await this.api.addFeedback(detectorId, image, feedback);
      expect(res.feedback).to.be.an('array', JSON.stringify(res));
      expect(res.feedback).to.have.lengthOf(1, JSON.stringify(res));

      const feedbackItem = res.feedback[0];
      checkFeedback(feedback, feedbackItem);

      feedbackIds.push(feedbackItem.id || feedbackItem._id);
    });

    it('should add multiple feedbacks from a local file', async function () {
      const feedback1 = {
        label: 'cat',
        feedbackType: 'negative',
        boundingBox: boundingBox1,
      };

      const feedback2 = {
        label: 'cat',
        feedbackType: 'positive',
        boundingBox: boundingBox2,
      };

      const feedback = [feedback1, feedback2];

      const image = { file: DOG_FILE };

      const res = await this.api.addFeedback(detectorId, image, feedback);
      expect(res.feedback).to.be.an('array', JSON.stringify(res));
      expect(res.feedback).to.have.lengthOf(2, JSON.stringify(res));

      const feedbackItem = res.feedback[0];
      checkFeedback(feedback1, feedbackItem);
      feedbackIds.push(feedbackItem.id || feedbackItem._id);

      const feedbackItem2 = res.feedback[1];
      checkFeedback(feedback2, feedbackItem2);
      feedbackIds.push(feedbackItem2.id || feedbackItem2._id);
    });

    it('should add feedback from a URL', async function () {
      const feedback = {
        label: 'cat',
        feedbackType: 'positive',
        boundingBox: boundingBox2,
      };

      const image = { url: CAT_URL };

      const res = await this.api.addFeedback(detectorId, image, feedback);
      expect(res.feedback).to.be.an('array', JSON.stringify(res));
      expect(res.feedback).to.have.lengthOf(1, JSON.stringify(res));

      const feedbackItem = res.feedback[0];
      checkFeedback(feedback, feedbackItem);

      feedbackIds.push(feedbackItem.id || feedbackItem._id);
    });

    it('should add multiple feedback from a URL', async function () {
      const feedback1 = {
        label: 'cat',
        feedbackType: 'positive',
        boundingBox: boundingBox2,
      };

      const feedback2 = {
        label: 'cat',
        feedbackType: 'negative',
        boundingBox: boundingBox2,
      };

      const feedback = [feedback1, feedback2];

      const image = { url: CAT_URL };

      const res = await this.api.addFeedback(detectorId, image, feedback);
      expect(res.feedback).to.be.an('array', JSON.stringify(res));
      expect(res.feedback).to.have.lengthOf(2, JSON.stringify(res));

      const feedbackItem = res.feedback[0];
      checkFeedback(feedback1, feedbackItem);
      feedbackIds.push(feedbackItem.id || feedbackItem._id);

      const feedbackItem2 = res.feedback[1];
      checkFeedback(feedback2, feedbackItem2);
      feedbackIds.push(feedbackItem2.id || feedbackItem2._id);
    });
  });

  describe('deleteFeedback', function () {
    it('should delete feedback', async function () {
      for (let feedbackId of feedbackIds) {
        const res = await this.api.deleteFeedback(feedbackId, detectorId);
        expect(res.feedbackId).to.be.a('string', JSON.stringify(res));
        expect(res.feedbackId).to.equal(feedbackId, JSON.stringify(res));
      }
    });
  });

  describe('redoDetector', function () {
    it('should create a copy of an existing detector', async function () {
      const res = await this.api.redoDetector(detectorId);

      expect(res.detectorId).to.be.a('string', JSON.stringify(res));

      redoDetectorId = res.detectorId;
    });

    it('should get an error with an invalid detectorId', async function () {
      const res = await this.api.redoDetector(RANDOM_MONGO_ID);

      expect(res.message).to.equal(
        `Could not find subject with id ${RANDOM_MONGO_ID}`
      );
    });
  });

  describe('searchDetectors', function () {
    it('should get detector search result when no param provided', async function () {
      const res = await this.api.searchDetectors();

      expect(res).to.be.an('array', JSON.stringify(res));
    });

    it('should get detector search result based on params', async function () {
      let res = await this.api.searchDetectors({ limit: 5, published: true });
      expect(res).to.be.an('array', JSON.stringify(res));
      expect(res).to.have.lengthOf(5, JSON.stringify(res));

      res = await this.api.searchDetectors({
        id: EVERYDAY_OBJECT_ID,
        published: true,
      });
      expect(res).to.be.an('array', JSON.stringify(res));
      expect(res).to.have.lengthOf(1, JSON.stringify(res));
    });
  });

  describe('listDetectors (deprecated for searchDetectors)', function () {
    it('should list all detectors', async function () {
      const res = await this.api.listDetectors();

      expect(res).to.be.an('array', JSON.stringify(res));
      expect(res).to.have.lengthOf.above(0, JSON.stringify(res));
    });
  });

  describe('deleteDetector', function () {
    it('should delete detector', async function () {
      const res = await cleanUpDetector(this.api, detectorId);

      expect(res.message).to.equal('Deleted detector.', JSON.stringify(res));

      await cleanUpDetector(redoDetectorId);
    });

    it('should get an error with an invalid detector ID', async function () {
      const res = await this.api.deleteDetector(RANDOM_MONGO_ID);

      expect(res.code).to.equal('invalid_query_err', JSON.stringify(res));
    });
  });
});

// helpers

async function waitDetectorTraining(api, detectorId) {
  // wait until detector is trained
  printInfo(`waiting for detector training ${detectorId}`);

  let res = await api.getDetectorInfo(detectorId);
  let indicator = '\x1b[2m      .';
  const maxTries = 60;

  while (res.state !== 'trained') {
    console.log(indicator);
    indicator += '.';

    if (indicator.length > maxTries) {
      throw new Error('Timeout when waiting for detector training');
    } else if (res.state === 'failed') {
      throw new Error('Detector training failed');
    }

    await sleep(5000);
    res = await api.getDetectorInfo(detectorId);
  }

  printInfo('detector is ready.');
}

async function cleanUpDetector(api, detectorId) {
  // delete detector if Id exists
  let res;

  if (detectorId) {
    res = await api.deleteDetector(detectorId);
  }

  return res;
}
