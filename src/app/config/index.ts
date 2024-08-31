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
  reset_password_url: process.env.RESET_PASSWORD_URL,
  access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
  access_token_private_key: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  refresh_token_private_key: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  nodemailer_auth_user_email: process.env.NODEMAILER_AUTH_USER_EMAIL,
  nodemailer_auth_password: process.env.NODEMAILER_AUTH_PASSWORD,
};
