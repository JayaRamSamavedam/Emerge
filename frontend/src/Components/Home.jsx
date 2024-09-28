import React from 'react';
import Newsletter from './Newsletter';


const HomePage = () => {

   
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen">
      {/* Padding to offset the sticky navbar */}
      <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-28">
        
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-20 bg-gray-100 dark:bg-gray-900">
          <h1 className="text-5xl font-bold mb-6 tracking-wide">Welcome to Emerge</h1>
          <p className="text-lg max-w-xl mb-8 ">
            Empowering communities through outreach, education, and impact.
          </p>
          <div className="flex space-x-4">
            <a href="/shop" className="bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800">
              Shop
            </a>
            <a href="/donate" className="border-2 border-black text-black py-3 px-6 rounded-lg hover:bg-gray-200 dark:border-white dark:hover:bg-gray-700 dark:text-white">
              Donate
            </a>
          </div>
        </section>

       
        {/* Testimonials and Impact Stories */}
        <section className="px-10 py-20 bg-white dark:bg-black">
          <h2 className="text-3xl font-semibold text-center mb-12">Our Impact</h2>
          <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div> {/* Skeleton Image */}
              <p className="italic mb-2">
                "Emerge helped us find hope again. Their efforts changed our community."
              </p>
              <p className="font-semibold">- Community Member</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div> {/* Skeleton Image */}
              <p className="italic mb-2">
                "Thanks to Emerge, we were able to rebuild and start anew."
              </p>
              <p className="font-semibold">- Local Beneficiary</p>
            </div>
          </div>
        </section>
        <div className='p-3'>
        <Newsletter/>
        {/* <NewsletterSignup/> */}
        </div>

        {/* Newsletter Signup */}
        {/* <section className="py-20 bg-gray-100 dark:bg-gray-900">
          <h2 className="text-3xl font-semibold text-center mb-6">Stay Updated</h2>
          <p className="text-center max-w-md mx-auto mb-8">
            Subscribe to our newsletter to learn more about our outreach programs and upcoming events.
          </p>
          <div className="flex justify-center">
            <input
              type="email"
              className="border-2 border-gray-300 dark:border-gray-600 rounded-l-lg p-3 w-64 dark:bg-gray-700 dark:text-white"
              placeholder="Enter your email"
            />
            <button className="bg-black text-white py-3 px-6 rounded-r-lg hover:bg-gray-800">
              Subscribe
            </button>
          </div>
        </section> */}

        {/* Social Media Links */}
        {/* <footer className="py-6 bg-white dark:bg-black">
          <div className="flex justify-center space-x-6">
            <a href="https://facebook.com" aria-label="Facebook" className="text-gray-500 hover:text-black dark:hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.596 0 0 .596 0 1.325v21.351C0 23.404.596 24 1.325 24h11.495V14.706h-3.13v-3.66h3.13v-2.696c0-3.1 1.893-4.791 4.659-4.791 1.324 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.794.714-1.794 1.76v2.313h3.587l-.467 3.66h-3.12V24h6.116c.73 0 1.326-.596 1.326-1.325V1.325C24 .596 23.404 0 22.675 0z"/>
              </svg>
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="text-gray-500 hover:text-black dark:hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.954 4.569c-.885.392-1.83.656-2.825.775 1.014-.608 1.794-1.574 2.163-2.723-.95.555-2.005.959-3.127 1.184-.896-.954-2.173-1.55-3.591-1.55-2.717 0-4.92 2.203-4.92 4.917 0 .385.045.761.127 1.124C7.691 8.095 4.066 6.13 1.64 3.161c-.422.725-.664 1.561-.664 2.475 0 1.71.87 3.214 2.188 4.096-.807-.026-1.566-.247-2.229-.616v.061c0 2.388 1.697 4.384 3.946 4.837-.413.111-.849.171-1.296.171-.316 0-.623-.03-.923-.086.631 1.953 2.445 3.377 4.6 3.418-1.68 1.316-3.809 2.102-6.102 2.102-.397 0-.789-.023-1.175-.067 2.179 1.394 4.768 2.208 7.548 2.208 9.055 0 14.002-7.502 14.002-14.002 0-.213-.004-.425-.014-.636.961-.695 1.797-1.56 2.457-2.548l-.047-.02z"/>
              </svg>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="text-gray-500 hover:text-black dark:hover:text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.849.07 1.366.062 2.633.354 3.608 1.33.976.976 1.268 2.242 1.33 3.608.058 1.265.069 1.645.069 4.849s-.011 3.584-.07 4.849c-.062 1.366-.354 2.633-1.33 3.608-.976.976-2.242 1.268-3.608 1.33-1.265.058-1.645.069-4.849.069s-3.584-.011-4.849-.07c-1.366-.062-2.633-.354-3.608-1.33-.976-.976-1.268-2.242-1.33-3.608-.058-1.265-.069-1.645-.069-4.849s.011-3.584.07-4.849c.062-1.366.354-2.633 1.33-3.608.976-.976 2.242-1.268 3.608-1.33 1.265-.058 1.645-.069 4.849-.069m0-2.163C8.756 0 8.346 0 7.054 0S5.37.011 4.11.07c-1.366.062-2.631.353"/>
              </svg>
            </a>
          </div>
        </footer> */}
      </div>
    </div>
  );
};

export default HomePage;
