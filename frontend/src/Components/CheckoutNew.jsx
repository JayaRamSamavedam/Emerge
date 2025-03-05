import React, { useState, useEffect, useRef } from "react";
import { Button, Form, message, Card, Radio } from "antd";
import { Request } from "../helpers/axios_helper";
import { useNavigate, useLocation } from "react-router-dom";
import Cart from "./Cart";
import CheckOutCart from "./CheckOutCart";
import CheckOutProduct from "./CheckOutProduct";

const CheckoutNew = () => {
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  console.log(selectedOption)
  const iframeRef = useRef(null);
  const [paymentInstrumentId, setPaymentInstrumentId] = useState("");
  const [isTokenized, setIsTokenized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipmentAddress: {
      name: "",
      line1: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
    },
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { fromCart, productId, quantity, variantId } = location.state || {};
const [newQuantity , setNewQuantity] = useState(quantity);
const increment = ()=>{
  setNewQuantity(newQuantity+1);
}
const decrement = () =>{
  setNewQuantity(newQuantity-1);
}
  const handleSelectionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const US_CITIES = {
    CA: ["Los Angeles", "San Francisco", "San Diego", "Sacramento"],
    NY: ["New York City", "Buffalo", "Rochester", "Albany"],
    TX: ["Houston", "Austin", "Dallas", "San Antonio"],
    FL: ["Miami", "Orlando", "Tampa", "Jacksonville"],
    IL: ["Chicago", "Springfield", "Naperville", "Peoria"],
  };
  const postMessageToIframe = (message) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, "*");
    } else {
      console.warn("Iframe not ready. Retrying...");
      setTimeout(() => postMessageToIframe(message), 500); // Retry after 500ms
    }
  };
  useEffect(() => {
    const handleIframeMessages = (event) => {
      const { type, paymentInstrumentId, message: iframeMessage } = event.data;

      if (type === "tokenization_success") {
        setPaymentInstrumentId(paymentInstrumentId);
        setIsTokenized(true);
        message.success("Tokenization successful!");
      } else if (type === "tokenization_failure") {
        setIsTokenized(false);
        message.error("Tokenization failed. Please try again.");
      }
    };

    window.addEventListener("message", handleIframeMessages);
    return () => {
      window.removeEventListener("message", handleIframeMessages);
    };
  }, []);

  useEffect(() => {
    // Initialize the iframe when the component mounts
    if (iframeRef.current) {
      iframeRef.current.src = "https://tokenization-form-sandbox.synswi.com/card-form?accountId=acc-c8a42bea-a708-4165-beea-e1eb95b5000a"; // Replace with your iframe URL 
    }
    iframeRef.current.contentWindow.postMessage({ type: 'init' }, '*');
  }, []); // Run only once on mount
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      shipmentAddress: { ...formData.shipmentAddress, [name]: value },
    });
  };

  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData({
      ...formData,
      shipmentAddress: {
        ...formData.shipmentAddress,
        state,
        city: "", // Reset city when state changes
      },
    });
    console.log(formData.shipmentAddress)
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isTokenized) {
      iframeRef.current?.contentWindow?.postMessage({ type: "submit_form" }, "*");
      message.info("Processing tokenization, please wait...");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = fromCart ? "/orders/cart-buy-now" : "/orders/buy-now";
      const orderPayload = {
        shipmentAddress: formData.shipmentAddress,
        paymentInstrumentId,
        shipment: selectedOption,
      };
      const orderData = fromCart
        ? { ...orderPayload }
        : { productId,"quantity": newQuantity, ...orderPayload, variantId };

      const { data } = await Request("POST", apiUrl, orderData);

      if (data.requiresAction) {
        window.location.href = data.nextActionUrl;
      } else {
        message.success("Order placed successfully");
        navigate("/orders", { state: { order: data } });
      }
    } catch (err) {
      message.error(`Failed to place order: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchShippingOptions = async () => {
    try {
      const apiUrl = fromCart ? "/orders/charges":"/order/prcharges"
      const payload = {
        shipmentAddress: formData.shipmentAddress,
      }
      const apipayload = fromCart
        ? { ...payload }
        : { productId, variantId,"quantity":newQuantity, ...payload };
      const response = await Request("POST", apiUrl, apipayload);
      setShippingOptions(response.data);
    } catch (error) {
      console.error("Failed to fetch shipping options:", error);
    }
  };
  const renderForm=()=>{
    return ( <div className=" bg-white p-6 rounded-lg  w-full max-w-md ">
      <Form layout="vertical" onSubmitCapture={handleSubmit}>
        <Form.Item label="Full Name" className="mb-4">
          <input
            className="w-full p-2 border rounded-lg"
            name="name"
            value={formData.shipmentAddress.name}
            onChange={handleInputChange}
            required
          />
        </Form.Item>
        <Form.Item label="Street" className="mb-4">
          <input
            className="w-full p-2 border rounded-lg"
            name="street"
            value={formData.shipmentAddress.street}
            onChange={handleInputChange}
            required
          />
        </Form.Item>
        <Form.Item label="Line1" className="mb-4">
          <input
            className="w-full p-2 border rounded-lg"
            name="line1"
            value={formData.shipmentAddress.line1}
            onChange={handleInputChange}
            required
          />
        </Form.Item>
        <Form.Item label="State" className="mb-4">
          <select
            className="w-full p-2 border rounded-lg"
            name="state"
            value={formData.shipmentAddress.state}
            onChange={handleStateChange}
            required
          >
            <option value="">Select State</option>
            {Object.keys(US_CITIES).map((stateCode) => (
              <option key={stateCode} value={stateCode}>
                {stateCode}
              </option>
            ))}
          </select>
        </Form.Item>
        <Form.Item label="City" className="mb-4">
          <select
            className="w-full p-2 border rounded-lg"
            name="city"
            value={formData.shipmentAddress.city}
            onChange={handleInputChange}
            required
            disabled={!formData.shipmentAddress.state}
          >
            <option value="">Select City</option>
            {formData.shipmentAddress.state &&
              US_CITIES[formData.shipmentAddress.state].map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </Form.Item>
        <Form.Item label="Postal Code" className="mb-4">
          <input
            className="w-full p-2 border rounded-lg"
            name="postalCode"
            value={formData.shipmentAddress.postalCode}
            onChange={handleInputChange}
            required
          />
        </Form.Item>
        <Form.Item label="Country" className="mb-4">
          <select
            className="w-full p-2 border rounded-lg"
            name="country"
            value={formData.shipmentAddress.country}
            onChange={handleInputChange}
            required
          >
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
            <option value="IN">India</option>
            <option value="FR">France</option>
            <option value="DE">Germany</option>
            <option value="JP">Japan</option>
            <option value="CN">China</option>
          </select>
        </Form.Item>
        <Button
          type="primary"
          className="w-full bg-blue-500 text-white py-2 rounded-lg"
          onClick={fetchShippingOptions}
          loading={loading}
        >
          Get Shipment Charges
        </Button>
      </Form>
    </div>);
  }
  return (
    <div className="min-h-screen mt-20 bg-gray-100 py-10  flex justify-center w-full ">
      <div className=" max-w-6xl flex flex-row md:grid-cols-2 gap-6  justify-between w-full">
        {/* Left Column: Cart (if fromCart) */}
        {fromCart ? (
          <div className="bg-white shadow-md rounded-lg p-6 border w-full h-fit">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Your Order Details</h2>
            <CheckOutCart  shippingCost={selectedOption && selectedOption.rate} />
          </div>
        ):(
          <div className="bg-white shadow-md rounded-lg p-6 border w-full h-fit">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Your Order Details</h2>
            <CheckOutProduct  shippingCost={selectedOption && selectedOption.rate} variantId={variantId} productId={productId} quantity={newQuantity} increment={increment} decrement={decrement}/>
          </div>
        )}
        <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 w-full gap-5 ">
          <h2 className="text-xl font-semibold border-b pb-2 mb-4">Checkout</h2>
          {renderForm()}

          {/* Shipping Options */}
          {shippingOptions.length > 0 && (
            <Card title="Select Shipping Option" className="mt-6 shadow-sm border border-gray-300 rounded-lg">
              <Radio.Group onChange={handleSelectionChange} value={selectedOption} className="flex flex-col space-y-3">
                {shippingOptions.map((option) => (
                  <Radio key={option.id} value={option} className="p-3 border rounded-lg flex items-center shadow-sm">
                    <span className="text-gray-700 font-medium">
                      {option.name} - {option.rate} {option.currency}
                    </span>
                  </Radio>
                ))}
              </Radio.Group>
            </Card>
          )}

          {/* Payment Section */}
          <h3 className="text-xl font-semibold mt-6 mb-3">Payment Details</h3>
          <div className="w-full">
            <iframe
              ref={iframeRef}
              src="https://tokenization-form-sandbox.synswi.com/card-form?accountId=acc-c8a42bea-a708-4165-beea-e1eb95b5000a"
              className="w-full h-80 border border-none "
              title="Tokenization Form"
            ></iframe>
          </div>

          <Button type="primary" className="w-full" onClick={handleSubmit} loading={loading}>
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutNew;
