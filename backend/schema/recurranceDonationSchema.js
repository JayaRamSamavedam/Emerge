// Schema for recurring donation setup
const recurringDonationSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    currency: {
        type: String,
        required: true,
        default: 'USD'
    },
    stripeSubscriptionId: {
        type: String,
        required: true // Stripe Subscription ID for tracking
    },
    frequency: {
        type: String,
        required: true,
        enum: ['weekly', 'monthly', 'yearly'], // Set the recurring frequency
        default: 'monthly'
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'canceled', 'paused'],
        default: 'active'
    }
});

const RecurringDonation = mongoose.model("RecurringDonation", recurringDonationSchema);
export default RecurringDonation;
