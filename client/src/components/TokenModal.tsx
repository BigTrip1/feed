import React from 'react';
import { Token } from '../types/token';

interface TokenModalProps {
  token: Token | null;
  isOpen: boolean;
  onClose: () => void;
}

const TokenModal: React.FC<TokenModalProps> = ({ token, isOpen, onClose }) => {
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

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '2rem'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.95), rgba(26, 26, 37, 0.9))',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(0, 217, 255, 0.2)',
        borderRadius: '24px',
        padding: '2rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto',
        position: 'relative',
        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#EF4444',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.3)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: `linear-gradient(135deg, ${getRiskColor(token.riskLevel)}, ${getRiskColor(token.riskLevel)}CC)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            boxShadow: `0 12px 32px ${getRiskColor(token.riskLevel)}40`
          }}>
            {token.symbol.charAt(0)}
          </div>

          <div style={{ flex: 1 }}>
            <h2 style={{
              color: '#E5E7EB',
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: '0 0 0.5rem 0'
            }}>
              ${token.symbol}
            </h2>
            <p style={{
              color: '#A8B2D1',
              fontSize: '1.1rem',
              margin: 0
            }}>
              {token.description || 'No description available'}
            </p>
          </div>

          <div style={{
            background: `linear-gradient(135deg, ${getAlphaScoreColor(token.alphaScore)}, ${getAlphaScoreColor(token.alphaScore)}CC)`,
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            padding: '1rem 1.5rem',
            borderRadius: '16px',
            boxShadow: `0 8px 24px ${getAlphaScoreColor(token.alphaScore)}40`,
            textAlign: 'center',
            minWidth: '100px'
          }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem' }}>ALPHA SCORE</div>
            <div>α{token.alphaScore}</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(0, 217, 255, 0.1)',
            border: '1px solid rgba(0, 217, 255, 0.2)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ color: '#A8B2D1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Market Cap</div>
            <div style={{ color: '#00D9FF', fontSize: '1.5rem', fontWeight: 'bold' }}>
              ${(token.marketCap / 1000000).toFixed(1)}M
            </div>
          </div>

          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ color: '#A8B2D1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Volume 24h</div>
            <div style={{ color: '#8B5CF6', fontSize: '1.5rem', fontWeight: 'bold' }}>
              ${((token.volume || 0) / 1000).toFixed(0)}K
            </div>
          </div>

          <div style={{
            background: `rgba(${getRiskColor(token.riskLevel).replace('#', '')}, 0.1)`,
            border: `1px solid rgba(${getRiskColor(token.riskLevel).replace('#', '')}, 0.2)`,
            borderRadius: '12px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ color: '#A8B2D1', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Risk Level</div>
            <div style={{ 
              color: getRiskColor(token.riskLevel), 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              textTransform: 'uppercase'
            }}>
              {token.riskLevel}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <button style={{
            background: 'linear-gradient(135deg, #10B981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem 2rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(16, 185, 129, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.3)';
          }}
          >
            🚀 Buy Now
          </button>

          <button style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem 2rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 24px rgba(245, 158, 11, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(245, 158, 11, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(245, 158, 11, 0.3)';
          }}
          >
            ⭐ Add to Watchlist
          </button>

          <button style={{
            background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '1rem 2rem',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.3)';
          }}
          >
            📊 Deep Analysis
          </button>
        </div>

        {/* Disclaimer */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: '#FCA5A5',
          textAlign: 'center'
        }}>
          ⚠️ This is not financial advice. Always do your own research before investing.
        </div>
      </div>
    </div>
  );
};

export default TokenModal; 