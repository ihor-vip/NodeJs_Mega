const AWS_S3 = require('aws-sdk/clients/s3');
const path = require('path');
const { v4 } = require('uuid');

const { S3_SECRET_KEY, S3_ACCESS_KEY, S3_BUCKET, S3_REGION } = require('../config/config');

const s3 = new AWS_S3({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET_KEY,
  signatureVersion: 'v4',
  region: S3_REGION
});


const uploadFile = async (fileToUpload, itemType, itemId) => {
  const Key = _buildFilePath(itemType, itemId, fileToUpload.name);

  await s3.upload({
    Bucket: S3_BUCKET,
    Body: fileToUpload.data,
    Key
  }).promise();

  const signedUrl = s3.getSignedUrl('getObject', { Bucket: S3_BUCKET, Key });

  return signedUrl;
};

const getPhoto = async () => s3.getObject({
  Bucket: S3_BUCKET,
  Key: '/user/445360gfdj65a3930f3bbnefjh347mk/c356e526-52as-5673-fs7e-562fc45f4wes.jpg'
})

// http://localhost:5000/images/user/445360gfdj65a3930f3bbnefjh347mk/c356e526-52as-5673-fs7e-562fc45f4wes.jpg

function _buildFilePath(itemType, itemId, fileName = '') {
  // const extension = path.extname(fileName); // .jpg
  const ext = fileName.split('.').pop(); // jpg

  return path.normalize(`${itemType}/${itemId}/${v4()}.${ext}`);
}

module.exports = {
  uploadFile,
  getPhoto
}
