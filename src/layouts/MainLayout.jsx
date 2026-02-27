import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../views/Components/Header';
import Footer from '../views/Components/Footer';
import Banner from '../views/Components/Banner';

const MainLayout = () => {
  const location = useLocation();
  
  // Map routes to banner titles
  const getBannerTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Home';
    if (path === '/features') return 'Features';
    if (path === '/how-it-works') return 'How It Works';
    if (path === '/industries') return 'Industries';
    if (path === '/about') return 'About';
    if (path === '/contact') return 'Contact';
    return 'Home';
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* <Banner text={getBannerTitle()} /> */}
      
      <main className="w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;