import React, { useState } from 'react';
// Import the Animated Beam component
import { AnimatedBeamMultipleOutputDemo } from './AnimatedBeamDemo';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    category: 'prayer request',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className="pt-14 sm:pt-20 md:pt-24 lg:pt-28 bg-white dark:bg-black flex items-center justify-center">
      <div className="container mx-auto flex flex-col md:flex-row bg-white  dark:bg-black rounded-lg shadow-xl border-b-8 border-gray-200 dark:border-gray-700 p-4 sm:p-6 lg:p-10">
        
        {/* Left Side: Animated Icons */}
        <div className="md:w-1/2 w-full p-4 flex items-center justify-center">
          <AnimatedBeamMultipleOutputDemo className="h-64 sm:h-72 md:h-80 lg:h-full " />
        </div>

        {/* Right Side: Contact Form */}
        <div className="md:w-1/2 w-full p-4 sm:p-6 lg:p-10 flex flex-col justify-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black dark:text-white mb-4 sm:mb-6 md:mb-8 tracking-wide">
            Get in Touch
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 md:mb-10">
            We'd love to hear from you! Send us your inquiries, testimonies, or prayer requests.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 md:space-y-8">
            <div className="flex flex-col gap-4 sm:gap-6 md:flex-row">
              <div className="w-full">
                <label className="block text-base sm:text-lg text-black dark:text-white mb-1 sm:mb-2" htmlFor="name">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-400 transition-shadow shadow-sm hover:shadow-md"
                />
              </div>
              <div className="w-full">
                <label className="block text-base sm:text-lg text-black dark:text-white mb-1 sm:mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                  className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-400 transition-shadow shadow-sm hover:shadow-md"
                />
              </div>
            </div>
            <div>
              <label className="block text-base sm:text-lg text-black dark:text-white mb-1 sm:mb-2" htmlFor="category">
                What is this about?
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-400 transition-shadow shadow-sm hover:shadow-md"
              >
                <option value="prayer request">Prayer Request</option>
                <option value="outreach impact">Outreach Impact</option>
                <option value="general inquiry">General Inquiry</option>
              </select>
            </div>
            <div>
              <label className="block text-base sm:text-lg text-black dark:text-white mb-1 sm:mb-2" htmlFor="message">
                Your Message
              </label>
              <textarea
                name="message"
                id="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Share your thoughts with us..."
                className="w-full p-3 sm:p-4 border border-gray-300 dark:border-gray-700 bg-transparent dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 dark:focus:ring-gray-400 transition-shadow shadow-sm hover:shadow-md"
              ></textarea>
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white font-semibold text-base sm:text-lg rounded-full hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
