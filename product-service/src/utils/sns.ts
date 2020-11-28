import AWS from 'aws-sdk';
import config from '../../config';

let sns:AWS.SNS;

export function getSNS(): AWS.SNS {
  if(!sns) {
    sns = new AWS.SNS({
      region: config.SNS_REGION,
    });
  }

  return sns;
}