import express from 'express';
import { createOneTimeDonation, createRecurringDonation ,createCheckoutSession} from '../controllers/donationController.js';
// import * as donationController from "../controllers/donationController.js"
const router = express.Router();

// Route for one-time donations
router.post('/one-time', createOneTimeDonation);

// Route for recurring donations
router.post('/recurring', createRecurringDonation);
router.post("/create-checkout-session",createCheckoutSession);

export default router;
