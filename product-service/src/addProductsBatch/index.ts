import { Context, SQSEvent } from 'aws-lambda';
import 'source-map-support/register';

import { Product } from '../models/product'
import * as productService from '../services/products.service';
import { getSNS } from '../utils/sns';
import { checkProductValidity } from '../utils/products';
import { CREATE_PRODUCT_REQUEST_INCORRECT_MSG, SNS_PUBLISH_SUBJECT } from '../utils/messages';
import config from '../../config';
import { SNS } from 'aws-sdk';


export const addProductsBatch = async (event: SQSEvent, _context: Context): Promise<void> => {
  console.log('addProductsBatch input event', event);

  try {
    const products = event.Records
    .map(({ body }) => JSON.parse(body))
    .filter(product => {
      const isProductValid = checkProductValidity(product as Partial<Product>);
      if(!isProductValid){
        console.error(CREATE_PRODUCT_REQUEST_INCORRECT_MSG, product)
      };
      return isProductValid;
    })
    .map(productData => new Product({
      title: productData['title'],
      price: +productData['price'],
      description: productData['description'],
      imageUrl: productData['imageUrl'],
      count: +productData['count']
    }));

    await productService.addProductsBatch(products);
    notifyAboutProductUpdate(products);
    
  } catch (error) {
    console.error('addProductsBatch error', error);
  }
}

function notifyAboutProductUpdate(products: Product[]): void {
  try {
    const sns = getSNS();
    const snsMessage = `The list of products that have been added via csv file import: 
      ${products.map((p: Product, index: number) => `${index + 1}. ${p.title}`).join(',')}`;
    
    console.log('notifyAboutProductUpdate', snsMessage, config.SNS_ARN);
  
    const sender = sns.publish({
      Subject: SNS_PUBLISH_SUBJECT,
      Message: snsMessage,
      TopicArn: config.SNS_ARN
    });
    sender.send((err: any, data: SNS.PublishResponse) => {
      console.log(data);
      err && console.error(err);
    });
  } catch(err) {
    console.error('ERROR in process of sending products to SNS queue', err);
  }
  
}