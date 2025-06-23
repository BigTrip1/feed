import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import TokenModal from './TokenModal';
import { Token } from '../types/token';
import { useTokenAPI } from '../hooks/useTokenAPI';
import { useWebSocket } from '../hooks/useWebSocket';
import TokenFeed from './TokenFeed';

interface Activity {
  id: string;
  type: 'feature' | 'pump' | 'whale' | 'moon_mission' | 'degen_play' | 'insider_buy' | 'community_takeover' | 'rug_pull' | 'new_listing' | 'alert';
  token: string;
  message: string;
  timestamp: string;
  priority: 'legendary' | 'critical' | 'high' | 'medium' | 'low';
  riskLevel: 'SAFE' | 'MEDIUM' | 'HIGH' | 'DEGEN' | 'SUICIDE';
  sentiment: 'euphoric' | 'bullish' | 'bearish' | 'panic';
  marketCap: string;
  volume?: string;
  multiplier?: string;
  alphaScore?: number;
  isNew?: boolean;
}

const ActivityFeed: React.FC = () => {
  const { tokens, loading, error } = useTokenAPI({
    search: '',
    category: '',
    minMarketCap: 0,
    maxMarketCap: 0,
    sortBy: 'alphaScore',
    sortOrder: 'desc'
  });
  
  const { connectionState } = useWebSocket('ws://localhost:8080');
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLive] = useState(true);
  const [notifications, setNotifications] = useState(436);
  const [filter, setFilter] = useState<'all' | 'pumps' | 'whales' | 'alpha'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedStats, setFeedStats] = useState({
    totalSignals: 0,
    alphaSignals: 0,
    whaleMovements: 0,
    rugPulls: 0,
    moonshots: 0,
    totalVolume: 0,
    avgAlphaScore: 0
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const tokenPool = [
    'BONK', 'PEPE', 'WIF', 'SAMO', 'ATLAS', 'STEP', 'NINJA', 'CHEEMS', 'PONKE', 'MYRO',
    'POPCAT', 'MEW', 'SLERF', 'BOME', 'SMOG', 'WEN', 'JUPITER', 'RENDER', 'PYTH', 'JITO'
  ];

  const generateActivity = useCallback((): Activity => {
    const token = tokenPool[Math.floor(Math.random() * tokenPool.length)];
    const activityTypes = [
      'feature', 'pump', 'whale', 'moon_mission', 'degen_play', 
      'insider_buy', 'community_takeover', 'rug_pull', 'new_listing', 'alert'
    ];
    const type = activityTypes[Math.floor(Math.random() * activityTypes.length)] as Activity['type'];
    
    const priorities: Activity['priority'][] = ['legendary', 'critical', 'high', 'medium', 'low'];
    const riskLevels: Activity['riskLevel'][] = ['SAFE', 'MEDIUM', 'HIGH', 'DEGEN', 'SUICIDE'];
    const sentiments: Activity['sentiment'][] = ['euphoric', 'bullish', 'bearish', 'panic'];
    
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    
    const marketCapValue = Math.floor(Math.random() * 50000000) + 100000;
    const volumeValue = Math.floor(Math.random() * 5000000) + 50000;
    
    const messages = {
      feature: `community is taking over 💪`,
      pump: `broke all resistance levels ${(Math.random() * 45 + 5).toFixed(1)}x`,
      whale: `rug pull alert detected 🚨`,
      moon_mission: `is going parabolic! 🚀`,
      degen_play: `volume spike detected +${Math.floor(Math.random() * 500 + 100)}%`,
      insider_buy: `whale accumulation pattern forming`,
      community_takeover: `trending #1 on DexScreener`,
      rug_pull: `liquidity pulled - AVOID!`,
      new_listing: `just launched on Raydium`,
      alert: `technical breakout confirmed`
    };

    const now = new Date();
    const timestamp = now.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return {
      id: `${Date.now()}-${Math.random()}`,
      type,
      token,
      message: messages[type],
      timestamp,
      priority,
      riskLevel,
      sentiment,
      marketCap: `MC: $${(marketCapValue / 1000000).toFixed(1)}M`,
      volume: `Vol: $${(volumeValue / 1000).toFixed(0)}K`,
      multiplier: type === 'pump' || type === 'moon_mission' ? `${(Math.random() * 45 + 5).toFixed(1)}x` : undefined,
      alphaScore: Math.floor(Math.random() * 40 + 60),
      isNew: true
    };
  }, [tokenPool]);

  const playSound = useCallback((activity: Activity) => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      const frequencies = {
        feature: 800,
        pump: 1000,
        whale: 600,
        moon_mission: 1200,
        degen_play: 900,
        insider_buy: 700,
        community_takeover: 1100,
        rug_pull: 400,
        new_listing: 850,
        alert: 950
      };
      
      const priorityMultiplier = {
        legendary: 1.5,
        critical: 1.3,
        high: 1.1,
        medium: 1.0,
        low: 0.8
      };
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(
        frequencies[activity.type] * priorityMultiplier[activity.priority], 
        audioContext.currentTime
      );
      oscillator.type = activity.priority === 'legendary' ? 'sawtooth' : 'sine';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Audio not supported');
    }
  }, [soundEnabled]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      
      setActivities(prev => {
        const updated = [newActivity, ...prev.slice(0, 49)];
        return updated;
      });
      
      setNotifications(prev => prev + 1);
      
      playSound(newActivity);
      
      setTimeout(() => {
        setActivities(prev => 
          prev.map(activity => 
            activity.id === newActivity.id 
              ? { ...activity, isNew: false }
              : activity
          )
        );
      }, 3000);
      
    }, Math.random() * 3000 + 2000);

    return () => clearInterval(interval);
  }, [generateActivity, playSound]);

  useEffect(() => {
    if (tokens.length > 0) {
      const stats = tokens.reduce((acc, token) => {
        acc.totalSignals += 1;
        if (token.alphaScore >= 80) acc.alphaSignals += 1;
        if (token.category === 'Alpha Hunters') acc.whaleMovements += 1;
        if (token.riskLevel === 'suicide') acc.rugPulls += 1;
        if ((token.performanceChange || 0) > 50) acc.moonshots += 1;
        acc.totalVolume += token.volume || 0;
        acc.avgAlphaScore += token.alphaScore;
        return acc;
      }, {
        totalSignals: 0,
        alphaSignals: 0,
        whaleMovements: 0,
        rugPulls: 0,
        moonshots: 0,
        totalVolume: 0,
        avgAlphaScore: 0
      });

      stats.avgAlphaScore = stats.avgAlphaScore / tokens.length;
      setFeedStats(stats);
    }
  }, [tokens]);

  const getActivityIcon = (type: string) => {
    const icons = {
      feature: '⭐',
      pump: '🚀',
      whale: '🐋',
      moon_mission: '🌙',
      degen_play: '🎲',
      insider_buy: '💎',
      community_takeover: '👥',
      rug_pull: '⚠️',
      new_listing: '🆕',
      alert: '🔔'
    };
    return icons[type as keyof typeof icons] || '📈';
  };

  const getActivityColor = (type: string, priority: string, riskLevel: string) => {
    if (priority === 'legendary') return '#F59E0B';
    if (priority === 'critical') return '#EF4444';
    if (riskLevel === 'SUICIDE') return '#DC2626';
    if (riskLevel === 'DEGEN') return '#F59E0B';
    
    const colors = {
      feature: '#8B5CF6',
      pump: '#10B981',
      whale: '#3B82F6',
      moon_mission: '#F59E0B',
      degen_play: '#EF4444',
      insider_buy: '#10B981',
      community_takeover: '#8B5CF6',
      rug_pull: '#DC2626',
      new_listing: '#06B6D4',
      alert: '#F59E0B'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  const getSentimentEmoji = (sentiment: string) => {
    const emojis = {
      euphoric: '🚀',
      bullish: '📈',
      bearish: '📉',
      panic: '😱'
    };
    return emojis[sentiment as keyof typeof emojis] || '📊';
  };

  const getRiskBadge = (riskLevel: string) => {
    const badges = {
      SAFE: { emoji: '🛡️', text: 'SAFE', color: '#10B981' },
      MEDIUM: { emoji: '⚖️', text: 'MEDIUM', color: '#F59E0B' },
      HIGH: { emoji: '🔥', text: 'HIGH', color: '#EF4444' },
      DEGEN: { emoji: '⚡', text: 'DEGEN', color: '#8B5CF6' },
      SUICIDE: { emoji: '💀', text: 'SUICIDE', color: '#DC2626' }
    };
    return badges[riskLevel as keyof typeof badges] || badges.MEDIUM;
  };

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      if (filter === 'all') return true;
      if (filter === 'pumps') return activity.type === 'pump' || activity.type === 'moon_mission';
      if (filter === 'whales') return activity.type === 'whale' || activity.type === 'insider_buy';
      if (filter === 'alpha') return (activity.alphaScore || 0) >= 80;
      return true;
    });
  }, [activities, filter]);

  const handleTokenClick = (token: Token) => {
    setSelectedToken(token);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedToken(null), 300);
  };

  if (loading && tokens.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, rgba(11, 11, 15, 1) 0%, rgba(18, 18, 26, 0.98) 50%, rgba(26, 26, 37, 1) 100%)',
        color: '#E5E7EB',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(0, 217, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
          `,
          animation: 'loadingPulse 4s ease-in-out infinite'
        }} />

        <div style={{
          width: '120px',
          height: '120px',
          border: '3px solid rgba(0, 217, 255, 0.2)',
          borderTop: '3px solid #00D9FF',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '2rem'
          }}>
            📡
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          zIndex: 2
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 0 1rem 0',
            background: 'linear-gradient(135deg, #00D9FF, #8B5CF6, #10B981)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'textShimmer 2s ease-in-out infinite'
          }}>
            Initializing Alpha Feed
          </h2>
          <p style={{
            color: '#A8B2D1',
            fontSize: '1.1rem',
            margin: 0,
            animation: 'fade 2s ease-in-out infinite alternate'
          }}>
            Scanning the blockchain for alpha signals...
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '2rem'
        }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#00D9FF',
                animation: `bounce 1.4s ease-in-out infinite ${i * 0.16}s`
              }}
            />
          ))}
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes loadingPulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
          
          @keyframes textShimmer {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes fade {
            0% { opacity: 0.6; }
            100% { opacity: 1; }
          }
          
          @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, rgba(11, 11, 15, 1) 0%, rgba(18, 18, 26, 0.98) 50%, rgba(26, 26, 37, 1) 100%)',
        color: '#E5E7EB',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          fontSize: '4rem',
          marginBottom: '1rem',
          animation: 'errorPulse 2s ease-in-out infinite'
        }}>
          🚨
        </div>
        <h2 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          margin: '0 0 1rem 0',
          color: '#EF4444'
        }}>
          Connection Error
        </h2>
        <p style={{
          color: '#A8B2D1',
          fontSize: '1.1rem',
          margin: '0 0 2rem 0',
          maxWidth: '500px'
        }}>
          Unable to connect to the alpha feed. Please check your connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem 2rem',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(239, 68, 68, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.3)';
          }}
        >
          🔄 Retry Connection
        </button>

        <style>{`
          @keyframes errorPulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '1rem',
        zIndex: 10,
        flexWrap: 'wrap',
        justifyContent: 'flex-end'
      }}>
        {[
          { label: 'Alpha', value: feedStats.alphaSignals, color: '#FFD700', icon: '⚡' },
          { label: 'Whales', value: feedStats.whaleMovements, color: '#8B5CF6', icon: '🐋' },
          { label: 'Moons', value: feedStats.moonshots, color: '#10B981', icon: '🌙' },
          { label: 'Rugs', value: feedStats.rugPulls, color: '#EF4444', icon: '⚠️' }
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${stat.color}30`,
              borderRadius: '12px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: '80px',
              animation: `statPulse 3s ease-in-out infinite ${index * 0.5}s`
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{stat.icon}</span>
            <div>
              <div style={{
                color: stat.color,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                fontFamily: 'monospace'
              }}>
                {stat.value}
              </div>
              <div style={{
                color: '#A8B2D1',
                fontSize: '0.7rem',
                textTransform: 'uppercase'
              }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${connectionState === 'Open' ? '#10B981' : '#EF4444'}30`,
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        zIndex: 10
      }}>
        <div style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          background: connectionState === 'Open' ? '#10B981' : '#EF4444',
          animation: 'pulse 2s infinite',
          boxShadow: `0 0 12px ${connectionState === 'Open' ? '#10B981' : '#EF4444'}`
        }} />
        <div>
          <div style={{
            color: connectionState === 'Open' ? '#10B981' : '#EF4444',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            {connectionState === 'Open' ? 'CONNECTED' : 'DISCONNECTED'}
          </div>
          <div style={{
            color: '#A8B2D1',
            fontSize: '0.7rem'
          }}>
            WebSocket
          </div>
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 215, 0, 0.3)',
        borderRadius: '20px',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        zIndex: 10
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: `conic-gradient(#FFD700 ${feedStats.avgAlphaScore * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'rgba(18, 18, 26, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFD700',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            α
          </div>
        </div>
        <div>
          <div style={{
            color: '#FFD700',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}>
            {feedStats.avgAlphaScore.toFixed(1)}
          </div>
          <div style={{
            color: '#A8B2D1',
            fontSize: '0.9rem',
            textTransform: 'uppercase'
          }}>
            Avg Alpha Score
          </div>
        </div>
      </div>

      {/* Main Token Feed Container */}
      <div style={{
        flex: 1,
        marginTop: '100px',
        marginBottom: '140px',
        padding: '0 20px',
        position: 'relative',
        zIndex: 1
      }}>
        <TokenFeed 
          tokens={tokens} 
          loading={loading}
          error={error}
          autoScroll={true}
          onTokenClick={handleTokenClick}
        />
      </div>

      <style>{`
        @keyframes statPulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
      `}</style>

      <TokenModal
        token={selectedToken}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ActivityFeed; 