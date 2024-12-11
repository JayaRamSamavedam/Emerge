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
import Products from "./Components/products";
import ProductInfo from "./Components/ProductInfo";
import Cart from "./Components/Cart";
import AllOrdersPage from "./Components/Orders";
import OrderDetailsPage from "./Components/OrderDetailsPage";
import UserProfile from "./Components/Profile";
import Favourites from "./Components/Favourites";
import OrderConfirmation from "./Components/OrderConfirmation";
import Checkout from "./Components/Checkout";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Printfull from "./Components/Printfull";
import PrintfullDetailed from "./Components/PrintfullDetailed";

import TestProductInfo from "./Components/TestProductInfo";
function Views() {
  const stripePromise = loadStripe("pk_test_51N4hU4SFkOxgvYC9PVnsAUrfAt1DrBgl6z5CWVVfBvFhgVM4Mi7EGquPBv4wDW1yxBh3wuHoozETR5CbfSsO1c5u00HediLTnN");

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
        <Route path="/printfull" element={<Printfull/>}></Route>
        
        <Route path="/printfull/:id" element={<TestProductInfo/>}></Route>
        <Route path="/" element={<NewHomePage />} />
        <Route path="/donation" element={<DonationForm />} />
        <Route path="/Shop" element={<Shop />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="products" element={<Products/>}/>
        <Route path="/productInfo/:id" element={<ProductInfo/>}/>
        {/* Protected routes for admin */}
        <Route element={<ProtectedRoutes />}>
               <Route element={<Cart/>} path='/cart'/>
               <Route element={<AllOrdersPage/>} path='/orders'/>
               <Route element={<OrderDetailsPage/>} path='/order/:orderId'/>
               <Route element={<UserProfile/>} path="/profile"/>
               <Route element={<Favourites/>} path="/wish-list"/>
               
               <Route
          path="/checkout"
          element={
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          }
        />
          <Route path='/order-confirmation' element={  <Elements stripe={stripePromise}> <OrderConfirmation/></Elements>}/>

          </Route>
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
