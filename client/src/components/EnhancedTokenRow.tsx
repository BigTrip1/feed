import React, { useState, useEffect } from 'react';
import { Token } from '../types/token';

interface EnhancedTokenRowProps {
  token: Token;
  isNew?: boolean;
  onTokenClick?: (token: Token) => void;
}

const EnhancedTokenRow: React.FC<EnhancedTokenRowProps> = ({ 
  token, 
  isNew = false, 
  onTokenClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    if (isNew) {
      setShowSparkles(true);
      const timer = setTimeout(() => setShowSparkles(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  useEffect(() => {
    // Simulate price changes
    const interval = setInterval(() => {
      setPriceChange((Math.random() - 0.5) * 10);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const formatMarketCap = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <div
      onClick={() => onTokenClick?.(token)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered 
          ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.05), rgba(139, 92, 246, 0.05))'
          : 'linear-gradient(135deg, rgba(18, 18, 26, 0.8), rgba(26, 26, 37, 0.6))',
        backdropFilter: 'blur(20px)',
        border: isHovered 
          ? '1px solid rgba(0, 217, 255, 0.3)'
          : '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        padding: '1.5rem',
        margin: '0.75rem 0',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-2px) scale(1.01)' : 'translateY(0) scale(1)',
        boxShadow: isHovered
          ? '0 20px 60px rgba(0, 217, 255, 0.1), 0 0 40px rgba(139, 92, 246, 0.05)'
          : '0 8px 32px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Sparkle Effect for New Tokens */}
      {showSparkles && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          fontSize: '1.2rem',
          animation: 'sparkle 2s infinite'
        }}>
          ✨
        </div>
      )}

      {/* Animated Border for High Alpha Scores */}
      {token.alphaScore >= 80 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: '16px',
          background: `linear-gradient(45deg, ${getAlphaScoreColor(token.alphaScore)}20, transparent, ${getAlphaScoreColor(token.alphaScore)}20)`,
          backgroundSize: '200% 200%',
          animation: 'gradientShift 3s ease infinite',
          pointerEvents: 'none'
        }} />
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto auto auto',
        alignItems: 'center',
        gap: '1.5rem',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Token Icon & Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${getRiskColor(token.riskLevel)}, ${getRiskColor(token.riskLevel)}CC)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: `0 8px 24px ${getRiskColor(token.riskLevel)}40`,
            transition: 'all 0.3s ease',
            transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)'
          }}>
            {token.symbol.charAt(0)}
          </div>
          
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.25rem'
            }}>
              <span style={{
                color: '#E5E7EB',
                fontSize: '1.1rem',
                fontWeight: '700'
              }}>
                ${token.symbol}
              </span>
              
              {isNew && (
                <span style={{
                  background: 'linear-gradient(135deg, #00D9FF, #8B5CF6)',
                  color: 'white',
                  fontSize: '0.6rem',
                  fontWeight: 'bold',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '4px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  NEW
                </span>
              )}
            </div>
            
            <div style={{
              color: '#A8B2D1',
              fontSize: '0.9rem',
              maxWidth: '200px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {token.description || 'No description available'}
            </div>
          </div>
        </div>

        {/* Market Data */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          <div style={{
            color: '#E5E7EB',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            MC: {formatMarketCap(token.marketCap)}
          </div>
          <div style={{
            color: '#A8B2D1',
            fontSize: '0.8rem'
          }}>
            Vol: {formatMarketCap(token.volume || 0)}
          </div>
        </div>

        {/* Price Change Indicator */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <div style={{
            color: priceChange >= 0 ? '#10B981' : '#EF4444',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            fontFamily: 'monospace'
          }}>
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(1)}%
          </div>
          <div style={{
            fontSize: '1.2rem',
            animation: priceChange !== 0 ? 'bounce 1s ease' : 'none'
          }}>
            {priceChange >= 0 ? '📈' : '📉'}
          </div>
        </div>

        {/* Alpha Score */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.25rem'
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${getAlphaScoreColor(token.alphaScore)}, ${getAlphaScoreColor(token.alphaScore)}CC)`,
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            padding: '0.5rem 0.75rem',
            borderRadius: '12px',
            boxShadow: `0 4px 16px ${getAlphaScoreColor(token.alphaScore)}40`,
            minWidth: '60px',
            textAlign: 'center'
          }}>
            α{token.alphaScore}
          </div>
          
          {token.alphaScore >= 90 && (
            <div style={{ fontSize: '1rem' }}>🏆</div>
          )}
        </div>

        {/* Risk Badge */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <div style={{
            background: getRiskColor(token.riskLevel),
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            padding: '0.4rem 0.6rem',
            borderRadius: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            boxShadow: `0 4px 16px ${getRiskColor(token.riskLevel)}40`
          }}>
            {token.riskLevel}
          </div>
          
          <div style={{
            fontSize: '0.9rem'
          }}>
            {token.riskLevel.toLowerCase() === 'safe' || token.riskLevel.toLowerCase() === 'low' ? '🛡️' : 
             token.riskLevel.toLowerCase() === 'medium' ? '⚖️' : 
             token.riskLevel.toLowerCase() === 'high' ? '🔥' : 
             token.riskLevel.toLowerCase() === 'degen' ? '⚡' : '💀'}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.7; }
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedTokenRow; 