import nodemailer from 'nodemailer';
import config from '../config';
import httpStatus from 'http-status';
import AppError from '../errors/AppError';

const sendEmail = async (
  to: string,
  html: string,
  priority: 'high' | 'low' | 'normal' = 'normal',
  replyTo: string = 'queue-meet@support.com',
  subject: string = 'User password change mail',
) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: config.node_env === 'production',
    auth: {
      user: config.nodemailer_auth_user_email,
      pass: config.nodemailer_auth_password,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `Queue-Meet ${config.nodemailer_auth_user_email}`,
      to,
      subject,
      text: 'Reset your password withen 10 minutes',
      priority,
      replyTo,
      html,
    });
    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.log('error found', error);
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      (error as Error)?.message,
    );
  }
};

export default sendEmail;
