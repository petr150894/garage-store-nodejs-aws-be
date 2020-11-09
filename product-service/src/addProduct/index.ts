import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult, Context } from 'aws-lambda';
import 'source-map-support/register';
import { mapToProxyResult } from '../utils';
import { ServiceError } from '../models/serviceError';
import * as productService from '../services/products.service';
import { CREATE_PRODUCT_REQUEST_INCORRECT_MSG } from '../utils/messages';
import { Product } from '../models/product';

export const addProduct: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> => {
  console.log('createProduct input event', event);

  try {
    const newProductData = JSON.parse(event.body);

    if(
      !newProductData['title'] || 
      !newProductData['price'] || 
      !newProductData['imageUrl'] ||
      !newProductData['count']) {
      throw(new ServiceError(CREATE_PRODUCT_REQUEST_INCORRECT_MSG, 400));
    }
    const product = new Product({
      title: newProductData['title'],
      price: newProductData['price'],
      description: newProductData['description'],
      imageUrl: newProductData['imageUrl'],
      count: newProductData['count']
    });
    console.log('product to add', product);

    await productService.addProduct(product);

    const result = mapToProxyResult({
      statusCode: 200,
      body: {
        success: true,
      },
    });

    console.log('createProduct response', result);

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

    console.error('createProduct error', errorResult);
    
    return errorResult;
  }
}

