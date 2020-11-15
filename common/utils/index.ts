import { ServiceResponse } from "../types/serviceResponse.type";

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
