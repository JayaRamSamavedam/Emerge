import React, { useState } from 'react';
import Switcher from './Switcher';

const NewNavbar = () => {
  // State to control mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle the menu open and close
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
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
          <button type="button" className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 text-center transition-all duration-300 ease-in-out dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:focus:ring-gray-400 shadow-lg hover:shadow-xl">
            Get started
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
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
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
        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? 'block' : 'hidden'}`} id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium  rounded-lg bg-white dark:bg-black md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white transition-colors duration-300">
            <li>
              <a href="#" className=" tracking-wide font-bold block py-2 px-3 text-black dark:text-white rounded hover:underline md:p-0 md:dark:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="tracking-wide font-bold block py-2 px-3 text-black dark:text-white rounded hover:underline md:p-0 md:dark:text-white">
                Shop
              </a>
            </li>
            <li>
              <a href="#" className="tracking-wide  font-bold block py-2 px-3 text-black dark:text-white rounded hover:underline md:p-0 md:dark:text-white">
                Donate
              </a>
            </li>
            <li>
              <a href="#" className="tracking-wide font-bold block py-2 px-3 text-black dark:text-white rounded hover:underline md:p-0 md:dark:text-white">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="tracking-wide font-bold block py-2 px-3 text-black dark:text-white rounded hover:underline md:p-0 md:dark:text-white">
                About
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NewNavbar;
