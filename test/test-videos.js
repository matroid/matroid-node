const chai = require('chai');
const expect = chai.expect;
const { setUpClient, waitVideoDoneClassifying } = require('./utils');
const { EVERYDAY_OBJECT_ID, S3_VID_URL } = require('./data');

describe('Videos', function () {
  this.timeout(100000);

  let videoId;

  before(async function () {
    this.api = setUpClient();
    await this.api.retrieveToken();
  });

  after(async function () {
    await waitVideoDoneClassifying(this.api, videoId);
  });

  describe('classifyVideo', async function () {
    it('should start classifying a video', async function () {
      const res = await this.api.classifyVideo(EVERYDAY_OBJECT_ID, {
        url: S3_VID_URL,
      });

      expect(res.videoId).to.be.a('string', JSON.stringify(res));

      videoId = res.videoId;
    });

    it('should throw an error if missing video', async function () {
      try {
        await this.api.classifyVideo(EVERYDAY_OBJECT_ID);
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: video',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('getVideoResults', async function () {
    it('should get video classification results', async function () {
      const res = await this.api.getVideoResults(videoId, null, null, {
        annotations: true,
      });

      expect(res).to.have.property('classificationProgress');
      expect(res).to.have.property('detections');
    });

    it('should throw an error if missing videoId', async function () {
      try {
        await this.api.getVideoResults();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: videoId',
          JSON.stringify(e)
        );
      }
    });
  });
});
