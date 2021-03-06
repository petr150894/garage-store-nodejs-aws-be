import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.default' });

export default {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: +process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  SNS_REGION: process.env.SNS_REGION,
  SNS_ARN: process.env.SNS_ARN,
  SNS_SUBSCRIPTION_EMAIL: process.env.SNS_SUBSCRIPTION_EMAIL,
  SNS_SUBSCRIPTION_EMAIL_FILTER: process.env.SNS_SUBSCRIPTION_EMAIL_FILTER,
  RESTRICTED_TITLES: process.env.RESTRICTED_TITLES,
  PRODUCTS_SAVE_BATCH: +process.env.PRODUCTS_SAVE_BATCH,
}