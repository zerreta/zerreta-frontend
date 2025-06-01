import React, { createContext, useState, useContext } from 'react';

// Create context
const SidebarContext = createContext();

// Create provider component
export const SidebarProvider = ({ children }) => {
  const [mainSidebarVisible, setMainSidebarVisible] = useState(true);

  const toggleMainSidebar = (state) => {
    // If state is provided, set to that value
    // Otherwise toggle current state
    if (typeof state === 'boolean') {
      setMainSidebarVisible(state);
    } else {
      setMainSidebarVisible(prev => !prev);
    }
  };

  return (
    <SidebarContext.Provider value={{ mainSidebarVisible, toggleMainSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

// Custom hook for using the sidebar context
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export default SidebarContext; 