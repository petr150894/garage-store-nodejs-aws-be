import { ServiceResponse } from "../types/serviceResponse.type";

const SPACE = ' ';
const CREDS_DELIM = ':';

export function mapToProxyResult(data: ServiceResponse): ServiceResponse {
  return {
    statusCode: data.statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': false,
    },
    body: JSON.stringify(data.body, null, 2)
  }
}

export function decodeBase64(str: string): string {
  return Buffer.from(str, 'base64').toString('utf-8');
}

export function parseBasicAuthToken(tokenStr: string): { login: string, password: string, token: string } {
  if(!tokenStr) {
    throw 'Unable to parse token';
  }
  const token = tokenStr.split(SPACE)[1];
  const decodedCreds = decodeBase64(token).split(CREDS_DELIM);

  if(!decodedCreds[0] || !decodedCreds[1]) {
    throw 'Unable to parse token';
  }

  return {
    login: decodedCreds[0],
    password: decodedCreds[1],
    token,
  };
}
