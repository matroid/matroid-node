const Matroid = require('../dist/matroid');

const setUpClient = () => {
  let { BASE_URL, MATROID_CLIENT_ID, MATROID_CLIENT_SECRET } = process.env;

  const baseUrl = BASE_URL || 'https://staging.app.matroid.com/api/v1';

  if (!MATROID_CLIENT_ID || !MATROID_CLIENT_SECRET) {
    throw new Error(
      'Please pass in MATROID_CLIENT_ID and MATROID_CLIENT_SECRET'
    );
  }

  return new Matroid({
    baseUrl,
    clientId: MATROID_CLIENT_ID,
    clientSecret: MATROID_CLIENT_SECRET,
  });
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const printInfo = (message) => {
  console.log(`\x1b[2m      Info: ${message}`);
};

const waitDetectorReadyForEdit = async (api, detectorId) => {
  let res = await api.detectorInfo(detectorId);

  let tries = 0;
  const maxTries = 15;
  while (res.processing) {
    tries++;
    if (tries > maxTries) {
      throw new Error(
        'Timeout when waiting for detector to be ready for editing'
      );
    }

    await sleep(2000);
    res = await api.detectorInfo(detectorId);
    console.log(res.state);
  }
};

const deletePendingDetector = async (api) => {
  const res = await api.searchDetectors({ state: 'pending' });

  if (res.length) {
    await api.deleteDetector(res[0]['id']);
  }
};

// wait until the collection index is complete (i.e. has a state of 'success' or 'failed')
const waitIndexDone = async (api, collectionTaskId) => {
  let res = await api.getCollectionTask(collectionTaskId);

  let tries = 0;
  const maxTries = 5;

  const doneStates = ['success', 'failed'];
  while (!doneStates.includes(res.collectionTask.state)) {
    tries++;
    if (tries > maxTries) {
      throw new Error('Timeout when waiting for collection task to be ready');
    }

    await sleep(2000);
    res = await api.getCollectionTask(collectionTaskId);
  }
};

async function waitCollectionTaskStop(api, collectionIndexId) {
  // wait until collection task state is failed so it can be deleted
  let res = await api.getCollectionTask(collectionIndexId);
  let tries = 0;
  const maxTries = 10;

  while (res.collectionTask.state !== 'failed') {
    if (tries > maxTries) {
      throw new Error('Timeout when waiting for collection task to stop');
    }

    await sleep(2000);
    tries++;

    res = await api.getCollectionTask(collectionIndexId);
  }
}

async function waitVideoDoneClassifying(api, videoId) {
  // wait until video is done classifying so it doesn't conflict with future runs b/c of concurrent video classification limit
  let res = await api.getVideoResults(videoId);
  let tries = 0;
  const maxTries = 10;

  const doneStates = ['success', 'failed'];
  while (!doneStates.includes(res.state)) {
    if (tries > maxTries) {
      throw new Error('Timeout when waiting for video to finish classifying');
    }
    console.log(res.state);

    await sleep(2000);
    tries++;

    res = await api.getVideoResults(videoId);
  }
}

module.exports = {
  setUpClient,
  sleep,
  printInfo,
  waitDetectorReadyForEdit,
  deletePendingDetector,
  waitIndexDone,
  waitCollectionTaskStop,
  waitVideoDoneClassifying,
};
