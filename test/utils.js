const Matroid = require('../dist/matroid');

const setUpClient = () => {
  let { BASE_URL, CLIENT_ID, CLIENT_SECRET } = process.env;

  const baseUrl = BASE_URL || 'https://staging.dev.matroid.com/api/v1';

  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Please pass in CLIENT_ID and CLIENT_SECRET');
  }

  return new Matroid({
    baseUrl,
    clientId: CLIENT_ID,
    clientSecret: CLIENT_SECRET
  });
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const printInfo = message => {
  console.log(`\x1b[2m      Info: ${message}`);
};

const waitDetectorReadyForEdit = async (api, detectorId) => {
  let res = await api.getDetectorInfo(detectorId);
  
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
    res = await api.getDetectorInfo(detectorId);
  }
};

const deletePendingDetector = async api => {
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
      throw new Error(
        'Timeout when waiting for collection task to be ready'
      );
    }

    await sleep(2000);
    res = await api.getCollectionTask(collectionTaskId);
  }
}

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

module.exports = {
  setUpClient,
  sleep,
  printInfo,
  waitDetectorReadyForEdit,
  deletePendingDetector,
  waitIndexDone,
  waitCollectionTaskStop,
};
