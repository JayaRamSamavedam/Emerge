import Product from '../schema/productSchema.js';
import Category from '../schema/categorySchema.js';
import RecentlyViewed from '../schema/recentlyViewedSchema.js';

import Color from '../schema/colorSchema.js';
import Favourites from '../schema/favouritesSchema.js';
import axios from 'axios';
export const createProduct = async (req, res) => {
  const { name, coverImage, colornames, images, category, description, price, discount, sizes } = req.body;

  try {
    // Look up colors by colornames array
    const colorsData = await Color.find({ colorname: { $in: colornames } });
    if (colorsData.length !== colornames.length) {
      return res.status(400).json({ error: 'One or more colors are invalid' });
    }

    // Map colorname and colorcode into colors array for product
    const colors = colorsData.map(color => ({
      colorname: color.colorname,
      colorcode: color.colorcode,
    }));

    // Create new product
    const newProduct = new Product({
      name,
      coverImage,
      images,
      category,
      description,
      sizes,
      colors, // Set the validated colors array
      price,
      discount,
      discountedPrice: price - (price * discount / 100),
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);

  } catch (error) {
    return res.status(500).json({ error: 'Error creating product', details: error.message });
  }
};

export const createCategory = async (req, res) => {
    const { name ,proImage,discount} = req.body;
    try {
      const precat = await Category.findOne({ name });
      if (precat) {
        return res.status(400).json({ error: "This category already exists in our database" });
      }
      const cat = new Category({ name,proImage,discount });
      const savecat = await cat.save();
      return res.status(201).json(savecat);
    } catch (error) {
      return res.status(400).json({ error: "Please provide the name", details: error.message });
    }
  };
  export const getAllCategories  = async (req,res)=>{
    try{
      const categories = await Category.find();
      return res.status(200).json({categories});
    }
    catch(error){
      return res.json(error);
    }
  }
  export const editProduct = async (req, res) => {
    const { id } = req.params;
    const { name, category, images, description, price, discount, imagesToDelete, newImages, coverImage, sizes, colornames } = req.body;
  
    try {
      // Find the product by ID
      const product = await Product.findOne({ productId: Number(id) });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      const updates = {};
  
      if (name) updates.name = name;
      if (description) updates.description = description;
      if (price) updates.price = price;
      if (discount) updates.discount = discount;
      if (coverImage) updates.coverImage = coverImage;
      if (sizes) updates.sizes = sizes;

      if(images) updates.images = images;
      // Handle image deletion
      if (imagesToDelete && imagesToDelete.length > 0) {
        updates.images = product.images.filter(image => !imagesToDelete.includes(image));
      }
  
      // Add new images if provided
      if (newImages && newImages.length > 0) {
        updates.images = [...product.images, ...newImages];
      }
  
      // Update category if provided
      if (category) {
        const cat = await Category.findOne({ name: category });
        if (!cat) {
          return res.status(404).json({ error: 'Category not found' });
        }
        updates.category = category;
      }
  
      // If colornames provided, find matching colors
      if (colornames && colornames.length > 0) {
        const colorsData = await Color.find({ colorname: { $in: colornames } });
        if (colorsData.length !== colornames.length) {
          return res.status(400).json({ error: 'One or more colors are invalid' });
        }
  
        updates.colors = colorsData.map(color => ({
          colorname: color.colorname,
          colorcode: color.colorcode,
        }));
      }
  
      // Recalculate discounted price if price or discount changes
      if (price || discount) {
        const updatedPrice = price || product.price;
        const updatedDiscount = discount || product.discount;
        updates.discountedPrice = updatedPrice - (updatedPrice * updatedDiscount) / 100;
      }
  
      // Apply updates to the product
      Object.assign(product, updates);
      const updatedProduct = await product.save();
  
      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res.status(500).json({ error: 'Error editing product', details: error.message });
    }
  };
  



export const editCategory = async (req, res) => {
    console.log("Endpoint hit: editCategory");
  
    let { category, newcategory, proImage, discount } = req.body;
    console.log("Request body:", req.body);
  
    if (!category) {
      console.log("Error: category not provided");
      return res.status(400).json({ error: "Category not provided" });
    }
  
    try {
      if (category && newcategory) {
        console.log(`Updating category name from ${category} to ${newcategory}`);
        const cate = await Category.findOneAndUpdate({ name: category }, { name: newcategory });
        category = newcategory;
        if (!cate) {
          console.log("Error: category not found");
          return res.json({ error: "Category not found" });
        }
  
        console.log(`Finding products with category: ${category}`);
        const prods = await Product.find({ category: category });
        
        if (prods.length > 0) {
          console.log(`Found ${prods.length} products. Updating categories...`);
          
          const updatedproducts = await Promise.all(prods.map(async prod => {
            prod.category = newcategory;
            await prod.save();
            return prod;
          }));
          console.log("Products updated successfully");
        } else {
          console.log("No products found with the given category");
        }
      }
  
      const updates = {};
      if (proImage) updates.proImage = proImage;
      if (discount) updates.discount = Number(discount);
  
      if (Object.keys(updates).length > 0) {
        console.log("Updating category with additional fields:", updates);
        const newcat = await Category.findOneAndUpdate({ name: category }, updates);
      }
  
      console.log("Category updated successfully");
      return res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
      console.log("Error occurred:", error);
      return res.status(500).json({ error });
    }
  };

  
export const deleteCategory = async (req, res) => {
    const { category } = req.body;
    
    try {
      const cat = await Category.findOneAndDelete({ name: category });
      
      if (cat) {
        const products = await Product.find({ category: category });
        
        const deletedProducts = await Promise.all(products.map(async product => {
          await product.deleteOne();
          return product.productId; // Returning the ID of the deleted product
        }));
  
        return res.status(200).json({
          message: 'Category and its products deleted successfully',
          deletedProducts: deletedProducts,
        });
      } else {
        return res.status(404).json({ message: 'Category not found' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  export const getCategory = async(req,res)=>{
    const {name}= req.params;
    console.log(typeof(name))
    if(!name) return res.status(400).json({"message":"name is not present"});
    try{
      const category = await Category.findOne({name:name});
      console.log(category)
      return res.status(200).json({category});
    }
    
    catch(error){
      console.log("hi")
      return res.status(500).json({error});
    }
  }
  export const getProductsByCategory = async(req,res)=>{
    let {cate} = req.params;
    if(!cate){
      return res.json({"error":"category not found"});
    }
    try{
      const cat = await Category.findOne({name:cate});
      if(!cat){ return res.json({error:"category not found"});}
      const products = await Product.find({category:cat.name});
      
        const updatedProducts = products.map(product => {
          const updatedProduct = product.toObject();
          updatedProduct.price = updatedProduct.price * req.Currency;
          return updatedProduct;
      });
      return res.json(updatedProducts);
    }
    catch(error){
      return res.json({"error":error});
    }
  }
export const getAllProducts= async(req,res)=>{
   let query = {}
  try{
    const {category} = req.body;
  if(category){
    const cat = await Category.findOne({name:category});
    if(cat)
    query.category = category;
  else{
    return res.status(400).json({error:"category is invalid"});
  }   
  }
console.log("I am safe")
  const products = await Product.find(query);
//   const updatedProducts = products.map(product => {
//     const updatedProduct = product.toObject();
//     updatedProduct.price = updatedProduct.price * req.Currency;
//     return updatedProduct;
// });
  console.log("i am invoked");
  return res.status(200).json(products);
  }
  catch(e){
    res.status(400).json({error:e});
  }
};

export const getProductById = async(req,res)=>{
  try{
    const {id} = req.params;
    
    console.log("id",id);
    if (!id){
      return res.status(400).json({error:"id not found "});
    }
    console.log("abcd")
    const product = await Product.findOne({"productId":id});
    console.log("pqrst")
    if(!product){
      return res.status(400).json({error:"invalid product id"});
    }
    product.views+=1;
    await product.save();
    if(req.user){
      const abcd = await RecentlyViewed.createOrUpdate(req.user.email,product);
    }
    
    
    return res.status(200).json(product);
  }
  catch(e){
    return res.status(500).json(e);
  }
}


export const deleteProductByID = async(req,res)=>{
  try{
const id = req.params.id;
if(!id){
  return res.json({error:"id not found"});
}
console.log(id);
const prod = await Product.findOneAndDelete({productId:Number(id)});
return res.json({message:"product successfully deleted"});
  }
  catch(error){
    return res.json({error:"product not found"});
  }
}
export const sortPriceProduct = async(req, res) => {
  try {
    const { order, category } = req.body;
    let filters = {};
    
    if (category) {
      const cat = await Category.findOne({ name: category });
      if (cat) {
        filters.category = category;
      } else {
        return res.status(400).json({ error: "Invalid category" });
      }
    }
    
    let sortCriteria = {};
    if (order === 'asc') {
      sortCriteria.price = 1; // Ascending order
    } else if (order === 'desc') {
      sortCriteria.price = -1; // Descending order
    }
    
    const products = await Product.find(filters).sort(sortCriteria);
    const updatedProducts = products.map(product => {
      const updatedProduct = product.toObject();
      updatedProduct.price = updatedProduct.price * req.Currency;
      return updatedProduct;
  });
    return res.status(200).json(updatedProducts);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




export const fetchProducts = async (req, res) => {
  const { category, minPrice, maxPrice, sortBy, orderBy } = req.query;

  // Construct the filter object
  const filter = {};
  if (category) {
    filter.category = category;
  }
  if (minPrice !== undefined) {
    filter.price = { ...filter.price, $gte: Number(minPrice) };
  }
  if (maxPrice !== undefined) {
    filter.price = { ...filter.price, $lte: Number(maxPrice) };
  }

  // Construct the sort object
  const sort = {};
  if (sortBy) {
    const sortOrder = orderBy && orderBy.toLowerCase() === 'desc' ? -1 : 1;
    sort[sortBy] = sortOrder;
  }
  console.log(filter)

  try {
    const products = await Product.find().sort(sort);
    console.log(products)
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// export const filters = async (req, res) => {
//   try {
//     const {
//       search,
//       minPrice,
//       maxPrice,
//       category,
//       colors,
//       sizes,
//       sortBy,
//       order
//     } = req.query;
//     console.log(req.query);
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 6;
//     const skip = (page - 1) * limit;

//     let filter = {};
//     if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
//     if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
//     // if (rating) filter.rating = { $gte: Number(rating) };
//     // if (brand) filter.brandname = brand;
//     if (category) filter.category = category;
//     if (colors) filter.subcategories = { $in: colors.split(',') }; 
//     if (sizes) filter.sizes = {$in : sizes.split(',')}
//     if (minDiscount) filter.discount = { ...filter.discount, $gte: Number(minDiscount) };
//     if (maxDiscount) filter.discount = { ...filter.discount, $lte: Number(maxDiscount) };
//     // if (hotDeals && hotDeals !== 'false') filter.hotDeals = true;

//     let sort = {};


//     if (sortBy) sort[sortBy] = order === 'desc' ? -1 : 1;
//     // console.log(filter);
//     let products;
//     if(search)
//     {
//       const regex = new RegExp(search, 'i'); // 'i' makes it case-insensitive
//        products = await Product.find({
//         $or: [
//           { name: regex },
//           { category: regex },
//           { colors: regex },
//           { description: regex },
//           { sizes: regex }
//         ]
//       }).find(filter).sort(sort).skip(skip).limit(limit);
//     }
//     else{
//      products = await Product.find(filter).sort(sort).skip(skip).limit(limit);
//   }
  

//     res.json(products);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// export const filters = async (req, res) => {
//   try {
//     const { category, colornames, sizes } = req.query;

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 6;
//     const skip = (page - 1) * limit;

//     let filter = {};

//     // Filter by category if provided
//     if (category) {
//       filter.category = category;
//     }

//     // Filter by sizes if provided
//     if (sizes) {
//       filter.sizes = { $in: sizes.split(',') };
//     }

//     // Filter by colornames (resolve colornames to colorcode and filter by that)
//     if (colornames) {
//       const colorDocs = await Color.find({ colorname: { $in: colornames.split(',') } });
//       if (colorDocs.length > 0) {
//         const colorcodes = colorDocs.map(c => c.colorcode);
//         filter['colors.colorcode'] = { $in: colorcodes };
//       } else {
//         return res.status(400).json({ error: 'No valid colors found' });
//       }
//     }

//     // Fetch products based on filters (if any) or all products if no filters
//     const products = await Product.find(filter).skip(skip).limit(limit);
//     const total = await Product.countDocuments(filter);

//     res.status(200).json({
//       products,
//       total,
//       page,
//       limit,
//     });

//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };


// export const filters = async (req, res) => {
//   try {
//     const { category, colors, sizes, sortBy } = req.query;
//     console.log(req.query)
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 6;
//     const skip = (page - 1) * limit;

//     let filter = {};

//     // Filter by categories if provided
//     if (category) {
//       filter.category = { $in: category.split(',') };
//     }

//     // Filter by sizes if provided
//     if (sizes) {
//       filter.sizes = { $in: sizes.split(',') };
//     }

//     console.log(colors)
//     // Filter by colors if provided
//     if (colors) {

//       const colorDocs = await Color.find({ colorname: { $in: colors.split(',') } });
//       if (colorDocs.length > 0) {
//         const colorcodes = colorDocs.map(c => c.colorcode);
//         filter['colors.colorcode'] = { $in: colorcodes };
//       } else {
//         return res.status(400).json({ error: 'No valid colors found' });
//       }
//     }

//     // Sorting
//     let sort = {};

//     switch (sortBy) {
//       case 'popularity':
//         sort = { views: -1 }; // Adjust based on your schema
//         break;
//       case 'newest':
//         sort = { createdAt: -1 };
//         break;
//       case 'priceAsc':
//         sort = { price: 1 };
//         break;
//       case 'priceDesc':
//         sort = { price: -1 };
//         break;
//       case 'discount':
//         sort = { discount: -1 }; // Adjust based on your schema
//         break;
//       default:
//         sort = {};
//     }

//     // Fetch products based on filters and sorting
//     const products = await Product.find(filter)
//       .sort(sort)
//       .skip(skip)
//       .limit(limit);
//     const total = await Product.countDocuments(filter);

//     res.status(200).json({
//       products,
//       total,
//       page,
//       limit,
//     });

//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };

// export const filters = async (req, res) => {
//   try {
//     const { category, colors, sizes, sortBy ,search} = req.query;

//     // Log the incoming query params for debugging
//     console.log(req.query);

//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 6;
//     const skip = (page - 1) * limit;

//     let filter = {};

//     // Filter by categories if provided (directly using the array)
//     if (category && category.length > 0) {
//       filter.category = { $in: category }; // No need to split, already an array
//     }

//     // Filter by sizes if provided (directly using the array)
//     if (sizes && sizes.length > 0) {
//       filter.sizes = { $in: sizes }; // No need to split, already an array
//     }

//     console.log(colors);
//     // Filter by colors if provided
//     if (colors && colors.length > 0) {
//       // Find colors by colorname in the Color collection
//       const colorDocs = await Color.find({ colorname: { $in: colors } });
//       if (colorDocs.length > 0) {
//         const colorcodes = colorDocs.map(c => c.colorcode);
//         filter['colors.colorcode'] = { $in: colorcodes }; // Use colorcode for filtering products
//       } else {
//         return res.status(400).json({ error: 'No valid colors found' });
//       }
//     }

//     // Sorting logic
//     let sort = {};

//     switch (sortBy) {
//       case 'popularity':
//         sort = { views: -1 }; // Adjust based on your schema
//         break;
//       case 'newest':
//         sort = { createdAt: -1 };
//         break;
//       case 'priceAsc':
//         sort = { price: 1 };
//         break;
//       case 'priceDesc':
//         sort = { price: -1 };
//         break;
//       case 'discount':
//         sort = { discount: -1 }; // Adjust based on your schema
//         break;
//       default:
//         sort = {};
//     }
//   let products;
//     if(search)
//     {
//       const regex = new RegExp(search, 'i'); // 'i' makes it case-insensitive
//        products = await Product.find({
//         $or: [
//           { name: regex },
//           { category: regex },
//           { colors: regex },
//           { description: regex },
//           { sizes: regex }
//         ]
//       }).find(filter).sort(sort).skip(skip).limit(limit);
//     }
//     else{
//      products = await Product.find(filter).sort(sort).skip(skip).limit(limit);
//   }
   

//     const total = await Product.countDocuments(filter);

//     // Return the filtered and sorted products along with pagination details
//     res.status(200).json({
//       products,
//       total,
//       page,
//       limit,
//     });

//   } catch (error) {
//     console.error('Error fetching products:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
export const filters = async (req, res) => {
  try {
    const { category, colors, sizes, sortBy, search } = req.query;
console.log(req.query)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    let filter = {};

    // Filter by category
    if (category && category.length > 0) {
      filter.category = { $in: category };
    }

    // Filter by sizes
    if (sizes && sizes.length > 0) {
      filter.sizes = { $in: sizes };
    }

    // Filter by colors
    if (colors && colors.length > 0) {
      const colorDocs = await Color.find({ colorname: { $in: colors } });
      if (colorDocs.length > 0) {
        const colorcodes = colorDocs.map(c => c.colorcode);
        filter['colors.colorcode'] = { $in: colorcodes };
      } else {
        return res.status(400).json({ error: 'No valid colors found' });
      }
    }

    // Sorting logic
    let sort = {};
    switch (sortBy) {
      case 'popularity':
        sort = { views: -1 }; // Most popular
        break;
      case 'newest':
        sort = { createdAt: -1 }; // Newest products
        break;
      case 'priceAsc':
        sort = { price: 1 }; // Lowest price first
        break;
      case 'priceDesc':
        sort = { price: -1 }; // Highest price first
        break;
      case 'discount':
        sort = { discount: -1 }; // Highest discount first
        break;
      default:
        sort = {};
    }

    // Search logic (case-insensitive regex search)
    let searchFilter = {};
    if (search) {
      const regex = new RegExp(search, 'i'); // Case-insensitive search
      searchFilter = {
        $or: [
          { name: regex },
          { category: regex },
          { 'colors.colorname': regex }, // Explicitly search within colorname
          { description: regex },
          { sizes: regex }
        ]
      };
    }

    // Combine search filter with other filters
    const combinedFilter = { ...filter, ...searchFilter };

    // Fetch products based on filter and sort
    const products = await Product.find(combinedFilter)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(combinedFilter);

    // Return response with pagination
    res.status(200).json({
      products,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const searchProducts = async (searchTerm) => {
  try {
    const regex = new RegExp(searchTerm, 'i'); // 'i' makes it case-insensitive
    const results = await Product.find({
      $or: [
        { name: regex },
        { category: regex },
        { sizes: regex },
        {colors:regex},
        { description: regex },
      ]
    });
    return results;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};


export const search =  async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).send('Query parameter "q" is required');
  }
  try {
    const products = await searchProducts(q);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while searching for products' });
  }
};

// Create Color
export const createColor = async (req, res) => {
  const { colorcode, colorname } = req.body;
  try {
    const color = new Color({ colorcode, colorname });
    await color.save();
    res.status(201).json({ message: 'Color created successfully', color });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Color
export const deleteColor = async (req, res) => {
  const { id } = req.body;

  try {
    // Find and delete the color
    const color = await Color.findByIdAndDelete(id);
    if (!color) return res.status(404).json({ message: 'Color not found' });

    // Remove the color from all products that reference it
    await Product.updateMany(
      { 'colors.colorname': color.colorname, 'colors.colorcode': color.colorcode }, // Find products with the deleted color
      { $pull: { colors: { colorname: color.colorname, colorcode: color.colorcode } } } // Remove the matching color object
    );

    res.status(200).json({ message: 'Color deleted successfully and removed from products' });
  } catch (error) {
    console.error('Error deleting color:', error);
    res.status(500).json({ message: error.message });
  }
};



// Get All Colors
export const getAllColors = async (req, res) => {
  try {
    const colors = await Color.find();
    res.status(200).json(colors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Color By ID
export const getColorById = async (req, res) => {
  const { id } = req.params;
  try {
    const color = await Color.findById(id);
    if (!color) return res.status(404).json({ message: 'Color not found' });
    
    res.status(200).json(color);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Color
export const editColor = async (req, res) => {
  const { id, colorcode, colorname } = req.body;

  try {
    // Find the color to update
    const color = await Color.findById(id);
    if (!color) return res.status(404).json({ message: 'Color not found' });

    // Store the old colorname and colorcode for matching in products
    const oldColorName = color.colorname;
    const oldColorCode = color.colorcode;

    // Update the color document itself
    color.colorcode = colorcode || color.colorcode;
    color.colorname = colorname || color.colorname;
    await color.save();

    // Update the color references in products
    await Product.updateMany(
      { 'colors.colorname': oldColorName, 'colors.colorcode': oldColorCode }, // Match old colorname and colorcode
      { 
        $set: {
          'colors.$[element].colorname': colorname, // Update new colorname
          'colors.$[element].colorcode': colorcode  // Update new colorcode
        }
      },
      { arrayFilters: [{ 'element.colorname': oldColorName, 'element.colorcode': oldColorCode }] } // Use array filter to match the correct color object
    );

    res.status(200).json({ message: 'Color updated successfully', color });
  } catch (error) {
    console.error('Error updating color in products:', error);
    res.status(500).json({ message: error.message });
  }
};



export const AddAndRemoveFavourites = async(req,res)=>{
  const {productId} = req.params;
  console.log("Hellow major")
  if(!productId)return res.json({error:"product Id not found"});
  try{
    console.log("hello surya");
   let message =  await Favourites.AddandDelete(req.user.email,productId);
   console.log(message);
   console.log("hello surya")
   return res.json({message:message})

  }
  catch(error){
    return res.status(500).json({"error":error.message});
  }
}

export const addToFav = async (req, res) => {
  const { productId } = req.body;
  
  try {
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    // Assuming req.user.email is available from your verifyAuthToken middleware
    const pr = await Favourites.addToFavourites(req.user.email, productId);

    return res.status(200).json({ message: "Product added to favourites" });
  } catch (error) {
    if (error.message.includes("Invalid Product Id")) {
      return res.status(400).json({ error: "Invalid Product ID" });
    } else if (error.message.includes("Product already in favourites")) {
      return res.status(409).json({ error: "Product is already in favourites" });
    } else {
      // For other unexpected errors, use 500 status code
      return res.status(500).json({ error: "An unexpected error occurred. Please try again later." });
    }
  }
};

export const remToFav = async(req,res)=>{
  const {productId} = req.body;
  try{
    const pr = await Favourites.removeFromFavourites(req.user.email,productId);
    return res.status(200).json({message:"product removed"})
  }
  catch(error){
    return res.status(500).json({error:error.message});
  }
}



export const FavouriteProducts = async (req, res) => {
  try {
      const fav = await Favourites.findOne({ email: req.user.email });
      if (!fav || !fav.products.length) {
          return res.status(200).json({ products:null });
      }

      // Fetch the product details for each product ID in the favourites
      const products = await Promise.all(fav.products.map(async (productId) => {
          const product = await axios.get(`https://api.printful.com/store/products/${productId}`, {
            headers: {
                Authorization: `Bearer ${process.env.printful_token}`,
            },
        });
          return product.data.result;
      }));

      res.status(200).json({products });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
