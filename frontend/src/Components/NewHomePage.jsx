import React from 'react';
import { motion } from 'framer-motion'; // Import Framer Motion
import img from './image.png';
import Newsletter from './Newsletter';
import Testimonial from './assets/Testimonial.png'; // Ensure paths are correct.
import img1 from "./assets/Hero.png";



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
];

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

const NewHomePage = () => {
  return (
    <d>
      {/* Hero Section */}
      <motion.div
  className="relative w-full h-screen"  // Full viewport height for hero section
  initial="hidden"
  animate="visible"
  variants={staggerContainer}
>
  {/* Hero Image */}
  <div className="absolute inset-0 overflow-hidden">
    <motion.img
      src={img}  // Use the appropriate image file path
      alt="Hero Banner"
      className="object-cover w-full h-full"  // Ensure image covers the section without distortion
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  </div>

  {/* Text and Buttons */}
  <motion.div
    className="relative z-10 flex flex-col justify-center items-start h-full p-6 lg:p-10 text-black lg:w-1/3 dark:text-white"
    variants={fadeIn}
  >
    {/* Heading */}
    <motion.h1
      className="text-4xl sm:text-5xl lg:text-5xl font-bold mb-4"
      variants={fadeIn}
    >
      Welcome to Our Store
    </motion.h1>

    {/* Subheading */}
    <motion.p className="mb-6 text-lg sm:text-xl lg:text-xl" variants={fadeIn}>
      Discover our exclusive range of cosmetics.
    </motion.p>

    {/* Buttons */}
    <motion.div className="flex space-x-4" variants={fadeIn}>
      <motion.a
        href="/shop"
        className="bg-black text-white py-3 px-6 rounded-lg hover:bg-[#998200] transition"
        whileHover={{ scale: 1.1 }}
      >
        Shop
      </motion.a>

      <motion.a
        href="/donate"
        className="border-2 border-black text-black py-3 px-6 rounded-lg hover:bg-[#900C3F] transition"
        whileHover={{ scale: 1.1 }}
      >
        Donate
      </motion.a>
    </motion.div>
  </motion.div>
</motion.div>


      {/* Section with right-side image and left-side content */}
      <section className='bg-[#F2EFE4]'>
      <motion.section
  className="flex flex-col lg:flex-row items-center justify-between p-10 lg:p-24 bg-[#F2EFE4] shadow-md dark:bg-gray-900"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={staggerContainer}
>
  {/* Left Side Image */}
  <div className="bg-white w-full h-full  rounded-lg flex flex-col lg:flex-row items-center  ">
  <motion.div className="w-full h-full lg:w-1/2 mb-10 lg:mb-0 p-8" variants={fadeIn}>
    <motion.img
      src={img}
      alt=" Pouch"
      className=" w-full h-auto object-cover rounded-lg"
      whileHover={{ scale: 1.05 }}
    />
  </motion.div>

  {/* Right Side Content */}
  <motion.div
    className="w-full lg:w-1/2 flex flex-col justify-center text-left p-8 lg:p-16 text-black"
    variants={fadeIn}
  >
    <h4 className="text-gray-500 uppercase tracking-wide text-lg mb-4 dark:text-gray-400">Limited Time Only</h4>
    <h2 className="text-5xl font-bold text-black dark:text-white mb-6">Free  Pouch</h2>
    <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
      With your purchase of 2 or more lippies. Choose from liquid lipsticks, lip blushes, lip oils, lip tints, balms, glosses, plumpers & more.
    </p>
    <p className="text-md text-gray-500 dark:text-gray-400 mb-8">
      Exclusions may apply. While supplies last. Ends October 13 @ 11:59pm PST.
    </p>
    <div className="flex space-x-4">
      <a href="/shop" className="bg-black text-white py-4 px-8 rounded-lg hover:bg-[#998200] transition">Shop</a>
    </div>
  </motion.div>
  </div>
</motion.section>
</section>



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

      {/* Product Grid */}
      <motion.section
        className="bg-[#F2EFE4] dark:bg-gray-900 py-6"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8  bg-white rounded-lg">
          <motion.h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white" variants={fadeIn}>
            Customers also purchased
          </motion.h2>
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

      {/* Another card with left-side image and right-side centered content */}
      <section className='bg-[#F2EFE4]'>
      <motion.section
  className="flex flex-col lg:flex-row items-center justify-between p-10 lg:p-24 bg-[#F2EFE4] shadow-md dark:bg-gray-900"
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
  variants={staggerContainer}
>
  {/* Left Side Image */}
  <div className="bg-white w-full h-full  rounded-lg flex flex-col lg:flex-row items-center  ">
  <motion.div className="w-full h-full lg:w-1/2 mb-10 lg:mb-0 p-8" variants={fadeIn}>
    <motion.img
      src={img1}
      alt=" Pouch"
      className=" w-full h-auto object-cover rounded-lg"
      whileHover={{ scale: 1.05 }}
    />
  </motion.div>

  {/* Right Side Content */}
  <motion.div
    className="w-full lg:w-1/2 flex flex-col justify-center text-left p-8 lg:p-16 text-black"
    variants={fadeIn}
  >
    <h4 className="text-gray-500 uppercase tracking-wide text-lg mb-4 dark:text-gray-400">Limited Time Only</h4>
    <h2 className="text-5xl font-bold text-black dark:text-white mb-6">Free  Pouch</h2>
    <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
      With your purchase of 2 or more lippies. Choose from liquid lipsticks, lip blushes, lip oils, lip tints, balms, glosses, plumpers & more.
    </p>
    <p className="text-md text-gray-500 dark:text-gray-400 mb-8">
      Exclusions may apply. While supplies last. Ends October 13 @ 11:59pm PST.
    </p>
    <div className="flex space-x-4">
      <a href="/shop" className="bg-black text-white py-4 px-8 rounded-lg hover:bg-[#998200] transition">Shop</a>
    </div>
  </motion.div>
  </div>
</motion.section>
</section>
      <section>
     <section className="relative w-full aspect-w-16 aspect-h-9 md:aspect-w-16 md:aspect-h-8 lg:aspect-w-16 lg:aspect-h-6 overflow-hidden">
  {/* Background Image */}
  <motion.img
    src="/assets/Banners/banner1.png" // Replace with the correct path to your image
    alt="Cosmic  Collection"
    className="absolute inset-0 w-full h-full object-cover"
    initial={{ opacity: 0, scale: 1.1 }} // Start slightly zoomed-in and transparent
    animate={{ opacity: 1, scale: 1 }}   // Animate to full visibility and normal scale
    transition={{ duration: 1 }}         // Smooth one-second transition
  />

  {/* Text and CTA */}
  <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-10 lg:px-20 text-left">
    <motion.div
      className="max-w-lg"
      initial={{ opacity: 0, x: -50 }}  // Slide from left with opacity
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
      {/* Impact Section */}
      <motion.section
        className="px-4 lg:px-10 py-20 bg-[#F2EFE4] dark:bg-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {/* Line Above the Heading */}
        <motion.div className="flex justify-center" variants={fadeIn}>
          <div className="w-1/2 border-t border-gray-300 dark:border-gray-600"></div>
        </motion.div>

        {/* Heading */}
        <motion.div className="text-center my-4" variants={fadeIn}>
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200">Our Impact</h2>
        </motion.div>

        {/* Line Below the Heading */}
        <motion.div className="flex justify-center" variants={fadeIn}>
          <div className="w-1/2 border-t border-gray-300 dark:border-gray-600"></div>
        </motion.div>

        <motion.div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* Testimonial 1 */}
          <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" variants={fadeIn}>
            <img
              src={Testimonial}
              alt="Testimonial"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="italic mb-2 text-gray-600 dark:text-gray-400">
              "Emerge helped us find hope again. Their efforts changed our community."
            </p>
            <p className="font-semibold text-gray-700 dark:text-gray-300">- Community Member</p>
          </motion.div>

          {/* Testimonial 2 */}
          <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md" variants={fadeIn}>
            <img
              src={Testimonial}
              alt="Testimonial"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p className="italic mb-2 text-gray-600 dark:text-gray-400">
              "Thanks to Emerge, we were able to rebuild and start anew."
            </p>
            <p className="font-semibold text-gray-700 dark:text-gray-300">- Local Beneficiary</p>
          </motion.div>
        </motion.div>
      </motion.section>


     
      {/* Newsletter Signup */}
      <motion.div
        className="p-6 lg:p-10 bg-[#F2EFE4] dark:bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Newsletter />
      </motion.div>
    </d>
  );
}

export default NewHomePage;
