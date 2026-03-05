import React from 'react';
import Navbar from './Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#121212] transition-colors duration-300">
      <Navbar />
      
      {/* Main Content */}
      <main className="pt-20 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
