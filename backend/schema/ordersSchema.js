import mongoose from 'mongoose';
import Product from './productSchema.js';
import User from './userSchema.js';

const orderStatusEnum = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
  },
  variantId:{
    type:Number,
    required:true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const paymentDetailsSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed', 'Failed', 'requires_action','succeeded'], 
  },
});

const shipmentAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  externalorderId:{
    type:String,
    
  },
  items: [orderItemSchema],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: orderStatusEnum,
    default: 'Pending',
  },
  orderStatusMessage:{
    type:String,
    required:true,
    default: 'Order placed',
  },
  paymentDetails: paymentDetailsSchema,
  shipmentAddress: shipmentAddressSchema,
  shipmentCharges: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{timestamps:true});


orderSchema.statics.getUniqueProductsPurchasedByUser = async function (userId) {
  try {
    const orders = await this.find({ user: userId });
    const productIds = new Set();
    orders.forEach(order => {
      order.items.forEach(item => {
        productIds.add(item.productId);
      });
    });

    const uniqueProducts = await Product.find({ productId: { $in: Array.from(productIds) } });
    return uniqueProducts;
  } catch (error) {
    throw new Error(error.message);
  }
};
const Order = mongoose.model('Order', orderSchema);
export default Order;
