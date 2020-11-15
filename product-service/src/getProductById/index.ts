import {APIGatewayProxyEvent, Context } from 'aws-lambda';
import 'source-map-support/register';
import { mapToProxyResult } from '../../../common/utils';
import { ServiceError } from '../../../common/models/serviceError';
import * as productService from '../services/products.service';
import { GET_PRODUCT_REQUEST_INCORRECT_MSG } from '../utils/messages';
import { ServiceResponse } from '../../../common/types/serviceResponse.type';

export const getProductById = async (event: APIGatewayProxyEvent, _context: Context): Promise<ServiceResponse> => {
  console.log('getProductById input event', event);

  try {
    const searchId = event.pathParameters['id'];

    if(!searchId) {
      throw(new ServiceError(GET_PRODUCT_REQUEST_INCORRECT_MSG, 400));
    }

    const res = await productService.getProductById(searchId);
    const product = productService.mapProductToClient(res);

    if(!product) {
      throw(new ServiceError(`Product with ${searchId} is not found`, 404));
    }

    const result = mapToProxyResult({
      statusCode: 200,
      body: product,
    });

    console.log('getProductById response', result);

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

    console.error('getProductById error', errorResult);
    
    return errorResult;
  }
}

