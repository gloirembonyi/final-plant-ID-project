import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Plan } from '@/types/Plan';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentFormProps {
  plan: Plan;
}

const CheckoutForm: React.FC<StripePaymentFormProps> = ({ plan }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
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

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || processing || succeeded}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Pay $${plan.price}${plan.interval ? `/${plan.interval}` : ''}`}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {succeeded && (
        <div className="text-green-500 mt-2">Payment succeeded! Thank you for your purchase.</div>
      )}
    </form>
  );
};

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ plan }) => {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
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
      .then((data) => setClientSecret(data.clientSecret));
  }, [plan]);

  const appearance = {
    theme: 'stripe' as const,
  };
  const options = {
    clientSecret,
    appearance,
  };

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