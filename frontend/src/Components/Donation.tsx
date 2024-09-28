import React, { useState, FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElementOptions } from '@stripe/stripe-js';

// Load Stripe using your publishable key
const stripePromise = loadStripe('pk_test_51N4hU4SFkOxgvYC9PVnsAUrfAt1DrBgl6z5CWVVfBvFhgVM4Mi7EGquPBv4wDW1yxBh3wuHoozETR5CbfSsO1c5u00HediLTnN');

const cardStyle: StripeCardElementOptions = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Roboto, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#a0aec0',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

const DonationForm: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [recurrence, setRecurrence] = useState<string>('one-time');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      if (recurrence === 'one-time') {
        // Call the API for one-time donation
        const response = await fetch('http://localhost:541/api/donate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, recurrence }),
        });

        const { clientSecret, error } = await response.json();

        if (error) {
          setErrorMessage(error);
          setIsLoading(false);
          return;
        }

        // Confirm the one-time payment
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement!,
            billing_details: {
              name: 'Donor Name', // You might want to capture the name as well
            },
          },
        });

        if (result.error) {
          setErrorMessage(result.error.message || 'An unknown error occurred');
        } else if (result.paymentIntent?.status === 'succeeded') {
          alert('One-time donation successful!');
        }
      } else {
        // Call the API for subscription
        const paymentMethodRes = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement!,
          billing_details: {
            name: 'Donor Name', // Capture name if needed
          },
        });

        if (paymentMethodRes.error) {
          setErrorMessage(paymentMethodRes.error.message || 'An unknown error occurred.');
          setIsLoading(false);
          return;
        }

        // Call the subscription API
        const result = await fetch('http://localhost:541/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethodId: paymentMethodRes.paymentMethod!.id,
            recurrence,
            amount,
          }),
        });

        const subscriptionResponse = await result.json();
        if (subscriptionResponse.error) {
          setErrorMessage(subscriptionResponse.error);
        } else {
          alert('Subscription created successfully!');
        }
      }
    } catch (err) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Donate to Our Cause</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col">
          <label className="text-gray-700">Amount (USD):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="1"
            required
            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700">Recurrence:</label>
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="one-time">One-time</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        <div>
          <label className="text-gray-700">Card Details:</label>
          <div className="mt-2 p-2 border border-gray-300 rounded-md shadow-sm">
            <CardElement options={cardStyle} />
          </div>
        </div>

        {errorMessage && <div className="text-red-500 text-center">{errorMessage}</div>}

        <button
          type="submit"
          disabled={!stripe || isLoading}
          className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-500 transition ${
            isLoading ? 'cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Processing...' : 'Donate'}
        </button>
      </form>
    </div>
  );
};

const App: React.FC = () => (
  <Elements stripe={stripePromise}>
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <DonationForm />
    </div>
  </Elements>
);

export default App;
