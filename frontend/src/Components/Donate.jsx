import React, { useState } from 'react';

const Donate = () => {
  const [donationType, setDonationType] = useState('one-time');
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedGoal, setSelectedGoal] = useState('');
  
  // Dummy data for previous donations impact
  const previousDonations = [
    {
      id: 1,
      title: 'Building a Community Center',
      description: 'Thanks to your generous donations, we are building a new community center!',
      impact: 'Impact: Helped 500+ families!',
      progress: 80,
      imageUrl: 'https://via.placeholder.com/400x300', // Placeholder image
    },
    {
      id: 2,
      title: 'School Supplies for Children',
      description: 'Your donations helped provide school supplies for over 100 children!',
      impact: 'Impact: Provided over 100 students with necessary tools!',
      progress: 95,
      imageUrl: 'https://via.placeholder.com/400x300', // Placeholder image
    },
  ];

  // Dummy data for donation topics
  const donationTopics = [
    {
      id: 1,
      title: 'Feed the Hungry Program',
      description: 'Help us reach our goal of feeding 500 families this year.',
      progress: 60,
      imageUrl: 'https://via.placeholder.com/400x300', // Placeholder image
    },
    {
      id: 2,
      title: 'Healthcare for the Elderly',
      description: 'We aim to provide medical care for elderly individuals in need.',
      progress: 40,
      imageUrl: 'https://via.placeholder.com/400x300', // Placeholder image
    },
    {
      id: 3,
      title: 'Education Scholarships',
      description: 'Support scholarships for underprivileged students to attend college.',
      progress: 30,
      imageUrl: 'https://via.placeholder.com/400x300', // Placeholder image
    },
  ];

  const handleDonationTypeChange = (e) => setDonationType(e.target.value);

  const handleDonationAmountChange = (e) => setDonationAmount(e.target.value);

  const handleGoalSelectionChange = (e) => setSelectedGoal(e.target.value);

  const handleDonate = () => {
    if (selectedGoal && donationAmount) {
      alert(`Donated $${donationAmount} as a ${donationType} donation to "${selectedGoal}"!`);
    } else {
      alert('Please select a donation goal and enter a donation amount.');
    }
  };

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 min-h-screen bg-[#F2EFE4] dark:bg-black text-black dark:text-white">
      {/* Hero Section */}
      <div className="w-full flex flex-col items-center justify-center py-16 px-6 bg-cover bg-center relative"
           style={{ backgroundImage: 'url(/assets/Banners/donate.png)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <h1 className="text-4xl font-bold mb-4 tracking-wide text-center z-10 text-white">
          Make a Difference Today!
        </h1>
        <p className="text-lg mb-8 text-center max-w-md z-10 text-white">
          Your donation can change lives and help us continue supporting our community!
        </p>
     
      </div>

      {/* Donation Form */}
      <div className="w-full flex flex-col items-center justify-center py-16 px-6">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-3xl font-semibold mb-6 tracking-wider">Donate Now</h2>

          {/* Donation Type */}
          <div className="mb-6">
            <label className="block text-xl mb-3 flex items-center">
              <span className="material-icons-outlined mr-2">card_giftcard</span> Donation Type:
            </label>
            <select
              value={donationType}
              onChange={handleDonationTypeChange}
              className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:outline-none"
            >
              <option value="one-time">One-time</option>
              <option value="recurring">Recurring</option>
            </select>
          </div>

          {/* Donation Goal Selection */}
          <div className="mb-6">
            <label className="block text-xl mb-3 flex items-center">
              <span className="material-icons-outlined mr-2">favorite</span> Select Donation Goal:
            </label>
            <select
              value={selectedGoal}
              onChange={handleGoalSelectionChange}
              className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:outline-none"
            >
              <option value="">-- Select a Goal --</option>
              {donationTopics.map((topic) => (
                <option key={topic.id} value={topic.title}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>

          {/* Donation Amount */}
          <div className="mb-6">
            <label className="block text-xl mb-3 flex items-center">
              <span className="material-icons-outlined mr-2">attach_money</span> Amount (USD):
            </label>
            <input
              type="number"
              value={donationAmount}
              onChange={handleDonationAmountChange}
              placeholder="Enter amount"
              className="w-full p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white focus:outline-none"
            />
          </div>

          {/* Donate Button */}
          <button
            onClick={handleDonate}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-lg text-xl font-semibold tracking-wider transition hover:bg-opacity-90"
          >
            Donate Now!
          </button>
        </div>
      </div>

      {/* Donation Goals Section */}
      <div className="py-16 bg-[#F2EFE4] dark:bg-black">
        <h2 className="text-3xl font-semibold text-center mb-8">Current Donation Goals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {donationTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <img
                src={topic.imageUrl}
                alt={topic.title}
                className="mb-4 w-full h-32 object-cover rounded-lg"
              />
              <h3 className="text-xl font-semibold mb-2 text-center">{topic.title}</h3>
              <p className="text-sm mb-4 text-center">{topic.description}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-black dark:bg-white h-2 rounded-full transition duration-500"
                  style={{ width: `${topic.progress}%` }}
                ></div>
              </div>
              <div className="text-right mt-2 text-sm">{topic.progress}% of goal reached</div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Section */}
      <div className="py-16 bg-[#F2EFE4] dark:bg-black">
        <h2 className="text-3xl font-semibold text-center mb-8">Your Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {previousDonations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <img
                src={donation.imageUrl}
                alt={donation.title}
                className="mb-4 w-full h-40 object-cover rounded-lg"
              />
              <h3 className="text-xl font-semibold mb-2 text-center">{donation.title}</h3>
              <p className="text-sm mb-4 text-center">{donation.description}</p>
              <p className="text-md font-bold text-center">{donation.impact}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-black dark:bg-white h-2 rounded-full transition duration-500"
                  style={{ width: `${donation.progress}%` }}
                ></div>
              </div>
              <div className="text-right mt-2 text-sm">{donation.progress}% of goal reached</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Donate;
