const chai = require('chai');
const expect = chai.expect;
const { setUpClient, sleep } = require('./utils');
const { YOUTUBE_VID_URL, EVERYDAY_OBJECT_ID } = require('./data');

describe('Streams', function() {
  this.timeout(10000);

  let monitoringId, streamId;

  before(async function() {
    this.api = setUpClient();
    await this.api.retrieveToken();
  });

  after(async function() {
    if (monitoringId) {
      await this.api.killMonitoring(monitoringId);
      await waitMonitoringStop(this.api, monitoringId);
    }

    if (streamId) {
      await this.api.deleteStream(streamId);
    }
  });

  describe('createStream', async function() {
    it('should create a stream', async function() {
      const streamName = `node-test-stream-${Date.now()}`;
      const res = await this.api.createStream(YOUTUBE_VID_URL, streamName);

      expect(res.stream_id).to.be.a('string', JSON.stringify(res));

      streamId = res.stream_id;
    });

    it('should throw an error if missing params', async function() {
      try {
        await this.api.createStream(YOUTUBE_VID_URL);
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: name',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('searchStreams', function() {
    it('should get stream search result', async function() {
      const res = await this.api.searchStreams({ streamId });

      expect(res).to.be.an('Array', JSON.stringify(res));
      expect(res).to.have.lengthOf(1, JSON.stringify(res));
      expect(res[0].stream_id).to.equal(streamId, JSON.stringify(res));
    });
  });

  describe('monitorStream', function() {
    it('should create a monitoring', async function() {
      const res = await this.api.monitorStream(
        streamId,
        EVERYDAY_OBJECT_ID,
        { cat: 0.5 },
        {
          taskName: 'node-test-task',
          endTime: '5 minutes'
        }
      );

      expect(res.stream_id).to.equal(streamId, JSON.stringify(res));
      expect(res.monitoring_id).to.be.a('string', JSON.stringify(res));

      monitoringId = res.monitoring_id;
    });
  });

  describe('searchMonitorings', function() {
    it('should get monitoring search result', async function() {
      const res = await this.api.searchMonitorings({ monitoringId });

      expect(res).to.be.an('Array', JSON.stringify(res));
      expect(res).to.have.lengthOf(1, JSON.stringify(res));
      expect(res[0].monitoring_id).to.equal(monitoringId, JSON.stringify(res));
    });
  });

  describe('getMonitoringResult', function() {
    it('should get monitoring result', async function() {
      const res = await this.api.getMonitoringResult(monitoringId);

      expect(res).to.be.an('Array', JSON.stringify(res));
    });

    it('should throw an error if missing monitoringId', async function() {
      try {
        await this.api.getMonitoringResult();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: monitoringId',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('killMonitoring', function() {
    it('should stop a monitoring', async function() {
      const res = await this.api.killMonitoring(monitoringId);

      expect(res.message).to.equal(
        'Successfully killed monitoring.',
        JSON.stringify(res)
      );

      await waitMonitoringStop(this.api, monitoringId);
    });

    it('should throw an error is missing monitoringId', async function() {
      try {
        await this.api.killMonitoring();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: monitoringId',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('deleteMonitoring', function() {
    it('should delete monitoring', async function() {
      const res = await this.api.deleteMonitoring(monitoringId);

      expect(res.message).to.equal(
        'Successfully deleted monitoring.',
        JSON.stringify(res)
      );

      monitoringId = null;
    });

    it('should throw an error is missing monitoringId', async function() {
      try {
        await this.api.deleteMonitoring();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));

        expect(e.message).to.equal(
          'Please provide data: monitoringId',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('deleteStream', function() {
    it('should delete stream', async function() {
      const res = await this.api.deleteStream(streamId);

      expect(res.message).to.equal(
        'Successfully deleted stream.',
        JSON.stringify(res)
      );

      streamId = null;
    });

    it('should throw an error is missing streamId', async function() {
      try {
        await this.api.deleteStream();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));

        expect(e.message).to.equal(
          'Please provide data: streamId',
          JSON.stringify(e)
        );
      }
    });
  });
});

// helpers

async function waitMonitoringStop(api, monitoringId) {
  let res = await api.searchMonitorings({ monitoringId });
  let tries = 0;
  const maxTries = 15;

  while (res[0].state !== 'failed') {
    tries++;
    if (tries > maxTries) {
      throw new Error('Timeout when waiting for monitoring to stop');
    }

    res = await api.searchMonitorings({ monitoringId });

    await sleep(2000);
  }
}