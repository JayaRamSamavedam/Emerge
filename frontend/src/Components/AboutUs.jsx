import React from 'react';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css'; // Include the timeline styles

const AboutUs = () => {
  return (
    <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-28 min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* Hero Section */}
      <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-gray-100 dark:bg-gray-900 px-6">
        <h1 className="text-5xl font-bold mb-6">About Us</h1>
        <p className="text-lg max-w-2xl">
          Discover our journey, our vision, and the heart behind Emerge Ministry. Together, we can build a better
          future through faith and action.
        </p>
      </div>

      {/* Pastor Bio Section */}
      <div className="py-16 px-6 max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          {/* Dummy Image for the Pastor */}
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0 lg:mr-8">
            <div className="w-full h-80 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded-lg">
              <span className="text-gray-600 dark:text-gray-400 text-2xl">Pastor's Image</span>
            </div>
          </div>
          {/* Bio Text */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl font-semibold mb-6">Meet Our Pastor</h2>
            <p className="text-lg mb-4">
              Pastor John Doe, founder of Emerge Ministry, is dedicated to serving the community with compassion and
              grace. His personal story of transformation drives his passion for helping others discover their purpose in
              Christ.
            </p>
            <p className="text-lg">
              Through years of community outreach, Pastor John has witnessed the power of faith in action, and Emerge
              Ministry is a reflection of that vision, aimed at uplifting those in need.
            </p>
          </div>
        </div>
      </div>

      {/* Vision and Mission Section */}
      <div className="py-16 bg-gray-100 dark:bg-gray-900 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-8">Our Vision & Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Vision Statement */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
              <p className="text-lg">
                To create a community where every individual finds hope, healing, and purpose. We envision a world
                transformed by love, where people thrive in their faith and in their lives.
              </p>
            </div>
            {/* Mission Statement */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Our Mission</h3>
              <p className="text-lg">
                Emerge Ministry exists to reach the lost, uplift the struggling, and provide faith-based solutions
                through outreach programs, community support, and spiritual guidance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section using react-vertical-timeline-component */}
      <div className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-semibold text-center mb-12">Our Journey</h2>
        <VerticalTimeline lineColor="black"> {/* Explicitly set the timeline line color */}
          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'black', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid black' }}
            date="2010"
            dateClassName="text-black dark:text-white"
            iconStyle={{ background: 'black', color: '#fff' }}
            icon={<i className="fas fa-church"></i>} // You can replace this with any other icon
          >
            <h3 className="vertical-timeline-element-title">Emerge Ministry Founded</h3>
            <p>
              Pastor John Doe founded Emerge Ministry with the mission to reach the marginalized and spread hope in the
              community.
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'black', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid black' }}
            date="2015"
            dateClassName="text-black dark:text-white"
            iconStyle={{ background: 'black', color: '#fff' }}
            icon={<i className="fas fa-hand-holding-heart"></i>}
          >
            <h3 className="vertical-timeline-element-title">Outreach Expanded</h3>
            <p>
              With the help of generous donations, Emerge Ministry expanded its outreach efforts, feeding and supporting
              over 1,000 individuals.
            </p>
          </VerticalTimelineElement>

          <VerticalTimelineElement
            className="vertical-timeline-element--work"
            contentStyle={{ background: 'black', color: '#fff' }}
            contentArrowStyle={{ borderRight: '7px solid black' }}
            date="2020"
            dateClassName="text-black dark:text-white"
            iconStyle={{ background: 'black', color: '#fff' }}
            icon={<i className="fas fa-hands-helping"></i>}
          >
            <h3 className="vertical-timeline-element-title">Community Center Opened</h3>
            <p>
              Emerge Ministry opened a community center, providing education, health services, and spiritual guidance
              for all.
            </p>
          </VerticalTimelineElement>
        </VerticalTimeline>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-100 dark:bg-gray-900 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-semibold mb-12">What People Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <p className="text-lg italic mb-4">
                "Emerge Ministry has completely transformed my life. Through their outreach programs, I found hope and
                a new direction."
              </p>
              <p className="text-lg font-semibold">- Sarah M.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
              <p className="text-lg italic mb-4">
                "Pastor John's support and guidance have been a beacon of light during some of my darkest times. I'm
                forever grateful."
              </p>
              <p className="text-lg font-semibold">- Michael K.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call-to-Action Section */}
      <div className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-semibold mb-6">Get Involved</h2>
        <p className="text-lg mb-8 max-w-xl mx-auto">
          Whether you're looking to volunteer, donate, or partner with us, your support makes a difference. Join us in
          making an impact in our community and beyond.
        </p>
        <button className="bg-black dark:bg-white text-white dark:text-black py-3 px-8 rounded-lg text-xl font-semibold tracking-wider">
          Get Involved
        </button>
      </div>
    </div>
  );
};

export default AboutUs;
