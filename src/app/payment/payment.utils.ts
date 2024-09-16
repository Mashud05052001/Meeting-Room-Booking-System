import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import axios from 'axios';
import config from '../config';
import { TPayment } from './payment.interface';

export const initiatePayment = async (payload: TPayment, bookingId: string) => {
  const {
    totalAmount,
    customerName,
    customerEmail,
    customerPhone,
    cancleUrl,
    date,
  } = payload;
  const storeId = config.aamarPay_store_id;
  const signatureKey = config.aamarPay_signature_key;
  const url = config.aamarPay_url;
  const userName = customerName.includes(' ')
    ? customerName.split(' ')[0]
    : customerName;
  const timestamp = Date.now();
  const randomValue = Math.random().toString(36).substring(2, 8);
  const transactionId = `T-${userName}${randomValue}:${timestamp}`;

  const paymentData = {
    store_id: storeId,
    signature_key: signatureKey,
    tran_id: transactionId,
    amount: Number(totalAmount),
    currency: 'USD',
    cus_name: customerName,
    cus_email: customerEmail,
    cus_phone: customerPhone,
    success_url: `${config.backend_url}/payment/success?transactionId=${transactionId}&bookingId=${bookingId}`,
    fail_url: `${config.backend_url}/payment/failed?transactionId=${transactionId}&bookingId=${bookingId}`,
    cancel_url: `${cancleUrl}&bookingId=${bookingId}`,
    type: 'json',
    desc: `Booking Date : ${date}`,
  };

  try {
    const response = await axios.post(url as string, paymentData);
    return response.data.payment_url;
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Payment failed!');
  }
};

export const verifyPayment = async (transactionId: string) => {
  try {
    const response = await axios.get(config.aamarPay_verify_url!, {
      params: {
        request_id: transactionId,
        store_id: config.aamarPay_store_id,
        signature_key: config.aamarPay_signature_key,
        type: 'json',
      },
    });
    return response.data;
  } catch (error) {
    throw new AppError(500, 'Payment validation failed');
  }
};
