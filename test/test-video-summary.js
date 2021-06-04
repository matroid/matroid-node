const chai = require('chai');
const expect = chai.expect;
const { setUpClient, sleep } = require('./utils');
const {
  LOCAL_VID,
  ONE_DAY,
  S3_VID_URL,
} = require('./data');

describe('Video Summary', function () {
  this.timeout(10000);

  let streamId, urlVideoSummaryId, localVideoSummaryId, streamSummaryId;

  before(async function () {
    this.api = setUpClient();
    await this.api.retrieveToken();
  });

  after(async function () {
    if (streamId) {
      await this.api.deleteStream(streamId);
    }

    if (urlVideoSummaryId) {
      await this.api.deleteVideoSummary(urlVideoSummaryId);
    }

    if (localVideoSummaryId) {
      await this.api.deleteVideoSummary(localVideoSummaryId);
    }

    if (streamSummaryId) {
      await this.api.deleteVideoSummary(streamSummaryId);
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

      urlVideoSummaryId = res.summary._id;
      
      expect(res.summary).to.be.an('object', JSON.stringify(res));
    });

    it('should create a video summary with provided local file', async function () {
      const res = await this.api.createVideoSummary({
        file: LOCAL_VID
      });

      localVideoSummaryId = res.summary._id;
      
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
      const res = await this.api.getVideoSummary(urlVideoSummaryId);

      expect(res).to.be.an('object', JSON.stringify(res));
      expect(res.progress).to.equal(0, JSON.stringify(res))
      expect(res.state).to.equal('requested', JSON.stringify(res));
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

  describe('deleteVideoSummary', function () {
    it('should throw an error if missing a summary ID', async function () {
      try {
        await this.api.deleteVideoSummary();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: summaryId',
          JSON.stringify(e)
        );
      }
    });

    it('should delete a VideoSummaryTask for the provided summary ID', async function () {
      const res = await this.api.deleteVideoSummary(urlVideoSummaryId);
      expect(res.summaryId).to.equal(urlVideoSummaryId, JSON.stringify(res));
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

    it('should create a stream summary with valid inputs', async function () {
      const streamName = `node-test-stream-${Date.now()}`;
      const streamRes = await this.api.createStream(S3_VID_URL, streamName);

      streamId = streamRes.streamId;

      const res = await this.api.createStreamSummary(streamId, {
        startTime: new Date(Date.now() - ONE_DAY * 2),
        endTime: new Date(Date.now() - ONE_DAY)
      });

      streamSummaryId = res.summary._id;

      expect(res.summary).to.be.an('object', JSON.stringify(res));
      expect(res.summary.feed.toString()).to.equal(streamId.toString(), JSON.stringify(res));
    });
  });

  describe('getStreamSummaries', function () {
    it('should throw an error if missing a stream ID', async function () {
      try {
        await this.api.getStreamSummaries();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: streamId',
          JSON.stringify(e)
        );
      }
    });

    it('should get summaries associated with provided stream', async function () {
      const res = await this.api.getStreamSummaries(streamId);

      expect(res.summaries).to.be.an('array', JSON.stringify(res));
      expect(res.summaries.length).to.equal(1, JSON.stringify(res));
      expect(res.summaries[0]._id.toString()).to.equal(streamSummaryId.toString(), JSON.stringify(res));
    });
  });
});
