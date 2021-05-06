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
  UPLOAD_PB_FILE,
  UPLOAD_LABEL_FILE,
  DOG_FILE,
  CAT_URL,
} = require('./data');

describe('Detectors', function () {
  this.timeout(10000);

  let detectorId, redoDetectorId, importedDetectorId;
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
    await cleanUpDetector(this.api, importedDetectorId);
  });

  describe('createDetector', function () {
    this.timeout(30000);

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

    it('should get an error if creating another detector when having a pending detector already', async function () {
      const res = await this.api.createDetector(
        DETECTOR_ZIP,
        detectorName,
        'general'
      );

      expect(res.message).to.include('You have a pending detector already');
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

  const feedbackIds = [];

  describe('addFeedbackFromFile', function() {
    it('should add feedback from a local file', async function() {
      const boundingBox = {
        top: .08,
        left: .17,
        height: .89,
        width: .64
      };

      const feedback = [
        {
          label: 'cat',
          feedbackType: 'negative',
          boundingBox,
        },
      ];

      const res = await this.api.addFeedbackFromFile(detectorId, DOG_FILE, feedback);
      expect(res.feedback).to.be.an('array', JSON.stringify(res));

      const feedbackItem = res.feedback[0];
      expect(feedbackItem.id).to.be.an('string', JSON.stringify(res));

      expect(feedbackItem.feedbackType).to.equal('negative', JSON.stringify(res));
      expect(feedbackItem.labelName).to.equal('cat', JSON.stringify(res));

      expect(feedbackItem.boundingBox.top).to.equal(boundingBox.top, JSON.stringify(res));
      expect(feedbackItem.boundingBox.left).to.equal(boundingBox.left, JSON.stringify(res));
      expect(feedbackItem.boundingBox.width).to.equal(boundingBox.width, JSON.stringify(res));
      expect(feedbackItem.boundingBox.height).to.equal(boundingBox.height, JSON.stringify(res));

      feedbackIds.push(feedbackItem.id);
    });
  });

  describe('addFeedbackFromURL', function() {
    it('should add feedback from a local file', async function() {
      const boundingBox = {
        top: .1,
        left: .36,
        height: .84,
        width: .62
      };

      const feedback = [
        {
          label: 'cat',
          feedbackType: 'positive',
          boundingBox,
        },
      ];

      const res = await this.api.addFeedbackFromURL(detectorId, CAT_URL, feedback);
      expect(res.feedback).to.be.an('array', JSON.stringify(res));

      const feedbackItem = res.feedback[0];
      expect(feedbackItem.id).to.be.an('string', JSON.stringify(res));

      expect(feedbackItem.feedbackType).to.equal('positive', JSON.stringify(res));
      expect(feedbackItem.labelName).to.equal('cat', JSON.stringify(res));

      expect(feedbackItem.boundingBox.top).to.equal(boundingBox.top, JSON.stringify(res));
      expect(feedbackItem.boundingBox.left).to.equal(boundingBox.left, JSON.stringify(res));
      expect(feedbackItem.boundingBox.width).to.equal(boundingBox.width, JSON.stringify(res));
      expect(feedbackItem.boundingBox.height).to.equal(boundingBox.height, JSON.stringify(res));

      feedbackIds.push(feedbackItem.id);
    });
  });

  describe('deleteFeedback', function() {
    it('should delete feedback', async function () {
      for (let feedbackId of feedbackIds) {
        const res = await this.api.deleteFeedback(feedbackId);
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

      expect(res.code).to.equal(INVALID_QUERY_ERR, JSON.stringify(res));
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

  describe('importDetector', function () {
    this.timeout(200000);

    it('should import detector when provided with valid params', async function () {
      const detectorName = `upload-node-client-${Date.now()}`;
      const inputTensor = 'input_5[128,128,3]';
      const outputTensor = 'prob3[2]';
      const detectorType = 'facial_recognition';

      const res = await this.api.importDetector(detectorName, {
        fileProto: UPLOAD_PB_FILE,
        fileLabel: UPLOAD_LABEL_FILE,
        inputTensor,
        outputTensor,
        detectorType,
      });

      expect(res.detectorId).to.be.a('string', JSON.stringify(res));
      expect(res.message).to.include(
        'Your model is being uploaded',
        JSON.stringify(res)
      );

      importedDetectorId = res.detectorId;
    });

    it('should throw an error with invalid params', async function () {
      try {
        await this.api.importDetector(detectorName, {
          label: ['cat', 'dog'],
        });
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide info: inputTensor, outputTensor, detectorType',
          JSON.stringify(e)
        );
      }
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
      await cleanUpDetector(importedDetectorId);
    });

    it('should get an error with an invalid detector ID', async function () {
      const res = await this.api.deleteDetector(RANDOM_MONGO_ID);

      expect(res.code).to.equal('not_found', JSON.stringify(res));
    });
  });
});

// helpers

async function waitDetectorTraining(api, detectorId) {
  // wait until detector is trained
  printInfo('waiting for detector training');

  let res = await api.getDetectorInfo(detectorId);
  let indicator = '\x1b[2m      .';
  const maxTries = 40;

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
