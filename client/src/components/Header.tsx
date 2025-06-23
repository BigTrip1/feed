import React, { useState, useEffect } from 'react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [marketStatus, setMarketStatus] = useState('ACTIVE');
  const [totalSignals, setTotalSignals] = useState(450);
  const [activeUsers, setActiveUsers] = useState(1232);
  const [networkHealth, setNetworkHealth] = useState(98.7);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setTotalSignals(prev => prev + Math.floor(Math.random() * 3));
      setActiveUsers(prev => prev + Math.floor(Math.random() * 5 - 2));
      setNetworkHealth(95 + Math.random() * 5);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        background: 'linear-gradient(135deg, rgba(11, 11, 15, 0.98) 0%, rgba(18, 18, 26, 0.95) 50%, rgba(26, 26, 37, 0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0, 217, 255, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 1000,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)'
      }}>
        {/* Left Section - Logo & Brand */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00D9FF 0%, #8B5CF6 50%, #00D9FF 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            animation: 'logoGlow 3s ease-in-out infinite alternate'
          }}>
            📡
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'logoScan 2s linear infinite'
            }} />
          </div>

          <div>
            <h1 style={{
              color: '#E5E7EB',
              fontSize: '1.8rem',
              fontWeight: 'bold',
              margin: 0,
              background: 'linear-gradient(135deg, #00D9FF, #8B5CF6, #10B981)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'textShimmer 3s ease-in-out infinite'
            }}>
              Feed.moi
            </h1>
            <p style={{
              color: '#A8B2D1',
              fontSize: '0.8rem',
              margin: 0,
              fontWeight: '500'
            }}>
              🚀 The Ultimate Alpha Feed - Where Legends Are Born
            </p>
          </div>
        </div>

        {/* Center Section - Real-time Metrics */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          flex: 1,
          justifyContent: 'center'
        }}>
          {/* Market Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10B981',
              animation: 'pulse 2s infinite',
              boxShadow: '0 0 12px #10B981'
            }} />
            <div>
              <div style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 'bold' }}>
                {marketStatus}
              </div>
              <div style={{ color: '#A8B2D1', fontSize: '0.7rem' }}>
                Market
              </div>
            </div>
          </div>

          {/* Live Signals */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(0, 217, 255, 0.1)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem'
          }}>
            <div style={{
              fontSize: '1.2rem',
              animation: 'bounce 1s infinite'
            }}>
              📡
            </div>
            <div>
              <div style={{ color: '#00D9FF', fontSize: '1rem', fontWeight: 'bold' }}>
                {totalSignals.toLocaleString()}
              </div>
              <div style={{ color: '#A8B2D1', fontSize: '0.7rem' }}>
                Live Signals
              </div>
            </div>
          </div>

          {/* Active Users */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem'
          }}>
            <div style={{
              fontSize: '1.2rem',
              animation: 'wiggle 2s ease-in-out infinite'
            }}>
              👥
            </div>
            <div>
              <div style={{ color: '#8B5CF6', fontSize: '1rem', fontWeight: 'bold' }}>
                {activeUsers.toLocaleString()}
              </div>
              <div style={{ color: '#A8B2D1', fontSize: '0.7rem' }}>
                Active Users
              </div>
            </div>
          </div>

          {/* Network Health */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: `conic-gradient(#F59E0B ${networkHealth * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: 'rgba(18, 18, 26, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                color: '#F59E0B',
                fontWeight: 'bold'
              }}>
                ✓
              </div>
            </div>
            <div>
              <div style={{ color: '#F59E0B', fontSize: '1rem', fontWeight: 'bold' }}>
                {networkHealth.toFixed(1)}%
              </div>
              <div style={{ color: '#A8B2D1', fontSize: '0.7rem' }}>
                Network Health
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Time & Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          {/* Real-time Clock */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '0.75rem 1.25rem',
            fontFamily: 'monospace'
          }}>
            <div style={{
              color: '#E5E7EB',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textAlign: 'center'
            }}>
              {formatTime(currentTime)}
            </div>
            <div style={{
              color: '#A8B2D1',
              fontSize: '0.7rem',
              textAlign: 'center',
              marginTop: '0.25rem'
            }}>
              UTC TIME
            </div>
          </div>

          {/* Emergency Stop Button */}
          <button style={{
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            border: 'none',
            borderRadius: '12px',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.3rem',
            color: 'white',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)';
          }}
          title="Emergency Stop"
          >
            🛑
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
              animation: 'emergencyGlow 3s linear infinite'
            }} />
          </button>

          {/* Profile Avatar */}
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6, #00D9FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1) rotate(5deg)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          >
            👤
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '16px',
              height: '16px',
              background: '#10B981',
              borderRadius: '50%',
              border: '2px solid rgba(18, 18, 26, 1)',
              animation: 'pulse 2s infinite'
            }} />
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        pointerEvents: 'none',
        zIndex: 999,
        overflow: 'hidden'
      }}>
        {/* Scanning Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '2px',
          height: '100%',
          background: 'linear-gradient(to bottom, transparent, #00D9FF, transparent)',
          animation: 'headerScan 8s linear infinite',
          boxShadow: '0 0 10px #00D9FF'
        }} />
        
        {/* Data Stream */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.3), transparent)',
          animation: 'dataStream 3s ease-in-out infinite'
        }} />
      </div>

      <style>{`
        @keyframes logoGlow {
          0% { box-shadow: 0 0 20px rgba(0, 217, 255, 0.3); }
          100% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
        }
        
        @keyframes logoScan {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes textShimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(2deg); }
          75% { transform: rotate(-2deg); }
        }
        
        @keyframes emergencyGlow {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(200%) rotate(45deg); }
        }
        
        @keyframes headerScan {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes dataStream {
          0%, 100% { opacity: 0; transform: scaleX(0); }
          50% { opacity: 1; transform: scaleX(1); }
        }
      `}</style>
    </>
  );
};

export default Header; 