import { ClientConfig, Client } from 'pg';
import config from '../config';

const { DB_HOST, DB_NAME, DB_PASS, DB_PORT, DB_USER }  = config;
const clientConfig: ClientConfig = {
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASS,
  ssl: {
    rejectUnauthorized: false
  },
};
const client: Client = new Client(clientConfig);

export async function getDBClient(): Promise<Client> {
  // Using a private property to define db connection state 
  // https://github.com/brianc/node-postgres/pull/1365
  if(!(client as any)._connected) {
    await client.connect();
  }
  return client;
}

