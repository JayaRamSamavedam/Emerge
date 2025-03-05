import React, { useState, useEffect } from "react";

const TokenizationForm = () => {
  const iframeRef = React.useRef(null);
  const [paymentInstrumentId, setPaymentInstrumentId] = useState("");
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  // Helper function to post a message to the iframe
  const postMessageToIframe = (message) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(message, "*");
    }
  };

  // Listener for message events from the iframe
  useEffect(() => {
    const handleIframeMessages = (event) => {
      const { type, paymentInstrumentId, message } = event.data;

      if (type === "tokenization_success") {
        console.log("Tokenization Success:", paymentInstrumentId);
        setPaymentInstrumentId(paymentInstrumentId);
      } else if (type === "tokenization_failure") {
        console.error("Tokenization Failure:", message);
      }
    };

    window.addEventListener("message", handleIframeMessages);

    return () => {
      window.removeEventListener("message", handleIframeMessages);
    };
  }, []);

  // Handle copying to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(paymentInstrumentId).then(() => {
      setShowCopyMessage(true);
      setTimeout(() => setShowCopyMessage(false), 2000); // Hide message after 2 seconds
    });
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Payment Instrument Tokenization</h1>
      <iframe
        ref={iframeRef}
        src="https://tokenization-form-sandbox.synswi.com/card-form?accountId=acc-c8a42bea-a708-4165-beea-e1eb95b5000a"
        className="w-full max-w-md h-64 border border-gray-300 rounded-md"
        title="Tokenization Form"
      ></iframe>
      <div className="mt-4 flex gap-4">
        <button
          onClick={() => postMessageToIframe({ type: "submit_form" })}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit Form
        </button>
        <button
          onClick={() => postMessageToIframe({ type: "clear_form" })}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Clear Form
        </button>
      </div>

      {paymentInstrumentId && (
        <div className="mt-6 w-full max-w-md p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold">Payment Instrument ID</h2>
          <div className="flex items-center mt-2">
            <input
              type="text"
              value={paymentInstrumentId}
              readOnly
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
            />
            <button
              onClick={handleCopy}
              className="ml-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Copy
            </button>
          </div>
          {showCopyMessage && (
            <p className="mt-2 text-sm text-green-500">Copied to clipboard!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TokenizationForm;
