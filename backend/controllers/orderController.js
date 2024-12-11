import Order from '../schema/ordersSchema.js';
import Cart from '../schema/cartSchema.js';
import Product from '../schema/productSchema.js';
import User from '../schema/userSchema.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import Stripe from 'stripe'
import axios from 'axios';

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

export const CartBuyNow = async (req, res) => {
  try {
    const { paymentDetails, shipmentAddress } = req.body;

     // Ensure payment method is present
     if (!paymentDetails || !paymentDetails.paymentMethodId) {
      return res.status(400).send({ error: 'Payment method is missing or invalid.' });
    }
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).send({ error: 'User not found' });

    const cart = await Cart.findOne({ user: user.email });
    if (!cart) return res.status(404).send({ error: 'Cart not found' });

    let totalAmount = 0;
    const itemsWithDetails = [];

    for (const item of cart.items) {
      const product =  await axios.get(`https://api.printful.com/store/products/${item.productId}`, {
        headers: {
            Authorization: `Bearer ${process.env.printful_token}`,
        },
    });
  
      if (!product) {
        return res.status(404).send({ error: `Product with ID ${item.productId} not found` });
      }
      // const varproduct = product.data.result.sync_variants.filter(variant => variant.id === item.variantId);
      const varproduct = product.data.result.sync_variants.filter(variant => variant.id.toString() === item.variantId.toString())[0];

      const itemTotal = item.quantity * varproduct.retail_price;
      totalAmount += itemTotal;
      itemsWithDetails.push({
        productId: product.data.result.sync_product.id,
        variantId : item.variantId,
        quantity: item.quantity,
        price: varproduct.retail_price,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({ amount: Math.round(totalAmount * 100),
      currency: 'usd',
      payment_method: paymentDetails.paymentMethodId,
      confirm: true,
      return_url: `${process.env.CLIENT}/order-confirmation?method=cart-buy-now`,
      description: `Purchase from ${user.email}`,
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
      // Include the customer's billing details to comply with Indian regulations
      shipping: {
        name: shipmentAddress.name,
        address: {
          line1: shipmentAddress.street,
          city: shipmentAddress.city,
          state: shipmentAddress.state,
          postal_code: shipmentAddress.postalCode,
          country: shipmentAddress.country
        }
      }  });
    console.log(paymentIntent)
    const ca = await Cart.findOne({user:user.email});
    ca.payementId = paymentIntent.id;
    await ca.save();
    const order = new Order({
      user: req.user.email,
      items: itemsWithDetails,
      paymentDetails: {
        method: 'stripe',
        transactionId: paymentIntent.id,
        status: paymentIntent.status,
      },
      shipmentAddress,
      shipmentCharges: 50,
      totalAmount,
      orderStatusMessage: 'Order confirmed',
    });

    await order.save();

    if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_source_action') {
      return res.status(200).send({
        requiresAction: true,
        paymentIntentClientSecret: paymentIntent.client_secret,
        nextActionUrl: paymentIntent.next_action.redirect_to_url.url, // URL for 3D Secure authentication
      });
    }
 // Step 2: After successful payment, place the order on Printful
 const placeOrderResponse = await placeOrderOnPrintful(itemsWithDetails, shipmentAddress);

 if (!placeOrderResponse || !placeOrderResponse.result || !placeOrderResponse.result.id) {
   return res.status(500).send({ error: 'Failed to place order on Printful' });
 }

 order.externalId=placeOrderResponse.result.id
 await order.save();
    await Cart.deleteOne({ user: user.email });
    res.status(201).send(order);

  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
};

// Product Buy Now
export const ProductBuyNow = async (req, res) => {
  try {
    const { productId,variantId, quantity, paymentDetails, shipmentAddress } = req.body;

    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).send({ error: 'User not found' });

    const product =  await axios.get(`https://api.printful.com/store/products/${productId}`, {
      headers: {
          Authorization: `Bearer ${process.env.printful_token}`,
      },
  });
  console.log(variantId)
  // const varproduct = product.data.result.sync_variants.filter(variant => variant.id === item.variantId);
  const varproduct = product.data.result.sync_variants.filter(variant => variant.id.toString() === variantId.toString())[0];
console.log(varproduct)
    if (!product) return res.status(404).send({ error: 'Product not found' });

    const totalAmount = varproduct.retail_price * quantity;

    const paymentIntent = await stripe.paymentIntents.create({ amount: Math.round(totalAmount * 100),
      currency: 'usd',
      payment_method: paymentDetails.paymentMethodId,
      confirm: true,
      return_url: `${process.env.CLIENT}/order-confirmation?method=buy-now`,
      description: `Purchase from ${user.email}`,
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic',
        },
      },
      // Include the customer's billing details to comply with Indian regulations
      shipping: {
        name: shipmentAddress.name,
        address: {
          line1: shipmentAddress.street,
          city: shipmentAddress.city,
          state: shipmentAddress.state,
          postal_code: shipmentAddress.postalCode,
          country: shipmentAddress.country
        }
      }  });

    console.log(paymentIntent)
    
    const order = new Order({
      user: user.email,
      items: [{
        productId: product.data.result.sync_product.id,
        quantity,
        price: varproduct.retail_price,
        variantId,
      }],
      paymentDetails: {
        method: 'stripe',
        transactionId: paymentIntent.id,
        status: paymentIntent.status,
      },
      shipmentAddress,
      shipmentCharges: 50,
      totalAmount,
      orderStatusMessage: 'Order confirmed',
    });

    await order.save();

    if (paymentIntent.status === 'requires_action' || paymentIntent.status === 'requires_source_action') {
      return res.status(200).send({
        requiresAction: true,
        paymentIntentClientSecret: paymentIntent.client_secret,
        nextActionUrl: paymentIntent.next_action.redirect_to_url.url, // URL for 3D Secure authentication
      });
    }

const placeOrderResponse = await placeOrderOnPrintful([{
  productId: productId,
  variantId : variantId,
  quantity: quantity,
  price: varproduct.retail_price,
}], shipmentAddress);
if (!placeOrderResponse || !placeOrderResponse.result || !placeOrderResponse.result.id) {
  return res.status(500).send({ error: 'Failed to place order on Printful' });
}
order.externalorderId = placeOrderResponse.result.id;
await order.save();
    res.status(201).send(order);
  } catch (error) {
    console.error(error);
    res.status(400).send({ error: error.message });
  }
};
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

      // Now place the order on Printful and update the order with the externalId
      const printfulOrder = await createPrintfulOrder(order);

      // If the order was successfully placed on Printful, update the order with externalId
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

const createPrintfulOrder = async (order) => {
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

    // Build the order payload
    const printfulOrderPayload = {
      "external_id": order._id,
      "shipping": "STANDARD",
      "recipient": {
        "name": order.user,
        "comany":order.user,
        "address1": order.shipmentAddress.street,
        "address2": order.shipmentAddress.city || "",
        "city": order.shipmentAddress.city,
        "state_code": "CA",
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
    // Find and delete the order by ID
    const order = await Order.findByIdAndDelete(orderId);

    // If no order found, send a 404 error
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Return success response
    return res.status(200).json({ message: 'Order successfully deleted' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




