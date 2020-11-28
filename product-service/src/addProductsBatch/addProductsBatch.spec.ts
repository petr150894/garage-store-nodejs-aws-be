import AWSMock from "aws-sdk-mock";
import { addProductsBatch } from ".";
import * as productService from '../services/products.service';
import { Product } from "../models/product";
import * as snsUtil from '../utils/sns';

const mockProducts = [
  {
    title: 'title 1',
    description: 'description 1',
    price: '1299',
    count: '17',
    imageUrl: 'http://magspace.ru/uploads/2020/07/07/auto_03-3505.jpg'
  },
  {
    title: 'title 2',
    description: 'description 2',
    price: '1288',
    count: '76',
    imageUrl: 'https://s1.1zoom.ru/big7/377/Ancient_animals_443955.jpg'
  },
];

const SQSEventRecordsMock = mockProducts.map(p => {
  return {
    body: JSON.stringify(p)
  }
})

describe('addProductsBatch lambda', () => {

  afterEach(() => {
    AWSMock.restore('SNS');
    jest.resetAllMocks();
  })

  it('should save products', async () => {
    const addProductsBatchServiceMocked = jest.fn(() => { return Promise.resolve(); });
    jest.spyOn(productService, 'addProductsBatch').mockImplementationOnce(addProductsBatchServiceMocked);
    
    AWSMock.mock("SNS", "publish", 'OK');

    await addProductsBatch({
      Records: SQSEventRecordsMock,
    } as any, null);

    const serviceInput = mockProducts.map(p => new Product({
      title: p.title,
      price: +p.price,
      description: p.description,
      imageUrl: p.imageUrl,
      count: +p.count
    }));

    expect(addProductsBatchServiceMocked).toHaveBeenCalledWith(serviceInput);
  })

  it('should call SNS service', async () => {
    const addProductsBatchServiceMocked = jest.fn(() => { return Promise.resolve(); });
    jest.spyOn(productService, 'addProductsBatch').mockImplementationOnce(addProductsBatchServiceMocked);
    
    const mSNS: any = {
      publish: jest.fn(() => {}),
    };

    jest.spyOn(snsUtil, 'getSNS').mockImplementationOnce(jest.fn(() => mSNS));


    await addProductsBatch({
      Records: SQSEventRecordsMock,
    } as any, null);

    expect(mSNS.publish).toHaveBeenCalled();
  })

  it('should handle error', async () => {
    const consoleErrorMock = jest.fn(() => { });
    jest.spyOn(console, 'error').mockImplementationOnce(consoleErrorMock);
    
    const addProductsBatchServiceMocked = jest.fn(() => { return Promise.reject('saveBatchProducts error') });
    jest.spyOn(productService, 'addProductsBatch').mockImplementationOnce(addProductsBatchServiceMocked);

    AWSMock.mock("SNS", "publish", 'OK');

    await addProductsBatch({
      Records: SQSEventRecordsMock,
    } as any, null);

    expect((console.error as any).mock.calls[0][0]).toEqual('addProductsBatch error');
  })
})