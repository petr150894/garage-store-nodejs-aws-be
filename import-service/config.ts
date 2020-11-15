import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.default' });

export default {
  MY_AWS_ACCESS_KEY: process.env.MY_AWS_ACCESS_KEY,
  MY_AWS_ACCESS_KEY_ID: process.env.MY_AWS_ACCESS_KEY_ID,
  BUCKET_UPLOAD_NAME: process.env.BUCKET_UPLOAD_NAME,
  BUCKET_REGION: process.env.BUCKET_REGION,
  BUCKET_UPLOAD_DIR_NAME: process.env.BUCKET_UPLOAD_DIR_NAME,
  BUCKET_PARSED_DIR_NAME: process.env.BUCKET_PARSED_DIR_NAME,
  BUCKET_UPLOAD_LINK_EXPIRES: +process.env.BUCKET_UPLOAD_LINK_EXPIRES
}