import mongoose from 'mongoose';
const printfullproductSchema = new mongoose.Schema({
  productId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  price: {
    type: Number,
    required: true,
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
  colors:{
    type:[String],
    required:false,
  },
},{timestamps:true});

// Text index for name, category, and description (suitable for full-text search)
printfullproductSchema.index({ 
  name: 'text', 
  category: 'text', 
  description: 'text'
});


printfullproductSchema.index({ sizes: 1 });
printfullproductSchema.index({ colors: 1 });


const PrintfullProduct = mongoose.model('PrintfullProduct', printfullproductSchema);

export default PrintfullProduct;
