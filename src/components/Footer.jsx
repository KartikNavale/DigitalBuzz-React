 import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <footer className="bg-blue-600 text-white mt-10">
        {/* Copyright */}
        <div className="bg-blue-700 text-center py-2 text-sm text-gray-100">
          © {new Date().getFullYear()} MyWebsite. All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;
