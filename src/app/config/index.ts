import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export default {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
  access_token_private_key: process.env.ACCESS_TOKEN_PRIVATE_KEY,
};
