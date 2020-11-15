import AWS from "aws-sdk-mock";
import config from "../../config";
import { importProductsFile } from ".";
import { APIGatewayProxyResult } from "aws-lambda";
import { FILE_NAME_INCORRECT_MSG } from "../utils/messages";

describe('importProductsFile lambda', () => {

  afterEach(() => {
    AWS.restore('S3');
  })

  it('should return signed url', async () => {
    const signedUrl = 'signedUrl';
    const fileNameParam = 'fileNameParam';
    const getSignedUrlMocked = jest.fn((_action, _params, callback) => { callback(null, signedUrl) });
    AWS.mock("S3", "getSignedUrl", getSignedUrlMocked);
    
    const result = (await importProductsFile({
      queryStringParameters: { fileName: fileNameParam },
    } as any, null)) as APIGatewayProxyResult;

    expect((getSignedUrlMocked as any).mock.calls[0][0]).toEqual('putObject');
    expect((getSignedUrlMocked as any).mock.calls[0][1]).toEqual({
      Bucket: config.BUCKET_UPLOAD_NAME,
      Key: `${config.BUCKET_UPLOAD_DIR_NAME}/${fileNameParam}`,
      Expires: config.BUCKET_UPLOAD_LINK_EXPIRES,
      ContentType: 'text/csv',
    });
    
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({url: signedUrl});
  })

  it('should handle 500 error', async () => {
    const errorMsg = 'errorMsg';
    const getSignedUrlMocked = jest.fn((_action, _params, _callback) => { throw new Error(errorMsg) });
    AWS.mock("S3", "getSignedUrl", getSignedUrlMocked);
    
    const result = (await importProductsFile({
      queryStringParameters: { fileName: 'fileNameParam' },
    } as any, null)) as APIGatewayProxyResult;
    
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({message: errorMsg});
  })

  it('should validate filename query parameter', async () => {
    const getSignedUrlMocked = jest.fn((_action, _params, callback) => { callback(null, '') });
    AWS.mock("S3", "getSignedUrl", getSignedUrlMocked);
    
    const result = (await importProductsFile({
      queryStringParameters: {},
    } as any, null)) as APIGatewayProxyResult;
    
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body)).toEqual({message: FILE_NAME_INCORRECT_MSG});
  })
})