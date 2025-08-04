import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      // Find the main element specifically
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.scrollTo(0, 0);
      }
      
      // Find all elements with overflow-y-auto class (scrollable containers)
      const scrollableElements = document.querySelectorAll('.overflow-y-auto');
      
      // Scroll each scrollable element to top
      scrollableElements.forEach(element => {
        element.scrollTo(0, 0);
      });
      
      // Also scroll the window as a fallback
      window.scrollTo(0, 0);
    };

    // Immediate scroll
    scrollToTop();
    
    // Delayed scroll to ensure DOM is fully updated
    const timeoutId = setTimeout(scrollToTop, 200);

    return () => clearTimeout(timeoutId);
  }, [pathname]);

  // This component doesn't render anything, it just handles scrolling
  return null;
};

export default ScrollToTop; 