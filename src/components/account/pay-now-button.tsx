'use client';

import { useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type RetryPaymentResponse = {
  order_id: string;
  order_number: string;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  retryable_until: string;
};

type ApiErrorResponse = {
  error?: string;
};

type PayNowButtonProps = {
  orderId: string;
  className?: string;
  onSuccess?: (orderId: string) => void;
  onFailure?: (message: string) => void;
};

export default function PayNowButton({
  orderId,
  className,
  onSuccess,
  onFailure,
}: PayNowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleClick() {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const res = await fetch(`/api/account/orders/${orderId}/retry-payment`, {
        method: 'POST',
      });

      const contentType = res.headers.get('content-type') || '';
let payload: RetryPaymentResponse | ApiErrorResponse | null = null;

if (contentType.includes('application/json')) {
  payload = await res.json();
} else {
  const text = await res.text();
  throw new Error(text || 'Unexpected non-JSON response from retry-payment API');
}

if (!res.ok) {
  const message =
    payload && 'error' in payload && typeof payload.error === 'string'
      ? payload.error
      : 'Failed to initialize payment retry';

  throw new Error(message);
}

const data = payload as RetryPaymentResponse;

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: 'naevii.co',
        description: `Order ${data.order_number}`,
        order_id: data.razorpay_order_id,

        retry: {
          enabled: true,
          // max_count is not supported in Razorpay Web Checkout.
        },

        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            const verifyRes = await fetch('/api/checkout/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                order_id: data.order_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyContentType = verifyRes.headers.get('content-type') || '';
            let verifyPayload: any = null;

            if (verifyContentType.includes('application/json')) {
              verifyPayload = await verifyRes.json();
            } else {
              const text = await verifyRes.text();
              throw new Error(text || 'Unexpected non-JSON response from verify API');
            }

            if (!verifyRes.ok) {
              throw new Error(verifyPayload?.error || 'Payment verification failed');
            }

            onSuccess?.(data.order_id);
            window.location.href = `/checkout/success?order=${data.order_id}`;
          } catch (error) {
            const message =
              error instanceof Error ? error.message : 'Payment verification failed';
            onFailure?.(message);
            alert(message);
          }
        },

        modal: {
          ondismiss: function () {
            onFailure?.('Payment window closed before completion');
          },
        },

        theme: {
          color: '#6f3cc3',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to start payment';
      onFailure?.(message);
      alert(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={
        className ??
        'rounded-full bg-plum px-4 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60'
      }
    >
      {isLoading ? 'Processing...' : 'Pay now'}
    </button>
  );
}