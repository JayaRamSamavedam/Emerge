import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DonationForm from "./DonationForm";
import Success from "./Sucess";
import Cancel from "./Cancel";
import Donationfrom from "./Components/Donation.tsx"
import NewNavbar from "./Components/NewNavbar";
import Home from "./Components/Home";
import Footer from "./Components/Footer";
import Shop from "./Components/Shop";
import Donate from "./Components/Donate";
import ContactUs from "./Components/Contact";
import NewHomePage from "./Components/NewHomePage";
import AboutUs from "./Components/AboutUs";

function App() {
  return (
    <>
  
    <Router>
    <NewNavbar/>
        <Routes>
      
          {/* <Route path="/" element={<Home/>}/> */}
          <Route path="/" element={<NewHomePage/>}/>
          <Route path="/donation" element={<DonationForm />} />
          <Route path="/Shop" element={<Shop/>}/>
          <Route path="/contactus" element={<ContactUs/>}/> 
          {/* Success route after successful donation */}
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/donate" element={<Donate/>}/>
          <Route path="/aboutUs" element={<AboutUs/>}/>
        </Routes>
    </Router>
    <Footer/>
    </>
  );
}

export default App;
