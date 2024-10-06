import React, { useState } from 'react';
import Switcher from './Switcher';
import { Link } from 'react-router-dom';
const NewNavbar = () => {
  // State to control mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // State to control modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State to toggle between login and signup
  const [isLoginForm, setIsLoginForm] = useState(true);

  // Function to toggle the menu open and close
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to toggle modal open and close
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Function to toggle between login and signup forms
  const switchForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  return (
    <>
      <nav className="bg-white dark:bg-black fixed w-full z-20 top-0 left-0 shadow-lg border-b border-gray-300 dark:border-gray-700 transition-all duration-300 ease-in-out">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo with Bordered Box */}
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="border-2 border-black px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-3 lg:px-12 lg:py-4 dark:border-white">
              <span className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide sm:tracking-wider md:tracking-widest font-normal dark:text-white">
                EMERGE
              </span>
            </div>
          </a>

          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              type="button"
              onClick={toggleModal}
              className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 text-center transition-all duration-300 ease-in-out dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:focus:ring-gray-400 shadow-lg hover:shadow-xl"
            >
              Login/SignUp
            </button>
            <div className="text-black dark:text-white font-medium bg-inherit text-sm px-5 py-2 text-center transition-transform duration-300 hover:scale-105">
              <Switcher />
            </div>
            {/* Hamburger menu button */}
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-600 transition-colors duration-300 ease-in-out"
              aria-controls="navbar-sticky"
              aria-expanded={isMenuOpen ? 'true' : 'false'}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
              isMenuOpen ? 'block' : 'hidden'
            }`}
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium  rounded-lg bg-white dark:bg-black md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white transition-colors duration-300">
              <li>
                <Link
                  to="/"
                  className=" tracking-wide font-bold block py-2 px-3 text-black dark:text-white rounded hover:underline md:p-0 md:dark:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/Shop"
                  className="tracking-wide font-bold block py-2 px-3 text-black dark:text-white rounded hover:underline md:p-0 md:dark:text-white"
                >
                  Shop
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="tracking-wide  font-bold block py-2 px-3 text-black dark:text-white rounded hover:underline md:p-0 md:dark:text-white"
                >
                  Donate
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="tracking-wide font-bold block py-2 px-3 text-black dark:text-white rounded hover:underline md:p-0 md:dark:text-white"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="tracking-wide font-bold block py-2 px-3 text-black dark:text-white rounded hover:underline md:p-0 md:dark:text-white"
                >
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal Component */}
      {isModalOpen && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {isLoginForm ? 'Login' : 'Sign Up'}
              </h3>
              <button
                onClick={toggleModal}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Form Fields */}
            <form className="space-y-4">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="block w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@example.com"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="block w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Additional Field for Sign Up */}
              {!isLoginForm && (
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="block w-full px-4 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all"
              >
                {isLoginForm ? 'Login' : 'Sign Up'}
              </button>
            </form>

            {/* Toggle Form Link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              {isLoginForm ? (
                <>
                  Don’t have an account?{' '}
                  <button onClick={switchForm} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button onClick={switchForm} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default NewNavbar;
