//app/plan-placing/StripePaymentForm.tsx

import React, { useState, useEffect } from 'react';
import { loadStripe, Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Define the Plan interface
interface Plan {
  price: number;
  interval?: string;
  name: string;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const LoadingAnimation: React.FC = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const SuccessAnimation: React.FC = () => (
  <div className="flex flex-col items-center">
    <div className="w-24 h-24 mb-4">
      <svg viewBox="0 0 24 24" className="text-green-500 w-full h-full">
        <path
          fill="currentColor"
          d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"
        />
      </svg>
    </div>
    <p className="text-xl font-semibold text-green-600">Thank you for your purchase!</p>
  </div>
);

interface CheckoutFormProps {
  plan: Plan;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [succeeded, setSucceeded] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-confirmation`,
      },
      redirect: 'if_required',
    });

    if (result.error) {
      setError(result.error.message ?? 'An unknown error occurred');
    } else {
      if (result.paymentIntent?.status === 'succeeded') {
        setSucceeded(true);
      } else {
        setError('Payment processing failed. Please try again.');
      }
    }

    setProcessing(false);
  };

  if (succeeded) {
    return <SuccessAnimation />;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Pay $${plan.price}${plan.interval ? `/${plan.interval}` : ''}`}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </form>
  );
};

const StripePaymentForm: React.FC<CheckoutFormProps> = ({ plan }) => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: plan.price * 100,
        currency: 'usd',
        interval: plan.interval
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setLoading(false);
      });
  }, [plan]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: { theme: 'stripe' as const },
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="mt-8">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm plan={plan} />
        </Elements>
      )}
    </div>
  );
};

export default StripePaymentForm;