
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import Stripe from 'stripe';
import axios from 'axios';
import mongoose from 'mongoose';
dotenv.config();
import moment from 'moment-timezone';
import cron from "node-cron"
import PrintfullProduct from './schema/printfullProductSchema.js';
const stripe = new Stripe(process.env.stripe_key);
const app = express();
const frontendURL =process.env.CLIENT;
app.use(express.urlencoded({ extended: false }))

// Configure Helmet for strong security
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
    }
}));
app.use(helmet.dnsPrefetchControl({ allow: false }));
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies({ permittedPolicies: 'none' }));
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }));
app.use(helmet.xssFilter());


// Rate limiting to prevent brute force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

// CORS configuration
const corsOptions = {
    origin:`${frontendURL}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

import "./db/connection.js"
import userrouter from './routes/userroutes.js';
// import productrouter from './routes/productroutes.js';
import donaterouter from "./routes/donationRoutes.js"
import productrouter from "./routes/productroutes.js";
import cartrouter from "./routes/cartroutes.js";
app.use(cartrouter);
app.use(donaterouter);
import adminrouter from "./routes/adminroutes.js";
app.use(adminrouter);
import orderRouter from "./routes/orderroutes.js";
import { search } from './controllers/productController.js';
import Color from './schema/colorSchema.js';
app.use(orderRouter);
app.use(productrouter)
app.use(userrouter);


const scheduleSchema = new mongoose.Schema({
    userId: String,
    category: { type: String, enum: ["daily", "monthly", "yearly"], required: true },
    message: { type: String, required: true },
    startDate:
    
    
    { type: Date, required: true },
  });
  
  const Schedule = mongoose.model("Schedule", scheduleSchema);
  
  // Mock function to simulate sending a message
  function sendMessage(message) {
    console.log("Message sent:", message);
  }
  
  // Cron Jobs
  cron.schedule("0 0 * * *", async () => {
    // Run daily
    console.log("Running daily jobs...");
    const today = new Date();
    const dailySchedules = await Schedule.find({ category: "daily" });
    dailySchedules.forEach((schedule) => {
      sendMessage(schedule.message);
    });
  });
  
  cron.schedule("0 0 1 * *", async () => {
    // Run monthly
    console.log("Running monthly jobs...");
    const today = new Date();
    const monthlySchedules = await Schedule.find({ category: "monthly" });
    monthlySchedules.forEach((schedule) => {
      sendMessage(schedule.message);
    });
  });
  
  cron.schedule("0 0 1 1 *", async () => {
    // Run yearly
    console.log("Running yearly jobs...");
    const today = new Date();
    const yearlySchedules = await Schedule.find({ category: "yearly" });
    yearlySchedules.forEach((schedule) => {
      sendMessage(schedule.message);
    });
  });
  
  // Route to schedule a new message
  app.post("/schedule", async (req, res) => {
    const { userId, category, message } = req.body;
    const startDate = new Date();
  
    try {
      const schedule = new Schedule({ userId, category, message, startDate });
      await schedule.save();
      res.status(201).send("Message scheduled successfully!");
    } catch (error) {
      res.status(500).send("Error scheduling message");
    }
  });
  
console.log(Date.now())
  // Mock Time for Testing
import mockdate from 'mockdate'

  app.post("/mock-time", (req, res) => {
    const { mockTime } = req.body;
    console.log(Date.now().toLocaleString())
    mockdate.set(new Date(mockTime));
    console.log(Date.now().toLocaleString())
    res.send(`Time mocked to ${mockTime}`);
  });
  
  app.post("/reset-time", (req, res) => {
    mockdate.reset();
    res.send("Time reset to the system's current time");
  });
  cron.schedule("0 0 * * *", async () => {
    console.log("Running daily jobs...");
  }, {
    timezone: "UTC"
  });
  function logMessage() {
    console.log('Cron job executed at:', new Date().toLocaleString());
    }
    
const PORT = process.env.PORT ;

app.listen(PORT,()=>{
    console.log(`server started at port ${PORT}`);
})

app.post('/api/donate', async (req, res) => {
  const { amount, recurrence } = req.body;
  console.log(req.body);  // Logs the incoming request body

  try {
      if (recurrence === 'one-time') {
          const paymentIntent = await stripe.paymentIntents.create({
              amount: amount * 100,  // Stripe expects the amount in cents
              currency: 'usd',
              payment_method_types: ['card'],
          });
          res.send({ clientSecret: paymentIntent.client_secret });
      } else {
          res.send({ clientSecret: null });
      }  
  } catch (error) {
    console.log(error)
      res.status(500).send({ error: error.message });
  }
});

  
  // Handle subscriptions
  app.post('/api/subscribe', async (req, res) => {
    const { paymentMethodId, amount, recurrence } = req.body;
  
    try {
      const interval = recurrence === 'weekly' ? 'week' : recurrence === 'monthly' ? 'month' : 'year';
  
      // Create a customer and attach the payment method
      const customer = await stripe.customers.create({
        payment_method: paymentMethodId,
        email: 'jayaramsamavedam04@gmail.com', // Use an actual email in production
        invoice_settings: { default_payment_method: paymentMethodId }
      });
  
      // Create a subscription with the chosen recurrence
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Recurring Donation',
            },
            unit_amount: amount * 100,
            recurring: { interval }
          }
        }],
        expand: ['latest_invoice.payment_intent'],
      });
  
      res.send({ subscription });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });
  
  // Stripe Webhook endpoint
  app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = 'whsec_f76d7ff00aebf74e72d59704e7c026340b53f17b81ef958f8f7eac6f0f853483'; // Get it from Stripe Dashboard
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    // Handle different types of events
    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object;
      console.log('Payment for invoice succeeded', invoice.id);
    }
  
    if (event.type === 'invoice.payment_failed') {
      const invoice = event.data.object;
      console.log('Payment for invoice failed', invoice.id);
    }
  
    res.status(200).send({ received: true });
  });
  

// Your Printful API token
const PRINTFUL_API_TOKEN = process.env.printful_token;

// Fetch products from Printful
app.get('/api/products', async (req, res) => {
  console.log("I am invoked")
    try {
        const response = await axios.get('https://api.printful.com/store/products', {
            headers: {
                Authorization: `Bearer ${PRINTFUL_API_TOKEN}`,
            },
        });
        console.log(response)
        res.json(response.data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products from Printful' });
    }
});


app.get('/api/products/info', async (req, res) => {
  const { offset, limit,search } = req.body; // Destructure offset and limit from request body
  
  try {
      const response = await axios.get('https://api.printful.com/store/products', {
          headers: {
              Authorization: `Bearer ${PRINTFUL_API_TOKEN}`,
          },
          params: {
              search:search || "",
              offset: offset || 0, // Default to 0 if not provided
              limit: limit || 9,  // Default to 10 if not provided
          },
      });

      if (response && response.data && response.data.result) {
          const productDetails = await Promise.all(
              response.data.result.map(async (product) => {
                  // Fetch additional details for each product
                  const additionalDetailsResponse = await axios.get(
                      `https://api.printful.com/store/products/${product.id}`,
                      {
                          headers: {
                              Authorization: `Bearer ${PRINTFUL_API_TOKEN}`,
                          },
                      }
                  );

                  const additionalDetails = additionalDetailsResponse.data.result;
                  const price = additionalDetailsResponse.data.result.sync_variants[0].retail_price;
                  // Combine the base product data with additional details
                  return {
                      id: product.id,
                      name: product.name,
                      variants: product.variants,
                      synced: product.synced,
                      thumbnail_url: product.thumbnail_url,
                      is_ignored: product.is_ignored,
                      price: price, // Append additional details

                  };
              })
          );

          // Send the processed product details to the frontend
          res.json({ products: productDetails ,paging:response.data.paging});
      } else {
          res.status(404).json({ error: 'No products found' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch products from Printful' });
  }
});


app.get('/api/products/:id', async (req, res) => {
  const productId = req.params.id;
  try {
      const response = await axios.get(`https://api.printful.com/store/products/${productId}`, {
          headers: {
              Authorization: `Bearer ${PRINTFUL_API_TOKEN}`,
          },
      });

      // Extract the sync_variants array
      const syncVariants = response.data.result.sync_variants;

      // Objects to store the grouped data
      const sizeToColors = {};  // For each size, list of colors
      const colorToSizes = {};  // For each color, list of sizes
      const colors = []; 
      const colorsobjects =[] // Array to hold unique colors
      const sizes = [];  // Array to hold unique sizes

      // Iterate over the sync_variants to group sizes and colors
      syncVariants.forEach(variant => {
          const size = variant.size;
          const color = variant.color;

          // Add color to size
          if (!sizeToColors[size]) {
              sizeToColors[size] = [];
          }
          if (!sizeToColors[size].includes(color)) {
              sizeToColors[size].push(color);
          }

          // Add size to color
          if (!colorToSizes[color]) {
              colorToSizes[color] = [];
          }
          if (!colorToSizes[color].includes(size)) {
              colorToSizes[color].push(size);
          }

          // Add unique colors and sizes to the arrays
          if (!colorsobjects.includes(color)) {
            colorsobjects.push(color);
              colors.push({"color":color,"image":variant.files[1]?.preview_url});
          }
          if (!sizes.includes(size)) {
              sizes.push(size);
          }
      });
      console.log(colors)

      // Send back the data
      res.json({
          productDetails: response.data.result,
          sizeToColors: sizeToColors,
          colorToSizes: colorToSizes,
          colors: colors,
          sizes: sizes,
      });

  } catch (error) {
      console.error('Error fetching product details:', error);
      res.status(500).json({ error: 'Failed to fetch product details' });
  }
});
async function insertUniqueColors(colors) {
  try {
    // Iterate through each color and try to insert it
    for (const color of colors) {
      // Use upsert to insert only if the color does not exist
      await Color.updateOne(
        { name: color }, // Filter condition to check for existing color
        { $setOnInsert: { name: color } }, // Insert operation if the color does not exist
        { upsert: true } // Enables the upsert behavior
      );
    }
    console.log('Colors inserted/checked.');
  } catch (error) {
    console.error('Error inserting colors:', error);
  }
}

app.post('/api/products/update', async (req, res) => {
  try {
      const response = await axios.get('https://api.printful.com/store/products', {
          headers: {
              Authorization: `Bearer ${PRINTFUL_API_TOKEN}`,
          },
      });

      const universalColors = new Set();

      if (response?.data?.result) {
          await Promise.all(
              response.data.result.map(async (product) => {
                  try {
                      const additionalDetailsResponse = await axios.get(
                          `https://api.printful.com/store/products/${product.id}`,
                          {
                              headers: {
                                  Authorization: `Bearer ${PRINTFUL_API_TOKEN}`,
                              },
                          }
                      );
                      const additionalDetails = additionalDetailsResponse.data.result;
                      const sync_variants = additionalDetails.sync_variants;

                      const colors = new Set();
                      const sizes = new Set();

                      sync_variants.forEach((variant) => {
                          colors.add(variant.color);
                          sizes.add(variant.size);
                          universalColors.add(variant.color);
                      });

                      const printproduct = {
                          productId: product.id,
                          name: product.name,
                          coverImage: product.thumbnail_url,
                          price: sync_variants[0]?.retail_price || 0,
                          colors: Array.from(colors),
                          sizes: Array.from(sizes),
                      };

                      await PrintfullProduct.updateOne(
                          { productId: product.id },
                          printproduct,
                          { upsert: true }
                      );
                  } catch (error) {
                      console.error(`Failed to fetch or save details for product ${product.id}`, error);
                  }
              })
          );

          // Debugging: Log the universalColors array
          console.log('Unique Colors:', Array.from(universalColors));

          await Promise.all(
              Array.from(universalColors).map(async (color) => {
                  try {
                      // Debugging: Log each color before saving
                      console.log(`Saving color: ${color}`);
                      await Color.updateOne(
                          { name: color },
                          { name: color },
                          { upsert: true }
                      );
                  } catch (error) {
                      console.error(`Failed to save color ${color}:`, error);
                  }
              })
          );

          const pr = await PrintfullProduct.find();
          res.json(pr);
      } else {
          res.status(404).json({ error: 'No products found' });
      }
  } catch (error) {
      console.error('Error fetching products from Printful:', error);
      res.status(500).json(error.message);
  }
});


import ScheduledDonations from './schema/donationScheduleSchema.js';
import { Request } from './helpers/axios_helpers.js';
import Donation from './schema/donationSchema.js';


cron.schedule('0 0 * * *', async () => {
  console.log("Cron job executed at:", new Date());
  try {
      // Get all active recurring donations
      const recurringDonations = await ScheduledDonations.find({ isActive: true });
      for (const donation of recurringDonations) {
          const startDate = moment(donation.startDate); // Moment.js for date manipulation
          const currentDate =moment(Date.now()) // Current date in US Eastern Time
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


app.get("/",(req,res)=>{
    res.send(" i am alive");
})
