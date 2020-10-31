import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from 'aws-lambda';
import 'source-map-support/register';
import { Product } from '../models/product';
import { mapToProxyResult } from '../utils';
import { getProductsFromDB } from '../services/products.service';
import { INTERNAL_SERVER_ERROR_MSG } from '../utils/messages';

export const getProductsList: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  console.log('getProductsList input event', event);

  try {
    const products = await getProductsFromDB();
    
    const productsResponse = products.map(product => new Product({
      id: product.id,
      title: product.title,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      count: product.count,
    }));

    const result = mapToProxyResult({
      statusCode: 200,
      body: productsResponse,
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


