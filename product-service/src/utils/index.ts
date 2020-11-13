import { APIGatewayProxyResult } from "aws-lambda";
import { ServiceResponse } from "../types/serviceResponse.type";

export function mapToProxyResult(data: ServiceResponse): APIGatewayProxyResult {
  return {
    statusCode: data.statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(data.body, null, 2)
  }
}
