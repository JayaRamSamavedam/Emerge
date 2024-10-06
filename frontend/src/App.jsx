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

function App() {
  return (
    <>
  
    <Router>
    <NewNavbar/>
        <Routes>
      
          <Route path="/" element={<Home/>}/>
          <Route path="/donation" element={<DonationForm />} />
          <Route path="/Shop" element={<Shop/>}/>
          {/* Success route after successful donation */}
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/donate" element={<Donate/>}/>
        </Routes>
    </Router>
    <Footer/>
    </>
  );
}

export default App;
