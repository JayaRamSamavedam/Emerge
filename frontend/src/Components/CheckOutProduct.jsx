import React,{useState,useEffect} from 'react'
import {
  Button,
  List,
  Card,
  InputNumber,
  Popconfirm,
  message,
  Row,
  Col,
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Request } from "../helpers/axios_helper";

const CheckOutProduct = ({ shippingCost, productId,variantId ,quantity,increment,decrement}) => {
  const [cartItems, setCartItems] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [product,setProduct] = useState(null);
  // Fetch the cart details when the component mounts
  useEffect(() => {
    fetchProduct();
  }, []);

   const fetchProduct = async () => {
      try {
        const response = await Request("GET", `/api/products/${productId}`);
        const productDetails = response.data.productDetails;

        console.log(productDetails)
        const variants = productDetails.sync_variants
        // If variants are fetched, set the initial variant data
        if (productDetails.sync_variants.length > 0) {
          const initialVariant = productDetails.sync_variants.find(v => v.id.toString() === variantId.toString());
          setProduct(initialVariant);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } 
    };
  // Function to fetch cart details from the server
  const fetchCartDetails = async () => {
    setLoading(true);
    try {
      const response = await Request("GET", "/cart/getproducts"); // Adjust the endpoint if necessary
      if (response && response.data) {
        setCartItems(response.data.products || []); // Ensure products is an array
        setTotalCost(response.data.totalCost || 0);
      } else {
        setCartItems([]); // Set to an empty array if response is invalid
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching cart details:", error);
      message.error("Failed to load cart");
      setLoading(false);
    }
  };

  // Function to increment quantity
  const incrementQuantity = async (productId, variantId) => {
    try {
      await Request("PUT", `/cart/increment/${productId}`, {
        variantId: variantId,
      });
      fetchCartDetails(); // Refresh the cart after updating
      message.success("Item quantity incremented");
    } catch (error) {
      message.error("Failed to increment quantity");
    }
  };

  // Function to decrement quantity
  const decrementQuantity = async (productId, currentQuantity, variantId) => {
    if (currentQuantity <= 1) {
      message.warning("Can't decrement quantity below 1");
      return;
    }
    try {
      await Request("PUT", `/cart/decrement/${productId}`, {
        variantId: variantId,
      });
      fetchCartDetails(); // Refresh the cart after updating
      message.success("Item quantity decremented");
    } catch (error) {
      message.error("Failed to decrement quantity");
    }
  };

  // Function to remove an item from the cart
  const removeItemFromCart = async (productId, variantId) => {
    try {
      await Request("DELETE", `/cart/remove/${productId}`, {
        variantId: variantId,
      });
      fetchCartDetails(); // Refresh the cart after removing the item
      message.success("Item removed from cart");
    } catch (error) {
      message.error("Failed to remove item");
    }
  };
  return (
    <div className={`container mx-auto p-8 mt-0`}>
      {loading ? (
        <div className="flex space-x-2 justify-center items-center h-screen dark:invert">
          <span className="sr-only">Loading...</span>
          <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
        </div>
      ) : !product ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-600">Your cart is empty</p>
        </div>
      ) : (
        <>
          <Card
                  style={{ width: "100%", padding: "20px" }}
                  actions={[
                    <Button
                      onClick={decrement}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>,
                    <InputNumber min={1} value={quantity} readOnly />,
                    <Button
                     onClick={increment}
                    >
                      +
                    </Button>, <Popconfirm
                                          title="Are you sure to remove this product?"
                                         
                                          okText="Yes"
                                          cancelText="No"
                                        >
                                          <Button icon={<DeleteOutlined />} />
                                        </Popconfirm>,
                  ]}
                >
                  <Row gutter={[16, 16]} align="middle">
                    <Col span={4} className="text-center">
                      <img
                        src={product.files[1].preview_url}
                        alt={product.name}
                        style={{ width: "100%", objectFit: "cover" }}
                      />
                    </Col>
                    <Col span={16}>
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <p className="text-gray-600">Price: ${product.retail_price}</p>
                      <p className="text-gray-600">
                        Total: ${(product.retail_price * quantity).toFixed(2)}
                      </p>
                    </Col>
                  </Row>
                </Card>

          <div className="cart-summary text-center mt-8">
            <div className="flex flex-col w-full">
              <div className="flex flex-row justify-between">
                <h1>Sub total</h1>
                <h1> ${Number(product?.retail_price).toFixed(2) * quantity}</h1>
              </div>
              <div className="flex flex-row justify-between">
                <h1>Shipping Charges</h1>
                <h1>
                  {shippingCost ? `$${shippingCost}` : "add address"}
                </h1>
              </div>
              {shippingCost && <div className="flex flex-row justify-between border-t-2 pt-2">
                <h1>Total Charges</h1>
                <h1>
                  ${Number(shippingCost)+(Number(product?.retail_price).toFixed(2)*quantity)}
                </h1>
              </div>}
              
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckOutProduct;


