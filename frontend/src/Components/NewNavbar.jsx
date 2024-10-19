import React, { useState, useEffect, useRef, useContext } from 'react';
import Switcher from './Switcher';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { UserContext } from "../App";
import { Form, replace } from 'react-router-dom';
import { FaMoon, FaSun, FaSearch, FaUserCircle } from 'react-icons/fa';
import { Request, setAuthHeader, getAuthToken, getJwtCookie, flushCookies, setUserDetails } from '../helpers/axios_helper';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
const NewNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const searchRef = useRef(null); // To track the modal container
  // const [isAdminDashBoard , setAdminDashboard] = useState(false);
  const { user, setUser, visible, setvisible, redirectPath, setRedirectPath } = useContext(UserContext); // Use variables from UserContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phonenumber , setphonenumber] = useState('');
  const [confirmpassword,setconfirmpassword] = useState('')
  const [fullName, setfullName] = useState('')
  const [loading, setLoading] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); 

  const switchToSignup = () => {
    setIsLoginForm(false);
  };
  const openLoginModal = () => {
    setvisible(true); // Open login/signup modal using context
  };
  const handleLogout = async () => {
    try {
      await Request('POST', '/user/logout');
      flushCookies();
      setUser({ loggedIn: false });
      message.success('Logged out successfully');
      navigate('/',replace)
    } catch (error) {
      message.error('Error logging out');
    }
  };

 
  const handleLogin = async (e) => {
    e.preventDefault();
    if (email === '') {
      message.error('Please enter the email');
    } else if (password === '') {
      message.error('Please enter the password');
    } else {
      const data = { email, password };
      try {
        setLoading(true);
        const res = await Request('POST', '/user/login', data, setUser);
        if (res.status === 200) {
          message.success(res.data.message);
          setAuthHeader(res.data.accessToken);
          setUserDetails(res.data.user)

          setUser({ loggedIn: true,details:res.data.user });
          setLoading(false);
          setvisible(false);
          console.log(res.data.user.userGroup)
          if(res.data.user.userGroup === "admin") {
            navigate('/AdminDashboard', { replace: true });
          } else if (redirectPath) {
            navigate(redirectPath, { replace: true });
          } else {
            navigate('/Shop', { replace: true });
          }          
        } else {
          message.error(res.data.error);
          setLoading(false);
        }
      } catch (error) {
        console.error('Login request failed:', error);
        setLoading(false);
        message.error('Login request failed');
      }
    }
  };

  const handleSignUp = async (e)=>{
    e.preventDefault();
    if (email === '') {
      message.error('Please enter the email');
    } else if (password === '') {
      message.error('Please enter the password');
    } else {
      const data = { email, password,fullName,phonenumber };
      try {
        setLoading(true);
        const res = await Request('POST', '/user/register', data, setUser);
        if (res.status === 200) {
          message.success(res.data.message);
          setIsLoginForm(true);
          setLoading(false);
        } else {
          message.error(res.data.error);
          setLoading(false);
        }
      } catch (error) {
        console.error('register request failed:', error);
        setLoading(false);
        message.error('register request failed');
      }
    }
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearchVisible(false)
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('')
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchVisible(false); // Close the modal if the click is outside
      }
    };

    if (isSearchVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchVisible]);

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
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible); // Toggle search modal visibility
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const closeLoginModal = () => {
    setvisible(false); // Close login/signup modal using context
  };

  const switchForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  if (loading) {
    return (
      <div className="flex space-x-2 justify-center items-center h-screen dark:invert">
        <span className="sr-only">Loading...</span>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
      </div>
    );
  }



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
          {!user.loggedIn ? (
            <button
              type="button"
              onClick={openLoginModal}
              className="text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-3 py-1 transition-all duration-300 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-lg"
            >
              Login/SignUp
            </button>
          ):(
<div
                className="relative"
                onMouseEnter={() => setIsDropdownVisible(true)}
                onMouseLeave={() => setIsDropdownVisible(false)}
              >
                <button className="p-2 md:p-3 lg:p-4 text-sm text-[#D7CCC8] dark:text-gray-300">
                  <FaUserCircle size={24} />
                </button>

                {/* Profile Dropdown */}
                {isDropdownVisible && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/wish-list"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          wishList
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/cart"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Cart
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
          )}
            <div className="text-black dark:text-white">
            <button
              onClick={toggleSearch}
              className="p-2 md:p-3 lg:p-4 text-black dark:text-gray-300 hover:text-[#A1887F] dark:hover:text-white focus:outline-none"
            >
              <FaSearch size={15} />
            </button>
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

      {isSearchVisible && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <div ref={searchRef} className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A1887F]"
              />
              <button
                onClick={handleSearch}
                className="ml-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              >
                <FaSearch size={20} />
              </button>
              <button
                onClick={toggleSearch}
                className="ml-2 text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {visible && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-96 shadow-lg">
            {isLoginForm ? (
              <>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Login</h2>
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-3 w-full p-2 bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-3 w-full p-2 bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md"
                />
                <button className="w-full bg-[#3E2723] text-white py-2 rounded-md" onClick={handleLogin}>
                  Login
                </button>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  Don't have an account?{' '}
                  <button onClick={switchToSignup} className="text-[#A1887F] hover:underline">
                    Sign Up
                  </button>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sign Up</h2>
                <input
                  type="text"
                  placeholder="fullName"
                  value={fullName}
                  onChange={(e) => setfullName(e.target.value)}
                  className="mb-3 w-full p-2 bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md"
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-3 w-full p-2 bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md"
                />
                <input
                  type="text"
                  placeholder="phonenumber"
                  value={phonenumber}
                  onChange={(e)=> setphonenumber(e.target.value)}
                  className="mb-3 w-full p-2 bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-3 w-full p-2 bg-[#EFEBE9] dark:bg-gray-900 dark:text-white rounded-md"
                />
                
                <button className="w-full bg-[#3E2723] text-white py-2 rounded-md" onClick={handleSignUp}>Sign Up</button>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                  Already have an account?{' '}
                  <button onClick={switchForm} className="text-[#A1887F] hover:underline">
                    Login
                  </button>
                </p>
              </>
            )}
            <button onClick={closeLoginModal} className="mt-4 text-sm text-gray-600 dark:text-gray-300 hover:underline">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NewNavbar;
