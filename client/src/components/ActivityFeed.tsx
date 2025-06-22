import React, { useState, useEffect, useCallback, useMemo } from 'react';
import TokenModal from './TokenModal';
import { Token } from '../types/token';

interface Activity {
  id: string;
  type: 'feature' | 'pump' | 'alert' | 'whale' | 'new_listing' | 'rug_pull' | 'moon_mission' | 'degen_play' | 'insider_buy' | 'community_takeover';
  token: string;
  message: string;
  marketCap: string;
  timestamp: string;
  multiplier?: string;
  volume?: string;
  sentiment?: 'bullish' | 'bearish' | 'neutral' | 'euphoric' | 'panic';
  priority?: 'high' | 'medium' | 'low' | 'critical' | 'legendary';
  isNew?: boolean;
  riskLevel?: 'safe' | 'medium' | 'high' | 'degen' | 'suicide';
  alphaScore?: number;
}

const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLive] = useState(true);
  const [notifications, setNotifications] = useState(436);
  const [filter, setFilter] = useState<'all' | 'pumps' | 'features' | 'whales' | 'alpha'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Enhanced token pool with more variety and creativity
  const tokenPool = useMemo(() => [
    { symbol: 'BONK', color: '#FF6B35', category: 'meme', risk: 'medium' },
    { symbol: 'PEPE', color: '#22C55E', category: 'meme', risk: 'high' },
    { symbol: 'WIF', color: '#9945FF', category: 'meme', risk: 'degen' },
    { symbol: 'RAY', color: '#14F195', category: 'defi', risk: 'safe' },
    { symbol: 'JUP', color: '#FFD700', category: 'defi', risk: 'safe' },
    { symbol: 'ORCA', color: '#FF1493', category: 'defi', risk: 'medium' },
    { symbol: 'COPE', color: '#FF69B4', category: 'meme', risk: 'suicide' },
    { symbol: 'FIDA', color: '#8A2BE2', category: 'defi', risk: 'medium' },
    { symbol: 'SAMO', color: '#00CED1', category: 'meme', risk: 'high' },
    { symbol: 'ATLAS', color: '#FFA500', category: 'gaming', risk: 'degen' },
    { symbol: 'STEP', color: '#32CD32', category: 'fitness', risk: 'medium' },
    { symbol: 'NINJA', color: '#800080', category: 'meme', risk: 'suicide' },
    { symbol: 'CHEEMS', color: '#FFB6C1', category: 'meme', risk: 'degen' },
    { symbol: 'PONKE', color: '#FF4500', category: 'meme', risk: 'suicide' }
  ], []);

  const activityTypes = useMemo(() => [
    { 
      type: 'pump', 
      messages: [
        'just went parabolic {}x 🚀',
        'broke all resistance levels {}x',
        'diamond hands paid off {}x',
        'to the moon and beyond {}x',
        'absolutely ripping {}x'
      ]
    },
    { 
      type: 'whale', 
      messages: [
        'whale just aped in with ${}K 🐋',
        'smart money accumulated ${}K',
        'institutional buyer loaded ${}K',
        'mysterious wallet bought ${}K',
        'diamond whale entered with ${}K'
      ]
    },
    { 
      type: 'moon_mission', 
      messages: [
        'initiated moon mission sequence 🌙',
        'rockets are fueled and ready 🚀',
        'preparing for orbital launch',
        'mission control activated',
        'countdown to alpha begins'
      ]
    },
    { 
      type: 'degen_play', 
      messages: [
        'pure degen energy detected ⚡',
        'maximum risk, maximum reward',
        'degens are going all-in',
        'YOLO mode activated',
        'sending it to Valhalla'
      ]
    },
    { 
      type: 'insider_buy', 
      messages: [
        'insider activity detected 👀',
        'someone knows something...',
        'unusual whale movements',
        'smart money is positioning',
        'alpha leak confirmed'
      ]
    },
    { 
      type: 'community_takeover', 
      messages: [
        'community is taking over 💪',
        'holders united for pump',
        'diamond hands coalition formed',
        'community-driven moon mission',
        'the people have spoken'
      ]
    },
    { 
      type: 'rug_pull', 
      messages: [
        'rug pull alert detected 🚨',
        'liquidity vanishing fast',
        'exit scam in progress',
        'developers have left chat',
        'another one bites the dust'
      ]
    },
    { 
      type: 'feature', 
      messages: [
                 'featured in Alpha Hunters 🎯',
         'trending on Degen Radar',
         'spotted by Moon Scouts',
         'added to Diamond Watch List',
         'flagged by Alpha Detectors'
      ]
    },
    { 
      type: 'new_listing', 
      messages: [
        'fresh listing on Raydium ✨',
        'new gem just dropped',
        'virgin token detected',
        'ground floor opportunity',
        'early bird special activated'
      ]
    },
    { 
      type: 'alert', 
      messages: [
        'volume explosion detected 💥',
        'price action going crazy',
        'something big is happening',
        'unusual activity patterns',
        'all systems are go'
      ]
    }
  ], []);

  // Play enhanced sound effects
  const playSound = useCallback((type: string, priority?: string) => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Enhanced frequencies for different activity types
      const frequencies: { [key: string]: number } = {
        'pump': 1000,
        'whale': 600,
        'moon_mission': 1200,
        'degen_play': 800,
        'insider_buy': 400,
        'community_takeover': 900,
        'rug_pull': 200,
        'feature': 500,
        'new_listing': 700,
        'alert': 1100
      };
      
      const baseFreq = frequencies[type] || 500;
      const finalFreq = priority === 'critical' || priority === 'legendary' ? baseFreq * 1.5 : baseFreq;
      
      oscillator.frequency.setValueAtTime(finalFreq, audioContext.currentTime);
      oscillator.type = priority === 'legendary' ? 'sawtooth' : 'sine';
      
      const volume = priority === 'legendary' ? 0.15 : priority === 'critical' ? 0.12 : 0.08;
      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Audio context not available');
    }
  }, [soundEnabled]);

  // Handle token click
  const handleTokenClick = useCallback((activity: Activity) => {
    const token: Token = {
      id: activity.id,
      symbol: activity.token,
      description: activity.message,
      marketCap: parseFloat(activity.marketCap.replace(/[$,]/g, '')) * 1000,
      volume: parseFloat(activity.volume?.replace(/[$,]/g, '') || '0') * 1000,
      alphaScore: activity.alphaScore || 50,
      riskLevel: activity.riskLevel || 'medium'
    };
    setSelectedToken(token);
    setIsModalOpen(true);
  }, []);

  // Generate super creative activities
  const generateActivity = useCallback((): Activity => {
    const token = tokenPool[Math.floor(Math.random() * tokenPool.length)];
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const marketCapValue = Math.random() * 50000 + 100;
    const volumeValue = Math.random() * 25000 + 50;
    const alphaScore = Math.floor(Math.random() * 100) + 1;
    
    let message = activityType.messages[Math.floor(Math.random() * activityType.messages.length)];
    let multiplier = '';
    let priority: Activity['priority'] = 'low';
    let sentiment: Activity['sentiment'] = 'neutral';
    
    // Generate specific data based on activity type
    if (activityType.type === 'pump') {
      const mult = (Math.random() * 50 + 2).toFixed(1);
      message = message.replace('{}', mult);
      multiplier = `${mult}x`;
      priority = parseFloat(mult) > 20 ? 'legendary' : parseFloat(mult) > 10 ? 'critical' : 'high';
      sentiment = 'euphoric';
    } else if (activityType.type === 'whale') {
      const amount = (Math.random() * 2000 + 100).toFixed(0);
      message = message.replace('{}', amount);
      priority = parseInt(amount) > 1000 ? 'critical' : parseInt(amount) > 500 ? 'high' : 'medium';
      sentiment = 'bullish';
    } else if (activityType.type === 'rug_pull') {
      priority = 'critical';
      sentiment = 'panic';
    } else if (activityType.type === 'moon_mission' || activityType.type === 'degen_play') {
      priority = Math.random() > 0.7 ? 'legendary' : 'high';
      sentiment = 'euphoric';
    } else if (activityType.type === 'insider_buy') {
      priority = 'critical';
      sentiment = 'bullish';
    } else {
      priority = Math.random() > 0.8 ? 'high' : Math.random() > 0.5 ? 'medium' : 'low';
      sentiment = Math.random() > 0.6 ? 'bullish' : Math.random() > 0.3 ? 'neutral' : 'bearish';
    }
    
    return {
      id: Date.now().toString() + Math.random(),
      type: activityType.type as Activity['type'],
      token: `$${token.symbol}`,
      message,
      marketCap: `MC: $${marketCapValue.toFixed(1)}K`,
      volume: `Vol: $${volumeValue.toFixed(1)}K`,
      timestamp: 'now',
      multiplier,
      sentiment,
      priority,
      riskLevel: token.risk as Activity['riskLevel'],
      alphaScore,
      isNew: true
    };
  }, [tokenPool, activityTypes]);

  useEffect(() => {
    // Initial legendary activities
    const initialActivities: Activity[] = [
      {
        id: '1', type: 'pump', token: '$BONK', message: 'just went parabolic 12.5x 🚀',
        marketCap: 'MC: $583.9K', volume: 'Vol: $1.2M', timestamp: '1m', 
        multiplier: '12.5x', sentiment: 'euphoric', priority: 'critical', 
        riskLevel: 'medium', alphaScore: 95
      },
      {
        id: '2', type: 'whale', token: '$PEPE', message: 'whale just aped in with $850K 🐋',
        marketCap: 'MC: $426.7K', volume: 'Vol: $892.1K', timestamp: '2m', 
        sentiment: 'bullish', priority: 'critical', riskLevel: 'high', alphaScore: 88
      },
      {
        id: '3', type: 'moon_mission', token: '$WIF', message: 'initiated moon mission sequence 🌙',
        marketCap: 'MC: $1.2M', volume: 'Vol: $445.2K', timestamp: '3m', 
        sentiment: 'euphoric', priority: 'legendary', riskLevel: 'degen', alphaScore: 92
      }
    ];

    setActivities(initialActivities);
    
    // Add new activities with creative timing
    const interval = setInterval(() => {
      const newActivity = generateActivity();
      playSound(newActivity.type, newActivity.priority);
      
      setActivities(prev => {
        const updated = [newActivity, ...prev.slice(0, 14)]; // Keep max 15 activities
        return updated.map((activity, index) => ({
          ...activity,
          isNew: index === 0
        }));
      });
      
      setNotifications(prev => prev + 1);
    }, Math.random() * 6000 + 3000); // Random interval between 3-9 seconds

    return () => clearInterval(interval);
  }, [generateActivity, playSound]);

  const getActivityIcon = (type: string) => {
    const icons = {
      'feature': '🎯',
      'pump': '🚀',
      'whale': '🐋',
      'new_listing': '✨',
      'alert': '⚠️',
      'moon_mission': '🌙',
      'degen_play': '⚡',
      'insider_buy': '👀',
      'community_takeover': '💪',
      'rug_pull': '🚨'
    };
    return icons[type as keyof typeof icons] || '📊';
  };

  const getActivityColor = (type: string, priority?: string, riskLevel?: string) => {
    const baseColors = {
      'feature': '#8B5CF6',
      'pump': '#10B981',
      'whale': '#F59E0B',
      'new_listing': '#3B82F6',
      'alert': '#F59E0B',
      'moon_mission': '#00D9FF',
      'degen_play': '#EF4444',
      'insider_buy': '#8B5CF6',
      'community_takeover': '#10B981',
      'rug_pull': '#EF4444'
    };
    
    let color = baseColors[type as keyof typeof baseColors] || '#00D9FF';
    
    // Enhance color based on priority
    if (priority === 'legendary') {
      color = '#F59E0B'; // Amber for legendary
    } else if (priority === 'critical') {
      color = '#EF4444'; // Red for critical
    } else if (riskLevel === 'suicide') {
      color = '#EF4444'; // Red for high risk
    }
    
    return color;
  };

  const getSentimentEmoji = (sentiment?: string) => {
    switch (sentiment) {
      case 'euphoric': return '🚀';
      case 'bullish': return '📈';
      case 'bearish': return '📉';
      case 'panic': return '😱';
      default: return '➡️';
    }
  };

  const getRiskBadge = (riskLevel?: string) => {
    const badges = {
      'safe': { emoji: '🛡️', color: '#10B981', text: 'SAFE' },
      'medium': { emoji: '⚖️', color: '#F59E0B', text: 'MED' },
      'high': { emoji: '🔥', color: '#F59E0B', text: 'HIGH' },
      'degen': { emoji: '⚡', color: '#EF4444', text: 'DEGEN' },
      'suicide': { emoji: '💀', color: '#EF4444', text: 'SUICIDE' }
    };
    return badges[riskLevel as keyof typeof badges] || badges.medium;
  };

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    if (filter === 'pumps') return activity.type === 'pump' || activity.type === 'moon_mission';
    if (filter === 'features') return activity.type === 'feature';
    if (filter === 'whales') return activity.type === 'whale' || activity.type === 'insider_buy';
    if (filter === 'alpha') return (activity.alphaScore || 0) >= 80;
    return true;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0B0B0F 0%, #12121A 50%, #1A1A25 100%)',
      color: '#FFFFFF',
      padding: '2rem',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      width: '100%'
    }}>
      {/* Enhanced animated background */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(0, 217, 255, 0.06) 0%, transparent 70%),
          radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 70%),
          radial-gradient(circle at 40% 80%, rgba(245, 158, 11, 0.04) 0%, transparent 70%),
          radial-gradient(circle at 60% 30%, rgba(16, 185, 129, 0.03) 0%, transparent 70%)
        `,
        animation: 'pulse 6s ease-in-out infinite alternate',
        pointerEvents: 'none'
      }}></div>

      {/* Enhanced header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '2rem',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          background: 'rgba(18, 18, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '1.5rem 3rem',
          borderRadius: '12px',
          border: '1px solid rgba(0, 217, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.1)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #00D9FF, #8B5CF6)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            boxShadow: '0 4px 20px rgba(0, 217, 255, 0.4)',
            animation: 'pulse 3s infinite'
          }}>
            📡
          </div>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            margin: 0,
            background: 'linear-gradient(135deg, #FFFFFF, #00D9FF, #8B5CF6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Feed.moi
          </h1>
        </div>
      </div>

      {/* Enhanced subtitle */}
      <p style={{
        textAlign: 'center',
        color: '#A8B2D1',
        marginBottom: '3rem',
        fontSize: '1.2rem',
        position: 'relative',
        zIndex: 2,
        fontWeight: '500'
      }}>
        🚀 The Ultimate Alpha Feed - Where Legends Are Born
      </p>

      {/* Enhanced controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(18, 18, 26, 0.98)',
          backdropFilter: 'blur(20px)',
          padding: '1rem 2rem',
          borderRadius: '10px',
          border: '1px solid rgba(0, 217, 255, 0.15)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: isLive ? '#00D9FF' : '#6B7280',
            boxShadow: isLive ? '0 0 12px rgba(0, 217, 255, 0.6)' : 'none',
            animation: isLive ? 'pulse 2s infinite' : 'none'
          }}></div>
          <span style={{ fontSize: '1rem', fontWeight: '600' }}>Live Feed</span>
          <span style={{
            background: 'linear-gradient(135deg, #00D9FF, #8B5CF6)',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            fontWeight: 'bold'
          }}>
            {notifications} signals
          </span>
        </div>

        {/* Enhanced filter buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { key: 'all', label: '🌟 All', count: filteredActivities.length },
            { key: 'pumps', label: '🚀 Pumps', count: activities.filter(a => a.type === 'pump' || a.type === 'moon_mission').length },
            { key: 'whales', label: '🐋 Whales', count: activities.filter(a => a.type === 'whale' || a.type === 'insider_buy').length },
            { key: 'alpha', label: '⚡ Alpha', count: activities.filter(a => (a.alphaScore || 0) >= 80).length }
          ].map(filterOption => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key as any)}
              style={{
                background: filter === filterOption.key 
                  ? 'linear-gradient(135deg, #00D9FF, #8B5CF6)' 
                  : 'rgba(18, 18, 26, 0.9)',
                border: filter === filterOption.key ? 'none' : '1px solid rgba(0, 217, 255, 0.15)',
                color: filter === filterOption.key ? '#FFFFFF' : '#A8B2D1',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: filter === filterOption.key ? '0 4px 20px rgba(0, 217, 255, 0.3)' : 'none'
              }}
            >
              {filterOption.label} ({filterOption.count})
            </button>
          ))}
        </div>

        {/* Enhanced sound toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            background: soundEnabled ? 'rgba(0, 217, 255, 0.2)' : 'rgba(107, 114, 128, 0.3)',
            border: `2px solid ${soundEnabled ? '#00D9FF' : '#6B7280'}`,
            color: soundEnabled ? '#00D9FF' : '#6B7280',
            padding: '1rem',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            boxShadow: soundEnabled ? '0 0 20px rgba(0, 217, 255, 0.4)' : 'none'
          }}
        >
          {soundEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Enhanced True Alpha Feed */}
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '2rem',
          fontSize: '2rem',
          fontWeight: 'bold'
        }}>
          ⚡ True Alpha Feed
          <span style={{
            fontSize: '1rem',
            color: '#B8B8B8',
            fontWeight: 'normal'
          }}>
            Showing {filteredActivities.length} alpha signals
          </span>
        </div>

        <div style={{
          background: 'rgba(18, 18, 26, 0.98)',
          backdropFilter: 'blur(20px)',
          borderRadius: '12px',
          border: '1px solid rgba(0, 217, 255, 0.15)',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}>
          {filteredActivities.map((activity, index) => {
            const riskBadge = getRiskBadge(activity.riskLevel);
            return (
              <div
                key={activity.id}
                onClick={() => handleTokenClick(activity)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '2rem',
                  borderBottom: index < filteredActivities.length - 1 ? '1px solid rgba(31, 41, 55, 0.6)' : 'none',
                  background: activity.isNew 
                    ? 'linear-gradient(90deg, rgba(0, 217, 255, 0.08), transparent)'
                    : activity.priority === 'legendary' 
                    ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.06), transparent)'
                    : activity.priority === 'critical'
                    ? 'rgba(239, 68, 68, 0.06)'
                    : 'transparent',
                  transition: 'all 0.5s ease',
                  animation: activity.isNew ? 'slideIn 0.6s ease-out' : 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = activity.priority === 'legendary' 
                    ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.12), transparent)'
                    : 'rgba(0, 217, 255, 0.06)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 217, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = activity.isNew 
                    ? 'linear-gradient(90deg, rgba(0, 217, 255, 0.08), transparent)'
                    : activity.priority === 'legendary' 
                    ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.06), transparent)'
                    : activity.priority === 'critical'
                    ? 'rgba(239, 68, 68, 0.06)'
                    : 'transparent';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Enhanced priority indicator */}
                {(activity.priority === 'legendary' || activity.priority === 'critical') && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '6px',
                    background: activity.priority === 'legendary' 
                      ? 'linear-gradient(180deg, #FFD700, #FF6B00)'
                      : 'linear-gradient(180deg, #FF0080, #FF073A)',
                    boxShadow: activity.priority === 'legendary'
                      ? '0 0 15px rgba(255, 215, 0, 0.7)'
                      : '0 0 15px rgba(255, 0, 128, 0.7)'
                  }}></div>
                )}

                {/* Super enhanced icon */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${getActivityColor(activity.type, activity.priority, activity.riskLevel)}, ${getActivityColor(activity.type, activity.priority, activity.riskLevel)}80)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  flexShrink: 0,
                  boxShadow: `0 6px 20px ${getActivityColor(activity.type, activity.priority, activity.riskLevel)}50`,
                  position: 'relative',
                  animation: activity.priority === 'legendary' ? 'pulse 2s infinite' : 'none'
                }}>
                  {getActivityIcon(activity.type)}
                  {activity.isNew && (
                    <div style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px',
                      width: '12px',
                      height: '12px',
                      background: '#39FF14',
                      borderRadius: '50%',
                      animation: 'neonPulse 1s infinite',
                      boxShadow: '0 0 15px #39FF14, 0 0 30px rgba(57, 255, 20, 0.3)'
                    }}></div>
                  )}
                </div>

                {/* Enhanced content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '1.1rem',
                    marginBottom: '0.75rem',
                    lineHeight: '1.4',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{
                      color: getActivityColor(activity.type, activity.priority, activity.riskLevel),
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      fontSize: '1.2rem'
                    }}>
                      {activity.token}
                    </span>
                    <span style={{ color: '#E8F4FD', fontSize: '1rem' }}>
                      {activity.message}
                    </span>
                    <span style={{ fontSize: '1rem' }}>
                      {getSentimentEmoji(activity.sentiment)}
                    </span>
                    
                    {/* Risk badge */}
                    <span style={{
                      background: riskBadge.color + '20',
                      color: riskBadge.color,
                      border: `1px solid ${riskBadge.color}`,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {riskBadge.emoji} {riskBadge.text}
                    </span>
                    
                    {/* Alpha score */}
                    {activity.alphaScore && (
                      <span style={{
                        background: activity.alphaScore >= 90 
                          ? 'linear-gradient(135deg, #F59E0B, #D97706)'
                          : activity.alphaScore >= 80 
                          ? 'linear-gradient(135deg, #10B981, #059669)'
                          : 'linear-gradient(135deg, #8B5CF6, #3B82F6)',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        α{activity.alphaScore}
                    </span>
                    )}
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    gap: '1.5rem',
                    fontSize: '0.875rem',
                    color: '#A8B2D1'
                  }}>
                    <span>{activity.marketCap}</span>
                    {activity.volume && <span>{activity.volume}</span>}
                  </div>
                  
                  {activity.multiplier && (
                    <div style={{
                      fontSize: '1.8rem',
                      color: '#10B981',
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      marginTop: '0.5rem',
                      textShadow: '0 0 10px rgba(16, 185, 129, 0.6)',
                      animation: 'greenPulse 1.5s infinite'
                    }}>
                      {activity.multiplier}
                    </div>
                  )}
                </div>

                {/* Enhanced timestamp and priority */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    fontFamily: 'monospace',
                    flexShrink: 0
                  }}>
                    {activity.timestamp}
                  </div>
                  {activity.priority === 'legendary' && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#F59E0B',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: 'rgba(245, 158, 11, 0.15)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      border: '1px solid #F59E0B',
                      boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)'
                    }}>
                      🏆 LEGENDARY
                    </div>
                  )}
                  {activity.priority === 'critical' && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#EF4444',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      background: 'rgba(239, 68, 68, 0.15)',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      border: '1px solid #EF4444',
                      boxShadow: '0 0 8px rgba(239, 68, 68, 0.3)'
                    }}>
                      🚨 CRITICAL
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideIn {
            from {
              transform: translateX(-100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes greenPulse {
            0%, 100% {
              opacity: 0.9;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.01);
            }
          }
          
          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
                     @keyframes glow {
             0%, 100% {
               box-shadow: 0 0 15px rgba(0, 217, 255, 0.4);
             }
             50% {
               box-shadow: 0 0 25px rgba(0, 217, 255, 0.6);
             }
           }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 0.7;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
          }
        `
      }} />
      
      {/* Token Modal */}
      <TokenModal 
        token={selectedToken}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedToken(null);
        }}
      />
    </div>
  );
};

export default ActivityFeed; 