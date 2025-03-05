import Order from '../schema/ordersSchema.js';
import Cart from '../schema/cartSchema.js';
import Product from '../schema/productSchema.js';
import User from '../schema/userSchema.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import Stripe from 'stripe'
import axios from 'axios';
import { Request } from '../helpers/axios_helpers.js';
import { create } from 'domain';
import { channel } from 'diagnostics_channel';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function placeOrderOnPrintful(items, shipmentAddress) {
  try {
    const response = await axios.post('https://api.printful.com/orders', {
      recipient: shipmentAddress,
      items: items.map(item => ({
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
      })),
    }, {
      headers: {
        Authorization: `Bearer ${process.env.printful_token}`,
      },
    });

    return response.data;  // This contains Printful's response, including the order ID.
  } catch (error) {
    console.error('Error placing order on Printful:', error);
    throw new Error('Failed to place order on Printful');
  }
}



export const confirmPayment = async (req, res) => {
  console.log("hi");
  try {
    const { paymentIntentId, method } = req.body;
    console.log(req.body);

    if (!paymentIntentId) {
      return res.status(400).send({ success: false, error: 'PaymentIntent ID is missing.' });
    }

    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check if the payment was successful
    if (paymentIntent.status === 'succeeded') {
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);

      // Find the order associated with this payment intent (assuming order is tied to paymentIntentId)
      const order = await Order.findOne({ 'paymentDetails.transactionId': paymentIntentId });

      if (!order) {
        return res.status(404).send({ success: false, error: 'Order not found.' });
      }

      // Update the order to reflect successful payment
      order.paymentDetails.status = 'Completed';
      order.orderStatusMessage = 'Processing';
      await order.save();

      // If method is 'cart-buy-now', clear the user's cart
      if (method === 'cart-buy-now') {
        const cart = await Cart.findOne({ user: order.user, paymentId: paymentIntentId });

        if (cart && order.paymentDetails.status === 'Completed') {
          // Delete the cart
          await Cart.findOneAndDelete({ user: order.user, paymentId: paymentIntentId });
        }
      }

      const printfulOrder = await createPrintfulOrder(order);
      if (printfulOrder && printfulOrder.id) {
        order.externalId = printfulOrder.id;
        await order.save();
      } else {
        return res.status(500).send({
          success: false,
          error: 'Failed to place the order on Printful.',
        });
      }

      // Send a response indicating the payment was confirmed, the order was updated, and the cart was cleared
      return res.status(200).send({
        success: true,
        message: 'Payment confirmed, order updated, and cart cleared.',
        order,
      });

    } else {
      // Handle cases where the payment was not successful
      console.log("Payment was not successful.");
      return res.status(400).send({
        success: false,
        error: 'Payment was not successful. Current status: ' + paymentIntent.status,
      });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    return res.status(500).send({
      success: false,
      error: 'Internal Server Error: ' + error.message,
    });
  }
};



const fetchPrintfulProduct = async (productId) => {
  try {
    const response = await axios.get(`https://api.printful.com/store/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${process.env.printful_token}`,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching product ${productId} from Printful:`, error);
    throw new Error('Unable to fetch product details.');
  }
};

const createPrintfulOrder = async (order,shipment) => {
  try {
    console.log("Creating Printful Order...");

    // Map the items and fetch product details
    const items = await Promise.all(
      order.items.map(async (item) => {
        const productDetails = await fetchPrintfulProduct(item.productId);

        const variant = productDetails.sync_variants.find(v => v.id.toString() === item.variantId.toString());
        console.log(variant)
        if (!variant) {
          throw new Error(`Variant with ID ${item.variantId} not found in product ${item.productId}`);
        }

        return {
          sync_product_id: variant.sync_product_id,
          variant_id: variant.variant_id,
          name:variant.name,
          quantity: item.quantity,
          retail_price: item.price,
          sku:variant.sku,
          currency:variant.currency,
          files: variant.files.filter(file=> file.is_temporary === false) || [], // Include any associated files if available
        };
      })
    );

    console.log(order.shipmentAddress)
    // Build the order payload
    const printfulOrderPayload = {
      "external_id": order._id,
      "shipping": `${shipment.id}`,
      "recipient": {
        "name": order.user,
        "comany":order.user,
        "address1": order.shipmentAddress.street,
        "address2": order.shipmentAddress.city || "",
        "city": order.shipmentAddress.city,
        "state_code": order.shipmentAddress.state,
        "country_code":order.shipmentAddress.country,
        "zip": order.shipmentAddress.postalCode,
        "phone": order.shipmentAddress.phone || "9949837192",
        "email": order.user,
      },
      "items":items,
    };
console.log(printfulOrderPayload)
    // Send the request to Printful API to place the order
    const response = await axios.post("https://api.printful.com/orders", printfulOrderPayload, {
      headers: {
        Authorization: `Bearer ${process.env.printful_token}`,
      },
    });

    console.log("Order successfully created on Printful:", response.data.result);
    return response.data.result;
  } catch (error) {
    // console.error("Error placing order on Printful:", error);
    // if (error.response) {
    //   console.error("Response Data:", error.response.data);
    // }
    // throw new Error("Failed to create order on Printful.");
  }
};
export const getShipmentcost = async (req,res) => {
  try {
    console.log(req.body)
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).send({ error: 'User not found' });

    // Fetch cart
    const cart = await Cart.findOne({ user: user.email });
   
    console.log("Getting Printful Cost...");

    // Map the items and fetch product details
    const items = await Promise.all(
      cart.items.map(async (item) => {
        const productDetails = await fetchPrintfulProduct(item.productId);
        const variant = productDetails.sync_variants.find(v => v.id.toString() === item.variantId.toString());
        if (!variant) {
          throw new Error(`Variant with ID ${item.variantId} not found in product ${item.productId}`);
        }

        return {
          sync_product_id: variant.sync_product_id,
          variant_id: variant.variant_id,
          name:variant.name,
          quantity: item.quantity,
          retail_price: item.price,
          sku:variant.sku,
          currency:variant.currency,
          files: variant.files.filter(file=> file.is_temporary === false) || [], // Include any associated files if available
        };
      })
    );

    console.log(req.body)
    // Build the order payload
   const shipmentAddress = req.body.shipmentAddress;
    const printfulOrderPayload = {
      
      "recipient": {
        "address1": shipmentAddress?.line1,
        "city": shipmentAddress?.city,
        "state_code": shipmentAddress?.state,
        "country_code":shipmentAddress?.country,
        "zip": shipmentAddress?.postalCode,
        "phone": shipmentAddress?.phone || "9949837192",
      },
      "items":items,
      "currency": "USD",
"locale": "en_US"
    };
console.log(printfulOrderPayload)
    // Send the request to Printful API to place the order
    const response = await axios.post("https://api.printful.com/shipping/rates", printfulOrderPayload, {
      headers: {
        Authorization: `Bearer uSSK1gMk5klqbobX3mYKkWNJvam3V7noJIkiPjId`,
      },
    });
    console.log(response)
    console.log("Order successfully created on Printful:", response.data.result);
    return res.json(response.data.result);
  } catch (error) {
    // console.error("Error placing order on Printful:", error);
    // if (error.response) {
    //   console.error("Response Data:", error.response.data);
    // }
    // throw new Error("Failed to create order on Printful.");
  }
};

// Function to place the order on Printful
// const createPrintfulOrder = async (order) => {
//   try {
//     console.log(order)
//     // Build the order object for Printful API
//     const printfulOrderPayload = {
//       "external_id": order._id,
//       "shipping": "STANDARD",
//       recipient: {
//         name: order.user,
//         address1: order.shipmentAddress,
//         address2:order.shipmentAddress,
//         address3:order.shipmentAddress,
//         city: order.shipmentAddress.city,
//         state_code: order.shipmentAddress.state,
//         country_code: order.shipmentAddress.country,
//         zip: order.shipmentAddress.postalCode,
//         phone: order.shipmentAddress.phone || 9949837192,
//         email: order.user,
//       },
//       items: order.items.map(item => ({
//         product_id: item.productId,
//         variant_id: item.variantId,
//         quantity: item.quantity,
//         retail_price: item.price,
//       })),
//     };

//     // Send the request to Printful API to place the order
//     const response = await axios.post('https://api.printful.com/orders', printfulOrderPayload, {
//       headers: {
//         Authorization: `Bearer ${process.env.printful_token}`,
//       },
//     });

//     return response.data.result;
//   } catch (error) {
//     console.error('Error placing order on Printful:', error);
//     console.log(error.response);
//     return null;
//   }
// };

// export const confirmPayment = async (req, res) => {
//   console.log("hi ")
//   try {
//     const { paymentIntentId , method } = req.body;
//     console.log(req.body)

//     if (!paymentIntentId) {
//       return res.status(400).send({ success: false, error: 'PaymentIntent ID is missing.' });
//     }

//     // Retrieve the payment intent from Stripe
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     // Check if the payment was successful
//     if (paymentIntent.status === 'succeeded') {
//       console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);

//       // Find the order associated with this payment intent (assuming order is tied to paymentIntentId)
//       const order = await Order.findOne({ 'paymentDetails.transactionId': paymentIntentId });

//       if (!order) {
//         return res.status(404).send({ success: false, error: 'Order not found.' });
//       }

//       // Update the order to reflect successful payment
//       order.paymentDetails.status = 'Completed';
//       order.orderStatusMessage = 'Processing';
//       await order.save();

//       // Clear the user's cart (assuming cart is tied to the user's email or user ID)
//       if(method === 'cart-buy-now'){
//         const ca = await Cart.findOne({user:order.user,payementId:paymentIntentId});
//         const or = await Order.findOne({'paymentDetails.transactionId': paymentIntentId});

//         if(ca && or.paymentDetails.status === 'Completed'){
//       await Cart.findOneAndDelete({ user:order.user,payementId:paymentIntentId });
//     }
//     }

//       // Send a response indicating the payment was confirmed and the cart was cleared
//       return res.status(200).send({
//         success: true,
//         message: 'Payment confirmed, order updated, and cart cleared',
//         order,
//       });

//     }
//      else {
//       // Handle cases where the payment was not successful
//       console.log("hi i am not sucessfull")
//       return res.status(400).send({
//         success: false,
//         error: 'Payment was not successful. Current status: ' + paymentIntent.status,
//       });
//     }
//   } catch (error) {
//     console.error('Error confirming payment:', error);
//     return res.status(500).send({
//       success: false,
//       error: 'Server error while confirming payment',
//     });
//   }
// };
// Generate Bill
// router.get('/order/:orderId/bill', 
export const orderBill = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate('user items.productId');
    if (!order) {
      return res.status(404).send({ error: 'Order not found' });
    }

    const user = await User.findById(order.user);

    const doc = new PDFDocument();
    const filename = `invoice_${order._id}.pdf`;
    const filePath = `./invoices/${filename}`;

    // Create invoices directory if it doesn't exist
    if (!fs.existsSync('./invoices')) {
      fs.mkdirSync('./invoices');
    }

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(25).text('Invoice', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`Order ID: ${order._id}`);
    doc.text(`User: ${user.uname} (${user.email})`);
    doc.text(`Order Date: ${order.createdAt.toDateString()}`);
    doc.moveDown();

    doc.fontSize(15).text('Shipment Address', { underline: true });
    doc.fontSize(12).text(`${order.shipmentAddress.street}`);
    doc.text(`${order.shipmentAddress.city}, ${order.shipmentAddress.state}, ${order.shipmentAddress.postalCode}`);
    doc.text(`${order.shipmentAddress.country}`);
    doc.moveDown();

    doc.fontSize(15).text('Items', { underline: true });
    order.items.forEach((item, index) => {
      doc.fontSize(12).text(`Item ${index + 1}:`);
      doc.text(`Product ID: ${item.productId.productId}`);
      doc.text(`Product Name: ${item.productId.name}`);
      doc.text(`Quantity: ${item.quantity}`);
      doc.text(`Price: $${(item.price *req.Currency).toFixed(2)}`);
      doc.moveDown();
    });

    doc.fontSize(15).text('Payment Details', { underline: true });
    doc.fontSize(12).text(`Method: ${order.paymentDetails.method}`);
    doc.text(`Transaction ID: ${order.paymentDetails.transactionId}`);
    doc.text(`Status: ${order.paymentDetails.status}`);
    doc.moveDown();

    doc.fontSize(15).text('Summary', { underline: true });
    doc.fontSize(12).text(`Total Amount: $${order.totalAmount.toFixed(2)}`);
    doc.text(`Shipment Charges: $${order.shipmentCharges.toFixed(2)}`);
    doc.text(`Grand Total: $${(order.totalAmount + order.shipmentCharges).toFixed(2)}`);

    doc.end();

    res.download(filePath, filename, (err) => {
      if (err) {
        res.status(500).send({ error: 'Failed to download the invoice' });
      } else {
        fs.unlinkSync(filePath); // Delete the file after download
      }
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

// export default router;

export const getOrdersOfSpecifiUser = async (req, res) => {
  try {
    // Get page and limit from query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default to 10 orders per page

    // Calculate total number of orders and pages
    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

    // Fetch orders with pagination
    const orders = await Order.find({user:req.user.email})
      .skip((page - 1) * limit)
      .limit(limit);

    if (!orders) {
      return res.status(400).json({ error: "Orders not found" });
    }

    // Convert and calculate order totals
    // Return orders with pagination details
    return res.status(200).json({
      orders: orders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req,res)=>{
  const { orderId } = req.params; 
  console.log(orderId);
  try{
    if(!orderId){
      return res.status(404).json({error:"missing order id"});
    }
    const o = await Order.findById(orderId);
    if(!o){
      return res.status(404).json({error:"order not found"});
    }
    else{
      if(o.user == req.user.email || req.user.userGroup === 'admin'){
        return res.status(200).json({order:o});
      }
      else{
        return res.status(400).json({error:"forbidden"});
      }
    }
  }
catch(error){
  return res.status(500).json({error:error.message});
}
}
export const getAllOrders = async (req,res)=>{
  try{

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10; // Default to 10 orders per page

    // Calculate total number of orders and pages
    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

    const orders = await Order.find().skip((page - 1) * limit)
      .limit(limit);
    if(!orders){
      return res.status(400).json({error:"orders not found"});
    }
    
    return res.status(200).json({
      orders: orders,
      currentPage: page,
      totalPages,
      totalOrders,
    });
    // return res.status(200).json();
  }
  catch{
    return res.status(500).json(error);
  }
};


export const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params; // Extract orderId from route params
  const { orderStatus, orderStatusMessage } = req.body; // Extract the status from the request body

  // Validate if orderId is present
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  const updates = {}; // Initialize an empty updates object

  // Add the fields to be updated based on request body
  if (orderStatus) {
    updates.orderStatus = orderStatus;
  }
  if (orderStatusMessage) {
    updates.orderStatusMessage = orderStatusMessage;
  }

  try {
    // Find and update the order by ID
    const order = await Order.findByIdAndUpdate(orderId, updates, { new: true }); // Use new:true to return updated document
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.status(200).json({ message: 'Order status successfully updated', order });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const { orderId } = req.params; // Extract orderId from params

  // Check if orderId is provided
  if (!orderId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.status(200).json({ message: 'Order successfully deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}; 


export const NewCartBuyNow = async (req, res) => {
  try {
    const { shipmentAddress, paymentInstrumentId ,shipment} = req.body;
    console.log(req.body);
    // Ensure payment method is present
    if (!paymentInstrumentId) {
      return res.status(400).send({ error: 'Payment method is missing or invalid.' });
    }

    // Fetch user
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).send({ error: 'User not found' });

    // Fetch cart
    const cart = await Cart.findOne({ user: user.email });
    if (!cart) return res.status(404).send({ error: 'Cart not found' });

    if (cart.payementId) {
      return res.status(400).send({ error: 'Payment already done' });
    }

    let totalAmount = 0;
    const itemsWithDetails = [];

    for (const item of cart.items) {
      const productResponse = await axios.get(`https://api.printful.com/store/products/${item.productId}`, {
        headers: { Authorization: `Bearer ${process.env.printful_token}` },
      });

      if (!productResponse || !productResponse.data.result) {
        return res.status(404).send({ error: `Product with ID ${item.productId} not found` });
      }

      const varproduct = productResponse.data.result.sync_variants.find(
        (variant) => variant.id.toString() === item.variantId.toString()
      );

      if (!varproduct) {
        return res.status(404).send({ error: `Variant with ID ${item.variantId} not found` });
      }

      const itemTotal = item.quantity * varproduct.retail_price;
      totalAmount += itemTotal;

      itemsWithDetails.push({
        productId: productResponse.data.result.sync_product.id,
        variantId: item.variantId,
        quantity: item.quantity,
        price: varproduct.retail_price,
      });
    }

    // Step 1: Create Order
    const order = new Order({
      user: req.user.email,
      items: itemsWithDetails,
      shipmentAddress,
      shipmentCharges: Number(shipment.rate),
      totalAmount,
      orderStatusMessage: 'Order created, awaiting payment',
    });

    await order.save();
    try {
      // Step 2: Process Payment (Reference ID set to order._id)
      const createTransaction = await Request("post", "/v1/accounts/transactions", {
        "amount":( totalAmount+order.shipmentCharges)*100,
        "paymentInstrumentId": paymentInstrumentId,
        "accountId": "acc-c8a42bea-a708-4165-beea-e1eb95b5000a",
        "type": "pull",
        "currency": "USD",
        "method": "card",
        "channel": "online",
        "referenceId": order._id, // Set referenceId as order._id
      });

      if (!createTransaction || !createTransaction.data || !createTransaction.data.id) {
        await Order.findByIdAndDelete(order._id);
        return res.status(400).send({ error: 'Transaction failed, order deleted' });
      }

      // Update order with transaction details
      order.paymentDetails = {
        transactionId: createTransaction.data.id,
        status: createTransaction.data.status,
        statusReason: createTransaction.data.statusReason,
        method: createTransaction.data.method,
        currency: createTransaction.data.currency,
        createdAt: createTransaction.data.createdAt,
        channel: createTransaction.data.channel,
      };

      order.orderStatusMessage = 'Payment successful, placing order on Printful';
      await order.save();

      // Step 3: Place Order on Printful
      const placeOrderResponse = await createPrintfulOrder(order,shipment);

      if (!placeOrderResponse || !placeOrderResponse.external_id) {
        await Order.findByIdAndDelete(order._id);
        return res.status(500).send({ error: 'Failed to place order on Printful, order deleted' });
      }

      // Update order with Printful external ID
      order.externalId = placeOrderResponse.external_id;
      order.orderStatusMessage = 'Order confirmed and placed on Printful';
      await order.save();

      // Delete cart after successful order placement
      await Cart.deleteOne({ user: user.email });

      res.status(201).send(order);
    } catch (transactionError) {
      await Order.findByIdAndDelete(order._id);
      return res.status(400).send({ error: 'Transaction failed, order deleted' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
};


// export const NewCartBuyNow = async (req, res) => {
//   try {
//     const { shipmentAddress,paymentInstrumentId } = req.body;

//      // Ensure payment method is present
//      console.log(req.body.paymentInstrumentId)
//      if (!paymentInstrumentId) {
//       return res.status(400).send({ error: 'Payment method is missing or invalid.' });
//     }
//     const user = await User.findOne({ email: req.user.email });
//     if (!user) return res.status(404).send({ error: 'User not found' });

//     const cart = await Cart.findOne({ user: user.email });
//     if (!cart) return res.status(404).send({ error: 'Cart not found' });

//     let totalAmount = 0;
//     const itemsWithDetails = [];

//     for (const item of cart.items) {
//       const product =  await axios.get(`https://api.printful.com/store/products/${item.productId}`, {
//         headers: {
//             Authorization: `Bearer ${process.env.printful_token}`,
//         },
//     });
  
//       if (!product) {
//         return res.status(404).send({ error: `Product with ID ${item.productId} not found` });
//       }
//       console.log(cart.payementId)
//       if(cart.payementId!=""){
//         return res.status(400).send({ error: 'Payment already done' });
//       }
//       // const varproduct = product.data.result.sync_variants.filter(variant => variant.id === item.variantId);
//       const varproduct = product.data.result.sync_variants.filter(variant => variant.id.toString() === item.variantId.toString())[0];

//       const itemTotal = item.quantity * varproduct.retail_price;
//       totalAmount += itemTotal;
//       itemsWithDetails.push({
//         productId: product.data.result.sync_product.id,
//         variantId : item.variantId,
//         quantity: item.quantity,
//         price: varproduct.retail_price,
//       });
//     }


//     const createTransaction = await Request("post","/v1/accounts/transactions",
//       {
//         "amount": totalAmount*100,
//         "paymentInstrumentId": paymentInstrumentId,
//         "accountId": "acc-c8a42bea-a708-4165-beea-e1eb95b5000a",
//         "type": "pull",
//         "currency": "USD",
//         "method": "card",
//         "channel": "online",
//         "referenceId":cart._id,
//     }
//     )
//     const ca = await Cart.findOne({user:user.email});
//     ca.payementId = createTransaction.data.id;
//     await ca.save();
//     const order = new Order({
//       user: req.user.email,
//       items: itemsWithDetails,
//       paymentDetails: {
//         transactionId: createTransaction.data.id,
//         status: createTransaction.data.status,
//         statusReason: createTransaction.data.statusReason,
//         method: createTransaction.data.method,
//         currency: createTransaction.data.currency, 
//         createdAt: createTransaction.data.createdAt,
//         channel: createTransaction.data.channel,
//       },
//       shipmentAddress,
//       shipmentCharges: 50,
//       totalAmount,
//       orderStatusMessage: 'Order confirmed',
//     });

//     await order.save();
//  console.log(shipmentAddress)
//  const placeOrderResponse = await createPrintfulOrder(order);

//  if (!placeOrderResponse) {
//    return res.status(500).send({ error: 'Failed to place order on Printful' });
//  }
// console.log(placeOrderResponse)
//  order.externalId=placeOrderResponse.external_id
//  await order.save();
//     await Cart.deleteOne({ user: user.email });
//     res.status(201).send(order);

//   } catch (error) {
//     console.error(error);
//     res.status(400).send({ error: error.message });
//   }
// };

export const NewProductBuyNow = async (req, res) => {
  try {
    console.log(req.body)
    const { productId, variantId, quantity, paymentInstrumentId, shipmentAddress ,shipment} = req.body;

    // Fetch user
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).send({ error: 'User not found' });
    const productResponse = await axios.get(`https://api.printful.com/store/products/${productId}`, {
      headers: {
        Authorization: `Bearer ${process.env.printful_token}`,
      },
    });

    const productData = productResponse.data.result;
    const varproduct = productData.sync_variants.find(variant => variant.id.toString() === variantId.toString());

    if (!varproduct) return res.status(404).send({ error: 'Variant not found' });
    const totalAmount = varproduct.retail_price * quantity;

    // Step 1: Create Order
    const order = new Order({
      user: user.email,
      items: [{
        productId: productData.sync_product.id,
        quantity,
        price: varproduct.retail_price,
        variantId,
      }],
      shipmentAddress,
      shipmentCharges: Number(shipment.rate),
      totalAmount,
      orderStatusMessage: 'Order created, awaiting payment',
    });

    await order.save();

    try {
      // Step 2: Process Payment
      const createTransaction = await Request("post", "/v1/accounts/transactions", {
        "amount": (totalAmount+order.shipmentCharges) * 100,
        "paymentInstrumentId": paymentInstrumentId,
        "accountId": "acc-c8a42bea-a708-4165-beea-e1eb95b5000a",
        "type": "pull",
        "currency": "USD",
        "method": "card",
        "channel": "online",
        "referenceId": order._id,
      });

      if (!createTransaction || !createTransaction.data || !createTransaction.data.id) {
        await Order.findByIdAndDelete(order._id);
        return res.status(400).send({ error: 'Transaction failed, order deleted' });
      }

      // Update order with transaction details
      order.paymentDetails = {
        transactionId: createTransaction.data.id,
        status: createTransaction.data.status,
        statusReason: createTransaction.data.statusReason,
        method: createTransaction.data.method,
        currency: createTransaction.data.currency,
        createdAt: createTransaction.data.createdAt,
        channel: createTransaction.data.channel,
      };

      order.orderStatusMessage = 'Payment successful, placing order on Printful';
      await order.save();

      // Step 3: Place order on Printful
      const placeOrderResponse = await createPrintfulOrder(order,shipment);

      if (!placeOrderResponse || !placeOrderResponse.external_id) {
        await Order.findByIdAndDelete(order._id);
        return res.status(500).send({ error: 'Failed to place order on Printful, order deleted' });
      }

      // Update order with Printful order ID
      order.externalorderId = placeOrderResponse.external_id;
      order.orderStatusMessage = 'Order confirmed and placed on Printful';
      await order.save();

      res.status(201).send(order);
    } catch (transactionError) {
      await Order.findByIdAndDelete(order._id);
      return res.status(400).send({ error: 'Transaction failed, order deleted' });
    }
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
};


export const getShipmentProductCost = async (req,res) => {
  try {
    console.log(req.body)
    const {productId,variantId,quantity} = req.body;
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).send({ error: 'User not found' });

    // Fetch cart
    // const cart = await Cart.findOne({ user: user.email });
   
    // console.log("Getting Printful Cost...");

    // Map the items and fetch product details
    async function getSingleProductDetails(productId, variantId, quantity) {
      try {
        const productDetails = await fetchPrintfulProduct(productId);
        const variant = productDetails.sync_variants.find(
          (v) => v.id.toString() === variantId.toString()
        );
    
        if (!variant) {
          throw new Error(
            `Variant with ID ${variantId} not found in product ${productId}`
          );
        }
    
        return {
          sync_product_id: variant.sync_product_id,
          variant_id: variant.variant_id,
          name: variant.name,
          quantity: quantity,
          retail_price: variant.price,
          sku: variant.sku,
          currency: variant.currency,
          files: variant.files.filter((file) => file.is_temporary === false) || [],
        };
      } catch (error) {
        console.error(`Error fetching product details for ${productId}-${variantId}: ${error.name} - ${error.message}`);
        return null;
      }
    }
    
    // Example Usage:
    // const productId = 123;
    // const variantId = 456;
    // const item = { quantity: 2, price: 29.99 }; // Example item object
    // const product = await getSingleProductDetails(productId, variantId, item);
    
    // if (product) {
    //   console.log(product);
    // } else {
    //   console.log("Failed to retrieve product details.");
    // }

    // const item = await Promise.all(
     
    //     const productDetails = await fetchPrintfulProduct(productId);
    //     const variant = productDetails.sync_variants.find(v => v.id.toString() === variantId.toString());
    //     if (!variant) {
    //       throw new Error(`Variant with ID ${variantId} not found in product ${productId}`);
    //     }

    //     return {
    //       sync_product_id: variant.sync_product_id,
    //       variant_id: variant.variant_id,
    //       name:variant.name,
    //       quantity: item.quantity,
    //       retail_price: variant.retail_price,
    //       sku:variant.sku,
    //       currency:variant.currency,
    //       files: variant.files.filter(file=> file.is_temporary === false) || [], // Include any associated files if available
    //     };
      
    // );
const item = await getSingleProductDetails(productId,variantId,quantity)
    console.log(req.body)
   const shipmentAddress = req.body.shipmentAddress;
    const printfulOrderPayload = {
      "recipient": {
        "address1": shipmentAddress?.line1,
        "city": shipmentAddress?.city,
        "state_code": shipmentAddress?.state,
        "country_code":shipmentAddress?.country,
        "zip": shipmentAddress?.postalCode,
        "phone": shipmentAddress?.phone || "9949837192",
      },
      "items":[item],
      "currency": "USD",
"locale": "en_US"
    };
console.log(printfulOrderPayload)
    // Send the request to Printful API to place the order
    const response = await axios.post("https://api.printful.com/shipping/rates", printfulOrderPayload, {
      headers: {
        Authorization: `Bearer uSSK1gMk5klqbobX3mYKkWNJvam3V7noJIkiPjId`,
      },
    });
    console.log(response)
    console.log("Order successfully created on Printful:", response.data.result);
    return res.json(response.data.result);
  } catch (error) {
    // console.error("Error placing order on Printful:", error);
    // if (error.response) {
    //   console.error("Response Data:", error.response.data);
    // }
    // throw new Error("Failed to create order on Printful.");
  }
};