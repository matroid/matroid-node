const chai = require('chai');
const expect = chai.expect;
const {
  setUpClient,
  waitDetectorReadyForEdit,
  deletePendingDetector
} = require('./utils');
const {
  CAT_FILE,
  DOG_FILE,
  DETECTOR_ZIP,
  EVERYDAY_OBJECT_ID
} = require('./data');

describe('Labels', function() {
  this.timeout(10000);

  let detectorId, labelId, imageId;

  before(async function() {
    this.api = setUpClient();
    await this.api.retrieveToken();

    await deletePendingDetector(this.api);
    const res = await this.api.createDetector(
      DETECTOR_ZIP,
      `test-label-detector-${Date.now()}`,
      'general'
    );

    detectorId = res.detector_id;

    await waitDetectorReadyForEdit(this.api, detectorId);
  });

  after(async function() {
    if (detectorId) {
      await this.api.deleteDetector(detectorId);
    }
  });

  describe('createLabelWithImages', function() {
    it('should create a label', async function() {
      const labelName = 'new-label';
      const res = await this.api.createLabelWithImages(
        detectorId,
        labelName,
        CAT_FILE
      );

      expect(res.label_id).to.be.a('string', JSON.stringify(res));
      expect(res.message).to.equal(
        `successfully uploaded 1 images to label ${res.label_id}`,
        JSON.stringify(res)
      );

      labelId = res.label_id;
    });

    it('should get an error with invalid params', async function() {
      try {
        await this.api.createLabelWithImages(detectorId);
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: name, imageFiles',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('getAnnotations', function() {
    it('should get annotations', async function() {
      const res = await this.api.getAnnotations({ labelIds: [labelId] });

      expect(res.images).to.be.an('Array', JSON.stringify(res));
      expect(res.images).to.have.lengthOf(1, JSON.stringify(res));
    });

    it('should get an error with invliad params', async function() {
      try {
        await this.api.getAnnotations();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please pass in one of the ids: detectorId, labelIds, or imageId',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('getLabelImages', function() {
    it('should get images info of a label', async function() {
      const res = await this.api.getLabelImages(detectorId, labelId);

      expect(res.images).to.be.an('Array', JSON.stringify(res));
      expect(res.images).to.have.lengthOf(1);

      imageId = res.images[0]['image_id'];
    });

    it('should throw an error with invalid params', async function() {
      try {
        await this.api.getLabelImages(detectorId);
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: labelId',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('UpdateAnnotations', function() {
    it('should update annotations', async function() {
      const res = await this.api.updateAnnotations(detectorId, labelId, [
        { id: imageId, bbox: { left: 0.1, top: 0.1, width: 0.2, height: 0.2 } }
      ]);

      expect(res.message).to.equal(
        'successfully updated 1 images',
        JSON.stringify(res)
      );
    });

    it('should throw an error with invalid params', async function() {
      try {
        await this.api.updateAnnotations(detectorId, labelId);
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: images',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('updateLabelWithImages', function() {
    it('should upload new image to label', async function() {
      const res = await this.api.updateLabelWithImages(
        detectorId,
        labelId,
        DOG_FILE
      );

      expect(res.label_id).to.equal(labelId, JSON.stringify(res));
      expect(res.message).to.equal(
        `successfully uploaded 1 images to label ${labelId}`,
        JSON.stringify(res)
      );
    });

    it('should throw an error with invalid params', async function() {
      try {
        await this.api.updateLabelWithImages(detectorId);
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please provide data: labelId, imageFiles',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('localizeImage', function() {
    it('should take an imageId and a labelId', async function() {
      const res = await this.api.localizeImage(EVERYDAY_OBJECT_ID, 'cat', {
        update: true,
        imageId,
        labelId
      });

      expect(res.results).to.be.an('Array', JSON.stringify(res));
      expect(res.results).to.have.lengthOf(1, JSON.stringify(res));
    });
  });

  describe('deleteLabel', function() {
    it('should delete a label', async function() {
      const res = await this.api.deleteLabel(detectorId, labelId);

      expect(res.message).to.equal(
        'Successfully deleted the label',
        JSON.stringify(res)
      );
    });

    it('should throw an error if missing params', async function() {
      try {
        await this.api.deleteLabel(detectorId);
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal('Please provide data: labelId');
      }
    });
  });
});
