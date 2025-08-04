import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';

const SuperAdminLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      // Find the main element and scroll it to top
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTo(0, 0);
      }
    };

    // Scroll to top when pathname changes
    scrollToTop();
    
    // Also try after a short delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar role="superadmin" />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;