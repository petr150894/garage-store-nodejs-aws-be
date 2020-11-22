import AWS from 'aws-sdk';
import config from '../../config';

let sqs:AWS.SQS;

export function getSQS(): AWS.SQS {
  if(!sqs) {
    sqs = new AWS.SQS({
      region: config.SQS_REGION,
    });
  }

  return sqs;
}