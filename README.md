## Matroid API Node Client

Use our Node client to access the Matroid API for image and video classification. It has been tested as far back as Node 6.2.2.

## Full documentation
Navigate to any detector's page, such as the [Famous Places Detector](https://www.matroid.com/detector/58d010c75bcac50d00ad85ed?tab=api), and click on the "Overview" tab.
The "Overview" section contains the full specifications for each REST endpoint.

## Installation
```
npm install matroid
```

You can pass in your API credentials directly to the API client or save them as environment variables where the client will use them automatically.
Here is a bash example:

```
nano .bash_profile
```

Inside your `.bash_profile`, add the following lines, replacing the placeholder with the real values from the [API documentation's](https://www.matroid.com/detector/58d010c75bcac50d00ad85ed?tab=api) "Account Info" section
```
export MATROID_CLIENT_ID=PLACEHOLDER
export MATROID_CLIENT_SECRET=PLACEHOLDER
```

Then run `source ~/.bash_profile` on the command line to ensure the environment variables are loaded.

## Example usage

The public functions all return Promise objects.

```
const Matroid = require('matroid');
const util = require('util');

let api = new Matroid({clientId: 'abc', clientSecret: '123'});

// Classify a picture from a URL
api.retrieveToken()
   .then(token => api.classifyImage('test', { url: 'https://www.matroid.com/images/logo2.png' }))
   .then(classification => console.log('Answer: ', util.inspect(classification, false, null)))
   .catch(error => console.error('Something happened:', error))

// Classify a picture from a file
api.retrieveToken()
   .then(token => api.classifyImage('test', { file: ['/home/user/picture.jpg', '/home/user/image.jpg'] }))
   .then(classification => console.log('Answer: ', util.inspect(classification, false, null)))
   .catch(error => console.error('Something happened:', error))

// Classify a video from a file
api.retrieveToken()
   .then(token => api.classifyVideo('test', { file: '/home/user/video.mp4' }))
   .then(videoId => console.log('Video ID: ', videoId))
   .catch(error => console.error('Something happened:', error))

// Classify a YouTube video
api.retrieveToken()
   .then(token => api.classifyVideo('test', { url: 'https://youtube.com/watch?v=abc' }))
   .then(videoId => console.log('Video ID: ', videoId))
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
   .then(detectorId => api.trainDetector(detectorId))
   .catch(error => console.error('Something happened:', error))

// You can check on its progress. Then when it's done training, you can classify with the detector.
var detectorId = 'test';
api.retrieveToken()
   .then(token => api.detectorInfo(detectorId))
   .then(detectorInfo => console.log('Information: ', util.inspect(detectorInfo, false, null)))
   .catch(error => console.error('Something happened:', error))

// Check how many Matroid Credits you have
api.retrieveToken()
   .then(token => api.accountInfo())
   .then(account => console.log('Information: ', util.inspect(account, false, null)))
```

## API Response samples
#### Sample detectors listing
```
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
```
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
```
{
  "video_id": "58489472ff22bb2d3f95728c"
}
```

#### Sample video classification results
```
{
  "download_progress": 100,
  "classification_progress": 8,
  "status": "Video Download Complete. Classifying Video",
  "label_dict": {"0":"cat","1":"dog"},
  "state": "running",
  "detections": {
       "1": {"1":10},
       "2": {"0":98,"1":10},
       "5": {"0":75}
   }
}

{
  "download_progress": 100,
  "classification_progress": 100,
  "status": "Classification success",
  "label_dict": {"0":"cat","1":"dog"},
  "state": "success",
  "detections": {
       "1": {"1":10},
       "2": {"0":98,"1":10},
       "5": {"0":75},
       "7.5": {"0":45},
       "10": {"1":99}
   }
}
```

#### Sample detector creation ID
```
{
  "detector_id": "58489472ff22bb2d3f95728c"
}
```

#### Sample detector information and training progress response
```
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
