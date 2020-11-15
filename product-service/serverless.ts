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
    },
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
    }
  }
}

module.exports = serverlessConfiguration;
