"use client";

import { useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <html lang="en">
      <body className={`${poppins.className} bg-bg`}>
        {loading ? (
          <div className="fixed inset-0 bg-bg flex items-center justify-center z-50">
            <div className="flex flex-col items-center space-y-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-card flex items-center justify-center">
                  <span className="text-3xl font-bold text-accent">🌡️</span>
                </div>
                <div className="absolute -inset-2 rounded-full border-2 border-accent animate-pulse"></div>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-primary mb-2 animate-pulse">
                  Temperature Monitor
                </h2>
                <div className="flex justify-center space-x-2 mt-4">
                  <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-accent rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-accent rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col min-h-screen animate-fade-in">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <Footer />
          </div>
        )}
      </body>
    </html>
  );
}
