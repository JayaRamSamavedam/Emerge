
import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import Stripe from 'stripe';
import axios from 'axios';
dotenv.config();

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

import productrouter from "./routes/productroutes.js";
import cartrouter from "./routes/cartroutes.js";
app.use(cartrouter);
import adminrouter from "./routes/adminroutes.js";
app.use(adminrouter);
import orderRouter from "./routes/orderroutes.js";
app.use(orderRouter);
app.use(productrouter)
app.use(userrouter);


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
      const colors = [];  // Array to hold unique colors
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
          if (!colors.includes(color)) {
              colors.push(color);
          }
          if (!sizes.includes(size)) {
              sizes.push(size);
          }
      });

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

app.get("/",(req,res)=>{
    res.send(" i am alive");
})
