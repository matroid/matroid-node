## Matroid API Node Client

Use our Node client to access the Matroid API for image and video classification. It has been tested as far back as Node 10.

Due to API changes, please use Matroid Node Client versions 1.2.1 or later

## Full documentation
You can view our full client documentation [here](https://app.matroid.com/docs/api/documentation).

## Installation
```
npm install matroid
```

You can pass in your API credentials directly to the API client or save them as environment variables where the client will use them automatically.
Here is a bash example:

```
nano .bash_profile
```

Inside your `.bash_profile`, add the following lines, replacing the placeholder with the real values from the [API documentation's](https://app.matroid.com/detector/58d010c75bcac50d00ad85ed?tab=api) "Account Info" section
```
export MATROID_CLIENT_ID=PLACEHOLDER
export MATROID_CLIENT_SECRET=PLACEHOLDER
```

Then run `source ~/.bash_profile` on the command line to ensure the environment variables are loaded.

## Example usage

The public functions all return Promise objects.

```javascript
const Matroid = require('matroid');
const util = require('util');

const api = new Matroid({clientId: 'abc', clientSecret: '123'});

// Classify a picture from a URL
api.retrieveToken()
   .then(token => api.classifyImage('test', { url: 'https://app.matroid.com/images/logo2.png' }))
   .then(classification => console.log('Answer: ', util.inspect(classification, false, null)))
   .catch(error => console.error('Something happened:', error))

// Classify a picture from a file
api.retrieveToken()
   .then(token => api.classifyImage('test', { file: ['/home/user/picture.jpg', '/home/user/image.jpg'] }, { num_results: 5 }))
   .then(classification => console.log('Answer: ', util.inspect(classification, false, null)))
   .catch(error => console.error('Something happened:', error))

// Classify a video from a file
api.retrieveToken()
   .then(token => api.classifyVideo('test', { file: '/home/user/video.mp4' }))
   .then(({ videoId }) => console.log('Video ID: ', video_id))
   .catch(error => console.error('Something happened:', error))

// Classify a YouTube video
api.retrieveToken()
   .then(token => api.classifyVideo('test', { url: 'https://youtube.com/watch?v=abc' }))
   .then(({ video_id }) => console.log('Video ID: ', video_id))
   .catch(error => console.error('Something happened:', error))

// Get video results
api.retrieveToken()
   .then(token => api.getVideoResults('abc123'))
   .then(classifications => console.log('Answer: ', util.inspect(classifications, false, null)))
   .catch(error => console.error('Something happened:', error))

// Create a detector
/*
  Remember to pass in the name of your detector and its type (general, facial_recognition, facial_characteristics)
  pass in a zip file containing the images to be used in the detector creation
              the root folder should contain only directories which will become the labels for detection
              each of these directories should contain only a images corresponding to that label
      structure example:
        cat/
          garfield.jpg
          nermal.png
        dog/
          odie.tiff
*/
api.retrieveToken()
   .then(token => api.createDetector('/home/user/myPictures.zip', 'Apple Detector', 'general'))
   .then(({ detector_id }) => api.trainDetector(detector_id))
   .catch(error => console.error('Something happened:', error))

// You can check on its progress. Then when it's done training, you can classify with the detector.
const detectorId = 'test';
api.retrieveToken()
   .then(token => api.detectorInfo(detectorId))
   .then(detectorInfo => console.log('Information: ', util.inspect(detectorInfo, false, null)))
   .catch(error => console.error('Something happened:', error))

// Check how many Matroid Credits you have
api.retrieveToken()
   .then(token => api.getAccountInfo())
   .then(account => console.log('Information: ', util.inspect(account, false, null)))

// Register and monitor stream on Matroid
const streamUrl = http://localhost:8888/stream.mjpg;
const detectorId = 'abc123';
const monitorOptions = {
  'startTime': '2017-06-20T20:56:19.096Z',
  'endTime': '2017-06-21T20:00:00.000Z',
  'thresholds': {
    'cat': 0.5,
    'dog': 0.7
  }
  'endpoint': 'http://mydomain.fake:9000/matroid_detections'
}

api.createStream(streamUrl, 'backyard')
   .then(({ stream_id }) => api.monitorStream(stream_id, detectorId, monitorOptions))
   .then(monitoringInfo => console.log(monitoringInfo));

// Add feedback to a detector using a local file
const detectorId = 'your-detector-id';
const filePath = '/Users/matroid-user/Desktop/image.png';
const image = { file: filePath };
const feedback = [
  {
    label: 'cat',
    feedbackType: 'positive',
    boundingBox: {
      top: .08,
      left: .17,
      height: .89,
      width: .64
    },
  },
  {
    label: 'dog',
    feedbackType: 'negative',
    {
      top: .1,
      left: .36,
      height: .84,
      width: .62
    }
  },
];

api.retrieveToken()
   .then(token => api.addFeedback(detectorId, image, feedback))
   .catch(error => console.error('Something happened:', error))

// Add feedback to a detector using a URL
const detectorId = 'your-detector-id';

const imageURL = 'https://m-test-public.s3.amazonaws.com/test/python-client/tesla-cat.jpg';
const image = { url: imageURL };

const feedback = [
  {
    label: 'cat',
    feedbackType: 'positive',
    boundingBox: {
      top: .08,
      left: .17,
      height: .89,
      width: .64
    },
  },
  {
    label: 'dog',
    feedbackType: 'negative',
    {
      top: .1,
      left: .36,
      height: .84,
      width: .62
    }
  },
];

api.retrieveToken()
   .then(token => api.addFeedback(detectorId, image, feedback))
   .catch(error => console.error('Something happened:', error))

// Delete feedback
const feedbackId = 'your-feedback-id';
const detectorId = 'your-detector-id';

api.retrieveToken()
   .then(token => api.deleteFeedback(feedbackId, detectorId))
   .catch(error => console.error('Something happened:', error))

// Get video summary information
const summaryId = 'your-summary-id';

api.retrieveToken()
   .then(token => api.getVideoSummary(summaryId))
   .catch(error => console.error('Something happened:', error))

// Download video summary tracks as a CSV file
api.retrieveToken()
   .then(token => api.getVideoSummaryTracks(summaryId))
   .catch(error => console.error('Something happened:', error))

// Download video summary as a video file
api.retrieveToken()
   .then(token => api.getVideoSummaryFile(summaryId))
   .catch(error => console.error('Something happened:', error))

// Create a video summary from a local file
const video = { 
  file: '/home/user/video.mp4'
};

const detectorId = 'my-detector-id';

/*
 * Required configuration:
 * - detectorId: the detector to create the summary with
 */
/*
 * Optional configuration:
 * - fps: the number of frames per second to process when generating the summary [default = 4]
 * - labels: array of labels to summarize
 * - featureWeight: weight to be given to features when tracking
 * - motionWieght: weight to be given to motion when tracking
 * - matchingDistance [range 0 - 1]: distance threshold when matching
 */

const labelsToSummarize = ['people', 'car'];
const summaryFPS = 4;

const configs = { 
  detectorId,
  fps: summaryFPS,
  labels: labelsToSummarize,
};

api.retrieveToken()
   .then(token => api.createVideoSummary(video, configs))
   .catch(error => console.error('Something happened:', error))

// Delete video summary
const summaryId = 'your-summary-id';

api.retrieveToken()
   .then(token => api.deleteVideoSummary(summaryId))
   .catch(error => console.error('Something happened:', error))

// Get stream summaries
const streamId = 'your-stream-id';

api.retrieveToken()
   .then(token => api.getStreamSummaries(streamId))
   .catch(error => console.error('Something happened:', error))

// Create a stream summary from a local file
const video = { 
  file: '/home/user/video.mp4'
};

const streamId = 'my-stream-id';
const detectorId = 'my-detector-id';

/* 
 * Required configuration:
 * - startTime: timestamp for the start of the period to summarize
 * - endTime: timestamp for the end of the period to summarize
 */

 const startTime = '2022-06-21T00:00:00Z'
 const endTime = '2022-06-22T00:00:00'

/*
 * Optional configuration:
 * - detectorId: the detector to use for the summary. Summarizes people if not specified
 * - labels: array of labels to summarize
 * - fps: the number of frames per seceond to process when generating the summary [default = 4]
 * - featureWeight: weight to be given to features when tracking
 * - motionWieght: weight to be given to motion when tracking
 * - matchingDistance [range 0 - 1]: distance threshold when matching
 */

const labelsToSummarize = ['people', 'car'];
const summaryFPS = 4;

const configs = { 
  startTime,
  endTime,
  fps: summaryFPS,
  labels: labelsToSummarize,
};

api.retrieveToken()
   .then(token => api.createVideoSummary(detectorId, video, configs))
   .catch(error => console.error('Something happened:', error))
```

## API Response samples
#### Sample detectors listing
```json
[
  {
    "detector_name": "cat-dog-47",
    "human_name": "cats vs dogs",
    "labels": ["cat", "dog"],
    "permission_level": "open",
    "owner": "true"
  }
]
```

#### Sample Image Classification
```json
{
  "results": [
    {
      "file": {
        "name": "image1.png",
        "url": "https://myimages.1.png",
        "thumbUrl": "https://myimages.1_t.png",
        "filetype": "image/png"
      },
      "predictions": [
        {
          "bbox": {
            "left": 0.7533333333333333,
            "top": 0.4504347826086956,
            "height": 0.21565217391304348,
            "aspectRatio": 1.0434782608695652
          },
          "labels": {
            "cat face": 0.7078468322753906,
            "dog face": 0.29215322732925415
          }
        },
        {
          "bbox": {
            "left": 0.4533333333333333,
            "top": 0.6417391304347826,
            "width": 0.20833333333333334,
            "height": 0.21739130434782608,
            "aspectRatio": 1.0434782608695652
          },
          "labels": {
            "cat face": 0.75759859402753906,
            "dog face": 0.45895322732925415
          }
        }, {
          ...
        }
      ]
    }
  ]
}
```

#### Sample video classification tracking ID
```json
{
  "video_id": "58489472ff22bb2d3f95728c"
}
```

#### Sample stream creation
```json
{
  "stream_id": "58489472ff22bb2d3f95728c"
}
```

#### Sample stream monitoring
```json
{
  "stream_id": "58489472ff22bb2d3f95728c",
  "monitoring_id": "68489472ff22bb2d3f95728c",
}
```

#### Sample video classification results
```json
{
  "download_progress": 100,
  "classification_progress": 8,
  "status": "Video Download Complete. Classifying Video",
  "label_dict": {"0":"cat","1":"dog"},
  "state": "running",
  "detections": {
       "1.5": [{ "labels": { "0": 0.10 } }],
       "2": [{ "labels": { "0": 0.98, "1": 0.10 } }],
       "5": [{ "labels": { "0": 0.75 } }]
   }
}

{
  "download_progress": 100,
  "classification_progress": 8,
  "status": "Video Download Complete. Classifying Video",
  "label_dict": {"0":"man","1":"woman"},
  "state": "running",
  "detections": {
    "89": [
      {
        "labels": {
          "0": 0.95
        },
        "bbox": {
         "left": 0.2377,
         "top": 0.2021,
         "width": 0.1628,
         "height": 0.3896,
       }
      }
    ],
    "92": [
      {
        "labels": {
          "0": 0.16,
          "2": 0.80
        },
        "bbox": {
          "left": 0.7576,
          "top": 0.2375,
          "width": 0.0597,
          "height": 0.1313,
        }
      },
      {
        "labels": {
          "0": 0.89,
        },
        "bbox": {
          "left": 0.5047,
          "top": 0.1708,
          "width": 0.055,
          "height": 0.1292,
        }
      },
    ]
  }
}
```

#### Sample detector creation ID
```json
{
  "detector_id": "58489472ff22bb2d3f95728c"
}
```

#### Sample detector information and training progress response
```json
{
  "detector": {
    "labels": [{
      "label_id": "58471afdc3d3516158d3b441",
      "name": "bread"
    }],
    "state": "training",
    "permission_level": "private",
    "training": {
      "progress": 100,
      "accuracy": 89.9,
      "total_images": 250,
      "queue_position": 0,
      "training_requested_at": "2016-01-01T20:20:13.739Z",
      "estimated_start_time": "2016-01-01T20:21:30.193Z",
      "estimated_time_remaining": 3,
      "estimated_completion_time": "2016-01-01T20:24:30.193Z"
    }
  }
}
```

#### Sample add feedback response
```json
{
  "feedback": [
    {
      "id": "unique-feedback-id",
      "feedbackType": "positive",
      "label": "cat",
      "boundingBox": {
        "top": ".08",
        "left": ".17",
        "height": ".89",
        "width": ".64"
      },
    }
  ]
}
```

#### Sample delete feedback response
```json
{
  "feedbackId": "unique-feedback-id"
}
```

#### Sample get video summary response
```json
{
  "progress": 0.5,
  "state": "ready",
  "message": "running"
}
```

#### Sample create video summary response
```json
{
  "summary": {
    "_id": "6614d4d545d3b83467cbabca",
    "createdBy": "5f7fc9e142ff025006199af7",
    "state": "requested",
    "video": "6164d4d545d3b43867bacbab"
  }
}
```

#### Sample delete video summary response
```json
{
  "summaryId": "6614d4d545d3b83467cbabca"
}
```

#### Sample get stream summaries response
```json
{
  "summaries": [
    {
      "_id": "1232eac3be247b0d915ee82f",
      "feed": "4092eac3be247b0d915ee23c",
      "startTime": "2021-04-12T22:53:17.902Z",
      "endTime": "2021-04-13T22:53:17.902Z",
      "progress": 0.5
    },
    {
      "_id": "2232eac3be247b0d915ee82f",
      "feed": "5092eac3be247b0d915ee23c",
      "startTime": "2021-04-11T22:53:17.902Z",
      "endTime": "2021-04-14T22:53:17.902Z",
      "progress": 0.75
    }
  ]
}
```

#### Sample create stream summary response
```json
{
  "summary": {
    "_id": "6164a3d891e6a932927bd6d6",
    "createdBy": "5f7fc9e142ff025006199af7",
    "feed": "16325a725af20d025c865421",
    "startTime": "2021-10-09T22:53:17.902Z",
    "endTime": "2021-10-10T22:53:17.902Z",
    "state": "requested",
    "progress": 0
  }
}
```
