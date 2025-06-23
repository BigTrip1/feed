import React, { useState, useEffect } from 'react';

interface DebugInfoProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ isVisible = false, onToggle }) => {
  const [systemMetrics, setSystemMetrics] = useState({
    cpuUsage: 23.4,
    memoryUsage: 67.8,
    networkLatency: 12,
    activeConnections: 847,
    dataProcessed: 2847293,
    errorRate: 0.02,
    uptime: Date.now() - 3600000,
    lastUpdate: Date.now(),
    fps: 60,
    renderTime: 16.7,
    cacheHitRate: 94.3,
    queueSize: 23,
    throughput: 1847,
    diskUsage: 45.2,
    temperature: 67.3,
    powerDraw: 145.7
  });

  const [logs, setLogs] = useState<Array<{
    timestamp: number;
    level: 'info' | 'warning' | 'error' | 'success';
    message: string;
    component?: string;
  }>>([
    { timestamp: Date.now() - 5000, level: 'success', message: 'WebSocket connection established', component: 'WS' },
    { timestamp: Date.now() - 3000, level: 'info', message: 'Token data refreshed', component: 'API' },
    { timestamp: Date.now() - 1000, level: 'warning', message: 'High memory usage detected', component: 'SYS' },
    { timestamp: Date.now() - 500, level: 'info', message: 'Alpha score calculation complete', component: 'CALC' }
  ]);

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() - 0.5) * 3)),
        networkLatency: Math.max(1, prev.networkLatency + (Math.random() - 0.5) * 2),
        activeConnections: Math.max(0, prev.activeConnections + Math.floor((Math.random() - 0.5) * 10)),
        dataProcessed: prev.dataProcessed + Math.floor(Math.random() * 1000),
        errorRate: Math.max(0, Math.min(1, prev.errorRate + (Math.random() - 0.5) * 0.01)),
        uptime: prev.uptime + 2000,
        lastUpdate: Date.now(),
        fps: Math.max(30, Math.min(120, prev.fps + (Math.random() - 0.5) * 5)),
        renderTime: Math.max(8, Math.min(33, prev.renderTime + (Math.random() - 0.5) * 2)),
        cacheHitRate: Math.max(80, Math.min(100, prev.cacheHitRate + (Math.random() - 0.5) * 2)),
        queueSize: Math.max(0, prev.queueSize + Math.floor((Math.random() - 0.5) * 5)),
        throughput: Math.max(0, prev.throughput + Math.floor((Math.random() - 0.5) * 100)),
        diskUsage: Math.max(0, Math.min(100, prev.diskUsage + (Math.random() - 0.5) * 0.5)),
        temperature: Math.max(40, Math.min(85, prev.temperature + (Math.random() - 0.5) * 2)),
        powerDraw: Math.max(100, Math.min(200, prev.powerDraw + (Math.random() - 0.5) * 10))
      }));

      // Add random log entries
      if (Math.random() > 0.7) {
        const messages = [
          { level: 'info' as const, message: 'Token analysis complete', component: 'AI' },
          { level: 'success' as const, message: 'Alpha signal detected', component: 'ALGO' },
          { level: 'warning' as const, message: 'Rate limit approaching', component: 'API' },
          { level: 'info' as const, message: 'Cache invalidated', component: 'CACHE' },
          { level: 'success' as const, message: 'Whale movement detected', component: 'WHALE' }
        ];
        
        const newLog = {
          timestamp: Date.now(),
          ...messages[Math.floor(Math.random() * messages.length)]
        };

        setLogs(prev => [newLog, ...prev.slice(0, 49)]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const formatUptime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)}GB`;
    if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(1)}MB`;
    if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(1)}KB`;
    return `${bytes}B`;
  };

  const getMetricColor = (value: number, type: 'usage' | 'latency' | 'rate') => {
    switch (type) {
      case 'usage':
        if (value > 80) return '#EF4444';
        if (value > 60) return '#F59E0B';
        return '#10B981';
      case 'latency':
        if (value > 50) return '#EF4444';
        if (value > 20) return '#F59E0B';
        return '#10B981';
      case 'rate':
        if (value > 95) return '#10B981';
        if (value > 80) return '#F59E0B';
        return '#EF4444';
      default:
        return '#A8B2D1';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return '#EF4444';
      case 'warning': return '#F59E0B';
      case 'success': return '#10B981';
      default: return '#00D9FF';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return '🚨';
      case 'warning': return '⚠️';
      case 'success': return '✅';
      default: return 'ℹ️';
    }
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      right: '20px',
      width: isExpanded ? '600px' : '350px',
      maxHeight: '80vh',
      background: 'linear-gradient(135deg, rgba(11, 11, 15, 0.98), rgba(18, 18, 26, 0.95))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(0, 217, 255, 0.3)',
      borderRadius: '16px',
      zIndex: 9999,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: '0 16px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      animation: 'debugPulse 3s ease-in-out infinite'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'linear-gradient(90deg, rgba(0, 217, 255, 0.1), rgba(139, 92, 246, 0.1))'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#10B981',
            animation: 'pulse 2s infinite',
            boxShadow: '0 0 10px #10B981'
          }} />
          <h3 style={{
            color: '#E5E7EB',
            fontSize: '1rem',
            fontWeight: 'bold',
            margin: 0
          }}>
            🔧 System Debug
          </h3>
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'rgba(0, 217, 255, 0.2)',
              border: '1px solid rgba(0, 217, 255, 0.3)',
              borderRadius: '6px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#00D9FF',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 217, 255, 0.3)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 217, 255, 0.2)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isExpanded ? '−' : '+'}
          </button>
          
          <button
            onClick={onToggle}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#EF4444',
              fontSize: '0.8rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
              e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxHeight: 'calc(80vh - 60px)',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(0, 217, 255, 0.3) transparent'
      }}>
        {/* System Metrics */}
        <div style={{ padding: '1rem' }}>
          <h4 style={{
            color: '#A8B2D1',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            margin: '0 0 1rem 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            📊 System Metrics
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: isExpanded ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            {[
              { label: 'CPU', value: systemMetrics.cpuUsage, suffix: '%', type: 'usage' as const },
              { label: 'Memory', value: systemMetrics.memoryUsage, suffix: '%', type: 'usage' as const },
              { label: 'Latency', value: systemMetrics.networkLatency, suffix: 'ms', type: 'latency' as const },
              { label: 'FPS', value: systemMetrics.fps, suffix: '', type: 'rate' as const },
              { label: 'Cache Hit', value: systemMetrics.cacheHitRate, suffix: '%', type: 'rate' as const },
              { label: 'Temp', value: systemMetrics.temperature, suffix: '°C', type: 'usage' as const }
            ].map((metric, index) => (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '0.75rem',
                textAlign: 'center'
              }}>
                <div style={{
                  color: getMetricColor(metric.value, metric.type),
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  fontFamily: 'monospace'
                }}>
                  {metric.value.toFixed(1)}{metric.suffix}
                </div>
                <div style={{
                  color: '#A8B2D1',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  marginTop: '0.25rem'
                }}>
                  {metric.label}
                </div>
                
                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '3px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '2px',
                  marginTop: '0.5rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(100, metric.value)}%`,
                    height: '100%',
                    background: getMetricColor(metric.value, metric.type),
                    borderRadius: '2px',
                    transition: 'width 0.5s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Additional Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.5rem',
            fontSize: '0.8rem',
            color: '#A8B2D1'
          }}>
            <div>🔗 Connections: <span style={{ color: '#00D9FF', fontWeight: 'bold' }}>{systemMetrics.activeConnections}</span></div>
            <div>📦 Queue: <span style={{ color: '#8B5CF6', fontWeight: 'bold' }}>{systemMetrics.queueSize}</span></div>
            <div>⚡ Throughput: <span style={{ color: '#10B981', fontWeight: 'bold' }}>{systemMetrics.throughput}/s</span></div>
            <div>💾 Data: <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>{formatBytes(systemMetrics.dataProcessed)}</span></div>
            <div>⏱️ Uptime: <span style={{ color: '#FFD700', fontWeight: 'bold' }}>{formatUptime(systemMetrics.uptime)}</span></div>
            <div>⚠️ Errors: <span style={{ color: systemMetrics.errorRate > 0.1 ? '#EF4444' : '#10B981', fontWeight: 'bold' }}>{(systemMetrics.errorRate * 100).toFixed(2)}%</span></div>
          </div>
        </div>

        {/* Live Logs */}
        {isExpanded && (
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1rem'
          }}>
            <h4 style={{
              color: '#A8B2D1',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              margin: '0 0 1rem 0',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              📜 Live Logs
            </h4>
            
            <div style={{
              maxHeight: '200px',
              overflowY: 'auto',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.75rem',
              fontFamily: 'monospace',
              fontSize: '0.75rem'
            }}>
              {logs.map((log, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  padding: '0.25rem 0.5rem',
                  background: `rgba(${getLevelColor(log.level).replace('#', '')}, 0.1)`,
                  border: `1px solid rgba(${getLevelColor(log.level).replace('#', '')}, 0.2)`,
                  borderRadius: '4px',
                  animation: index === 0 ? 'logEntry 0.3s ease-out' : 'none'
                }}>
                  <span>{getLevelIcon(log.level)}</span>
                  <span style={{
                    color: '#A8B2D1',
                    fontSize: '0.7rem',
                    minWidth: '60px'
                  }}>
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  {log.component && (
                    <span style={{
                      background: getLevelColor(log.level),
                      color: 'white',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '4px',
                      fontSize: '0.6rem',
                      fontWeight: 'bold'
                    }}>
                      {log.component}
                    </span>
                  )}
                  <span style={{ color: '#E5E7EB', flex: 1 }}>
                    {log.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scanning Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.1), transparent)',
        animation: 'debugScan 4s linear infinite',
        pointerEvents: 'none'
      }} />

      <style>{`
        @keyframes debugPulse {
          0%, 100% { 
            border-color: rgba(0, 217, 255, 0.3);
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05);
          }
          50% { 
            border-color: rgba(139, 92, 246, 0.4);
            box-shadow: 0 20px 60px rgba(139, 92, 246, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1);
          }
        }
        
        @keyframes debugScan {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes logEntry {
          0% { 
            opacity: 0; 
            transform: translateX(-10px); 
          }
          100% { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default DebugInfo; 