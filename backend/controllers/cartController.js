import Cart from '../schema/cartSchema.js'; // Adjust the path as necessary
import axios from 'axios';

export const addToCart = async (req, res) => {
  const productId = req.params.productId;
  
  let { quantity } = req.body; // quantity can be reassigned
 const variantId = req.body.variantId;
  if (!productId) {
    return res.status(400).json({ error: "Please provide valid ProductID" });
  }
  if(!variantId){
    return res.status(400).json({error:"please enter the valid variantId"});
  }
  
 
  

  try {
    
  

    let cart = await Cart.findOne({ user: req.user.email });
    if (!cart) {
      cart = new Cart({ user: req.user.email, items: [] });
    }
    
    // const productIndex = cart.items.findIndex(item => item.productId === productId);
    const productIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString() && item.variantId.toString()=== variantId.toString());
    console.log(productIndex)
    if (productIndex > -1) {
      // Product already in cart, update quantity
      cart.items[productIndex].quantity += quantity;
    } else {
      // Product not in cart, add new item
       // Use _id or unique identifier
      if (!quantity || quantity <= 0) {
        quantity = 1; // Set default quantity to 1 if not provided or invalid
      }
      cart.items.push({ productId, quantity,variantId });
    }
    await cart.save();
    return res.status(200).json(cart); // Send the updated cart as response
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


// Increment the quantity of a product in the cart
export const increment = async (req, res) => {
  console.log(req.params)
    const  productId  = req.params.productId;
    const variantId = req.body.variantId;
    if ( !productId) {
      return res.status(400).json({ error: "Please provide  productId to increment" });
    }
  
    try {
      const cart = await Cart.findOne({user:req.user.email});
      if (!cart) {
        return res.status(400).json({ error: "Invalid cartID" });
      }

      // console.log(cart.items)
      const productIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString() && item.variantId.toString()=== variantId.toString());
      // const product = await Product.findOne({productId:productId});
      if (productIndex > -1) {
        cart.items[productIndex].quantity +=1;
        await cart.save();
        return res.status(200).json(cart);
      } else {
        return res.status(400).json({ error: "Product not found in cart" });
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  };
  
  // Decrement the quantity of a product in the cart
  export const decrement = async (req, res) => {
    // console.log(req.params)
    const  productId  = req.params.productId;
    const variantId = req.body.variantId;
    if ( !productId) {
      return res.status(400).json({ error: "Please provide  productId to increment" });
    }
    try {
      const cart = await Cart.findOne({user:req.user.email});
      if (!cart) {
        return res.status(400).json({ error: "Invalid cartID" });
      }

      // console.log(cart.items)
      const productIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString() && item.variantId.toString()=== variantId.toString());
      if (productIndex > -1) {
        cart.items[productIndex].quantity -= 1;
        if (cart.items[productIndex].quantity <= 0) {
          cart.items.splice(productIndex, 1); // Remove the product if quantity goes to zero
        }
        await cart.save();
        return res.status(200).json(cart);
      } else {
        return res.status(400).json({ error: "Product not found in cart" });
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  };
  
  // Remove a product from the cart
  export const removeFromCart = async (req, res) => {
    const  productId  = req.params.productId;
    const variantId = req.body.variantId;
    if (!productId) {
      return res.status(400).json({ error: "Please provide productId to remove" });
    }
    try {
      const cart = await Cart.findOne({user:req.user.email});
      if (!cart) {
        return res.status(400).json({ error: "Invalid cartID" });
      }
  
      cart.items = cart.items.filter(item => item.variantId.toString() !== variantId.toString());
      await cart.save();
      return res.status(200).json(cart);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  };
  
  // Clear all items from the cart
  export const clearTheCart = async (req, res) => {

    try {
      const cart = await Cart.findOne({user:req.user.email });
      if (!cart) {
        return res.status(400).json({ error: "Invalid cartID" });
      }
  
      cart.items = [];
      await cart.save();
      return res.status(200).json(cart);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  };
  
  export const getCartDetails = async (req, res) => {
    try {
      // Find the cart for the user
      const cart = await Cart.findOne({ user: req.user.email });
      if (!cart) {
        return res.status(200).json({ error: "Empty Cart" });
      }
  
      let totalCost = 0;
      const products = [];
  
      // Loop through the cart items and fetch product details manually
      for (const item of cart.items) {
        const product =  await axios.get(`https://api.printful.com/store/products/${item.productId}`, {
          headers: {
              Authorization: `Bearer ${process.env.printful_token}`,
          },
      });
      console.log(product)
      const varproduct = product.data.result.sync_variants.filter(variant => variant.id.toString() === item.variantId.toString())[0];
       console.log(varproduct) 
      if (product) {
          const productDetails = {
            productId: product.data.result.sync_product.id,
            variantId:item.variantId,
            name: varproduct.name,
            coverImage: varproduct.files[1].preview_url,
            price: varproduct.retail_price,
            productQuantity:item.quantity,
            quantity: item.quantity,
            totalItemCost: varproduct.retail_price * item.quantity,
          };
          totalCost += productDetails.totalItemCost;
          products.push(productDetails);
        }
      }
      return res.status(200).json({ products, totalCost });
    } catch (e) {
      console.error('Error getting cart details:', e);
      return res.status(500).json({ error: e.message });
    }
  };
  