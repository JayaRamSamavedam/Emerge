import Donation from '../schema/donationSchema.js';
import ScheduledDonations from '../schema/donationScheduleSchema.js';
import User from '../schema/userSchema.js';
import axios from 'axios';
import { Request } from '../helpers/axios_helpers.js';
import Order from '../schema/ordersSchema.js';

// export const createDonation = async (req,res)=>{

//     console.log(req.body);
//     const {ministry,amount,instrumentId,donationType} = req.body;
//     try{
//          const user = await User.findOne({ email: "jayaram.samavedam1@gmail.com" });
//          if (!user) return res.status(404).send({ error: 'User not found' });
//          const donation = new Donation({
//             user:"jayaram.samavedam1@gmail.com",
//             ministry:ministry,
//             amount:amount*100
//          })
//          await donation.save();
//          const createTransaction = await Request("post","/v1/accounts/transactions",
//             {
//               "amount": amount,
//               "paymentInstrumentId": instrumentId,
//               "accountId": "acc-c8a42bea-a708-4165-beea-e1eb95b5000a",
//               "type": "pull",
//               "currency": "USD",
//               "method": "card",
//               "channel": "online",
//               "referenceId":`${donation._id}`,
//           }
//           )
//           if(createTransaction.status==200){
//             if(donationType === 'one-time'){
//                 donation.transactionId = createTransaction.data.id;
//                 donation.isRecurring = false;
//                 await donation.save();
//                 console.log(donation);
//             }
//             else{
//                 donation.transactionId = createTransaction.data.id;
//                 donation.isRecurring = true;
//                 await donation.save();
//                 const donationScheduleSchema = new ScheduledDonations({
//                     user:"jayaram.samavedam1@gmail.com",
//                     ministry:donation.ministry,
//                     amount:donation.amount,
//                     currency:donation.currency,
//                     paymentInstrumentId:instrumentId,
//                     isActive:true,
//                 });
//                 await donationScheduleSchema.save();
//             }
//           }else{
//             console.log(donation._id);
//             await Donation.findByIdAndDelete(donation._id);
//           }
//           console.log(createTransaction)
//           return res.status(200)
//     }
//     catch(error){
//         console.error(error);
//         console.log("hi")
//         res.status(400).send({ error: error.message });
//     }
// }
export const createDonation = async (req, res) => {
    console.log(req.body);
    const { ministry, amount, instrumentId, donationType } = req.body;

    let donation = null; // Declare donation reference outside try block

    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            console.log("User not found");
            return res.status(404).send({ error: 'User not found' });
        }

        donation = new Donation({
            user: req.user.email,
            ministry: ministry,
            amount: amount, // Convert amount to cents if needed
        });

        await donation.save();
        console.log("Donation saved:", donation);

        const createTransaction = await Request("post", "/v1/accounts/transactions", {
            "amount": amount*100, // Assuming the API requires the original amount, not cents
            "paymentInstrumentId": instrumentId,
            "accountId": "acc-c8a42bea-a708-4165-beea-e1eb95b5000a",
            "type": "pull",
            "currency": "USD",
            "method": "card",
            "channel": "online",
            "referenceId": `${donation._id}`,
        });

        if (createTransaction.status === 200) {
            if (donationType === 'one-time') {
                donation.transactionId = createTransaction.data.id;
                donation.isRecurring = false;
                await donation.save();
                console.log("One-time donation completed:", donation);
            } else {
                donation.transactionId = createTransaction.data.id;
                donation.isRecurring = true;
                await donation.save();

                const donationScheduleSchema = new ScheduledDonations({
                    user: user.email,
                    ministry: donation.ministry,
                    amount: donation.amount,
                    currency: "USD",
                    paymentInstrumentId: instrumentId,
                    isActive: true,
                });
                await donationScheduleSchema.save();
                console.log("Recurring donation scheduled:", donationScheduleSchema);
            }
            return res.status(200).send({"message":"donation successfull"})
        } else {
            throw new Error("Transaction failed with status: " + createTransaction.status);
        }

        return res.status(200).send({ message: 'Donation created successfully' });
    } catch (error) {
        console.error("Error in createDonation:", error);

        // Re-throw the error after logging if required
        return res.status(400).send({ error: error.message });
    } finally {
        // Ensure donation is deleted if an error occurred and it was created
        if (donation && !donation.transactionId) {
            try {
                console.log("Deleting incomplete donation:", donation._id);
                await Donation.findByIdAndDelete(donation._id);
                console.log("Incomplete donation deleted successfully.");
            } catch (deleteError) {
                console.error("Failed to delete incomplete donation:", deleteError);
            }
        }
    }
};

export const getDonations = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;

        const donations = await Donation.find({ user: req.user.email })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by latest donations

        const total = await Donation.countDocuments({ user: req.user.email }); // Total count for pagination

        return res.status(200).json({
            donations,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (exception) {
        return res.status(400).json({ message: exception.message });
    }
};

export const getScheduledDonations = async(req,res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
        const skip = (page - 1) * limit;
        const donations = await ScheduledDonations.find({ user: req.user.email })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by latest donations

        const total = await ScheduledDonations.countDocuments({ user: req.user.email }); // Total count for pagination
        return res.status(200).json({
            donations,
            total,
            page,
            pages: Math.ceil(total / limit),
        });
    } catch (exception) {
        return res.status(400).json({ message: exception.message });
    }

}
