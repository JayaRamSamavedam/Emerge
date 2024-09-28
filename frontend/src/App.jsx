import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DonationForm from "./DonationForm";
import Success from "./Sucess";
import Cancel from "./Cancel";
import Donationfrom from "./Components/Donation.tsx"
import NewNavbar from "./Components/NewNavbar";
import Home from "./Components/Home";
import Footer from "./Components/Footer";

function App() {
  return (
    <>
    <NewNavbar/>
    <Router>
      <div className="App">
        <h1>Donation Platform</h1>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/donation" element={<DonationForm />} />

          {/* Success route after successful donation */}
          <Route path="/success" element={<Success />} />

        
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/donate" element={<Donationfrom/>}/>
        </Routes>
      </div>
    </Router>
    <Footer/>
    </>
  );
}

export default App;
