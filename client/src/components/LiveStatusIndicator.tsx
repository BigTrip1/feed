import React, { useState, useEffect } from 'react';

interface LiveStatusIndicatorProps {
  className?: string;
}

const LiveStatusIndicator: React.FC<LiveStatusIndicatorProps> = ({ className }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [latency, setLatency] = useState(12);
  const [signalsPerMinute, setSignalsPerMinute] = useState(47);
  const [activeUsers, setActiveUsers] = useState(1247);

  useEffect(() => {
    // Simulate real-time metrics updates
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 20) + 8);
      setSignalsPerMinute(Math.floor(Math.random() * 30) + 35);
      setActiveUsers(1200 + Math.floor(Math.random() * 100));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      {/* Main Status Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.95), rgba(26, 26, 37, 0.9))',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
        borderRadius: '12px',
        padding: '1rem',
        minWidth: '200px',
        boxShadow: isConnected 
          ? '0 8px 32px rgba(16, 185, 129, 0.15), 0 0 20px rgba(16, 185, 129, 0.1)'
          : '0 8px 32px rgba(239, 68, 68, 0.15)',
        transition: 'all 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isConnected ? '#10B981' : '#EF4444',
              boxShadow: isConnected 
                ? '0 0 12px rgba(16, 185, 129, 0.8)' 
                : '0 0 12px rgba(239, 68, 68, 0.8)',
              animation: 'pulse 2s infinite'
            }}></div>
            <span style={{
              color: isConnected ? '#10B981' : '#EF4444',
              fontSize: '0.8rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #00D9FF, #8B5CF6)',
            borderRadius: '6px',
            padding: '0.25rem 0.5rem',
            fontSize: '0.7rem',
            color: 'white',
            fontWeight: 'bold'
          }}>
            DB
          </div>
        </div>

        {/* Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          fontSize: '0.75rem'
        }}>
          <div>
            <div style={{ color: '#A8B2D1', marginBottom: '0.25rem' }}>Latency</div>
            <div style={{
              color: latency < 15 ? '#10B981' : latency < 25 ? '#F59E0B' : '#EF4444',
              fontWeight: 'bold',
              fontFamily: 'monospace'
            }}>
              {latency}ms
            </div>
          </div>
          
          <div>
            <div style={{ color: '#A8B2D1', marginBottom: '0.25rem' }}>Signals/min</div>
            <div style={{
              color: '#00D9FF',
              fontWeight: 'bold',
              fontFamily: 'monospace'
            }}>
              {signalsPerMinute}
            </div>
          </div>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ color: '#A8B2D1', marginBottom: '0.25rem' }}>Active Users</div>
            <div style={{
              color: '#8B5CF6',
              fontWeight: 'bold',
              fontFamily: 'monospace'
            }}>
              {activeUsers.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Mini Performance Indicators */}
      <div style={{
        display: 'flex',
        gap: '0.5rem'
      }}>
        {/* CPU Usage */}
        <div style={{
          background: 'rgba(18, 18, 26, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 217, 255, 0.2)',
          borderRadius: '8px',
          padding: '0.5rem',
          flex: 1,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.6rem',
            color: '#A8B2D1',
            marginBottom: '0.25rem'
          }}>CPU</div>
          <div style={{
            fontSize: '0.8rem',
            color: '#00D9FF',
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}>
            23%
          </div>
        </div>

        {/* Memory Usage */}
        <div style={{
          background: 'rgba(18, 18, 26, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '8px',
          padding: '0.5rem',
          flex: 1,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.6rem',
            color: '#A8B2D1',
            marginBottom: '0.25rem'
          }}>RAM</div>
          <div style={{
            fontSize: '0.8rem',
            color: '#8B5CF6',
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}>
            67%
          </div>
        </div>

        {/* Network */}
        <div style={{
          background: 'rgba(18, 18, 26, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '8px',
          padding: '0.5rem',
          flex: 1,
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.6rem',
            color: '#A8B2D1',
            marginBottom: '0.25rem'
          }}>NET</div>
          <div style={{
            fontSize: '0.8rem',
            color: '#10B981',
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}>
            89%
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStatusIndicator; 