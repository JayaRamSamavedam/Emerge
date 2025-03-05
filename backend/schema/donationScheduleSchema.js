import mongoose from "mongoose";

const donationScheduleSchema = new mongoose.Schema({
    user:{
        type:String,
        required:true,
    },
    paymentInstrumentId:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    currency: {
        type: String,
        required: true,
        default: 'USD' // Default to USD, but can change based on Stripe or user input
    },
    ministry:{
        type:String,
        required:true,
    },
    startDate :{
        type:Date,
        default:Date.now(),
    },
    isActive:{
        type:Boolean,
        required:true,
    }
})

const ScheduledDonations = mongoose.model("RecurringDonations",donationScheduleSchema);

export default ScheduledDonations;