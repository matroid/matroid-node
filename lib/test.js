const Matroid = require('./matroid');

const EVERYDAY_OBJECT_ID = '598e23679fd1a805a5c09275';
const CAT_URL = 'https://r.hswstatic.com/w_907/gif/tesla-cat.jpg';
const DOG_URL =
  'https://www.petmd.com/sites/default/files/Acute-Dog-Diarrhea-47066074.jpg';
const CAT_FILE = '/Users/Matroid/Desktop/testimage/cat.png';
const DOG_FILE = '/Users/Matroid/Desktop/testimage/dog.png';
const ZIP_FILE =
  '/Users/Matroid/Desktop/sxd/files/pyclient/cat-dog-lacroix.zip';

const matroidFile =
  '/Users/Matroid/Desktop/sxd/files/upload_models_test/Test-cat-vs-dog.matroid';
const cocoFile =
  '/Users/Matroid/Desktop/sxd/files/upload_models_test/v2_coco/frozen_inference_graph.pb';
const cocoLabel =
  '/Users/Matroid/Desktop/sxd/files/upload_models_test/v2_coco/labels_coco.txt';
const cocoInd =
  '/Users/Matroid/Desktop/sxd/files/upload_models_test/v2_coco/labels_coco_ind.txt';
const genderFile =
  '/Users/Matroid/Desktop/sxd/files/upload_models_test/gender_only/gender_only_all_android.pb';
const genderLabel =
  '/Users/Matroid/Desktop/sxd/files/upload_models_test/gender_only/labels_gender.txt';

const youtubeUrl = 'https://www.youtube.com/watch?v=Q4a9j2eZ9bA';
const localVideo = '/Users/Matroid/Desktop/testimage/jamie-chua.mp4';

const test = async () => {
  console.log('Testing starts -----------------');

  let api = new Matroid({
    baseUrl: 'https://staging.dev.matroid.com/api/v1',
    clientId: 'yCzyYu2U1v3qPqAC',
    clientSecret: 'NmBuz5lvnBW9Y9pbyGSAvfxEibMHxOOA'
  });
  api = new Matroid({
    baseUrl: 'http://xiaoyun.devaz.matroid.com/api/v1',
    clientId: 'yCzyYu2U1v3qPqAC',
    clientSecret: 'NmBuz5lvnBW9Y9pbyGSAvfxEibMHxOOA'
  });

  try {
    await api.retrieveToken();
    let res;
    // accounts:
    const account = await api.getAccountInfo();
    // console.log(account);

    api //collections:
      // .createCollectionIndex(
      //   '5d02e68208f0022edd108e8b',
      //   EVERYDAY_OBJECT_ID,
      //   'images'
      // )
      // .createCollection('collection-node', 's3://bucket/m-test-public/', 's3')
      // .deleteCollectionIndex('5d02f0b85442ff117472b259')
      // .deleteCollection('5d03e24d98481c6d482da767')
      // .getCollectionTask('5d02f0b85442ff117472b259')
      // .getCollection('5d02e68208f0022edd108e8b')
      // .killCollectionIndex('5d02f0b85442ff117472b259')
      // .queryCollectionByScores('5ce85d07e15449000de15f7a', { cat: 0.5 }, 2)
      // .queryCollectionByImage('5ce85d07e15449000de15f7a', 'collection', 1, {
      //   url: CAT_URL
      // })
      // .queryCollectionByImage(
      //   '5ce85d07e15449000de15f7a',
      //   'collection',
      //   1,
      //   {
      //     file: CAT_FILE
      //   },
      //   { boundingBox: { top: 0.8, left: 0.8, height: 0.1, width: 0.1 } }
      // )
      // .updateCollectionIndex('5d02e78708f0022edd108f3c')

      // detectors
      // .createDetector(ZIP_FILE, 'node-client-test', 'general')
      // .deleteDetector('5d040e5ecebe92eec274e9da')
      .searchDetectors({ id: '598e23679fd1a805a5c09275' })
      // .searchDetectors({ limit: 2 })
      // .searchDetectors({ state: 'pending' })
      // .detectorInfo('5d07dd21ff4f9677056b71a3')
      // .trainDetector('5d040e5ecebe92eec274e9da')
      // .importDetector('upload-from-node', {
      //   fileDetector: matroidFile
      // })
      // .importDetector('upload-node-coco', {
      //   fileProto: cocoFile,
      //   fileLabel: cocoLabel,
      //   fileLabelInd: cocoInd,
      //   inputTensor: 'ToFloat_3[100,100,3]',
      //   outputTensor:
      //     'detection_boxes[100,4],detection_classes[100],detection_scores[100]',
      //   detectorType: 'object_localization'
      // })
      // .importDetector('upload-node-gender', {
      //   fileProto: genderFile,
      //   labels: ['female', 'male'],
      //   inputTensor: 'input_5[128,128,3]',
      //   outputTensor: 'prob3[2]',
      //   detectorType: 'facial_recognition'
      // })
      // .redoDetector(EVERYDAY_OBJECT_ID)

      // images
      // .classifyImage()
      // .localizeImage(EVERYDAY_OBJECT_ID, 'cat', { file: CAT_FILE })
      // .localizeImage(EVERYDAY_OBJECT_ID, 'dog', {
      //   update: true,
      //   labelId: '5d07feeff6e3fe0a5745922e',
      //   imageIds: ['5d07fef2f6e3fe0a57459231', '5d07ffd00fbb85f0705e740c']
      // })

      // labels
      // .createLabelWithImages('5d08059d0fbb85f0705e7867', 'node-label', CAT_FILE)
      // .createLabelWithImages(
      //   '5d08059d0fbb85f0705e7867',
      //   'node-label',
      //   CAT_FILE,
      //   { bboxes: [{ left: 0.1, top: 0.1, width: 0.5, height: 0.5 }] }
      // )
      // .createLabelWithImages(
      //   '5d08059d0fbb85f0705e7867',
      //   'node-label',
      //   [CAT_FILE, DOG_FILE],
      //   {
      //     bboxes: [
      //       { left: 0.1, top: 0.1, width: 0.5, height: 0.5 },
      //       { left: 0.1, top: 0.1, width: 0.5, height: 0.5 }
      //     ]
      //   }
      // )
      // .deleteLabel('5d08059d0fbb85f0705e7867', '5d08152b1d477d80c4cc0d7c')
      // .getAnnotations({ detectorId: '5d08059d0fbb85f0705e7867' })
      // .getAnnotations({ imageId: '5d0814641d477d80c4cc0d09' })
      // .getAnnotations({
      //   labelIds: ['5d08059f97b686d4aaf6af75', '5d08059f97b686d4aaf6af76']
      // })
      // .getLabelImages('5d08059d0fbb85f0705e7867', '5d0814641d477d80c4cc0d07')
      // .updateAnnotations(
      //   '5d08059d0fbb85f0705e7867',
      //   '5d0814641d477d80c4cc0d07',
      //   [
      //     {
      //       id: '5d08281ca21bf0f0a1272806',
      //       bbox: { left: 0.1, top: 0.1, width: 0.2, height: 0.2 }
      //     }
      //   ]
      // )
      // .updateAnnotations(
      //   '5d08059d0fbb85f0705e7867',
      //   '5d0814641d477d80c4cc0d07',
      //   [
      //     {
      //       id: '5d08281ca21bf0f0a1272806',
      //       bbox: { left: 0.1, top: 0.1, width: 0.2, height: 0.2 }
      //     },
      //     {
      //       id: '5d08281ca21bf0f0a1272807',
      //       bbox: { left: 0.1, top: 0.1, width: 0.2, height: 0.2 }
      //     }
      //   ]
      // )
      // .updateLabelWithImages(
      //   '5d08059d0fbb85f0705e7867',
      //   '5d0814641d477d80c4cc0d07',
      //   CAT_FILE
      // )
      // .updateLabelWithImages(
      //   '5d08059d0fbb85f0705e7867',
      //   '5d0814641d477d80c4cc0d07',
      //   CAT_FILE,
      //   { bboxes: [{ left: 0.1, top: 0.1, width: 0.2, height: 0.2 }] }
      // )

      // stream
      // .createStream(youtubeUrl, 'node-youtube')
      // .monitorStream(
      //   '5d0922a8a17828e0cf57793b',
      //   EVERYDAY_OBJECT_ID,
      //   { cat: 0.5 },
      //   {
      //     taskName: 'node-task',
      //     endTime: '5 minutes'
      //   }
      // )
      // .killMonitoring('5d092b0aee4fcdf40d253687')
      // .searchMonitorings({
      //   streamId: '5d0922a8a17828e0cf57793b'
      // })
      // .getMonitoringResult('5ce85d07e15449000de15f75', {
      //   format: 'csv',
      //   statusOnly: true
      // })
      // .searchStreams({ streamId: '5953032d72dc5c8708fbfeac' })
      // .deleteMonitoring('5d092b0aee4fcdf40d253687')
      // .deleteStream('5d0922a8a17828e0cf57793b')

      // videos
      // .classifyVideo(EVERYDAY_OBJECT_ID, { url: youtubeUrl })
      // .classifyVideo(EVERYDAY_OBJECT_ID, { file: localVideo })
      // .getVideoResults('5d093d24cdf6f5caa2791f86')

      .then(res => {
        console.log(res);
        // console.log(JSON.stringify(res));
        console.log('Testing ends -----------------');
      })
      .catch(e => console.log(e));
  } catch (e) {
    console.log(e);
  }
};

test();
