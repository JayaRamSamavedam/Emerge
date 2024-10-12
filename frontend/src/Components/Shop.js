import React,{useState} from "react";
import { motion } from "framer-motion";
export default function Shop() {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
     const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  const toggleFilterModal = () => {
    setIsFilterModalOpen((prev) => !prev);
  };

  // Toggle sort dropdown
  const toggleSortDropdown = () => {
    setIsSortDropdownOpen((prev) => !prev);
  };
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  
  const products = [
    {
      id: 1,
      name: 'Basic Tee',
      href: '#',
      imageSrc: '/assets/products/p1.png',
      imageAlt: "Front of men's Basic Tee in black.",
      price: '$35',
      color: 'Black',
    },
    {
      id: 2,
      name: 'Basic Tee',
      href: '#',
      imageSrc: '/assets/products/p2.png',
      imageAlt: "Front of men's Basic Tee in black.",
      price: '$35',
      color: 'Black',
    },
    {
      id: 3,
      name: 'Basic Tee',
      href: '#',
      imageSrc: '/assets/products/p3.png',
      imageAlt: "Front of men's Basic Tee in black.",
      price: '$35',
      color: 'Black',
    },
    {
      id: 4,
      name: 'Basic Tee',
      href: '#',
      imageSrc: '/assets/products/p4.png',
      imageAlt: "Front of men's Basic Tee in black.",
      price: '$35',
      color: 'Black',
    },
    {
      id: 5,
      name: 'Basic Tee',
      href: '#',
      imageSrc: '/assets/products/p1.png',
      imageAlt: "Front of men's Basic Tee in black.",
      price: '$35',
      color: 'Black',
    },
    {
      id: 6,
      name: 'Basic Tee',
      href: '#',
      imageSrc: '/assets/products/p2.png',
      imageAlt: "Front of men's Basic Tee in black.",
      price: '$35',
      color: 'Black',
    },
    {
      id: 7,
      name: 'Basic Tee',
      href: '#',
      imageSrc: '/assets/products/p3.png',
      imageAlt: "Front of men's Basic Tee in black.",
      price: '$35',
      color: 'Black',
    },
    {
      id: 8,
      name: 'Basic Tee',
      href: '#',
      imageSrc: '/assets/products/p4.png',
      imageAlt: "Front of men's Basic Tee in black.",
      price: '$35',
      color: 'Black',
    },
  ];

  return (
    <div className="bg-[#DEDBD1]">
        <section>
    
        <section className="relative w-full aspect-w-16 aspect-h-9 md:aspect-w-16 md:aspect-h-8 lg:aspect-w-16 lg:aspect-h-6 overflow-hidden">
  {/* Background Image */}
  <motion.img
    src="/assets/Banners/banner2.png" // Replace with the correct path to your image
    alt="Cosmic  Collection"
    className="absolute inset-0 w-full h-full object-cover"
    initial={{ opacity: 0, scale: 1.1 }} // Start slightly zoomed-in and transparent
    animate={{ opacity: 1, scale: 1 }}   // Animate to full visibility and normal scale
    transition={{ duration: 1 }}         // Smooth one-second transition
  />

  {/* Text and CTA */}
  <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 lg:px-20 text-right">
    <motion.div
      className="max-w-lg ml-auto" // Align text to the right
      initial={{ opacity: 0, x: 50 }}  // Slide from right with opacity
      animate={{ opacity: 1, x: 0 }}   // Animate to full visibility and position
      transition={{ duration: 0.8, delay: 0.3 }} // Slight delay for smooth transition
    >
      {/* Best Seller */}
      <motion.h3
        className="uppercase text-sm lg:text-base tracking-widest text-[#c08484] mb-2 dark:text-[#fca5a5]"
        initial={{ opacity: 0, y: -20 }} // Slide up effect for subheading
        animate={{ opacity: 1, y: 0 }}  // Animate to position
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        Best Seller
      </motion.h3>

      {/* Main Heading */}
      <motion.h1
        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: 20 }}  // Slide up for the main heading
        animate={{ opacity: 1, y: 0 }}   // Animate to position
        transition={{ duration: 0.6, delay: 0.8 }} // Delay for staggered effect
      >
        Cosmic  Collection
      </motion.h1>

      {/* Subheading */}
      <motion.p
        className="text-base lg:text-lg mb-6 text-gray-700 dark:text-gray-300"
        initial={{ opacity: 0, y: 20 }}  // Slide up for the description
        animate={{ opacity: 1, y: 0 }}   // Animate to position
        transition={{ duration: 0.6, delay: 1 }}
      >
        Explore the full collection including new limited edition gift-sets, body lotions, & more.
      </motion.p>

      {/* CTA Button */}
      <motion.a
        href="/shop"
        className="inline-block bg-white text-black py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
        initial={{ opacity: 0, scale: 0.8 }}  // Starts scaled down
        animate={{ opacity: 1, scale: 1 }}    // Grows to normal size
        transition={{ duration: 0.6, delay: 1.2 }} // Delay for smooth entrance
        whileHover={{ scale: 1.05 }} // Slight scale-up on hover
      >
        Shop Now
      </motion.a>
    </motion.div>
  </div>
</section>
     </section>

     <section className="p-6 bg-white justify-center">
  {/* Heading */}
  <h2 className=" text-2xl font-bold mb-6 text-center">Categories</h2>

  {/* Grid Layout */}
  <div className="justify-center grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 ">
  {/* Men Category */}
  <a href="/men" className="block transform hover:scale-105 transition-transform duration-300">
    <img className="rounded-full w-32 h-auto max-w-full sm:w-28 lg:w-32 mx-auto " src="https://via.placeholder.com/150x150?text=Shirts" alt="Men Category"/>
    <p className="text-center mt-2 text-lg font-semibold">Men</p>
  </a>

  {/* Women Category */}
  <a href="/women" className="block transform hover:scale-105 transition-transform duration-300">
    <img className="rounded-full w-32 h-auto max-w-full sm:w-28 lg:w-32 mx-auto" src="https://via.placeholder.com/150x150?text=Shoes" alt="Women Category"/>
    <p className="text-center mt-2 text-lg font-semibold">Women</p>
  </a>

  {/* Kids Category */}
  <a href="/kids" className="block transform hover:scale-105 transition-transform duration-300">
    <img className="rounded-full w-32 h-auto max-w-full sm:w-28 lg:w-32 mx-auto" src="https://via.placeholder.com/150x150?text=Pants" alt="Kids Category"/>
    <p className="text-center mt-2 text-lg font-semibold">Kids</p>
  </a>

  {/* Accessories Category */}
  <a href="/accessories" className="block transform hover:scale-105 transition-transform duration-300">
    <img className="rounded-full w-32 h-auto max-w-full sm:w-28 lg:w-32 mx-auto" src="https://via.placeholder.com/150x150?text=Accessories" alt="Accessories Category"/>
    <p className="text-center mt-2 text-lg font-semibold">Accessories</p>
  </a>

  {/* View All */}
  <a href="/all-categories" className="block transform hover:scale-105 transition-transform duration-300">
    <img className="rounded-full w-32 h-auto max-w-full sm:w-28 lg:w-32 mx-auto" src="https://via.placeholder.com/150x150?text=View+All" alt="View All Categories"/>
    <p className="text-center mt-2 text-lg font-semibold">View All</p>
  </a>
</div>

</section>

    <section class=" bg-white  antialiased dark:bg-black md:py-12">
  <div class="mx-auto max-w-screen-xl px-2 2xl:px-0">
    <div class="">
    <motion.section
        className="bg-white dark:bg-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <motion.div class="mb-4 items-end justify-between space-y-4 sm:flex sm:space-y-0 md:mb-8" variants={fadeIn}>
      <div>
        
        <h2 class="mt-3 text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Shop</h2>
      </div>
      <div class="flex items-center space-x-4">
        <button onClick={toggleFilterModal}  type="button" class="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto">
          <svg class="-ms-0.5 me-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z" />
          </svg>
          Filters
          <svg class="-me-0.5 ms-2 h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
          </svg>
        </button>
        <div className="relative inline-block text-left">
      {/* Sort Button */}
      <button
        id="sortDropdownButton1"
        onClick={toggleSortDropdown}
        type="button"
        className="flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 sm:w-auto"
      >
        <svg
          className="-ms-0.5 me-2 h-4 w-4"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 4v16M7 4l3 3M7 4 4 7m9-3h6l-6 6h6m-6.5 10 3.5-7 3.5 7M14 18h4"
          />
        </svg>
        Sort
        <svg
          className={`-me-0.5 ms-2 h-4 w-4 transition-transform ${
            isSortDropdownOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m19 9-7 7-7-7"
          />
        </svg>
      </button>

      {/* Sort Dropdown */}
      {isSortDropdownOpen && (
        <div
          id="dropdownSort1"
          className="absolute right-0 mt-2 w-40 divide-y divide-gray-100 rounded-lg bg-white shadow-lg dark:bg-gray-700 z-50"
        >
          <ul className="p-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
            <li>
              <a
                href="#"
                className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                The most popular
              </a>
            </li>
            <li>
              <a
                href="#"
                className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Newest
              </a>
            </li>
            <li>
              <a
                href="#"
                className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Increasing price
              </a>
            </li>
            <li>
              <a
                href="#"
                className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Decreasing price
              </a>
            </li>
            <li>
              <a
                href="#"
                className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                No. reviews
              </a>
            </li>
            <li>
              <a
                href="#"
                className="group inline-flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Discount %
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
      </div>
      
    </motion.div>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="group relative"
                variants={fadeIn}
                whileHover={{ scale: 1.05 }}
              >
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700 lg:aspect-none group-hover:opacity-75 lg:h-80">
                  <img
                    alt={product.imageAlt}
                    src={product.imageSrc}
                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700 dark:text-gray-300">
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{product.color}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
                                            
                                            
    </div>
    <div class="w-full text-center">
      <button type="button" class="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700">Show more</button>
    </div>
  </div>
  {/* <!-- Filter modal --> */}
  {isFilterModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75 p-4"
          onClick={toggleFilterModal} // To close modal when clicking outside
        >
          <form
            action="#"
            method="get"
            id="filterModal"
            tabIndex="-1"
            className="relative w-full max-w-lg rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800 md:max-w-md lg:max-w-xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-gray-200 pb-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Filters
              </h3>
              <button
                type="button"
                onClick={toggleFilterModal}
                className="ml-auto inline-flex items-center rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M18 18L6 6"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4">
              {/* Sizes */}
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Sizes
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Small', 'Medium', 'Large', 'Extra Large'].map((size) => (
                    <label className="inline-flex items-center" key={size}>
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {size}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Colors
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Red', 'Blue', 'Green', 'Black'].map((color) => (
                    <label className="inline-flex items-center" key={color}>
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {color}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Categories
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Men', 'Women', 'Kids', 'Accessories'].map((category) => (
                    <label className="inline-flex items-center" key={category}>
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-4 border-t border-gray-200 pt-3">
              <button
                type="submit"
                className="rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-800"
              >
                Apply Filters
              </button>
              <button
                type="reset"
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
</section>
</div>
  );
}
