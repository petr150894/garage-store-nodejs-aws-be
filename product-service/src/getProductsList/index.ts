import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import 'source-map-support/register';
import { ServiceResponse } from '../../../common/types/serviceResponse.type';
import { mapToProxyResult } from '../../../common/utils';
import * as productsService from '../services/products.service';
import { INTERNAL_SERVER_ERROR_MSG } from '../utils/messages';

export const getProductsList = async (event: APIGatewayProxyEvent, _context: Context): Promise<ServiceResponse> => {
  console.log('getProductsList input event', event);

  try {
    const productsResponse = await productsService.getProducts();
    const products = productsService.mapProductsToClient(productsResponse);
    const result = mapToProxyResult({
      statusCode: 200,
      body: products,
    });

    console.log('getProductsList response', result);

    return result;
  } catch(error) {
    const errorResult = mapToProxyResult({
      statusCode: 500,
      body: {
        message: INTERNAL_SERVER_ERROR_MSG,
      },
    });

    console.error('getProductsList error', error);

    return errorResult;
  }
}


