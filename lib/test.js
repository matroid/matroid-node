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
    const account = await api.accountInfo();
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
      // .listDetectors({ id: '5d01383a8556a016397c27ce' })
      // .listDetectors({ limit: 2 })
      // .listDetectors({ state: 'pending' })
      // .detectorInfo('5d07dd21ff4f9677056b71a3')
      // .trainDetector('5d040e5ecebe92eec274e9da')
      // .redoDetector(EVERYDAY_OBJECT_ID)
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
      .importDetector('upload-node-gender', {
        fileProto: genderFile,
        labels: ['female', 'male'],
        inputTensor: 'input_5[128,128,3]]',
        outputTensor: 'prob3[2]',
        detectorType: 'facial_recognition'
      })

      .then(res => {
        console.log(res);
        console.log('Testing ends -----------------');
      })
      .catch(e => console.log(e));
  } catch (e) {
    console.log(e);
  }
};

test();
