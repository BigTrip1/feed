import React, { useState, useEffect } from 'react';
import ActivityFeed from './components/ActivityFeed';
import SideNav from './components/SideNav';
import MobileMenuButton from './components/MobileMenuButton';
import LiveStatusIndicator from './components/LiveStatusIndicator';
import FloatingActionButton from './components/FloatingActionButton';
import AnimatedBackground from './components/AnimatedBackground';
import NotificationToast from './components/NotificationToast';

function App() {
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSideNavCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggle = () => {
    setIsSideNavCollapsed(!isSideNavCollapsed);
  };

  return (
    <div className="App" style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Live Status Indicator */}
      <LiveStatusIndicator />
      
      {/* Floating Action Button */}
      <FloatingActionButton />
      
      {/* Notification Toast */}
      <NotificationToast />
      
      {isMobile && (
        <MobileMenuButton 
          onClick={handleToggle}
          isOpen={!isSideNavCollapsed}
        />
      )}
      
      <SideNav 
        isCollapsed={isSideNavCollapsed} 
        onToggle={handleToggle} 
      />
      
      <div style={{
        flex: 1,
        marginLeft: isMobile ? '0' : (isSideNavCollapsed ? '80px' : '280px'),
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1
      }}>
        <ActivityFeed />
      </div>
    </div>
  );
}

export default App; 