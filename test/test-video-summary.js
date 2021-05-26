const chai = require('chai');
const expect = chai.expect;
const { setUpClient, sleep } = require('./utils');
const { S3_VID_URL, S3_VID_URL_2, EVERYDAY_OBJECT_ID, LOCAL_VID } = require('./data');

describe('Video Summary', function () {
  this.timeout(10000);

  let streamId, summaryId;

  before(async function () {
    this.api = setUpClient();
    await this.api.retrieveToken();
  });

  after(async function () {
    if (streamId) {
      await this.api.deleteStream(streamId);
    }
  });

  describe('createVideoSummary', async function () {
    it('should throw an error if missing a video file', async function () {
      try {
        await this.api.createVideoSummary();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'No video provided',
          JSON.stringify(e)
        );
      }
    });

    it('should throw an error if providing both URL and local file', async function () {
      try {
        await this.api.createVideoSummary({
          url: S3_VID_URL,
          file: LOCAL_VID, 
        });
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Can only handle either url or local file classification in a single request',
          JSON.stringify(e)
        );
      }
    });

    it('should create a video summary with provided URL', async function () {
      const res = await this.api.createVideoSummary({
        url: S3_VID_URL
      });

      expect(res.summary).to.be.an('object', JSON.stringify(res));

      summaryId = res.summary.id;
    });

    it('should create a video summary with provided local file', async function () {
      const res = await this.api.createVideoSummary({
        file: LOCAL_VID
      });

      expect(res.summary).to.be.an('object', JSON.stringify(res));
    });
  });

  describe('getVideoSummary', function () {
    it('should throw an error if missing a summary ID', async function () {
      try {
        await this.api.getVideoSummary();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: summaryId',
          JSON.stringify(e)
        );
      }
    });

    it('should fetch a video summary', async function () {
      const res = await this.api.getVideoSummary(summaryId);

      expect(res).to.be.an('object', JSON.stringify(res));
      expect(res.progress).to.be.a('number', JSON.stringify(res))
      expect(res.trackUrl).to.equal(
        `s3://${process.env.S3_BUCKET}/summaries/${summaryId}/tracks.csv`,
        JSON.stringify(res)
      );
      expect(res.videoUrl).to.equal(
        `s3://${process.env.S3_BUCKET}/summaries/${summaryId}/video.mp4`,
        JSON.stringify(res)
      );
    });
  });

  describe('getVideoSummaryTracks', function () {
    it('should throw an error if missing a summary ID', async function () {
      try {
        await this.api.getVideoSummaryTracks();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: summaryId',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('getVideoSummaryFile', function () {
    it('should throw an error if missing a summary ID', async function () {
      try {
        await this.api.getVideoSummaryFile();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: summaryId',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('createStreamSummary', function () {
    it('should throw an error if missing a stream ID', async function () {
      try {
        await this.api.createStreamSummary();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: streamId',
          JSON.stringify(e)
        );
      }
    });

    it('should throw an error if start time is invalid', async function () {
      const streamName = `node-test-stream-${Date.now()}`;
      const res = await this.api.createStream(S3_VID_URL, streamName);

      streamId = res.streamId;

      try {
        await this.api.createStreamSummary(streamId, {});
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Can only handle either url or local file classification in a single request',
          JSON.stringify(e)
        );
      }
    });
  });
});
