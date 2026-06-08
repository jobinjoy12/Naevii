import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

type AdminOrderEmailInput = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalInr: number;
};

type CustomerPaidEmailInput = {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalInr: number;
};

function assertEmailEnv() {
  if (!process.env.RESEND_API_KEY) throw new Error('Missing RESEND_API_KEY');
  if (!process.env.EMAIL_FROM) throw new Error('Missing EMAIL_FROM');
  if (!process.env.ADMIN_EMAIL) throw new Error('Missing ADMIN_EMAIL');
}

export async function sendAdminOrderCreatedEmail(input: AdminOrderEmailInput) {
  assertEmailEnv();

  return resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: process.env.ADMIN_EMAIL!,
    replyTo: process.env.ADMIN_EMAIL!,
    subject: `New order created: ${input.orderNumber}`,
    html: `
      <h2>New order created</h2>
      <p><strong>Order:</strong> ${input.orderNumber}</p>
      <p><strong>Customer:</strong> ${input.customerName}</p>
      <p><strong>Email:</strong> ${input.customerEmail}</p>
      <p><strong>Total:</strong> ₹${input.totalInr}</p>
    `,
  });
}

export async function sendCustomerPaymentConfirmedEmail(input: CustomerPaidEmailInput) {
  assertEmailEnv();

  return resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: input.customerEmail,
    replyTo: process.env.ADMIN_EMAIL!,
    subject: `Payment received for order ${input.orderNumber}`,
    html: `
      <h2>Payment received</h2>
      <p>Hi ${input.customerName},</p>
      <p>Your payment for order <strong>${input.orderNumber}</strong> has been received successfully.</p>
      <p><strong>Amount:</strong> ₹${input.totalInr}</p>
      <p>We’ll start processing your order shortly.</p>
    `,
  });
}