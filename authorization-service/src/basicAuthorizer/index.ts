import { APIGatewayProxyCallback, APIGatewayProxyWithLambdaAuthorizerEvent, Context } from 'aws-lambda';
import 'source-map-support/register';
import { parseBasicAuthToken } from '../../../common/utils';
import config from '../../config';

const EVENT_TYPE_TOKEN = 'TOKEN';
const UNATHORIZED_ERROR_KEY = 'Unauthorized';
const DENY_EFFECT = 'Deny';
const ALLOW_EFFECT = 'Allow';

export const basicAuthorizer = async (
  event: APIGatewayProxyWithLambdaAuthorizerEvent<any> & { type: string, methodArn: string, authorizationToken: string }, 
  _context: Context, 
  callback: APIGatewayProxyCallback,
): Promise<void> => {

  console.log('basicAuthorizer input event', event);

  if(event.type !== EVENT_TYPE_TOKEN) {
    handleUnathorizedError(UNATHORIZED_ERROR_KEY, callback);
  }

  try {
    const credentials = parseBasicAuthToken(event.authorizationToken);
    
    console.log('user credentials', credentials);
    
    const storedPassword = config[credentials.login];
    const effect = (!storedPassword || storedPassword !== credentials.password) ? DENY_EFFECT : ALLOW_EFFECT;
    const policy = generatePolicy(credentials.token, event.methodArn, effect);

    console.log(JSON.stringify(policy));

    callback(null, policy);
  } catch(error) {
    handleUnathorizedError(`${UNATHORIZED_ERROR_KEY}: ${error.message}`, callback)
  }
}

function handleUnathorizedError(error: string, callback: APIGatewayProxyCallback): void {
  console.error('Unathorized error', error);
  callback(UNATHORIZED_ERROR_KEY);
}

function generatePolicy(token: string, resourceArn: string, effect = ALLOW_EFFECT): any {
  return {
    principalId: token,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resourceArn,
        }
      ]
    }
  }
}