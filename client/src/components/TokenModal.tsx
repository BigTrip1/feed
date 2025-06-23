import React, { useState, useEffect, useRef } from 'react';
import { Token } from '../types/token';

interface TokenModalProps {
  token: Token | null;
  isOpen: boolean;
  onClose: () => void;
}

const TokenModal: React.FC<TokenModalProps> = ({ token, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [socialSentiment, setSocialSentiment] = useState(0.75);
  const [whaleActivity, setWhaleActivity] = useState(0.65);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate real-time data updates
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setPriceHistory(prev => {
        const newHistory = [...prev.slice(-20), Math.random() * 100 + 50];
        return newHistory;
      });
      setSocialSentiment(0.5 + Math.random() * 0.5);
      setWhaleActivity(Math.random());
    }, 2000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Draw mini chart
  useEffect(() => {
    if (!canvasRef.current || priceHistory.length < 2) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 217, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 217, 255, 0.05)');
    
    ctx.strokeStyle = '#00D9FF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    priceHistory.forEach((price, index) => {
      const x = (index / (priceHistory.length - 1)) * canvas.width;
      const y = canvas.height - (price / 150) * canvas.height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.stroke();
    
    // Fill area under curve
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
  }, [priceHistory]);

  // Early return after all hooks
  if (!isOpen || !token) return null;

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'safe':
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      case 'degen': return '#8B5CF6';
      case 'suicide':
      case 'extreme': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getAlphaScoreColor = (score: number) => {
    if (score >= 90) return '#FFD700';
    if (score >= 80) return '#10B981';
    if (score >= 50) return '#8B5CF6';
    return '#6B7280';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '🧠' },
    { id: 'social', label: 'Social Pulse', icon: '💬' },
    { id: 'trading', label: 'Trading Tools', icon: '⚡' },
    { id: 'security', label: 'Security', icon: '🛡️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Live Price Chart */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(139, 92, 246, 0.05))',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <h3 style={{ color: '#E5E7EB', margin: 0, fontSize: '1.1rem' }}>
                  📈 Live Price Action
                </h3>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10B981',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  +{(Math.random() * 15 + 5).toFixed(2)}%
                </div>
              </div>
              <canvas
                ref={canvasRef}
                width={400}
                height={120}
                style={{ width: '100%', height: '120px' }}
              />
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontSize: '2rem',
                animation: 'pulse 2s infinite'
              }}>
                📊
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              {[
                { label: 'Market Cap', value: `$${(token.marketCap / 1000000).toFixed(1)}M`, color: '#00D9FF', icon: '💰' },
                { label: 'Volume 24h', value: `$${((token.volume || 0) / 1000).toFixed(0)}K`, color: '#8B5CF6', icon: '📊' },
                { label: 'Holders', value: `${Math.floor(Math.random() * 50000 + 10000).toLocaleString()}`, color: '#10B981', icon: '👥' },
                { label: 'Liquidity', value: `$${(Math.random() * 500 + 100).toFixed(0)}K`, color: '#F59E0B', icon: '🌊' }
              ].map((metric, index) => (
                <div key={index} style={{
                  background: `rgba(${metric.color.replace('#', '')}, 0.1)`,
                  border: `1px solid rgba(${metric.color.replace('#', '')}, 0.2)`,
                  borderRadius: '12px',
                  padding: '1rem',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    {metric.icon}
                  </div>
                  <div style={{ color: '#A8B2D1', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    {metric.label}
                  </div>
                  <div style={{ color: metric.color, fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {metric.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* AI Analysis */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(0, 217, 255, 0.05))',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#E5E7EB', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🧠 AI-Powered Analysis
                <div style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #00D9FF)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '6px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold'
                }}>
                  BETA
                </div>
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem'
              }}>
                {[
                  { label: 'Momentum Score', value: 87, color: '#10B981' },
                  { label: 'Volatility Index', value: 65, color: '#F59E0B' },
                  { label: 'Support Level', value: 92, color: '#00D9FF' },
                  { label: 'Whale Confidence', value: Math.floor(whaleActivity * 100), color: '#8B5CF6' }
                ].map((score, index) => (
                  <div key={index} style={{ textAlign: 'center' }}>
                    <div style={{ color: '#A8B2D1', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      {score.label}
                    </div>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: `conic-gradient(${score.color} ${score.value * 3.6}deg, rgba(255,255,255,0.1) 0deg)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      position: 'relative'
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(18, 18, 26, 0.9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: score.color,
                        fontWeight: 'bold'
                      }}>
                        {score.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pattern Recognition */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#E5E7EB', margin: '0 0 1rem 0' }}>
                🔍 Pattern Recognition
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Bull Flag', 'Cup & Handle', 'Ascending Triangle', 'Golden Cross'].map((pattern, index) => (
                  <div key={index} style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    color: '#F59E0B',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    border: '1px solid rgba(245, 158, 11, 0.3)'
                  }}>
                    {pattern}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Social Sentiment */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 217, 255, 0.05))',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#E5E7EB', margin: '0 0 1rem 0' }}>
                💬 Social Sentiment Analysis
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: `conic-gradient(#10B981 ${socialSentiment * 360}deg, rgba(255,255,255,0.1) 0deg)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '90px',
                    height: '90px',
                    borderRadius: '50%',
                    background: 'rgba(18, 18, 26, 0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10B981',
                    fontWeight: 'bold'
                  }}>
                    <div style={{ fontSize: '1.5rem' }}>
                      {(socialSentiment * 100).toFixed(0)}%
                    </div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                      BULLISH
                    </div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { platform: 'Twitter', sentiment: 85, color: '#1DA1F2' },
                      { platform: 'Telegram', sentiment: 92, color: '#0088CC' },
                      { platform: 'Discord', sentiment: 78, color: '#7289DA' },
                      { platform: 'Reddit', sentiment: 88, color: '#FF4500' }
                    ].map((social, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          color: social.color,
                          fontWeight: 'bold',
                          minWidth: '80px',
                          fontSize: '0.9rem'
                        }}>
                          {social.platform}
                        </div>
                        <div style={{
                          flex: 1,
                          height: '8px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${social.sentiment}%`,
                            height: '100%',
                            background: `linear-gradient(90deg, ${social.color}, ${social.color}CC)`,
                            borderRadius: '4px',
                            transition: 'width 1s ease'
                          }} />
                        </div>
                        <div style={{
                          color: social.color,
                          fontWeight: 'bold',
                          fontSize: '0.8rem',
                          minWidth: '40px'
                        }}>
                          {social.sentiment}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Trending Keywords */}
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#E5E7EB', margin: '0 0 1rem 0' }}>
                🔥 Trending Keywords
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['moon', 'diamond hands', 'hodl', 'ape', 'lambo', 'to the moon', 'bullish', 'pump'].map((keyword, index) => (
                  <div key={index} style={{
                    background: `rgba(139, 92, 246, ${0.2 + Math.random() * 0.3})`,
                    color: '#8B5CF6',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    animation: `pulse ${2 + Math.random() * 2}s infinite`
                  }}>
                    #{keyword}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'trading':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Quick Trade Panel */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(139, 92, 246, 0.05))',
              border: '1px solid rgba(0, 217, 255, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#E5E7EB', margin: '0 0 1rem 0' }}>
                ⚡ Lightning Trade
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button style={{
                  background: 'linear-gradient(135deg, #10B981, #059669)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  🚀 Buy ${token.symbol}
                </button>
                <button style={{
                  background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  📉 Sell ${token.symbol}
                </button>
              </div>
            </div>

            {/* Trading Signals */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#E5E7EB', margin: '0 0 1rem 0' }}>
                📡 Trading Signals
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { signal: 'Strong Buy', confidence: 95, color: '#10B981', icon: '🟢' },
                  { signal: 'RSI Oversold', confidence: 78, color: '#00D9FF', icon: '📊' },
                  { signal: 'Volume Spike', confidence: 88, color: '#F59E0B', icon: '📈' },
                  { signal: 'Whale Alert', confidence: 92, color: '#8B5CF6', icon: '🐋' }
                ].map((signal, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem',
                    background: `rgba(${signal.color.replace('#', '')}, 0.1)`,
                    border: `1px solid rgba(${signal.color.replace('#', '')}, 0.2)`,
                    borderRadius: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>{signal.icon}</span>
                      <span style={{ color: '#E5E7EB', fontWeight: 'bold' }}>{signal.signal}</span>
                    </div>
                    <div style={{
                      color: signal.color,
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}>
                      {signal.confidence}% confidence
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Security Score */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 217, 255, 0.05))',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#E5E7EB', margin: '0 0 1rem 0' }}>
                🛡️ Security Analysis
              </h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2rem'
              }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'conic-gradient(#10B981 288deg, rgba(255,255,255,0.1) 0deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <div style={{
                    width: '75px',
                    height: '75px',
                    borderRadius: '50%',
                    background: 'rgba(18, 18, 26, 0.9)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10B981',
                    fontWeight: 'bold'
                  }}>
                    <div style={{ fontSize: '1.3rem' }}>80</div>
                    <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>SECURE</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  {[
                    { check: 'Contract Verified', status: true },
                    { check: 'Liquidity Locked', status: true },
                    { check: 'Ownership Renounced', status: true },
                    { check: 'No Hidden Functions', status: false }
                  ].map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        background: item.status ? '#10B981' : '#EF4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem'
                      }}>
                        {item.status ? '✓' : '✗'}
                      </div>
                      <span style={{
                        color: item.status ? '#10B981' : '#EF4444',
                        fontSize: '0.9rem'
                      }}>
                        {item.check}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Audit Results */}
            <div style={{
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem'
            }}>
              <h3 style={{ color: '#E5E7EB', margin: '0 0 1rem 0' }}>
                🔍 Audit Results
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  { auditor: 'CertiK', score: 95, color: '#10B981' },
                  { auditor: 'ConsenSys', score: 88, color: '#00D9FF' },
                  { auditor: 'OpenZeppelin', score: 92, color: '#8B5CF6' }
                ].map((audit, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <span style={{ color: '#E5E7EB', fontWeight: 'bold' }}>
                      {audit.auditor}
                    </span>
                    <div style={{
                      color: audit.color,
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>{audit.score}/100</span>
                      <div style={{
                        width: '40px',
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${audit.score}%`,
                          height: '100%',
                          background: audit.color,
                          borderRadius: '3px'
                        }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.9)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '2rem',
      animation: 'modalFadeIn 0.3s ease-out'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.98), rgba(26, 26, 37, 0.95))',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(0, 217, 255, 0.2)',
        borderRadius: '24px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        position: 'relative',
        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        animation: 'modalSlideIn 0.4s ease-out'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '2rem 2rem 0 2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              background: `linear-gradient(135deg, ${getRiskColor(token.riskLevel)}, ${getRiskColor(token.riskLevel)}CC)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: `0 8px 24px ${getRiskColor(token.riskLevel)}40`,
              position: 'relative'
            }}>
              {token.symbol.charAt(0)}
              <div style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                width: '20px',
                height: '20px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                animation: 'pulse 2s infinite'
              }}>
                ⭐
              </div>
            </div>

            <div>
              <h2 style={{
                color: '#E5E7EB',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                margin: '0 0 0.5rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                ${token.symbol}
                <div style={{
                  background: `linear-gradient(135deg, ${getAlphaScoreColor(token.alphaScore)}, ${getAlphaScoreColor(token.alphaScore)}CC)`,
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  boxShadow: `0 4px 16px ${getAlphaScoreColor(token.alphaScore)}40`
                }}>
                  α{token.alphaScore}
                </div>
              </h2>
              <p style={{
                color: '#A8B2D1',
                fontSize: '1rem',
                margin: 0
              }}>
                {token.description || 'Advanced Solana token with high alpha potential'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#EF4444',
              fontSize: '1.3rem',
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
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          padding: '1rem 2rem 0 2rem',
          gap: '0.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(139, 92, 246, 0.1))'
                  : 'transparent',
                border: activeTab === tab.id 
                  ? '1px solid rgba(0, 217, 255, 0.3)'
                  : '1px solid transparent',
                borderRadius: '12px',
                padding: '0.75rem 1.5rem',
                cursor: 'pointer',
                color: activeTab === tab.id ? '#00D9FF' : '#A8B2D1',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.color = '#E5E7EB';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#A8B2D1';
                }
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{
          padding: '2rem',
          maxHeight: 'calc(90vh - 200px)',
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(0, 217, 255, 0.3) transparent'
        }}>
          {renderTabContent()}
        </div>
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from { 
            opacity: 0; 
            transform: scale(0.9) translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: scale(1) translateY(0); 
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.8; 
            transform: scale(1); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1.1); 
          }
        }
      `}</style>
    </div>
  );
};

export default TokenModal; 