const chai = require('chai');
const expect = chai.expect;
const { setUpClient, sleep } = require('./utils');
const { S3_VID_URL, S3_VID_URL_2, EVERYDAY_OBJECT_ID } = require('./data');

describe('Streams', function () {
  this.timeout(60000);

  let streamId, streamId2, monitoringId;

  // Append a query to stream URLs to avoid duplicate URL error
  const makeStreamUrl = (baseUrl) => {
    return `${baseUrl}?time=${Date.now()}`;
  };

  before(async function () {
    this.api = setUpClient();
    await this.api.retrieveToken();
  });

  after(async function () {
    if (monitoringId) {
      await this.api.killMonitoring(monitoringId);
      await waitMonitoringStop(this.api, monitoringId);
    }

    if (streamId) {
      await this.api.deleteStream(streamId);
    }

    if (streamId2) {
      await this.api.deleteStream(streamId2);
    }
  });

  describe('createStream', async function () {
    it('should create a stream', async function () {
      const streamName = `node-test-stream-${Date.now()}`;
      const res = await this.api.createStream(
        makeStreamUrl(S3_VID_URL),
        streamName
      );

      expect(res.streamId).to.be.a('string', JSON.stringify(res));

      streamId = res.streamId;
    });

    it('should create a stream using registerStream (deprecated for createStream)', async function () {
      const streamName = `node-test-stream-${Date.now()}`;
      const res = await this.api.registerStream(
        makeStreamUrl(S3_VID_URL_2),
        streamName
      );

      expect(res.streamId).to.be.a('string', JSON.stringify(res));

      streamId2 = res.streamId;
    });

    it('should throw an error if missing params', async function () {
      try {
        await this.api.createStream(makeStreamUrl(S3_VID_URL));
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: name',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('updateStream', function () {
    it('should update stream', async function () {
      const name = 'new name';
      const customFields = [
        { key: 'i am a key', template: 'and i am a template' },
      ];
      const retentionDays = '5';

      const res = await this.api.updateStream(streamId, {
        name,
        customFields,
        retentionDays,
      });

      expect(res.feed.toString()).to.equal(streamId);
      expect(res.name).to.equal(name);
      expect(res.retentionDays.toString()).to.equal(retentionDays);
      expect(res.customFields).to.eql(customFields);
    });
  });

  describe('searchStreams', function () {
    it('should get stream search result', async function () {
      const res = await this.api.searchStreams({ streamId });

      expect(res).to.be.an('Array', JSON.stringify(res));
      expect(res).to.have.lengthOf(1, JSON.stringify(res));
      expect(res[0].streamId).to.equal(streamId, JSON.stringify(res));
    });
  });

  describe('monitorStream', function () {
    it('should create a monitoring', async function () {
      let minDetectionInterval = 90;
      const res = await this.api.monitorStream(streamId, EVERYDAY_OBJECT_ID, {
        thresholds: { cat: 0.5, car: 0.1 },
        taskName: 'node-test-task',
        endTime: '5 minutes',
        minDetectionInterval: minDetectionInterval,
      });

      expect(res.streamId).to.equal(streamId, JSON.stringify(res));
      expect(res.monitoringId).to.be.a('string', JSON.stringify(res));
      expect(res.minDetectionInterval).to.equal(
        minDetectionInterval,
        JSON.stringify(res)
      );
      monitoringId = res.monitoringId;
    });
  });

  describe('searchMonitorings', function () {
    it('should get monitoring search result', async function () {
      const res = await this.api.searchMonitorings({ monitoringId });
      expect(res).to.be.an('Array', JSON.stringify(res));
      expect(res).to.have.lengthOf(1, JSON.stringify(res));
      expect(res[0].monitoringId).to.equal(monitoringId, JSON.stringify(res));
    });
  });

  describe('getMonitoringResult', function () {
    it('should get monitoring result', async function () {
      const res = await this.api.getMonitoringResult(monitoringId);

      expect(res).to.be.an('Array', JSON.stringify(res));
    });
    it('should get monitoring result between two dates', async function () {
      const config = {
        startTime: '2022-05-01 00:00:00',
        endTime: '2022-06-01 00:00:00',
      };
      const res = await this.api.getMonitoringResult(monitoringId, config);
      expect(res).to.be.an('Array', JSON.stringify(res));
    });
    it('should throw an error if missing monitoringId', async function () {
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

  describe('watchMonitoringResult', function () {
    after(function () {
      if (this.watch) {
        this.watch.close();
      }
    });
    it('should watch monitoring result', async function () {
      await new Promise((resolve, reject) => {
        this.watch = this.api.watchMonitoringResult(monitoringId);
        this.watch.addListener((msg) => {
          expect(msg.monitoringId).to.equal(monitoringId);
          expect(msg.detections).to.have.lengthOf.at.least(1);
          resolve(msg);
          this.watch.close();
        });
      });
    });
  });

  describe('updateMonitoring', function () {
    it('should update a monitoring', async function () {
      let name = 'oh wow new name!!!!!!';
      let colors = { color: '#dce775', darkColor: '#9e9d24' };
      let regionEnabled = true;
      let regionCoords = [
        '0.2500,0.2500',
        '0.7500,0.2500',
        '0.7500,0.7500',
        '0.2500,0.7500',
      ];
      let minDetectionInterval = 50;
      let thresholds = { cat: 0.7 };
      const configs = {
        thresholds,
        name,
        regionCoords: regionCoords,
        colors,
        minDetectionInterval,
      };
      const res = await this.api.updateMonitoring(monitoringId, configs);
      expect(res.name).to.equal(name);
      expect(res.detection.minDetectionInterval).to.equal(minDetectionInterval);
      expect(res.detection.thresholds).to.eql([
        '1',
        '1',
        '1',
        '1',
        '1',
        '1',
        '1',
        '0.7',
        '1',
        '1',
        '1',
        '1',
        '1',
        '1',
        '1',
        '1',
        '1',
        '1',
        '1',
        '1',
      ]);
      expect(res.region.enabled).to.equal(regionEnabled);
      expect(res.region.focusAreas[0].coords).to.eql([regionCoords]);
    });
  });

  describe('killMonitoring', function () {
    this.timeout(50000);

    it('should stop a monitoring', async function () {
      const res = await this.api.killMonitoring(monitoringId);

      expect(res.message).to.equal(
        'Successfully killed monitoring.',
        JSON.stringify(res)
      );

      await waitMonitoringStop(this.api, monitoringId);
    });

    it('should throw an error is missing monitoringId', async function () {
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

  describe('deleteMonitoring', function () {
    it('should delete monitoring', async function () {
      const res = await this.api.deleteMonitoring(monitoringId);

      expect(res.message).to.equal(
        'Successfully deleted monitoring.',
        JSON.stringify(res)
      );

      monitoringId = null;
    });

    it('should throw an error is missing monitoringId', async function () {
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

  describe('deleteStream', function () {
    it('should delete stream', async function () {
      const res = await this.api.deleteStream(streamId);

      expect(res.message).to.equal(
        'Successfully deleted stream.',
        JSON.stringify(res)
      );

      streamId = null;
    });

    it('should throw an error is missing streamId', async function () {
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
