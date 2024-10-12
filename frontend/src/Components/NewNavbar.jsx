import React, { useState, useEffect } from 'react';
import Switcher from './Switcher';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const NewNavbar = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const switchForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  return (
    <>
      <nav className={`fixed w-full z-20 top-0 left-0  transition-colors duration-300 ease-in-out ${
        isScrolled ? 'bg-white dark:bg-black shadow-lg border-b border-gray-300 dark:border-gray-700'  :  isHome ? 'bg-transparent hover:bg-white hover:dark:bg-black': 'bg-white dark:bg-black shadow-lg border-b border-gray-300 dark:border-gray-700'
      }`}>
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          {/* Logo */}
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="border-2 border-black px-2 py-1 sm:px-4 sm:py-2 md:px-6 md:py-3 lg:px-8 lg:py-3 dark:border-white">
              <span className="text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-wide sm:tracking-wider font-normal dark:text-white">
                EMERGE
              </span>
            </div>
          </a>

          {/* Buttons */}
          <div className="flex md:order-2 space-x-3 rtl:space-x-reverse">
            <button
              type="button"
              onClick={toggleModal}
              className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-1 transition-all duration-300 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-lg"
            >
              Login/SignUp
            </button>
            <div className="text-black dark:text-white font-medium p-2">
              <Switcher />
            </div>

            {/* Hamburger */}
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 w-8 h-8 justify-center text-sm text-gray-500 md:hidden hover:bg-gray-100 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-800"
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
            <ul className={` font-extrabold flex flex-col p-4 md:p-0 mt-4  rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  transition-colors duration-300
              ${ isScrolled ? 'bg-white dark:bg-black '  : 'bg-transparent  hover:bg-white hover:dark:bg-black '}`}>
              <li>
                <Link to="/" className="block py-2 px-2 text-black dark:text-white hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/Shop" className="block py-2 px-2 text-black dark:text-white hover:underline">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/donate" className="block py-2 px-2 text-black dark:text-white hover:underline">
                  Donate
                </Link>
              </li>
              <li>
                <Link to="/contactus" className="block py-2 px-2 text-black dark:text-white hover:underline">
                  Contact
                </Link>
              </li>
              <li>
                <Link  to="/aboutUs" className="block py-2 px-2 text-black dark:text-white hover:underline">
                  About
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Modal */}
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

              <button
                type="submit"
                className="w-full px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all"
              >
                {isLoginForm ? 'Login' : 'Sign Up'}
              </button>
            </form>

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
