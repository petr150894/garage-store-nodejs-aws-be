import { APIGatewayProxyResult } from "aws-lambda";
import { getProductById } from ".";
import getProductsListMock from "../services/getProductsList.mock";
import * as productService from '../services/products.service';
import { GET_PRODUCT_REQUEST_INCORRECT_MSG } from "../utils/messages";


describe('getProductById', () => {

  it('should find a product by id', async () => {
    const getProductFromDBMocked = jest.fn(() => { return Promise.resolve(getProductsListMock[0]); });
    jest.spyOn(productService, 'getProductById').mockImplementationOnce(getProductFromDBMocked);
    const product = getProductsListMock[0];
    const productResponseMock = productService.mapProductToClient(getProductsListMock[0]);
    
    const result = (await getProductById({
      pathParameters: {id: product.id},
    } as any, null)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(productResponseMock);
    expect(getProductFromDBMocked).toHaveBeenCalled();
  })

  it('should return 400 if url param has not been passed', async () => {
    const result = (await getProductById({
      pathParameters: {},
    } as any, null)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({message: GET_PRODUCT_REQUEST_INCORRECT_MSG});
  })

  it('should return 404 if product has not been found', async () => {
    jest.spyOn(productService, 'getProductById').mockImplementationOnce(() => {return null});

    const result = (await getProductById({
      pathParameters: {id: 'wrong_id'},
    } as any, null)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(404);
    expect(JSON.parse(result.body)).toEqual({message: 'Product with wrong_id is not found'});
  })

  it('should return 500 if products service failed', async () => {
    const productsServiceError = 'products service error';
    jest.spyOn(productService, 'getProductById').mockImplementationOnce(() => { throw new Error(productsServiceError)});

    const result = (await getProductById({
      pathParameters: {id: getProductsListMock[0].id},
    } as any, null)) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({message: productsServiceError});
  })
});