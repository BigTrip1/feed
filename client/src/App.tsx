import React, { useState, useEffect, useRef } from 'react';
import ActivityFeed from './components/ActivityFeed';
import SideNav from './components/SideNav';
import MobileMenuButton from './components/MobileMenuButton';
import LiveStatusIndicator from './components/LiveStatusIndicator';
import FloatingActionButton from './components/FloatingActionButton';
import AnimatedBackground from './components/AnimatedBackground';
import NotificationToast from './components/NotificationToast';
import Header from './components/Header';
import StatusBar from './components/StatusBar';
import DebugInfo from './components/DebugInfo';

function App() {
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [systemStats, setSystemStats] = useState({
    totalTokens: 15,
    activeAlerts: 12,
    marketTrend: 'bullish' as 'bullish' | 'bearish' | 'neutral',
    connectionStatus: 'connected' as 'connected' | 'connecting' | 'disconnected',
    notifications: 3,
    autoScroll: true
  });
  const [hologramEffects, setHologramEffects] = useState({
    scanlinePosition: 0,
    glitchIntensity: 0,
    dataStreamOpacity: 0.3
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

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

  // Advanced holographic effects
  useEffect(() => {
    const interval = setInterval(() => {
      setHologramEffects(prev => ({
        scanlinePosition: (prev.scanlinePosition + 1) % 100,
        glitchIntensity: Math.random() * 0.1,
        dataStreamOpacity: 0.2 + Math.random() * 0.4
      }));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Advanced particle system for cursor trail
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      color: string;
    }> = [];

    const colors = ['#00D9FF', '#8B5CF6', '#10B981', '#F59E0B', '#FFD700'];

    const addParticle = (x: number, y: number) => {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 60,
        maxLife: 60,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        if (particle.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = particle.life / particle.maxLife;
        ctx.save();
        ctx.globalAlpha = alpha * 0.6;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      mouseRef.current = { x, y };
      
      if (Math.random() > 0.8) {
        addParticle(x, y);
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    handleResize();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'd':
            e.preventDefault();
            setShowDebugInfo(!showDebugInfo);
            break;
          case 'm':
            e.preventDefault();
            setIsSideNavCollapsed(!isSideNavCollapsed);
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showDebugInfo, isSideNavCollapsed]);

  const handleToggle = () => {
    setIsSideNavCollapsed(!isSideNavCollapsed);
  };

  const handleClearNotifications = () => {
    setSystemStats(prev => ({ ...prev, notifications: 0 }));
  };

  const handleToggleAutoScroll = () => {
    setSystemStats(prev => ({ ...prev, autoScroll: !prev.autoScroll }));
  };

  const handleRefresh = () => {
    // Trigger refresh animation
    window.location.reload();
  };

  return (
    <div className="App" style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      position: 'relative',
      background: 'linear-gradient(135deg, #0B0B0F 0%, #12121A 50%, #1A1A25 100%)',
      overflow: 'hidden'
    }}>
      {/* Advanced Particle Cursor Trail */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 9998
        }}
      />

      {/* Holographic Scan Lines */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 217, 255, ${hologramEffects.dataStreamOpacity * 0.05}) 2px,
            rgba(0, 217, 255, ${hologramEffects.dataStreamOpacity * 0.05}) 4px
          )
        `,
        pointerEvents: 'none',
        zIndex: 9997,
        animation: 'scanlines 20s linear infinite'
      }} />

      {/* Dynamic Data Stream Overlay */}
      <div style={{
        position: 'fixed',
        top: `${hologramEffects.scanlinePosition}%`,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #00D9FF, #8B5CF6, #10B981, transparent)',
        boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)',
        pointerEvents: 'none',
        zIndex: 9996,
        opacity: hologramEffects.dataStreamOpacity
      }} />

      {/* Glitch Effect Overlay */}
      {hologramEffects.glitchIntensity > 0.08 && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, 
              transparent 0%, 
              rgba(255, 0, 0, ${hologramEffects.glitchIntensity}) 33%, 
              rgba(0, 255, 0, ${hologramEffects.glitchIntensity}) 66%, 
              rgba(0, 0, 255, ${hologramEffects.glitchIntensity}) 100%
            )
          `,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
          zIndex: 9995,
          animation: 'glitch 0.1s linear'
        }} />
      )}

      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Header */}
      <Header onToggleSidebar={handleToggle} />
      
      {/* Live Status Indicator */}
      <LiveStatusIndicator />
      
      {/* Floating Action Button */}
      <FloatingActionButton />
      
      {/* Notification Toast */}
      <NotificationToast />
      
      {/* Debug Info */}
      <DebugInfo 
        isVisible={showDebugInfo}
        onToggle={() => setShowDebugInfo(!showDebugInfo)}
      />
      
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
      
      {/* Main Content Area */}
      <div style={{
        flex: 1,
        marginLeft: isMobile ? '0' : (isSideNavCollapsed ? '80px' : '280px'),
        marginTop: '80px',
        marginBottom: '120px',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: 'calc(100vh - 200px)',
        position: 'relative',
        zIndex: 1,
        padding: '0',
        overflow: 'hidden'
      }}>
        {/* Content Background Glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '80%',
          height: '60%',
          background: 'radial-gradient(ellipse, rgba(0, 217, 255, 0.03) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'contentGlow 8s ease-in-out infinite alternate'
        }} />

        <ActivityFeed />
      </div>

      {/* Status Bar */}
      <StatusBar
        connectionStatus={systemStats.connectionStatus}
        notifications={systemStats.notifications}
        autoScroll={systemStats.autoScroll}
        onClearNotifications={handleClearNotifications}
        onToggleAutoScroll={handleToggleAutoScroll}
        onRefresh={handleRefresh}
        totalTokens={systemStats.totalTokens}
        activeAlerts={systemStats.activeAlerts}
        marketTrend={systemStats.marketTrend}
      />

      {/* Keyboard Shortcuts Helper */}
      <div style={{
        position: 'fixed',
        bottom: '140px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        padding: '0.75rem',
        fontSize: '0.75rem',
        color: '#A8B2D1',
        zIndex: 9999,
        opacity: 0,
        animation: 'fadeInOut 10s ease-in-out infinite',
        animationDelay: '5s'
      }}>
        <div style={{ marginBottom: '0.25rem', fontWeight: 'bold', color: '#00D9FF' }}>
          ⌨️ Shortcuts
        </div>
        <div>Ctrl+D: Debug Info</div>
        <div>Ctrl+M: Toggle Menu</div>
      </div>

      {/* Performance Monitor */}
      <div style={{
        position: 'fixed',
        top: '100px',
        left: '20px',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0, 217, 255, 0.2)',
        borderRadius: '8px',
        padding: '0.5rem',
        fontSize: '0.7rem',
        color: '#00D9FF',
        zIndex: 9999,
        fontFamily: 'monospace'
      }}>
        <div>FPS: {Math.floor(60 + Math.random() * 10)}</div>
        <div>Latency: {Math.floor(10 + Math.random() * 5)}ms</div>
        <div>Signals: {Math.floor(450 + Math.random() * 50)}</div>
      </div>

      <style>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
        
        @keyframes glitch {
          0% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes contentGlow {
          0% { 
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          100% { 
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        
        @keyframes fadeInOut {
          0%, 90%, 100% { opacity: 0; }
          10%, 80% { opacity: 1; }
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #00D9FF, #8B5CF6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #8B5CF6, #10B981);
        }
        
        /* Selection Styling */
        ::selection {
          background: rgba(0, 217, 255, 0.3);
          color: white;
        }
        
        /* Focus Styling */
        *:focus {
          outline: 2px solid rgba(0, 217, 255, 0.5);
          outline-offset: 2px;
        }
        
        /* Global Animation Performance */
        * {
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}

export default App; 