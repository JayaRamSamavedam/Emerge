import Donation from '../schema/donationSchema.js';
import RecurringDonation from '../schema/recurranceDonationSchema.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.stripe_key);

export const createOneTimeDonation = async (req, res) => {
    const { user, amount, currency = 'USD', paymentMethodId } = req.body;

    try {
        // Create a payment intent for dynamic amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe uses the smallest unit (cents for USD)
            currency,
            payment_method: paymentMethodId,
            confirm: true
        });

        // Store the donation in the database
        const donation = new Donation({
            user,
            amount,
            currency,
            stripePaymentId: paymentIntent.id,
            isRecurring: false
        });

        await donation.save();

        res.status(201).json({
            message: 'One-time donation successful',
            donation
        });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to process donation',
            error: error.message
        });
    }
};

export const createRecurringDonation = async (req, res) => {
    const { user, amount, currency = 'USD', paymentMethodId, frequency = 'monthly' } = req.body;

    try {
        // Create a Stripe customer
        const customer = await stripe.customers.create({
            payment_method: paymentMethodId,
            email: req.body.email, // If the user's email is provided
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        // Dynamically create a price for this subscription
        const price = await stripe.prices.create({
            unit_amount: amount * 100, // Stripe uses the smallest unit
            currency,
            recurring: { interval: frequency }, // Frequency can be monthly, yearly, etc.
            product_data: {
                name: `Custom donation of ${amount} ${currency}`, // Description for the product
            }
        });

        // Create a subscription with the dynamically created price
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: price.id }],
            default_payment_method: paymentMethodId,
        });

        // Store the recurring donation in the database
        const recurringDonation = new RecurringDonation({
            user,
            amount,
            currency,
            stripeSubscriptionId: subscription.id,
            frequency,
        });

        await recurringDonation.save();

        res.status(201).json({
            message: 'Recurring donation successful',
            recurringDonation
        });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to process recurring donation',
            error: error.message
        });
    }
};



// One-time and recurring donation Checkout session
export const createCheckoutSession = async (req, res) => {
  const { amount, recurring, email, currency = 'USD' } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: 'Donation',
            },
            unit_amount: amount * 100, // Convert to cents
            recurring: recurring ? { interval: 'month' } : undefined, // Recurring or one-time
          },
          quantity: 1,
        },
      ],
      mode: recurring ? 'subscription' : 'payment', // Payment mode changes for one-time or recurring
      success_url: `http://localhost:3000/success`,
      cancel_url: `http://localhost:3000/cancel`,
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
