import AWS from 'aws-sdk';
import config from '../../config';

let s3:AWS.S3;

export function getS3(): AWS.S3 {
  if(!s3) {
    s3 = new AWS.S3({ 
      credentials: {
        secretAccessKey: config.MY_AWS_ACCESS_KEY,
        accessKeyId: config.MY_AWS_ACCESS_KEY_ID,
      },
      region: config.BUCKET_REGION,
      signatureVersion: 'v4'
     });
  }
  return s3;
}