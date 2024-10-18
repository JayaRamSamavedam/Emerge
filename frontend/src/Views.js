import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import DonationForm from "./DonationForm";
import Success from "./Sucess";
import Cancel from "./Cancel";
import Donationfrom from "./Components/Donation.tsx";
import NewNavbar from "./Components/NewNavbar";
import Home from "./Components/Home";
import Footer from "./Components/Footer";
import Shop from "./Components/Shop";
import Donate from "./Components/Donate";
import ContactUs from "./Components/Contact";
import NewHomePage from "./Components/NewHomePage";
import AboutUs from "./Components/AboutUs";
import AdminDashBoard from "./AdminComponents/AdminDashBoard";
import ProtectedRoutes from "./ProtectedRoutes";
import AdminProducts from "./AdminComponents/AdminProducts";
import AdminCategory from "./AdminComponents/AdminCategory";
import ColorManagement from "./AdminComponents/AdminColors";
import AdminPanel from "./AdminComponents/AdminUsers";

function Views() {
  const location = useLocation(); // Get the current route location

  // Define the routes where the navbar and footer should be hidden
  console.log(location.pathname)
  const hideNavbarFooter = location.pathname.startsWith("/Admin") || 
    ["/success", "/cancel", "/AdminDashboard"].includes(location.pathname);

  return (
    <>
      {/* Conditionally render Navbar and Footer based on route */}
      {!hideNavbarFooter && <NewNavbar />}
      <Routes>
        <Route path="/" element={<NewHomePage />} />
        <Route path="/donation" element={<DonationForm />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        {/* Protected routes for admin */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/AdminDashboard" element={<AdminDashBoard />} >
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategory/>}/>
          <Route path="colors" element={<ColorManagement/>}/>
          <Route path="users" element={<AdminPanel/>}/>
          </Route>
        </Route>
      </Routes>
      {!hideNavbarFooter && <Footer />}
    </>
  );
}

export default Views;
