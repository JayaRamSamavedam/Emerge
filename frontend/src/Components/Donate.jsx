import React, { useState } from 'react';

const Donate = () => {
  const [donationType, setDonationType] = useState('one-time');
  const [donationAmount, setDonationAmount] = useState('');
  const [progress, setProgress] = useState(50); // Example progress (50%)

  const handleDonationTypeChange = (e) => {
    setDonationType(e.target.value);
  };

  const handleDonationAmountChange = (e) => {
    setDonationAmount(e.target.value);
  };

  const handleDonate = () => {
    // Mock function for handling donations
    alert(`Donated $${donationAmount} as a ${donationType} donation!`);
  };

  return (
    <div className=" pt-16 sm:pt-20 md:pt-24 lg:pt-28 min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white p-6 transition duration-500">
      <h1 className="text-4xl font-bold mb-8 tracking-wide text-center">
        Support Our Outreach Ministry !
      </h1>
      <div className="mt-10 w-full max-w-lg">
        <div className="mb-2 text-lg tracking-wider">Donation Goal Progress</div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 transition duration-500">
          <div
            className="bg-black dark:bg-white h-4 rounded-full transition duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="text-right mt-2 tracking-wide">{progress}% of goal reached, !</div>
      </div>

      {/* Donation Form */}
      <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg transition duration-500">
        <h2 className="text-3xl font-semibold mb-6 tracking-wider">
          Make a Donation
        </h2>

        {/* Donation Type */}
        <div className="mb-6">
          <label className="block text-xl mb-3 tracking-wide">Donation Type:</label>
          <select
            value={donationType}
            onChange={handleDonationTypeChange}
            className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white focus:outline-none transition duration-500"
          >
            <option value="one-time">One-time</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>

        {/* Donation Amount */}
        <div className="mb-6">
          <label className="block text-xl mb-3 tracking-wide">Amount (USD):</label>
          <input
            type="number"
            value={donationAmount}
            onChange={handleDonationAmountChange}
            placeholder="Enter amount"
            className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-black dark:text-white focus:outline-none transition duration-500"
          />
        </div>

        {/* Donate Button */}
        <button
          onClick={handleDonate}
          className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 p-3 rounded-lg text-xl font-semibold tracking-wider transition duration-500"
        >
          Donate Now!
        </button>
      </div>

      {/* Progress Bar */}
      
    </div>
  );
};

export default Donate;
