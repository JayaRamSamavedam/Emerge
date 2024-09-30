import React from 'react';
import Newsletter from './Newsletter';
import HeroImage from './assets/image.png'; // Make sure the image path is correct.

const HomePage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
      {/* Padding to offset the sticky navbar */}
      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-28">
        
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-center text-center py-20 bg-gray-100 dark:bg-gray-800">
          {/* Hero Text */}
          <div className="md:w-1/2 px-6 md:px-12 lg:px-20">
            <h1 className="text-5xl md:text-6xl  font-bold mb-6 leading-tight tracking-wide">
              Welcome to <span className="text-gray-700 dark:text-gray-300">Emerge</span>
            </h1>
            <p className="text-lg md:text-xl max-w-lg mb-8 leading-relaxed text-gray-700 dark:text-gray-300">
              Empowering communities through outreach, education, and impact.
            </p>
            <div className="flex space-x-4 justify-center">
              <a href="/shop" className="bg-black text-white py-3 px-6 rounded-lg dark:bg-white dark:text-black hover:bg-gray-900 transition">
                Shop
              </a>
              <a href="/donate" className="border-2 border-black text-black py-3 px-6 rounded-lg hover:bg-gray-200 dark:border-white dark:text-white dark:hover:bg-gray-700 transition">
                Donate
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="md:w-1/2 mt-8 md:mt-0 px-6">
            <img
              src={HeroImage}
              alt="Hero"
              className="max-w-full h-auto rounded-md shadow-lg"
            />
          </div>
        </section>

        {/* Testimonials and Impact Stories */}
        <section className="px-10 py-20 bg-white dark:bg-gray-900">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-800 dark:text-gray-200">Our Impact</h2>
          <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div> {/* Skeleton Image */}
              <p className="italic mb-2 text-gray-600 dark:text-gray-400">
                "Emerge helped us find hope again. Their efforts changed our community."
              </p>
              <p className="font-semibold text-gray-700 dark:text-gray-300">- Community Member</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div> {/* Skeleton Image */}
              <p className="italic mb-2 text-gray-600 dark:text-gray-400">
                "Thanks to Emerge, we were able to rebuild and start anew."
              </p>
              <p className="font-semibold text-gray-700 dark:text-gray-300">- Local Beneficiary</p>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <div className="p-3">
          <Newsletter />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
