import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Use setTimeout to ensure DOM is updated after route change
    const scrollToTop = () => {
      // Try to scroll the main content area first (for layout-based scrolling)
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.scrollTo(0, 0);
      }
      
      // Also scroll the window as a fallback
      window.scrollTo(0, 0);
    };

    // Immediate scroll
    scrollToTop();
    
    // Delayed scroll to ensure DOM is fully updated
    const timeoutId = setTimeout(scrollToTop, 100);

    return () => clearTimeout(timeoutId);
  }, [pathname]);
};

export default useScrollToTop; 