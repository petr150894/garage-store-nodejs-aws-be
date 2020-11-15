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
      BUCKET_UPLOAD_LINK_EXPIRES: config.BUCKET_UPLOAD_LINK_EXPIRES
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
    }
  }
}

module.exports = serverlessConfiguration;
