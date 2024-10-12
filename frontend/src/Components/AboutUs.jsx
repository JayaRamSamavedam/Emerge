import React, { useEffect, useRef } from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css'; // Include the timeline styles
import { motion } from 'framer-motion'; // Import Framer Motion
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import img1 from "./assets/Hero.png";

gsap.registerPlugin(ScrollTrigger);

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

// Smooth scroll effect for each section
const sectionFade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
};

// Hover scale effect for images
const hoverScale = {
  whileHover: { scale: 1.05, transition: { duration: 0.3 } },
};

const AboutUs = () => {
  const containerRef = useRef(null);

  // GSAP scroll-triggered animations
  useEffect(() => {
    const sections = containerRef.current.querySelectorAll('.gsap-section');
    
    gsap.fromTo(
      sections,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out',
        stagger: 0.3,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <motion.div
      className="pt-14 sm:pt-16 md:pt-20 lg:pt-24 min-h-screen bg-[#F2EFE4] dark:bg-black text-black dark:text-white"
      initial="hidden"
      animate="visible"
      variants={staggerContainer} // Fade-in effect on the whole page
      ref={containerRef}
    >
      {/* Hero Section with Smooth Image Transition */}
      <motion.section
        className="relative w-full aspect-w-16 aspect-h-9 md:aspect-w-16 md:aspect-h-8 lg:aspect-w-16 lg:aspect-h-6 overflow-hidden gsap-section"
        initial="hidden"
        animate="visible"
        variants={sectionFade} // Fade-in for the hero section
      >
        {/* Background Image */}
        <motion.img
          src="/assets/Banners/aboutus.png"
          alt="Cosmic Collection"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }} // Start slightly zoomed-in
          animate={{ opacity: 1, scale: 1 }}   // Smooth zoom-out effect
          transition={{ duration: 1 }}
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center text-center bg-black bg-opacity-50">
          <motion.div className="text-white p-4">
            <motion.h1
              className="text-4xl font-bold tracking-wide text-white md:text-6xl lg:text-7xl"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "back.out(1.7)" }} // Smooth easing
            >
              About Us
            </motion.h1>
            <motion.p
              className="text-xl font-bold mt-4 opacity-70 md:text-2xl lg:text-3xl"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "back.out(1.7)" }}
            >
              Discover the Cosmic Collection with us.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Pastor Bio Section */}
      <motion.section
        className="flex flex-col lg:flex-row items-center justify-between p-10 lg:p-24 bg-[#F2EFE4] shadow-md dark:bg-gray-900 gsap-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerContainer} // Staggered animation for bio section
      >
        {/* Left Side Image */}
        <motion.div className="bg-white w-full h-full rounded-lg flex flex-col lg:flex-row items-center">
          <motion.div
            className="w-full h-full lg:w-1/2 mb-10 lg:mb-0 p-8"
            variants={fadeIn}
            whileHover={hoverScale} // Add scale effect on hover
          >
            <motion.img
              src={img1}
              alt="Pouch"
              className="w-full h-auto object-cover rounded-lg"
            />
          </motion.div>

          {/* Right Side Content */}
          <motion.div
            className="w-full lg:w-1/2 flex flex-col justify-center text-left p-8 lg:p-16 text-black"
            variants={fadeIn}
          >
            <h4 className="text-gray-500 uppercase tracking-wide text-lg mb-4 dark:text-gray-400">About Pastor</h4>
            <h2 className="text-5xl font-bold text-black dark:text-white mb-6">Free Pouch</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
              With your purchase of 2 or more lippies. Choose from liquid lipsticks, lip blushes, lip oils, and more.
            </p>
            <p className="text-md text-gray-500 dark:text-gray-400 mb-8">
              Exclusions may apply. While supplies last. Ends October 13 @ 11:59pm PST.
            </p>
            <motion.div className="flex space-x-4">
              <motion.a
                href="/shop"
                className="bg-black text-white py-4 px-8 rounded-lg hover:bg-[#998200] transition"
                whileHover={{ scale: 1.05 }}
              >
                Shop
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Vision and Mission Section */}
      <motion.div
        className="py-16 bg-[#F2EFE4] dark:bg-gray-900 px-6 gsap-section"
        initial="hidden"
        whileInView="visible"
        variants={sectionFade} // Smooth fade-in for this section
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8">Our Vision & Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-lg">
                To create a community where every individual finds hope, healing, and purpose. We envision a world
                transformed by love, where people thrive in their faith and in their lives.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-lg">
                Emerge Ministry exists to reach the lost, uplift the struggling, and provide faith-based solutions
                through outreach programs, community support, and spiritual guidance.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Timeline Section */}
      <motion.div
        className="py-16 px-6 max-w-6xl mx-auto bg-[#F2EFE4] gsap-section"
        initial="hidden"
        whileInView="visible"
        variants={staggerContainer} // Stagger animations for timeline elements
      >
        <h2 className="text-4xl font-semibold text-center mb-12">Our Journey</h2>
        <VerticalTimeline lineColor="black">
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'black', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid black' }}
            date="2010"
            dateClassName="text-black dark:text-white"
            iconStyle={{ background: 'black', color: '#fff' }}
            icon={<i className="fas fa-church"></i>}
          >
            <h3 className="vertical-timeline-element-title">Emerge Ministry Founded</h3>
            <p>Pastor John Doe founded Emerge Ministry with the mission to reach the marginalized and spread hope in the community.</p>
          </VerticalTimelineElement>
          {/* Other timeline elements */}
        </VerticalTimeline>
      </motion.div>

      {/* Call-to-Action Section */}
      <motion.div
        className="py-16 px-6 max-w-6xl mx-auto text-center bg-white gsap-section"
        initial="hidden"
        whileInView="visible"
        variants={sectionFade}
      >
        <h2 className="text-4xl font-semibold mb-6">Get Involved</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Whether you're looking to volunteer, donate, or partner with us, your support makes a difference.
        </p>
        <motion.button
          className="bg-black dark:bg-white text-white dark:text-black py-3 px-8 rounded-lg text-xl font-semibold tracking-wider"
          whileHover={{ scale: 1.05, backgroundColor: "#998200" }} // Hover effect on button
        >
          Get Involved
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default AboutUs;
