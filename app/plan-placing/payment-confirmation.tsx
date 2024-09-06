import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function PaymentConfirmation() {
  const [status, setStatus] = useState<'success' | 'processing' | 'error' | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (clientSecret) {
      stripePromise.then((stripe) => {
        if (stripe) {
          stripe
            .retrievePaymentIntent(clientSecret)
            .then(({ paymentIntent }) => {
              switch (paymentIntent?.status) {
                case 'succeeded':
                  setStatus('success');
                  break;
                case 'processing':
                  setStatus('processing');
                  break;
                case 'requires_payment_method':
                  setStatus('error');
                  break;
                default:
                  setStatus('error');
                  break;
              }
            });
        }
      });
    }
  }, [router.isReady]);

  if (!status) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Payment Status</h1>
        {status === 'success' && (
          <div className="text-green-600">
            <p>Payment successful! Thank you for your purchase.</p>
          </div>
        )}
        {status === 'processing' && (
          <div className="text-yellow-600">
            <p>Your payment is being processed. We'll update you when it's complete.</p>
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-600">
            <p>There was an error processing your payment. Please try again.</p>
          </div>
        )}
        <button
          onClick={() => router.push('/')}
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}