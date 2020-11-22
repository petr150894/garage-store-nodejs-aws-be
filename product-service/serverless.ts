import type { Serverless } from 'serverless/aws';
import config from './config';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
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
      productsSNSTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "add-products-topic"
        }
      },
      productsSNSSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "petr_razvaliaev@epam.com",
          Protocol: "email",
          TopicArn:  { "Ref": "productsSNSTopic" }
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
      PG_HOST: config.DB_HOST,
      PG_PORT: config.DB_PORT,
      PG_DATABASE: config.DB_NAME,
      PG_USERNAME: config.DB_USER,
      PG_PASSWORD: config.DB_PASS,
      PRODUCTS_SAVE_BATCH: config.PRODUCTS_SAVE_BATCH,
      SNS_REGION: config.SNS_REGION,
      SNS_ARN: { "Ref": "productsSNSTopic" },
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: "${cf:import-service-develop.productsSQSQueueArn}"
      },
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: {
          "Ref": "productsSNSTopic"
        }
      }
    ]
  },
  functions: {
    getProductsList: {
      handler: 'handlers.getProductsList',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
          }
        }
      ]
    },
    getProductById: {
      handler: 'handlers.getProductById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{id}',
            cors: true
          }
        }
      ]
    },
    addProduct: {
      handler: 'handlers.addProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true,
          }
        }
      ]
    },
    addProductsBatch: {
      handler: 'handlers.addProductsBatch',
      events: [
        {
          sqs: {
            batchSize: config.PRODUCTS_SAVE_BATCH,
            arn: "${cf:import-service-develop.productsSQSQueueArn}"
          }
        }
      ]
    },
  }
}

module.exports = serverlessConfiguration;
