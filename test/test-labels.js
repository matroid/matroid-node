const chai = require('chai');
const expect = chai.expect;
const {
  setUpClient,
  waitDetectorReadyForEdit,
  deletePendingDetector,
} = require('./utils');
const {
  CAT_FILE,
  DOG_FILE,
  DETECTOR_ZIP,
  EVERYDAY_OBJECT_ID,
} = require('./data');

describe('Labels', function () {
  // increased timeout for creating detector in before all hook
  this.timeout(30000);

  let detectorId, labelId, imageId;

  before(async function () {
    this.api = setUpClient();
    await this.api.retrieveToken();

    // create a pending detector to test labels API
    await deletePendingDetector(this.api);
    const res = await this.api.createDetector(
      DETECTOR_ZIP,
      `test-label-detector-${Date.now()}`,
      'single_shot_detector'
    );
    detectorId = res.detectorId;
    await waitDetectorReadyForEdit(this.api, detectorId);
  });

  after(async function () {
    // clean up - delete the new detector created by tests
    if (detectorId) {
      await this.api.deleteDetector(detectorId);
    }
  });

  describe('createLabelWithImages', function () {
    it('should create a label', async function () {
      const labelName = 'new-label';
      const res = await this.api.createLabelWithImages(
        detectorId,
        labelName,
        CAT_FILE
      );

      expect(res.labelId).to.be.a('string', JSON.stringify(res));
      expect(res.message).to.equal(
        `successfully uploaded 1 images to label ${res.labelId}`,
        JSON.stringify(res)
      );

      labelId = res.labelId;
    });

    it('should get an error with invalid params', async function () {
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

  describe('getAnnotations', function () {
    it('should get annotations using a labelId', async function () {
      const res = await this.api.getAnnotations({ labelIds: [labelId] });

      expect(res.images).to.be.an('Array', JSON.stringify(res));
      expect(res.images).to.have.lengthOf(1, JSON.stringify(res));

      imageId = res.images[0].id;
    });

    it('should get annotations using a detectorId', async function () {
      const res = await this.api.getAnnotations({ detectorId });

      expect(res.images).to.be.an('Array', JSON.stringify(res));
      // two images from detector zip file and one image from the createLabelWithImages test
      expect(res.images).to.have.lengthOf(3, JSON.stringify(res));
    });

    it('should get annotations using an imageId', async function () {
      const res = await this.api.getAnnotations({ imageId });

      expect(res.images).to.be.an('Array', JSON.stringify(res));
      expect(res.images).to.have.lengthOf(1, JSON.stringify(res));
      expect(res.images[0].id).to.equal(imageId);
    });

    it('should get an error with invalid params', async function () {
      try {
        await this.api.getAnnotations();
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal(
          'Please pass in one of the following IDs: detectorId, labelIds, or imageId',
          JSON.stringify(e)
        );
      }
    });
  });

  describe('getLabelImages', function () {
    it('should get images info of a label', async function () {
      const res = await this.api.getLabelImages(detectorId, labelId);

      expect(res.images).to.be.an('Array', JSON.stringify(res));
      expect(res.images).to.have.lengthOf(1);
    });

    it('should throw an error with invalid params', async function () {
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

  describe('updateAnnotations', function () {
    it('should update annotations', async function () {
      const res = await this.api.updateAnnotations(detectorId, labelId, [
        { id: imageId, bbox: { left: 0.1, top: 0.1, width: 0.2, height: 0.2 } },
      ]);

      expect(res.message).to.equal(
        'successfully updated 1 images',
        JSON.stringify(res)
      );
    });

    it('should throw an error with invalid params', async function () {
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

  describe('updateLabelWithImages', function () {
    it('should upload new image to label', async function () {
      const res = await this.api.updateLabelWithImages(
        detectorId,
        labelId,
        DOG_FILE
      );

      expect(res.labelId).to.equal(labelId, JSON.stringify(res));
      expect(res.message).to.equal(
        `successfully uploaded 1 images to label ${labelId}`,
        JSON.stringify(res)
      );
    });

    it('should throw an error with invalid params', async function () {
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

  // describe('localizeImage', function () {
  //   this.timeout(100000);

  //   it('should take an imageId and a labelId', async function () {
  //     const res = await this.api.localizeImage(detectorId, 'cat', {
  //       update: true,
  //       imageId,
  //       labelId,
  //     });

  //     expect(res.results).to.be.an('Array', JSON.stringify(res));
  //     expect(res.results).to.have.lengthOf(1, JSON.stringify(res));
  //   });

  //   it('should take an array of imageIds and a labelId', async function () {
  //     const res = await this.api.localizeImage(EVERYDAY_OBJECT_ID, 'cat', {
  //       update: true,
  //       imageIds: [imageId, 'invalid-id'],
  //       labelId,
  //     });

  //     expect(res.results).to.be.an('Array', JSON.stringify(res));
  //     expect(res.results).to.have.lengthOf(1, JSON.stringify(res));
  //   });
  // });

  describe('deleteLabel', function () {
    it('should delete a label', async function () {
      const res = await this.api.deleteLabel(detectorId, labelId);

      expect(res.message).to.equal(
        'Successfully deleted the label',
        JSON.stringify(res)
      );
    });

    it('should throw an error if missing params', async function () {
      try {
        await this.api.deleteLabel(detectorId);
      } catch (e) {
        expect(e).to.be.an('Error', JSON.stringify(e));
        expect(e.message).to.equal('Please provide data: labelId');
      }
    });
  });
});
