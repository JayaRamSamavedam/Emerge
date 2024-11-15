import mongoose from 'mongoose';
import Counter from './productCounterSchema.js';
import Category from './categorySchema.js';
import Color from './colorSchema.js';
const productSchema = new mongoose.Schema({
  printfulProductId: {
    type: String, // Printful's unique product identifier
    unique: true,
  },
  priority:{
    type:Number,
    default:0,
  },
  productId: {
    type: Number,
    unique: true, // Ensure unique product IDs
  },
  name: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  discountedPrice: {
    type: Number,
    required: true,
    default: function () {
      return this.price - (this.price * this.discount / 100);
    },
  },
  views:{
    type:Number,
    default:0,
  },
  purchases:{
    type:Number,
    default:0,
  },
  sizes:{
    type:[String],
    required:false,
  },
  colors: [{
    colorname: { type: String, required: true },
    colorcode: { type: String, required: true },
  }],
  hotDeals:{
    type:Boolean,
    default:false,
  },
  rating:{
    type:Number,
    default:5,
  }
},{timestamps:true});

// Text index for name, category, and description (suitable for full-text search)
productSchema.index({ 
  name: 'text', 
  category: 'text', 
  description: 'text'
});

// Compound index for `colors.colorname` and `sizes` (for targeted search)
productSchema.index({ 'colors.colorname': 1 });
productSchema.index({ sizes: 1 });

productSchema.pre('save', async function (next) {
  const product = this;

  if (!product.isNew) {
    return next();
  }

  try {
    // Validate Category
    const cat = await Category.findOne({ name: product.category });
    if (!cat) {
      throw new Error("Category is invalid");
    }

    // Validate Colors and populate both colorname and colorcode
    if (product.colors && product.colors.length > 0) {
      const colorDocs = await Color.find({ colorname: { $in: product.colors.map(c => c.colorname) } });
      if (colorDocs.length !== product.colors.length) {
        throw new Error("One or more colors are invalid");
      }

      // Replace the colors array with objects containing both colorname and colorcode
      product.colors = colorDocs.map(color => ({
        colorname: color.colorname,
        colorcode: color.colorcode
      }));
    }

    // Generate unique product ID
    const counter = await Counter.findOneAndUpdate(
      { _id: 'productId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    product.productId = counter.seq;

    next();
  } catch (error) {
    console.error("Error in product pre-save:", error);
    next(error);
  }
});


const Product = mongoose.model('Product', productSchema);

export default Product;
