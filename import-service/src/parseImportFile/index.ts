import { Context, S3Event } from 'aws-lambda';
import 'source-map-support/register';
import { mapToProxyResult } from '../../../common/utils';
import { ServiceError } from '../../../common/models/serviceError';
import { ServiceResponse } from '../../../common/types/serviceResponse.type';
import AWS from 'aws-sdk';
import csvParser from 'csv-parser';
import config from '../../config';


export const parseImportFile = async (event: S3Event, _context: Context): Promise<ServiceResponse> => {
  console.log('parseImportFile input event', event);

  try {
    const s3 = new AWS.S3({ 
      credentials: {
        secretAccessKey: config.MY_AWS_ACCESS_KEY,
        accessKeyId: config.MY_AWS_ACCESS_KEY_ID,
      },
      region: config.BUCKET_REGION,
      signatureVersion: 'v4'
     });
    let fileKey: string;

    for(const record of event.Records) {
      fileKey = record.s3.object.key;

      if(fileKey) {
        await readFileContent(s3, fileKey);
        await moveFileToParsed(s3, fileKey);
      }
    }
    
    const result = mapToProxyResult({
      statusCode: 202,
      body: {
        success: true,
      }
    });

    console.log('parseImportFile response', result);

    return result;
  } catch(error) {
    let statusCode = 500;
    if(error instanceof ServiceError){
      statusCode = error.statusCode;
    }
    const errorResult = mapToProxyResult({
      statusCode,
      body: {
        message: error.message,
      },
    });

    console.error('parseImportFile error', errorResult);
    
    return errorResult;
  }
}

async function readFileContent(s3: AWS.S3, fileKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const bucketParams = {
      Bucket: config.BUCKET_UPLOAD_NAME,
      Key: fileKey,
    };

    console.log(`Reading file [${fileKey}]`);

    const s3Stream = s3.getObject(bucketParams).createReadStream();
    const parsedData = [];

    s3Stream
      .pipe(csvParser())
      .on('data', (data: any) => {
        parsedData.push(data);
      })
      .on('error', (error: any) => {
        reject(error);
        console.error(`ERROR of read stream [FILE: ${fileKey}`, error);
      })
      .on('end', () => {
        console.log(`END of read stream [FILE: ${fileKey}`);
        console.log('RESULT csv file content', parsedData);
        resolve();
      })
  })
}

async function moveFileToParsed(s3: AWS.S3, fileKey: string): Promise<void> {
  const copySource = fileKey;
  const copyDestination = fileKey.replace(config.BUCKET_UPLOAD_DIR_NAME, config.BUCKET_PARSED_DIR_NAME);
  
  console.log(`Copying file from [${copySource}] to [${copyDestination}]`);
  //Copying file from [uploaded/product.csv] to [parsed/product.csv]
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