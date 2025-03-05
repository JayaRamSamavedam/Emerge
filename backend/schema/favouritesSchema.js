import mongoose from "mongoose";

const favouritesSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  products: [
    {
      productId: {
        type: String,
        required: true,
      },
      variantId: {
        type: String,
        required: true,
      },
    },
  ],
});

// Add a product to the favourites
favouritesSchema.statics.addToFavourites = async function (email, productId, variantId) {
  try {
    // Find the favourites list for the user by email
    let favourites = await this.findOne({ email });
    
    if (!favourites) {
      favourites = new this({ email, products: [{ productId, variantId }] });
    } else {
      // Check if the product with the variant is already in the favourites list
      if (favourites.products.some((p) => p.productId === productId && p.variantId === variantId)) {
        return favourites;
      }
        favourites.products.push({ productId, variantId });
    }
    await favourites.save();
    return favourites;
  } catch (error) {
    throw new Error("Error in adding to favourites: " + error.message);
  }
};

// Add and delete a product from favourites
favouritesSchema.statics.AddandDelete = async function (email, productId, variantId) {
  console.log("I have been called");
  let message = "";
  try {
    let favourites = await this.findOne({ email });

    if (!favourites) {
        favourites = new this({ email, products: [{ productId, variantId }] });
        message = "added product to favourites";
        await favourites.save();
    } else {
      const productIndex = favourites.products.findIndex(
        (p) => p.productId === productId && p.variantId === variantId
      );
      if (productIndex > -1) {
        favourites.products.splice(productIndex, 1);
        message = "product removed from favourites";
      } else {
       
          favourites.products.push({ productId, variantId });
          message = "added product to favourites";
      }
      await favourites.save();
    }
    return message;
  } catch (error) {
    throw error;
  }
};

// Check if a product is a favourite
favouritesSchema.statics.isFavourite = async function (email, productId, variantId) {
  try {
    const favourites = await this.findOne({ email });
    if (!favourites) return false;
    else {
      return favourites.products.some(
        (p) => p.productId === productId && p.variantId === variantId
      );
    }
  } catch (error) {
    return false;
  }
};

// Remove a product from the favourites
favouritesSchema.statics.removeFromFavourites = async function (email, productId, variantId) {
  try {
    const favourites = await this.findOne({ email });

    if (!favourites) {
      return null;
    }

    favourites.products = favourites.products.filter(
      (p) => !(p.productId === productId && p.variantId === variantId)
    );

    await favourites.save();
    return favourites;
  } catch (error) {
    throw error;
  }
};

const Favourites = mongoose.model("Favourites", favouritesSchema);
export default Favourites;
