import React, { useEffect, useState } from "react";
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

const CheckOutCart = ({ shippingCost }) => {
  const [cartItems, setCartItems] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  // Fetch the cart details when the component mounts
  useEffect(() => {
    fetchCartDetails();
  }, []);

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
      ) : cartItems.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-xl text-gray-600">Your cart is empty</p>
        </div>
      ) : (
        <>
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item>
                <Card
                  style={{ width: "100%", padding: "20px" }}
                  actions={[
                    <Button
                      onClick={() =>
                        decrementQuantity(
                          item.productId,
                          item.quantity,
                          item.variantId
                        )
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>,
                    <InputNumber min={1} value={item.quantity} readOnly />,
                    <Button
                      onClick={() =>
                        incrementQuantity(item.productId, item.variantId)
                      }
                    >
                      +
                    </Button>,
                    <Popconfirm
                      title="Are you sure to remove this product?"
                      onConfirm={() =>
                        removeItemFromCart(item.productId, item.variantId)
                      }
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
                        src={item.coverImage}
                        alt={item.name}
                        style={{ width: "80px", objectFit: "cover" }}
                      />
                    </Col>
                    <Col span={16}>
                      <h3 className="text-xl font-semibold">{item.name}</h3>
                      <p className="text-gray-600">Price: ${item.price}</p>
                      <p className="text-gray-600">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </Col>
                  </Row>
                </Card>
              </List.Item>
            )}
          />

          <div className="cart-summary text-center mt-8">
            <div className="flex flex-col w-full">
              <div className="flex flex-row justify-between">
                <h1>Sub total</h1>
                <h1> ${totalCost.toFixed(2)}</h1>
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
                  ${Number(shippingCost)+totalCost}
                </h1>
              </div>}
              
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckOutCart;
