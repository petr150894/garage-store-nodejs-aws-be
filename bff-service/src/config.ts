import * as dotenv from 'dotenv-override';

const CI_ENV_VARIABLES = { ...process.env };
dotenv.config({ path: '.env', override: true }); //default ENV variables
Object.assign(process.env, CI_ENV_VARIABLES);

export default {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV || 'development',
  PRODUCTS_SERVICE_URL: process.env.PRODUCTS_SERVICE_URL,
  CART_SERVICE_URL: process.env.CART_SERVICE_URL,
  CACHE_TTL: +process.env.CACHE_TTL,
};
