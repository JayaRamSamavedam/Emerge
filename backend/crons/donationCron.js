import cron from 'node-cron';
import ScheduledDonations from '../schema/donationScheduleSchema.js';
import { Request } from '../helpers/axios_helpers.js';
import Donation from '../schema/donationSchema.js';
import moment from 'moment';


    // Cron job: Run daily at 12:00 AM US Eastern Time
    cron.schedule('0 0 * * *', async () => {
        console.log("Cron job executed at:", new Date());
        try {
            // Get all active recurring donations
            const recurringDonations = await ScheduledDonations.find({ isActive: true });
            for (const donation of recurringDonations) {
                const startDate = moment(donation.startDate); // Moment.js for date manipulation
                const currentDate = moment().tz("America/New_York"); // Current date in US Eastern Time
                if (isMatchingDonationDate(startDate, currentDate)) {
                    const newDonation = new Donation({
                        user:donation.user,
                        amount:donation.amount,
                        isRecurring:donation.isActive,
                        ministry:donation.ministry,
                        currency:donation.currency,
                    })
                    await newDonation.save();
                    console.log(`Processing recurring donation: ${donation._id}`);
                    const createTransaction = await Request("post", "/v1/accounts/transactions", {
                        amount: newDonation.amount, // Convert cents to dollars
                        paymentInstrumentId: donation.paymentInstrumentId,
                        accountId: "acc-c8a42bea-a708-4165-beea-e1eb95b5000a",
                        type: "pull",
                        currency: donation.currency,
                        method: "card",
                        channel: "online",
                        referenceId: `${newDonation._id}`,
                    });

                    if (createTransaction.status === 200) {
                        newDonation.transactionId= createTransaction.data.id;
                        await newDonation.save();
                        console.log(`Transaction successful for donation: ${donation._id}`);
                    } else {
                        console.error(`Transaction failed for donation: ${donation._id}`);
                    }
                }
            }
        } catch (error) {
            console.error("Error in cron job:", error);
        }
    });
    

// Helper Function: Check if current date matches donation date
function isMatchingDonationDate(startDate, currentDate) {
    const startDay = startDate.date();
    const currentMonthLastDay = currentDate.clone().endOf('month').date();

    // If the start date exceeds the current month's last day, adjust to the last day
    const donationDay = Math.min(startDay, currentMonthLastDay);

    // Check if today matches the adjusted donation day
    return currentDate.date() === donationDay;
}
