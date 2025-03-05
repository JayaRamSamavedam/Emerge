import React, { useState,useRef,useEffect } from 'react';
import { Calendar, Heart, Church, Users, Music } from 'lucide-react';
import { Request } from '../helpers/axios_helper';
import { useNavigate } from 'react-router-dom';
import {message,Button} from 'antd'
const ChurchDonate = () => {
  const [donationType, setDonationType] = useState('one-time');
  const [donationAmount, setDonationAmount] = useState('');
  const [isTokenized, setIsTokenized] = useState(false);
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [loading, setLoading] = useState(false);
const iframeRef = useRef(null);
    const [paymentInstrumentId, setPaymentInstrumentId] = useState(null);
   const navigate = useNavigate();
  const predefinedAmounts = [25, 50, 100, 250, 500, 1000];
const postMessageToIframe = (message) => {
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage(message, "*");
    }
  };

  useEffect(() => {
    const handleIframeMessages = (event) => {
      const { type, paymentInstrumentId, message: iframeMessage } = event.data;

      if (type === "tokenization_success") {
        setPaymentInstrumentId(paymentInstrumentId);
        setIsTokenized(true);
        
      } else if (type === "tokenization_failure") {
        setIsTokenized(false);
        
      }
    };

    window.addEventListener("message", handleIframeMessages);
    return () => {
      window.removeEventListener("message", handleIframeMessages);
    };
  }, []);
   useEffect(() => {
      
        iframeRef.current.src = "https://tokenization-form-sandbox.synswi.com/card-form?accountId=acc-c8a42bea-a708-4165-beea-e1eb95b5000a"; // Replace with your iframe URL 
      
      iframeRef.current.contentWindow.postMessage({ type: 'init' }, '*');
    }, [iframeRef]);
  const ministries = [
    {
      id: 1,
      title: 'Building Restoration Fund',
      description: 'Help preserve our historic sanctuary and facilities for future generations.',
      icon: <Church className="w-10 h-10 mb-2 text-blue-600" />,
      progress: 65,
      goal: 500000,
      raised: 325000,
      image: '/assets/images/restoration.jpg'
    },
    {
      id: 2,
      title: 'Community Outreach',
      description: 'Support our food bank, homeless ministry, and community support programs.',
      icon: <Users className="w-10 h-10 mb-2 text-green-600" />,
      progress: 80,
      goal: 100000,
      raised: 80000,
      image: '/assets/images/outreach.jpg'
    },
    {
      id: 3,
      title: 'Youth Ministry',
      description: 'Invest in the next generation through youth programs and education.',
      icon: <Heart className="w-10 h-10 mb-2 text-red-600" />,
      progress: 45,
      goal: 75000,
      raised: 33750,
      image: '/assets/images/youth.jpg'
    },
    {
      id: 4,
      title: 'Music Ministry',
      description: 'Support our choir, worship team, and musical instruments maintenance.',
      icon: <Music className="w-10 h-10 mb-2 text-purple-600" />,
      progress: 55,
      goal: 50000,
      raised: 27500,
      image: '/assets/images/music.jpg'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      text: "Through our church's outreach program, we've been able to serve over 1,000 meals to those in need.",
      ministry: 'Community Outreach',
      avatar: '/assets/images/sarah.jpg'
    },
    {
      id: 2,
      name: 'Pastor Michael',
      text: 'The restoration of our historic stained glass windows has brought new light into our sanctuary.',
      ministry: 'Building Restoration',
      avatar: '/assets/images/pastor.jpg'
    }
  ];

  const handleDonationTypeChange = (type) => setDonationType(type);
  const handleDonationAmountChange = (e) => setDonationAmount(e.target.value);
  const handleMinistryChange = (e) => setSelectedMinistry(e.target.value);
  const handlePredefinedAmount = (amount) => setDonationAmount(amount.toString());
  let tokenizationAttempts = 0; // Initialize a counter

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    if(!isTokenized) {
      iframeRef.current?.contentWindow?.postMessage({ type: "submit_form" }, "*");
      message.info(`Processing tokenization, attempt ${tokenizationAttempts + 1}...`);
    }

  
    if (isTokenized) {
      // Proceed with the donation request
      setLoading(false)
      const donationPayload = {
        instrumentId: paymentInstrumentId,
        ministry: selectedMinistry,
        amount: donationAmount,
        donationType: donationType,
      };
  
      try {
        
        const abcd = await Request("POST", "/user/donate", donationPayload);
        message.success("Donation successful!");
        navigate("/viewdonations");
        console.log(donationType, donationAmount, selectedMinistry);
      } catch (error) {
        message.error(`Donation failed: ${error.message}`);
        console.error("Donation error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      message.error("Tokenization failed after multiple attempts.");
      setLoading(false);
    }
  };
  
  
  const waitForTokenization = () => {
    return new Promise((resolve) => {
      const check = () => {
        if (isTokenized) {
          resolve();
        } else {
          setTimeout(check, 500);
        }
      };
      check();
    });
  };
  
 
  // const handleSubmit=async (e)=>{
  //   e.preventDefault();
  //   const checkTokenization = () => {
  //      if (!isTokenized) {
      //   iframeRef.current?.contentWindow?.postMessage({ type: "submit_form" }, "*");
      //   message.info("Processing tokenization, please wait...");
      //   return;
      // }
  //   };
  //   
  //   postMessageToIframe({ type: "submit_form" })
  //   const donationPayload = {
  //     instrumentId :paymentInstrumentId,
  //     ministry:selectedMinistry,
  //     amount:donationAmount,
  //     donationType:donationType
  //   }

  //   const abcd = await Request("POST","/user/donate",donationPayload)
  //   navigate('/viewdonations')
  //   console.log(donationType,donationAmount,selectedMinistry);
  // }
  return (
    <div className="min-h-screen bg-[#F2EFE4]">
      
      <div
        className="relative h-96 bg-cover bg-center flex items-center justify-center text-white"
        style={{ backgroundImage: `url("/assets/Banners/donate.png")` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="text-center z-10 px-4">
          <h1 className="text-5xl font-extrabold mb-4 animate-float">
            "Give, and it will be given to you"
          </h1>
          <p className="text-xl mb-6">Luke 6:38</p>
          <p className="text-lg max-w-2xl mx-auto">
            Your generosity helps us continue God's work in our community and beyond.
          </p>
        </div>
      </div>

      {/* Main Donation Form */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-4xl font-bold text-center mb-10">Support Our Ministry</h2>
          <div className="space-y-8">
            {/* Ministry Selection */}
            <div>
              <label className="block text-lg mb-2 font-semibold">Select Ministry</label>
              <select
                value={selectedMinistry}
                onChange={handleMinistryChange}
                className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              >
                <option value="">Choose a Ministry</option>
                {ministries.map((ministry) => (
                  <option key={ministry.id} value={ministry.title}>
                    {ministry.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Donation Type */}
            <div>
              <label className="block text-lg mb-2 font-semibold">Giving Frequency</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleDonationTypeChange('one-time')}
                  className={`p-4 rounded-lg border ${
                    donationType === 'one-time'
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white dark:bg-gray-800 border-gray-300'
                  }`}
                >
                  One-Time Gift
                </button>
                <button
                  onClick={() => handleDonationTypeChange('monthly')}
                  className={`p-4 rounded-lg border ${
                    donationType === 'monthly'
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white dark:bg-gray-800 border-gray-300'
                  }`}
                >
                  Monthly Giving
                </button>
                
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Payment Details</h3>
          <div className="mb-6 p-4 border rounded-lg">
          <iframe
        ref={iframeRef}
        src="https://tokenization-form-sandbox.synswi.com/card-form?accountId=acc-c8a42bea-a708-4165-beea-e1eb95b5000a"
        className="w-full max-w-md h-64 border border-gray-300 rounded-md"
        title="Tokenization Form"
      ></iframe>
          </div>
            {/* Amount Selection */}
            <div>
              <label className="block text-lg mb-2 font-semibold">Select Amount</label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {predefinedAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handlePredefinedAmount(amount)}
                    className={`p-4 rounded-lg border ${
                      donationAmount === amount.toString()
                        ? 'bg-blue-600 text-white border-blue-700'
                        : 'bg-white dark:bg-gray-800 border-gray-300'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={donationAmount}
                onChange={handleDonationAmountChange}
                placeholder="Enter custom amount"
                className="w-full p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Submit Button */}
            <Button loading={loading} onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg text-xl font-bold transition-all">
              Give Now
            </Button>
          </div>
        </div>

        {/* Ministry Impact Section */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center mb-10">Our Ministries' Impact</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {ministries.map((ministry) => (
              <div
                key={ministry.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src="/assets/Testimonial.png"
                  alt={ministry.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex flex-col items-center mb-4">
                    {ministry.icon}
                    <h3 className="text-xl font-semibold mb-2">{ministry.title}</h3>
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
                      {ministry.description}
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${ministry.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>${ministry.raised.toLocaleString()} raised</span>
                    <span>Goal: ${ministry.goal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h2 className="text-4xl font-bold text-center mb-10">Testimonials</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
              >
                <div className="flex items-center mb-4">
                  <img
                    src="/assets/Testimonial.png"
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.ministry}
                    </p>
                  </div>
                </div>
                <p className="italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
   
    </div>
  );
};

export default ChurchDonate;
