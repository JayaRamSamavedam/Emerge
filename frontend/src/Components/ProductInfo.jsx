import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../App';
import { Request } from '../helpers/axios_helper';
import { InputNumber } from 'antd';

const ProductInfo = () => {
  const { user, setvisible, setRedirectPath } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState('');
  const [size, setSize] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(false);
  const hasFetchedProduct = useRef(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await Request('GET', `/prod/getByID/${id}`);
      setProduct(response.data);
      setMainImage(response.data.coverImage); // Set the cover image as the default main image
      setLoading(false);
      hasFetchedProduct.current = true;
    } catch (error) {
      navigate('/view-products');
    }
  };

  const addToFav = async () => {
    if (!user.loggedIn) {
      setvisible(true);
      setRedirectPath(location);
    } else {
      try {
        setLoading(true);
        const response = await Request('POST', `/prod/addfav/`, { productId: product.productId });
        setLoading(false);
        if (response.status === 200) {
          navigate('/wish-list', { replace: true });
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
        const response = await Request('POST', `/cart/add/${product.productId}`, { quantity ,color,size});
        if (response.status === 200) {
          navigate('/cart');
        }
      } catch (error) {
        // Handle error
        console.log("error");
      }
    }
  };

  useEffect(() => {
    if (!hasFetchedProduct.current) {
      fetchProduct();
    }
  }, [id, navigate]);

  return (
    <>
      {product && (
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <nav className="flex">
              <ol role="list" className="flex items-center">
                <li className="text-left">
                  <div className="-m-1">
                    <a href="/" className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"> Home </a>
                  </div>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <a href="/products" className="rounded-md p-1 text-sm font-medium text-gray-600 focus:text-gray-900 focus:shadow hover:text-gray-800"> Products </a>
                </li>
                <li className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-800"> {product.name} </span>
                </li>
              </ol>
            </nav>

            <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
              {/* Product Images */}
              <div className="lg:col-span-3 lg:row-end-1">
                <div className="lg:flex lg:items-start">
                  <div className="lg:order-2 lg:ml-5">
                    <div className="max-w-xl overflow-hidden rounded-lg">
                      <img className="h-full w-full object-cover" src={mainImage} alt={product.name} />
                    </div>
                  </div>
                  <div className="mt-2 w-full lg:order-1 lg:w-32 lg:flex-shrink-0">
                    <div className="flex flex-row items-start lg:flex-col">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setMainImage(image)}
                          className={`flex-0 aspect-square mb-3 h-20 overflow-hidden rounded-lg border-2 ${mainImage === image ? 'border-gray-900' : 'border-transparent'} text-center`}
                        >
                          <img className="h-full w-full object-cover" src={image} alt={`Thumbnail ${index}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                {/* Sizes */}
                <h2 className="mt-8 text-base text-gray-900">Size</h2>
                <div className="mt-3 flex select-none flex-wrap items-center gap-2">
                  {product.sizes.map((sizeOption) => (
                    <label key={sizeOption}>
                      <input
                        type="radio"
                        name="size"
                        value={sizeOption}
                        className="sr-only peer"
                        checked={size === sizeOption}
                        onChange={() => setSize(sizeOption)}
                      />
                      <p className={`peer-checked:bg-black peer-checked:text-white rounded-lg border border-black px-6 py-2 font-bold ${size === sizeOption ? 'bg-black text-white' : ''}`}>
                        {sizeOption}
                      </p>
                    </label>
                  ))}
                </div>

                {/* Colors */}
                <h2 className="mt-8 text-base text-gray-900">Color</h2>
                <div className="mt-3 flex select-none flex-wrap items-center gap-2">
                  {product.colors.map((colorOption) => (
                    <button
                      key={colorOption.colorname}
                      className={`w-10 h-10 rounded-full border-2 ${color === colorOption.colorcode ? 'border-black' : 'border-transparent'}`}
                      style={{ backgroundColor: colorOption.colorcode }}
                      onClick={() => setColor(colorOption.colorcode)}
                    >
                      <span className="sr-only">{colorOption.colorname}</span>
                    </button>
                  ))}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center mt-4">
                  <span className="mr-4">Quantity (nos):</span>
                  <InputNumber min={1} value={quantity} onChange={(value) => setQuantity(value)} />
                </div>

                {/* Action Buttons */}
                <div className="mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
                  <div className="flex items-end">
                    <h1 className="text-3xl font-bold">${product.discountedPrice}</h1>
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
                        navigate('/checkout', {
                          state: { fromCart: false, productId: product.productId, quantity },
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

                {/* Description */}
                <div className="mt-8 flow-root sm:mt-12">
                  <h1 className="text-3xl font-bold">Description</h1>
                  <p className="mt-4">{product.description}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default ProductInfo;
