import React from "react";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-gray-700 shadow-lg mt-12">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-secondary">
        <p>
          &copy; {new Date().getFullYear()} Gabriel Baptista. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
