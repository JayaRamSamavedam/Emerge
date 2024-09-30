import React, { useState } from 'react';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleEmailChange = (e) => setEmail(e.target.value);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulate a subscription request (you can replace this with an actual API call)
    console.log('Subscribed email:', email);
    setEmail('');  // Reset the email field on successful subscription
  };


  return (
    <div className="py-15 md:py-15 lg:py-30">
      <div className=" container mx-auto px-5 rounded-lg xl:max-w-screen-xl">
        <div className="px-5 rounded-lg bg-white dark:bg-gray-900 lg:flex lg:justify-center lg:items-center lg:p-10 shadow-lg dark:shadow-none">
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white md:text-4xl lg:text-left">
              Sign up for our Newsletter
            </h1>
            <p className="mt-2 text-gray-700 dark:text-gray-300 text-center lg:text-left">
              Get the latest updates and offers right in your inbox.
            </p>
            <form className="mt-5 sm:mx-auto sm:flex sm:max-w-lg lg:mx-0" onSubmit={handleSubmit}>
              <input
                className="block w-full px-5 py-3 outline-none border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition duration-300"
                type="email"
                placeholder="Your e-mail"
                value={email}
                onChange={handleEmailChange}
                required
              />
              <button
                type="submit"
                className="w-full text-customRed mt-2.5 px-5 py-3 rounded-lg shadow-md bg-black text-white font-medium hover:bg-[#998200] dark:hover:bg-[#900C3F] transition duration-300 sm:flex-shrink-0 sm:w-auto sm:mt-0 sm:ml-5 dark:bg-white dark:text-black"
              >
                Subscribe
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
