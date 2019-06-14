// const addVideoApi = Matroid => {
//   /*
//     Expected image format: { url: 'https://www.matroid.com/logo.png'} OR { file: ['/home/user/image.jpg', '/home/user/other_image.png'] }
//   */
//   Matroid.prototype.classifyVideo = function(detectorId, video) {
//     return new Promise((resolve, reject) => {
//       if (!detectorId) {
//         throw new Error(
//           'Please pass in the ID of the detector you want to use'
//         );
//       }

//       if (
//         !video ||
//         (typeof video.url === 'undefined' && typeof video.file === 'undefined')
//       ) {
//         throw new Error('No video provided');
//       }

//       if (video.file && Array.isArray(video.file)) {
//         throw new Error('Can only classify one local video at a time');
//       }

//       if (
//         !video.url &&
//         !this._checkFilePayloadSize(video.file, 0, this._fileSizeLimits.video)
//       ) {
//         throw new Error(
//           `Individual file size must be under ${this._fileSizeLimits.video /
//             1024 /
//             1024}MB`
//         );
//       }

//       let options = {
//         action: 'classifyVideo',
//         uriParams: { ':key': detectorId }
//       };

//       if (video.file) options.filePaths = video.file;
//       if (video.url) options.data = { url: video.url };

//       this._genericRequest(options, resolve, reject);
//     });
//   };

//   Matroid.prototype.getVideoResults = function(
//     videoId,
//     threshold,
//     responseFormat
//   ) {
//     return new Promise((resolve, reject) => {
//       let options = {
//         action: 'getVideoResults',
//         data: { threshold: threshold, format: responseFormat },
//         uriParams: { ':key': videoId }
//       };

//       if (responseFormat === 'csv') options.shouldNotParse = true;

//       this._genericRequest(options, resolve, reject);
//     });
//   };
// };

// exports = module.exports = addVideoApi;
