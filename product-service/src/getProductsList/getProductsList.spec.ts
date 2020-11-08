import { APIGatewayProxyResult } from "aws-lambda";
import { getProductsList } from ".";
import getProductsListMock from "../services/getProductsList.mock";
import * as productService from '../services/products.service';
import { INTERNAL_SERVER_ERROR_MSG } from "../utils/messages";


describe('getProductList', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should return a list of products', async () => {
    jest.spyOn(productService, 'getProducts').mockImplementation(() => Promise.resolve(getProductsListMock));
    const productsResponseMock = productService.mapProductsToClient(getProductsListMock);
    
    const result = (await getProductsList(null, null, null)) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(productsResponseMock);
  })

  it('should return 500 if getting products failed', async () => {
    jest.spyOn(productService, 'getProducts').mockReturnValueOnce(null);
    
    const result = (await getProductsList(null, null, null)) as APIGatewayProxyResult;
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({message: INTERNAL_SERVER_ERROR_MSG});
  })
});