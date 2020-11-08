import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from 'aws-lambda';
import 'source-map-support/register';
import { mapToProxyResult } from '../utils';
import { ServiceError } from '../models/serviceError';
import { getProductsFromDB } from '../services/products.service';
import { GET_PRODUCT_REQUEST_INCORRECT_MSG } from '../utils/messages';

export const getProductById: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  console.log('getProductById input event', event);

  try {
    const products = await getProductsFromDB();
    const searchId = event.pathParameters['id'];

    if(!searchId) {
      throw(new ServiceError(GET_PRODUCT_REQUEST_INCORRECT_MSG, 400));
    }
    
    const product = products.find(product => product.id === searchId);

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

