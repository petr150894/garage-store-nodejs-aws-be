import {APIGatewayProxyEvent, Context } from 'aws-lambda';
import 'source-map-support/register';
import { mapToProxyResult } from '../../../common/utils';
import { ServiceError } from '../../../common/models/serviceError';
import { ServiceResponse } from '../../../common/types/serviceResponse.type';
import { FILE_NAME_INCORRECT_MSG } from '../utils/messages';
import config from '../../config';
import { getS3 } from '../utils/s3';


export const importProductsFile = async (event: APIGatewayProxyEvent, _context: Context): Promise<ServiceResponse> => {
  console.log('importProductsFile input event', event);

  try {
    const fileName = event.queryStringParameters['fileName'];

    if(!fileName) {
      throw(new ServiceError(FILE_NAME_INCORRECT_MSG, 400));
    }

    const s3 = getS3();
    const signedUrlParams = {
      Bucket: config.BUCKET_UPLOAD_NAME,
      Key: `${config.BUCKET_UPLOAD_DIR_NAME}/${fileName}`,
      Expires: config.BUCKET_UPLOAD_LINK_EXPIRES,
      ContentType: 'text/csv',
    };
    const signedUrl = await s3.getSignedUrlPromise('putObject', signedUrlParams);
    
    const result = mapToProxyResult({
      statusCode: 200,
      body: {
        url: signedUrl,
      }
    });

    console.log('importProductsFile response', result);

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

    console.error('importProductsFile error', errorResult);
    
    return errorResult;
  }
}