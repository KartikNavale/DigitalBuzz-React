 import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-semibold">Task List</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex space-x-6">
            <li><Link to="/" className="hover:text-gray-200"></Link></li>
            <li><Link to="/calendar" className="hover:text-gray-200">DateTime Widget Customization</Link></li>
            <li><Link to="/dropdown" className="hover:text-gray-200">Dropdown / Select Widget</Link></li>
            <li><Link to="/chart" className="hover:text-gray-200">Chart Widget Customization</Link></li>
            <li><Link to="/document" className="hover:text-gray-200">Multi-Document Upload in Forms</Link></li>
             <li><Link to="/notification" className="hover:text-gray-200">Firebase Notifications & Crashlytics Integration</Link></li>
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      <div className={`md:hidden ${open ? "block" : "hidden"} px-6 pb-4`}>
        <ul className="flex flex-col space-y-3">
          <li><Link to="/" className="block hover:text-gray-200" onClick={() => setOpen(false)}>DateTime Widget Customization</Link></li>
          <li><Link to="/about" className="block hover:text-gray-200" onClick={() => setOpen(false)}>Dropdown / Select Widget</Link></li>
          <li><Link to="/services" className="block hover:text-gray-200" onClick={() => setOpen(false)}>Chart Widget Customization</Link></li>
          <li><Link to="/portfolio" className="block hover:text-gray-200" onClick={() => setOpen(false)}>Multi-Document Upload in Forms</Link></li>
          <li><Link to="/contact" className="block hover:text-gray-200" onClick={() => setOpen(false)}>Firebase Notifications & Crashlytics Integration</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
