import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "../Components/ui/navbar-menu";
import { cn } from "./utils/utils";
import Switcher from "./Switcher";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"; // Icons for mobile menu

export default function NavbarDemo() {
  return (
    <div className="relative w-full flex items-center justify-center">
      <Navbar className="top-2" />
      <p className="text-black dark:text-white text-center">
        The Navbar will show on top of the page
      </p>
    </div>
  );
}

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={cn("fixed top-10 inset-x-0 max-w-6xl mx-auto z-50 bg-opacity-100", className)}>
      <div className="flex justify-between items-center px-4 lg:px-8 py-2 container mx-auto">
        {/* Left-side - Logo */}
        <HoveredLink href="/" className="ml-4">
          <img src="/path-to-logo.png" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
        </HoveredLink>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <button onClick={toggleMobileMenu} className="text-2xl">
            {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>

        {/* Desktop Menu */}
        <Menu setActive={setActive} >
          {/* Services Menu */}
          <MenuItem setActive={setActive} active={active} item="Services">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/web-dev">Web Development</HoveredLink>
              <HoveredLink href="/interface-design">Interface Design</HoveredLink>
              <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
              <HoveredLink href="/branding">Branding</HoveredLink>
            </div>
          </MenuItem>

          {/* Products Menu */}
          <MenuItem setActive={setActive} active={active} item="Products">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 p-4">
              <ProductItem
                title="Algochurn"
                href="https://algochurn.com"
                src="https://assets.aceternity.com/demos/algochurn.webp"
                description="Prepare for tech interviews like never before."
              />
              <ProductItem
                title="Tailwind Master Kit"
                href="https://tailwindmasterkit.com"
                src="https://assets.aceternity.com/demos/tailwindmasterkit.webp"
                description="Production ready Tailwind css components for your next project"
              />
            </div>
          </MenuItem>

          {/* Pricing Menu */}
          <MenuItem setActive={setActive} active={active} item="Pricing">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/hobby">Hobby</HoveredLink>
              <HoveredLink href="/individual">Individual</HoveredLink>
              <HoveredLink href="/team">Team</HoveredLink>
              <HoveredLink href="/enterprise">Enterprise</HoveredLink>
            </div>
          </MenuItem>

          {/* Switcher */}
          <div className="p-1">
            <Switcher />
          </div>
        </Menu>

        {/* Right-side - Login/Signup */}
        <HoveredLink href="/login" className="hidden lg:block mr-4">
          Login/Signup
        </HoveredLink>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-800 p-4 absolute top-full inset-x-0 shadow-md">
          <div className="flex flex-col space-y-4">
            <HoveredLink href="/web-dev">Web Development</HoveredLink>
            <HoveredLink href="/interface-design">Interface Design</HoveredLink>
            <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="/branding">Branding</HoveredLink>

            <HoveredLink href="/hobby">Hobby</HoveredLink>
            <HoveredLink href="/individual">Individual</HoveredLink>
            <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink>

            <HoveredLink href="/login">Login/Signup</HoveredLink>

            <Switcher />
          </div>
        </div>
      )}
    </div>
  );
}
