import express from 'express';
// import { createOneTimeDonation, createRecurringDonation ,createCheckoutSession} from '../controllers/donationController.js';
import * as donationController from "../controllers/donationController.js"
import verifyAuthToken from '../middlewares/verifyAuthToken.js';
import  checkRoleAccess from '../middlewares/checkroleaccess.js';

import requestLogger from '../middlewares/requestlogger.js';
const router = express.Router();
router.post("/user/donate",verifyAuthToken,donationController.createDonation);
router.get("/donations",verifyAuthToken,donationController.getDonations);
router.get("/scheduledDonations",verifyAuthToken,donationController.getScheduledDonations);
export default router;
