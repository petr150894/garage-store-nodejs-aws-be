import { Context, S3Event } from 'aws-lambda';
import 'source-map-support/register';
import { mapToProxyResult } from '../../../common/utils';
import { ServiceError } from '../../../common/models/serviceError';

import csvParser from 'csv-parser';
import config from '../../config';
import { Product } from '../../../product-service/src/models/product'
import { getS3 } from '../utils/s3';
import { getSQS } from '../utils/sqs';
import { SQS } from 'aws-sdk';


export const parseImportFile = async (event: S3Event, _context: Context): Promise<void> => {
  console.log('parseImportFile input event', event);

  try {
    const s3 = getS3();
    let fileKey: string;
    let products: Partial<Product>[];

    for(const record of event.Records) {
      fileKey = record.s3.object.key;

      if(fileKey) {
        products = await readFileContent(s3, fileKey);
        pushProductsToSQSQueue(products);
        await moveFileToParsed(s3, fileKey);
      }
    }
  } catch(error) {
    console.error('parseImportFile error', error);
  }
}

async function readFileContent(s3: AWS.S3, fileKey: string): Promise<Partial<Product>[]> {
  return new Promise((resolve, reject) => {
    const bucketParams = {
      Bucket: config.BUCKET_UPLOAD_NAME,
      Key: fileKey,
      ResponseContentEncoding: 'utf8'
    };

    console.log(`Reading file [${fileKey}]`);

    const s3Stream = s3.getObject(bucketParams).createReadStream().setEncoding('utf8');
    const parsedData = [];

    s3Stream
      .pipe(csvParser())
      .on('data', (record: Partial<Product>) => {
        parsedData.push(record);
      })
      .on('error', (error: any) => {
        reject(error);
        console.error(`ERROR of read stream [FILE: ${fileKey}`, error);
      })
      .on('end', () => {
        console.log('RESULT csv file content', parsedData);
        resolve(parsedData);
      })
  })
}

function pushProductsToSQSQueue(products: Partial<Product>[]): void {
  console.log('Pushing parsed products to SQS queue', products, config.SQS_URL)
  try {
    const sqs = getSQS();  
    const sender = sqs.sendMessageBatch({
      QueueUrl: config.SQS_URL,
      Entries: products.map((product: Partial<Product>, index: number) => ({ 
        Id: index.toString(), 
        MessageBody: JSON.stringify(product)
      })),
    });
    sender.send((err: any, data: SQS.SendMessageBatchResult) => {
      console.log(data);
      err && console.error(err);
    });
  } catch(err) {
    console.error('ERROR in process of sending products to SQS queue', err);
  }
}

async function moveFileToParsed(s3: AWS.S3, fileKey: string): Promise<void> {
  const copySource = `${config.BUCKET_UPLOAD_NAME}/${fileKey}`;
  const copyDestination = fileKey.replace(config.BUCKET_UPLOAD_DIR_NAME, config.BUCKET_PARSED_DIR_NAME);
  
  console.log(`Copying file from [${copySource}] to [${copyDestination}]`);
  
  await s3.copyObject({
    Bucket: config.BUCKET_UPLOAD_NAME,
    CopySource: copySource,
    Key: copyDestination
  }).promise();
  
  console.log(`Deleting file [${fileKey}]`);

  await s3.deleteObject({
    Bucket: config.BUCKET_UPLOAD_NAME,
    Key: fileKey
  }).promise();

  console.log(`File [${fileKey}] moved to ${config.BUCKET_PARSED_DIR_NAME} folder`)
}