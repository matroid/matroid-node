const path = require('path');
const fs = require('fs');

async function fileExists() {
  const filePath = path.resolve(
    process.cwd(),
    '../../public/samples/example_coco.zip'
  );
  try {
    const exists = fs.existsSync(filePath);
    console.log({ exists });
  } catch (err) {
    console.error('File does not exist at', filePath);
    console.error(err);
  }
}

fileExists();

module.exports = {
  INVALID_QUERY_ERR: 'invalid_query_err',
  EVERYDAY_OBJECT_ID: '598e23679fd1a805a5c09275',
  RANDOM_MONGO_ID: '6036ccacba368fbbd2cb20ce',
  DETECTOR_ZIP: `${__dirname}/test-files/detector.zip`,
  COCO_ZIP: `${__dirname}/test-files/example_coco.zip`,
  DOG_FILE: `${__dirname}/test-files/dog.jpg`,
  CAT_FILE: `${__dirname}/test-files/cat.jpg`,
  DOG_URL: 'https://m-test-public.s3.amazonaws.com/test/python-client/dog.jpg',
  CAT_URL:
    'https://m-test-public.s3.amazonaws.com/test/python-client/tesla-cat.jpg',
  S3_VID_URL:
    'https://m-test-public.s3-us-west-2.amazonaws.com/videos/Multiple+cars+-+5s.mp4',
  S3_VID_URL_2:
    'https://m-test-public.s3.us-west-2.amazonaws.com/videos/TomCruiseInterview.mp4',
  S3_BUCKET_URL: 's3://bucket/m-test-public/',
  LOCAL_VID: `${__dirname}/test-files/construction.mp4`,
  ONE_DAY: 24 * 60 * 60 * 1000,
};
