import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../App";
import { Request } from "../helpers/axios_helper";
import { InputNumber } from "antd";

const ProductInfo = () => {
  const { user, setvisible, setRedirectPath } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedcolor, setColor] = useState("");
  const [selectedsize, setSize] = useState("");
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [variant, setselectedVariant] = useState(null); // Set initial state to null
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(false);
  const hasFetchedProduct = useRef(false);

  const [sizeColorMap, setSizeColorMap] = useState({});
  const [colorSizeMap, setColorSizeMap] = useState({});

  const [variants, setVariants] = useState([]);

  // Set initial variant data when variants are loaded
  useEffect(() => {
    if (variants.length > 0) {
      const initialVariant = variants[0];
      setselectedVariant(initialVariant); // Set the first variant
      setColor(initialVariant.color); // Set the color from the first variant
      setSize(initialVariant.size); // Set the size from the first variant
      setMainImage(initialVariant.files[1]?.preview_url || ""); // Safely set image URL
    }
  }, [variants]);

  // Fetch product data from the server
  const fetchProduct = async () => {
    try {
      const response = await Request("GET", `/api/products/${id}`);
      const productDetails = response.data.productDetails;
      console.log(productDetails);
      setProduct(productDetails.sync_product);
      setVariants(productDetails.sync_variants);
      setColors(response.data.colors);
      setSizes(response.data.sizes);
      setSizeColorMap(response.data.sizeToColors);
      setColorSizeMap(response.data.colorToSizes);

      // If variants are fetched, set the initial variant data
      if (productDetails.sync_variants.length > 0) {
        const initialVariant = productDetails.sync_variants[0];
        setselectedVariant(initialVariant);
        setColor(initialVariant.color);
        setSize(initialVariant.size);
        setMainImage(initialVariant.files[1]?.preview_url || "");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  // useEffect(async () => {
  //   if (!hasFetchedProduct.current) {
  //     setLoading(true)
  //     await fetchProduct();
  //     hasFetchedProduct.current = true;
  //     setLoading(false)
  //   }
  // }, [id]);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true); // Start loading
  //       await fetchProduct();
  //       setLoading(false); // End loading
  //     } catch (error) {
  //       console.error('Error fetching product:', error);
  //       setLoading(false); // Ensure loading stops even on error
  //     }
  //   };

  //   if (!hasFetchedProduct.current) {
  //     fetchData();
  //     hasFetchedProduct.current = true;
  //   }
  // }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        await fetchProduct(); // Await the fetchProduct call
        setLoading(false); // End loading
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false); // Ensure loading stops on error
      }
    };

    if (!hasFetchedProduct.current) {
      fetchData(); // Call the async function
      hasFetchedProduct.current = true;
    }
  }, [id]); // Dependency array ensures this runs when `id` changes

  const addToFav = async () => {
    if (!user.loggedIn) {
      setvisible(true);
      setRedirectPath(location);
    } else {
      try {
        setLoading(true);
        const response = await Request("POST", `/prod/addfav/`, {
          productId: product.id,
          variantId: variant.id,
        });
        setLoading(false);
        if (response.status === 200) {
          navigate("/wish-list", { replace: true });
        }
      } catch (error) {
        // Handle error
      }
    }
  };

  const addToCart = async () => {
    if (!user.loggedIn) {
      setvisible(true);
      setRedirectPath(location);
    } else {
      try {
        const response = await Request("POST", `/cart/add/${product.id}`, {
          quantity,
          variantId: variant.id,
        });
        if (response.status === 200) {
          navigate("/cart");
        }
      } catch (error) {
        // Handle error
        console.log("error");
      }
    }
  };

  const getValidColor = async (colorName) => {
    try {
      const response = await fetch(
        `https://www.thecolorapi.com/id?name=${colorName}`
      );
      const data = await response.json();
      return data.hex.value; // Return hex color code
    } catch (error) {
      console.error("Error fetching color:", error);
      return colorName; // Return the original name if there's an error
    }
  };

  useEffect(() => {
    if (!hasFetchedProduct.current) {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleColorUpdate = async (selcolor) => {
    console.log(selcolor);
    setColor(selcolor); // Update the selected color state

    const filteredVariants = variants.filter(
      (variant) => variant.color === selcolor && variant.size === selectedsize
    );

    if (filteredVariants.length > 0) {
      const variant = filteredVariants[0]; // Assuming you want the first matching variant
      setselectedVariant(variant); // Set the selected variant
      console.log(variant.color); // Log the color of the selected variant
      setMainImage(variant.files[1].preview_url); // Set the main image preview URL
    }
  }; // Filter products based on selected color and size

  const handleSizeUpdate = (selsize) => {
    setSize(selsize); // Update the selected size state

    console.log(selsize);
    const filteredVariants = variants.filter(
      (variant) => variant.color === selectedcolor && variant.size === selsize
    );

    if (filteredVariants.length > 0) {
      const variant = filteredVariants[0]; // Assuming you want the first matching variant
      setselectedVariant(variant); // Set the selected variant
      // Log the color of the selected variant
      setMainImage(variant.files[1].preview_url); // Set the main image preview URL
    }
  }; // Filter products based on selected color and size

  return (
    <>
      {loading ? (
        <div className="justify-items-center w-screen ">
          <div className="flex space-x-2 justify-center items-center h-screen dark:invert">
            <span className="sr-only">Loading...</span>
            <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
          </div>
        </div>
      ) : (
        product && (
          <section className="py-12 sm:py-16 bg-white">
            <div className="container mx-auto px-4">
              <nav className="flex">
                <ol role="list" className="flex items-center">
                  <li className="text-left">
                    <div className="-m-1">
                      <a
                        href="/"
                        className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                      >
                        {" "}
                        Home{" "}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <a
                      href="/products"
                      className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"
                    >
                      {" "}
                      Products{" "}
                    </a>
                  </li>
                  <li className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-sm font-medium text-gray-800">
                      {" "}
                      {product.name}{" "}
                    </span>
                  </li>
                </ol>
              </nav>

              <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
                {/* Product Images */}
                <div className="lg:col-span-3 lg:row-end-1">
                  <div className="lg:flex lg:items-start">
                    <div className="lg:order-2 lg:ml-5">
                      <div className="max-w-xl overflow-hidden rounded-lg">
                        <img
                          className="h-full w-full object-cover"
                          src={mainImage}
                          alt={product.name}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {product.name}
                  </h1>

                  {/* Sizes */}
                  <h2 className="mt-8 text-base text-gray-900">Size</h2>
                  <div className="mt-3 flex select-none flex-wrap items-center gap-2">
                    {sizes.map((sizeOption) => (
                      <label key={sizeOption}>
                        <input
                          type="radio"
                          name="size"
                          value={sizeOption}
                          className="sr-only peer"
                          checked={variant.size === sizeOption}
                          onChange={() => handleSizeUpdate(sizeOption)}
                        />
                        <p
                          className={`peer-checked:bg-black peer-checked:text-white rounded-lg border border-black px-6 py-2 font-bold ${
                            selectedsize === sizeOption
                              ? "bg-black text-white"
                              : ""
                          }`}
                        >
                          {sizeOption}
                        </p>
                      </label>
                    ))}
                  </div>

                  {/* Colors */}
                  <h2 className="mt-8 text-base text-gray-900">Color</h2>
                  <div className="mt-3 flex select-none flex-wrap items-center gap-2">
                    {colors.map(({ color, image }) => (
                      <button
                        key={color}
                        className={`w-10 h-10 rounded-full ${
                          variant.color === color
                            ? "scale-125 border-2 border-black"
                            : "border-2 border-black"
                        }`}
                        onClick={() => handleColorUpdate(color)} // Set the selected color
                      >
                        {/* Display the image instead of background color */}
                        <img
                          src={image}
                          alt={color}
                          className="w-full h-full object-cover rounded-full"
                        />
                        <span className="sr-only">{color}</span>
                      </button>
                    ))}
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center mt-4">
                    <span className="mr-4">Quantity (nos):</span>
                    <InputNumber
                      min={1}
                      value={quantity}
                      onChange={(value) => setQuantity(value)}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
                    <div className="flex items-end">
                      <h1 className="text-3xl font-bold">
                        $
                        {variant && variant.retail_price
                          ? variant.retail_price
                          : ""}
                      </h1>
                      <span className="text-base">/unit</span>
                    </div>
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={addToCart}
                        className="inline-flex items-center justify-center rounded-md bg-gray-900 px-6 py-3 text-white font-bold hover:bg-gray-800"
                      >
                        Add to Cart
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigate("/checkout", {
                            state: {
                              fromCart: false,
                              productId: product.id,
                              quantity,
                              variantId: variant.id,
                            },
                          });
                        }}
                        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-white font-bold hover:bg-blue-500"
                      >
                        Buy Now
                      </button>

                      <button
                        type="button"
                        onClick={addToFav}
                        className="inline-flex items-center justify-center rounded-md bg-pink-600 px-4 py-3 text-white font-bold hover:bg-pink-500"
                      >
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      )}
    </>
  );
};

export default ProductInfo;
