import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// REPLACE WITH YOUR PUBLIC STRIPE KEY from dashboard.stripe.com
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx"); 

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    // In a real app, fetch ClientSecret from backend here.
    // For now, we simulate the UI interaction.
    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);

    if (result.error) {
      setError(result.error.message);
    } else {
      setSuccess(true);
      console.log("Token:", result.token);
      // Send this token to your backend to charge
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded bg-white">
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success ? (
        <div className="text-green-600 font-bold text-center">Payment Successful! (Demo)</div>
      ) : (
        <button type="submit" disabled={!stripe} className="w-full bg-primary text-white font-bold py-3 rounded hover:bg-red-700 transition">
          Pay Now
        </button>
      )}
    </form>
  );
};

export default function Payment() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* Manual Payment (UPI) - Best for India */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Pay via UPI (Fastest)</h2>
          <div className="bg-gray-100 p-4 rounded text-center mb-4">
            <p className="text-sm text-gray-500 mb-2">Scan QR Code to Pay Booking Amount</p>
            {/* Replace with your actual UPI QR Image */}
            <div className="w-48 h-48 bg-white mx-auto border-2 border-dashed border-gray-300 flex items-center justify-center">
              <span className="text-gray-400">Your QR Code Here</span>
            </div>
            <p className="font-mono mt-2 font-bold text-dark">UPI ID: vrl-logistic@upi</p>
          </div>
          <p className="text-xs text-gray-500 text-center">After payment, please send screenshot to WhatsApp +91 98765 43210</p>
        </div>

        {/* Card Payment (Stripe) */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold mb-4">Pay via Card (Secure)</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
          <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-sm">
            <span>Powered by</span> 
            <span className="font-bold text-indigo-600">Stripe</span>
          </div>
        </div>

      </div>
    </div>
  );
}