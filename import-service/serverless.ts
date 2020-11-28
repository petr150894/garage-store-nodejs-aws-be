import type { Serverless } from 'serverless/aws';
import config from './config';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
  },
  resources: {
    Resources: {
      productsSQSQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "import-products-queue"
        }
      },
      GatewayResponseDefault5xx: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },    
          ResponseType: 'DEFAULT_5XX',
          RestApiId: {
            "Ref": 'ApiGatewayRestApi',
          },
          StatusCode: '500'
        }  
      },
      GatewayResponseAccessDenied: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },    
          ResponseType: 'ACCESS_DENIED',
          RestApiId: {
            "Ref": 'ApiGatewayRestApi',
          },
          StatusCode: '403'
        }  
      },
      GatewayResponseUnauthorized: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'*'",
          },    
          ResponseType: 'UNAUTHORIZED',
          RestApiId: {
            "Ref": 'ApiGatewayRestApi',
          },
          StatusCode: '401'
        }  
      }
    },
    Outputs: {
      productsSQSQueueArn: {
        Value: {
          "Fn::GetAtt": ["productsSQSQueue", "Arn"]
        },
        Export: {
          Name: "productsSQSQueueArn"
        }
      }
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'develop',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      MY_AWS_ACCESS_KEY: config.MY_AWS_ACCESS_KEY,
      MY_AWS_ACCESS_KEY_ID: config.MY_AWS_ACCESS_KEY_ID,
      BUCKET_REGION: config.BUCKET_REGION,
      BUCKET_UPLOAD_NAME: config.BUCKET_UPLOAD_NAME,
      BUCKET_UPLOAD_DIR_NAME: config.BUCKET_UPLOAD_DIR_NAME,
      BUCKET_PARSED_DIR_NAME: config.BUCKET_PARSED_DIR_NAME,
      BUCKET_UPLOAD_LINK_EXPIRES: config.BUCKET_UPLOAD_LINK_EXPIRES,
      SQS_REGION: config.SQS_REGION,
      SQS_URL: { "Ref": "productsSQSQueue" },
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:ListBucket",
        Resource: `arn:aws:s3:::${config.BUCKET_UPLOAD_NAME}`
      },
      {
        Effect: "Allow",
        Action: "s3:*",
        Resource: `arn:aws:s3:::${config.BUCKET_UPLOAD_NAME}/*`
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: {
          "Fn::GetAtt": ["productsSQSQueue", "Arn"]
        }
      }
    ]
  },
  functions: {
    importProductsFile: {
      handler: 'handlers.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import/products',
            cors: true,
            request: {
              parameters: {
                querystrings:{
                  fileName: true
                }
              }
            },
            authorizer: {
              name: 'basicTokenAuthorizer',
              arn: {
                "Fn::Join": ["", [ "arn:aws:lambda:", { "Ref": "AWS::Region" }, ":", { Ref: "AWS::AccountId" }, ":function:authorization-service-develop-basicAuthorizer" ]]
              } as any,
              resultTtlInSeconds: 0,
              identitySource: 'method.request.header.Authorization',
              type: 'token'
            }
          }
        }
      ]
    },
    parseImportFile: {
      handler: 'handlers.parseImportFile',
      events: [
        {
          s3: {
            bucket: config.BUCKET_UPLOAD_NAME,
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: `${config.BUCKET_UPLOAD_DIR_NAME}/`,
                suffix: '.csv'
              }
            ],
            existing: true
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;
