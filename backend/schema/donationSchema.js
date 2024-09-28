import mongoose from "mongoose";

// Schema for individual donations
const donationSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1 // Ensures a positive donation amount
    },
    currency: {
        type: String,
        required: true,
        default: 'USD' // Default to USD, but can change based on Stripe or user input
    },
    stripePaymentId: {
        type: String, 
        required: true // Stripe Payment ID for tracking the transaction
    },
    isRecurring: {
        type: Boolean,
        default: false // Default to non-recurring donations
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;
