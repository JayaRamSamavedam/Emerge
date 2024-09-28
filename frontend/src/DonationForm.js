// src/App.js
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe using your publishable key
const stripePromise = loadStripe("pk_test_51N4hU4SFkOxgvYC9PVnsAUrfAt1DrBgl6z5CWVVfBvFhgVM4Mi7EGquPBv4wDW1yxBh3wuHoozETR5CbfSsO1c5u00HediLTnN");

const DonationForm = () => {
  const [amount, setAmount] = useState(0);
  const [recurrence, setRecurrence] = useState('one-time');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (!stripe || !elements) {
      return; // Stripe.js has not loaded yet
    }

    // Get the CardElement to tokenize the payment info
    const cardElement = elements.getElement(CardElement);

    try {
      const response = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, recurrence })
      });

      const { clientSecret, error } = await response.json();

      if (error) {
        setErrorMessage(error);
        setIsLoading(false);
        return;
      }

      const paymentMethodRes = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (paymentMethodRes.error) {
        setErrorMessage(paymentMethodRes.error.message);
        setIsLoading(false);
        return;
      }

      if (recurrence === 'one-time') {
        const result = await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethodRes.paymentMethod.id,
        });

        if (result.error) {
          setErrorMessage(result.error.message);
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            alert('One-time donation successful!');
          }
        }
      } else {
        const result = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentMethodId: paymentMethodRes.paymentMethod.id, recurrence, amount }),
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
    <div>
      <h2>Donate</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Amount (USD):
          <input 
            type="number" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            min="1" 
            required 
          />
        </label>
        <label>
          Recurrence:
          <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
            <option value="one-time">One-time</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>

        <CardElement />
        <button type="submit" disabled={!stripe || isLoading}>
          {isLoading ? 'Processing...' : 'Donate'}
        </button>
      </form>

      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
};

const App = () => (
  <Elements stripe={stripePromise}>
    <DonationForm />
  </Elements>
);

export default App;
