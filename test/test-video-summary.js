const chai = require('chai');
const expect = chai.expect;
const { setUpClient, sleep } = require('./utils');
const {
  LOCAL_VID,
  ONE_DAY,
  S3_VID_URL,
  EVERYDAY_OBJECT_ID,
} = require('./data');

describe('Video Summary', function () {
  this.timeout(10000);

  let streamId, urlVideoSummaryId, localVideoSummaryId, streamSummaryId;

  before(async function () {
    this.api = setUpClient();
    await this.api.retrieveToken();

    const streamName = `node-test-stream-no-det-${Date.now()}`;
    const streamRes = await this.api.createStream(S3_VID_URL, streamName);

    streamId = streamRes.streamId;
  });

  after(async function () {
    if (urlVideoSummaryId) {
      await this.api.deleteVideoSummary(urlVideoSummaryId);
    }

    if (localVideoSummaryId) {
      await this.api.deleteVideoSummary(localVideoSummaryId);
    }

    if (streamSummaryId) {
      await this.api.deleteVideoSummary(streamSummaryId);
    }

    if (streamId) {
      await this.api.deleteStream(streamId);
    }
  });

  describe('createVideoSummary', async function () {
    const labels = ['person', 'car'];

    const defaultConfigs = {
      labels,
      detectorId: EVERYDAY_OBJECT_ID,
    };

    const urlVideo = {
      url: S3_VID_URL,
    };

    const fileVideo = {
      file: LOCAL_VID,
    };

    const bothVideo = {
      url: S3_VID_URL,
      file: LOCAL_VID,
    };

    it('should throw an error if missing a detectorId', async function () {
      try {
        await this.api.createVideoSummary(urlVideo, { labels });
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Missing required parameter: detectorId',
          JSON.stringify(e)
        );
      }
    });

    it('should throw an error if missing a video file', async function () {
      try {
        await this.api.createVideoSummary(null, defaultConfigs);
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal('No video provided', JSON.stringify(e));
      }
    });

    it('should throw an error if providing both URL and local file', async function () {
      try {
        await this.api.createVideoSummary(bothVideo, defaultConfigs);
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Can only handle either url or local file classification in a single request',
          JSON.stringify(e)
        );
      }
    });

    it('should create a video summary with provided URL', async function () {
      const res = await this.api.createVideoSummary(urlVideo, defaultConfigs);

      urlVideoSummaryId = res.summary._id;

      expect(res.summary).to.be.an('object', JSON.stringify(res));
    });

    it('should create a video summary with provided local file', async function () {
      const res = await this.api.createVideoSummary(fileVideo, defaultConfigs);

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
      expect(res.progress).to.equal(0, JSON.stringify(res));
      expect(res.state).to.be.oneOf(
        ['requested', 'preparing', 'ready'],
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
    const getConfigs = (overrides = {}) => ({
      ...overrides,
      startTime: new Date(Date.now() - 60 * 2),
      endTime: new Date(Date.now() - 30),
    });

    it('should throw an error if missing a stream ID', async function () {
      try {
        await this.api.createStreamSummary(null, getConfigs());
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: streamId',
          JSON.stringify(e)
        );
      }
    });

    it('should create a stream summary with a detector specified', async function () {
      const res = await this.api.createStreamSummary(
        streamId,
        getConfigs({
          detectorId: EVERYDAY_OBJECT_ID,
          labels: ['person', 'car'],
        })
      );

      streamSummaryId = res.summary._id;

      expect(res.summary).to.be.an('object', JSON.stringify(res));
      expect(res.summary.feed.toString()).to.equal(
        streamId.toString(),
        JSON.stringify(res)
      );
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
      expect(res.summaries[0]._id.toString()).to.equal(
        streamSummaryId.toString(),
        JSON.stringify(res)
      );
    });
  });
});
