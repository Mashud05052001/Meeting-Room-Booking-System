import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export default {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  backend_url: process.env.BACKEND_URL,
  database_url: process.env.DATABASE_URL,
  aamarPay_url: process.env.AAMARPAY_URL,
  aamarPay_store_id: process.env.AAMARPAY_STORE_ID,
  aamarPay_verify_url: process.env.AAMARPAY_VERIFY_URL,
  aamarPay_signature_key: process.env.AAMARPAY_SIGNATURE_ID,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  reset_password_url: process.env.RESET_PASSWORD_URL,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  access_token_expires_in: process.env.ACCESS_TOKEN_EXPIRES_IN,
  access_token_private_key: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  refresh_token_expires_in: process.env.REFRESH_TOKEN_EXPIRES_IN,
  refresh_token_private_key: process.env.REFRESH_TOKEN_PRIVATE_KEY,
  nodemailer_auth_user_email: process.env.NODEMAILER_AUTH_USER_EMAIL,
  nodemailer_auth_password: process.env.NODEMAILER_AUTH_PASSWORD,
};
