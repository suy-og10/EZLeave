import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  // State for the mobile dialog (small screens)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // State for the desktop sidebar (large screens). Default to open.
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);

  const toggleDesktopSidebar = () => {
    setIsDesktopSidebarOpen(!isDesktopSidebarOpen);
  };

  // Determine the padding class based on desktop sidebar state
  // This shifts the main content over when the sidebar is open
  const contentPaddingClass = isDesktopSidebarOpen ? 'lg:pl-64' : 'lg:pl-0';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Component receives both open states and the desktop state */}
      <Sidebar 
        open={sidebarOpen} // Mobile/Dialog state
        setOpen={setSidebarOpen} 
        isDesktopOpen={isDesktopSidebarOpen} // Desktop visibility state
      />
      
      {/* Main Content Area: Padding adjusts dynamically */}
      <div className={`flex-1 flex flex-col overflow-hidden ${contentPaddingClass} transition-all duration-300`}>
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onDesktopToggle={toggleDesktopSidebar} // Pass the desktop toggle handler
          isDesktopSidebarOpen={isDesktopSidebarOpen} // Pass the state
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
