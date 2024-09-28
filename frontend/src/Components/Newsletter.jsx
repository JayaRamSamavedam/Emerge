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
      <div className="container mx-auto px-5 rounded-lg xl:max-w-screen-xl">
        <div className="p-5 rounded-lg bg-white dark:bg-gray-900 lg:flex lg:justify-between lg:items-center lg:p-10 shadow-lg dark:shadow-none">
          <div className="lg:w-2/3">
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
                className="w-full mt-2.5 px-5 py-3 rounded-lg shadow-md bg-black text-white font-medium hover:bg-blue-700 transition duration-300 sm:flex-shrink-0 sm:w-auto sm:mt-0 sm:ml-5 dark:bg-white dark:text-black"
              >
                Subscribe
              </button>
            </form>
          </div>
          <div className="w-full mt-5 lg:mt-0 lg:ml-5 lg:w-auto">
            <div className="flex justify-center space-x-3 lg:justify-start">
              {/* Social Media Icons */}
              <a
                href="https://twitter.com/broadband_club"
                className="p-2.5 rounded-full border-2 border-gray-900 dark:border-white hover:bg-blue-600 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="w-6 h-6 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1668.56 1221.19">
                  <path
                    d="M283.94,167.31l386.39,516.64L281.5,1104h87.51l340.42-367.76L984.48,1104h297.8L874.15,558.3l361.92-390.99
		h-87.51l-313.51,338.7l-253.31-338.7H283.94z M412.63,231.77h136.81l604.13,807.76h-136.81L412.63,231.77z"
                  />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/broad-band-networks-club/"
                className="p-2.5 rounded-full border-2 border-gray-900 dark:border-white hover:bg-blue-600 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="w-6 h-6 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 50 50">
                  <path
                    d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"
                  />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/broadband_networks.klef/"
                className="p-2.5 rounded-full border-2 border-gray-900 dark:border-white hover:bg-blue-600 transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <svg className="w-6 h-6 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path
                    d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
