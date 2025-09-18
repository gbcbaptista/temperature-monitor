import React from "react";
import LanguageSelector from "./LanguageSelector";

const Header = () => {
  return (
    <header className="bg-card border-b border-gray-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-primary">
          Temperature Monitor
        </h1>
        <div className="flex items-center gap-4">
          <div className="w-32">
            <LanguageSelector />
          </div>
          <a
            href="https://gabriel-baptista.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block bg-accent text-white py-2 px-4 rounded-lg font-medium text-center hover:bg-accent/90 transition-colors text-sm"
          >
            Back to Portfolio
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
