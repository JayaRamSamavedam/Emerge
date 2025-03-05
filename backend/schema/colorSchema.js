import mongoose from "mongoose";
const ColorSchema = new mongoose.Schema({
    name:{
        unique:true,
        type:String,
        required:true
    }
},{timestamps:true});
const Color = mongoose.model('Colors', ColorSchema);

export default Color;