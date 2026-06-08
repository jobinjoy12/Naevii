import Razorpay from 'razorpay';
import crypto from 'crypto';

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function createRazorpayOrder(
  amountInr: number,
  receipt: string,
  notes?: Record<string, string>
) {
  return rzp.orders.create({
    amount: Math.round(amountInr * 100),
    currency: 'INR',
    receipt,
    notes,
  });
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const body = `${orderId}|${paymentId}`;
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex');

  return expected === signature;
}