import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, Bell, RotateCcw, Play, Pause } from 'lucide-react';
import { ConnectionStatus } from '../types/token';

interface StatusBarProps {
  connectionStatus: ConnectionStatus;
  notifications: number;
  autoScroll: boolean;
  onClearNotifications: () => void;
  onToggleAutoScroll: () => void;
  onRefresh: () => void;
  totalTokens?: number;
  activeAlerts?: number;
  marketTrend?: 'bullish' | 'bearish' | 'neutral';
}

const StatusContainer = styled.div`
  background: ${props => props.theme.colors.elevated};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 1rem 2rem;
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
  }
`;

const StatusContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ConnectionIndicator = styled(motion.div)<{ status: ConnectionStatus }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => {
    switch (props.status) {
      case 'connected':
        return props.theme.colors.success;
      case 'connecting':
        return props.theme.colors.warning;
      case 'disconnected':
        return props.theme.colors.error;
      default:
        return props.theme.colors.neutral;
    }
  }};
  color: white;
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 600;
`;

const NotificationBadge = styled(motion.div)<{ count: number }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.count > 0 ? props.theme.colors.primary : props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.full};
  cursor: ${props => props.count > 0 ? 'pointer' : 'default'};
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.count > 0 ? props.theme.colors.primaryHover : props.theme.colors.surface};
  }
`;

const NotificationCount = styled.span<{ count: number }>`
  background: ${props => props.count > 0 ? 'white' : props.theme.colors.textMuted};
  color: ${props => props.count > 0 ? props.theme.colors.primary : props.theme.colors.background};
  padding: 0.125rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 700;
  min-width: 20px;
  text-align: center;
`;

const ControlButton = styled(motion.button)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.surface};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primaryHover : props.theme.colors.elevated};
    border-color: ${props => props.theme.colors.primary};
  }

  svg {
    color: ${props => props.active ? 'white' : props.theme.colors.textSecondary};
  }
`;

const LiveFeedText = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 500;
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const Pulse = styled(motion.div)`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.theme.colors.success};
`;

const StatusBar: React.FC<StatusBarProps> = ({
  connectionStatus,
  notifications,
  autoScroll,
  onClearNotifications,
  onToggleAutoScroll,
  onRefresh,
  totalTokens = 15,
  activeAlerts = 12,
  marketTrend = 'bullish'
}) => {
  const [liveMetrics, setLiveMetrics] = useState({
    totalVolume: 2847293847,
    totalMarketCap: 847293847293,
    avgAlphaScore: 73.4,
    whaleMovements: 847,
    rugPulls: 3,
    moonshots: 12,
    tradingVelocity: 94.7,
    fearGreedIndex: 67,
    liquidityFlow: 1847293,
    gasPrice: 0.000023,
    networkLoad: 87.3,
    successRate: 91.2
  });

  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        totalVolume: prev.totalVolume + Math.random() * 1000000,
        totalMarketCap: prev.totalMarketCap + Math.random() * 10000000,
        avgAlphaScore: 70 + Math.random() * 20,
        whaleMovements: prev.whaleMovements + Math.floor(Math.random() * 3),
        rugPulls: Math.max(0, prev.rugPulls + (Math.random() > 0.95 ? 1 : 0)),
        moonshots: prev.moonshots + (Math.random() > 0.9 ? 1 : 0),
        tradingVelocity: 85 + Math.random() * 15,
        fearGreedIndex: 40 + Math.random() * 40,
        liquidityFlow: prev.liquidityFlow + Math.random() * 100000,
        gasPrice: 0.00001 + Math.random() * 0.00005,
        networkLoad: 70 + Math.random() * 30,
        successRate: 88 + Math.random() * 8
      }));
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number, suffix = '') => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B${suffix}`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M${suffix}`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K${suffix}`;
    return `${num.toFixed(2)}${suffix}`;
  };

  const getTrendColor = () => {
    switch (marketTrend) {
      case 'bullish': return '#10B981';
      case 'bearish': return '#EF4444';
      default: return '#F59E0B';
    }
  };

  const getTrendIcon = () => {
    switch (marketTrend) {
      case 'bullish': return '🚀';
      case 'bearish': return '📉';
      default: return '⚖️';
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi size={16} />;
      case 'connecting':
        return <Wifi size={16} />;
      case 'disconnected':
        return <WifiOff size={16} />;
      default:
        return <WifiOff size={16} />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Live Feed';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '120px',
      background: 'linear-gradient(0deg, rgba(11, 11, 15, 0.98) 0%, rgba(18, 18, 26, 0.95) 50%, rgba(26, 26, 37, 0.92) 100%)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid rgba(0, 217, 255, 0.2)',
      zIndex: 999,
      padding: '1rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
      overflow: 'hidden'
    }}>
      {/* Holographic Background Effects */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
          linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.05) 50%, transparent 100%)
        `,
        animation: 'holographicShift 8s ease-in-out infinite'
      }} />

      {/* Scanning Grid */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        opacity: 0.3,
        animation: 'gridScan 10s linear infinite'
      }} />

      {/* Top Row - Primary Metrics */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Market Overview */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: `rgba(${getTrendColor().replace('#', '')}, 0.1)`,
            border: `1px solid rgba(${getTrendColor().replace('#', '')}, 0.3)`,
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              fontSize: '1.5rem',
              animation: animationPhase % 2 === 0 ? 'bounce 0.5s ease-out' : 'none'
            }}>
              {getTrendIcon()}
            </div>
            <div>
              <div style={{
                color: getTrendColor(),
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'uppercase'
              }}>
                {marketTrend} Market
              </div>
              <div style={{ color: '#A8B2D1', fontSize: '0.8rem' }}>
                Total Volume: {formatNumber(liveMetrics.totalVolume, '$')}
              </div>
            </div>
            <div style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, rgba(${getTrendColor().replace('#', '')}, 0.2), transparent)`,
              animation: 'shimmer 3s linear infinite'
            }} />
          </div>

          {/* Alpha Score Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: `conic-gradient(#FFD700 ${liveMetrics.avgAlphaScore * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: 'rgba(18, 18, 26, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFD700',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                α
              </div>
            </div>
            <div>
              <div style={{ color: '#FFD700', fontSize: '1.1rem', fontWeight: 'bold' }}>
                {liveMetrics.avgAlphaScore.toFixed(1)}
              </div>
              <div style={{ color: '#A8B2D1', fontSize: '0.8rem' }}>
                Avg Alpha Score
              </div>
            </div>
          </div>

          {/* Whale Activity */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem'
          }}>
            <div style={{
              fontSize: '1.8rem',
              animation: liveMetrics.whaleMovements % 10 === 0 ? 'whaleAlert 1s ease-out' : 'none'
            }}>
              🐋
            </div>
            <div>
              <div style={{ color: '#8B5CF6', fontSize: '1.1rem', fontWeight: 'bold' }}>
                {liveMetrics.whaleMovements}
              </div>
              <div style={{ color: '#A8B2D1', fontSize: '0.8rem' }}>
                Whale Movements
              </div>
            </div>
          </div>
        </div>

        {/* Risk Indicators */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem'
        }}>
          {/* Rug Pulls Alert */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: liveMetrics.rugPulls > 5 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
            border: `1px solid rgba(239, 68, 68, ${liveMetrics.rugPulls > 5 ? '0.5' : '0.3'})`,
            borderRadius: '12px',
            padding: '0.5rem 1rem',
            animation: liveMetrics.rugPulls > 5 ? 'dangerPulse 1s infinite' : 'none'
          }}>
            <div style={{ fontSize: '1.2rem' }}>⚠️</div>
            <div>
              <div style={{ color: '#EF4444', fontSize: '1rem', fontWeight: 'bold' }}>
                {liveMetrics.rugPulls}
              </div>
              <div style={{ color: '#A8B2D1', fontSize: '0.7rem' }}>
                Rug Pulls
              </div>
            </div>
          </div>

          {/* Moonshots */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '0.5rem 1rem'
          }}>
            <div style={{
              fontSize: '1.2rem',
              animation: 'moonGlow 2s ease-in-out infinite'
            }}>
              🌙
            </div>
            <div>
              <div style={{ color: '#10B981', fontSize: '1rem', fontWeight: 'bold' }}>
                {liveMetrics.moonshots}
              </div>
              <div style={{ color: '#A8B2D1', fontSize: '0.7rem' }}>
                Moonshots
              </div>
            </div>
          </div>

          {/* Success Rate */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            background: 'rgba(0, 217, 255, 0.1)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            borderRadius: '12px',
            padding: '0.5rem 1rem'
          }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: `conic-gradient(#00D9FF ${liveMetrics.successRate * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: 'rgba(18, 18, 26, 0.9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.6rem',
                color: '#00D9FF'
              }}>
                ✓
              </div>
            </div>
            <div>
              <div style={{ color: '#00D9FF', fontSize: '1rem', fontWeight: 'bold' }}>
                {liveMetrics.successRate.toFixed(1)}%
              </div>
              <div style={{ color: '#A8B2D1', fontSize: '0.7rem' }}>
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Advanced Metrics */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Left Side - Trading Metrics */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ color: '#A8B2D1' }}>
            <span style={{ color: '#00D9FF', fontWeight: 'bold' }}>Trading Velocity:</span> {liveMetrics.tradingVelocity.toFixed(1)}%
          </div>
          <div style={{ color: '#A8B2D1' }}>
            <span style={{ color: '#8B5CF6', fontWeight: 'bold' }}>Fear & Greed:</span> {liveMetrics.fearGreedIndex}/100
          </div>
          <div style={{ color: '#A8B2D1' }}>
            <span style={{ color: '#F59E0B', fontWeight: 'bold' }}>Liquidity Flow:</span> {formatNumber(liveMetrics.liquidityFlow, '$')}
          </div>
          <div style={{ color: '#A8B2D1' }}>
            <span style={{ color: '#10B981', fontWeight: 'bold' }}>Gas Price:</span> {liveMetrics.gasPrice.toFixed(6)} SOL
          </div>
        </div>

        {/* Right Side - System Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          fontSize: '0.85rem'
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
              background: liveMetrics.networkLoad < 90 ? '#10B981' : '#EF4444',
              animation: 'pulse 2s infinite'
            }} />
            <span style={{ color: '#A8B2D1' }}>
              <span style={{ color: liveMetrics.networkLoad < 90 ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>
                Network Load:
              </span> {liveMetrics.networkLoad.toFixed(1)}%
            </span>
          </div>
          
          <div style={{ color: '#A8B2D1' }}>
            <span style={{ color: '#FFD700', fontWeight: 'bold' }}>Market Cap:</span> {formatNumber(liveMetrics.totalMarketCap, '$')}
          </div>
          
          <div style={{
            background: 'rgba(0, 217, 255, 0.1)',
            border: '1px solid rgba(0, 217, 255, 0.3)',
            borderRadius: '8px',
            padding: '0.25rem 0.75rem',
            color: '#00D9FF',
            fontWeight: 'bold',
            fontSize: '0.8rem'
          }}>
            🎯 {totalTokens} TOKENS TRACKED
          </div>
        </div>
      </div>

      {/* Data Stream Visualization */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '2px',
        background: 'linear-gradient(90deg, transparent, #00D9FF, #8B5CF6, #10B981, transparent)',
        animation: 'dataFlow 4s linear infinite'
      }} />

      <style>{`
        @keyframes holographicShift {
          0%, 100% { 
            background-position: 0% 50%, 100% 50%, 0% 50%; 
            opacity: 0.8;
          }
          50% { 
            background-position: 100% 50%, 0% 50%, 100% 50%; 
            opacity: 1;
          }
        }
        
        @keyframes gridScan {
          0% { transform: translateX(-20px) translateY(-20px); }
          100% { transform: translateX(20px) translateY(20px); }
        }
        
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        
        @keyframes whaleAlert {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }
        
        @keyframes dangerPulse {
          0%, 100% { 
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.3);
          }
          50% { 
            background: rgba(239, 68, 68, 0.3);
            border-color: rgba(239, 68, 68, 0.6);
          }
        }
        
        @keyframes moonGlow {
          0%, 100% { 
            text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
            transform: scale(1);
          }
          50% { 
            text-shadow: 0 0 15px rgba(255, 255, 255, 0.8);
            transform: scale(1.1);
          }
        }
        
        @keyframes dataFlow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default StatusBar; 