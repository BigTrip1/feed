import React, { forwardRef, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import TokenRow from './TokenRow';
import { Token } from '../types/token';
import TokenModal from './TokenModal';
import SearchFilters from './SearchFilters';

interface TokenFeedProps {
  tokens: Token[];
  loading: boolean;
  error: string | null;
  autoScroll: boolean;
  onTokenClick?: (token: Token) => void;
}

const FeedContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.xl};
  border: 1px solid ${props => props.theme.colors.border};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const FeedHeader = styled.div`
  background: ${props => props.theme.colors.elevated};
  padding: 1.5rem 2rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const HeaderTitle = styled.h2`
  font-size: ${props => props.theme.fontSizes.xl};
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ActivityIcon = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${props => props.theme.colors.gradientPrimary};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const StatsRow = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
    flex-wrap: wrap;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatLabel = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const StatValue = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const TableContainer = styled.div`
  max-height: 70vh;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.elevated};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.accent};
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: ${props => props.theme.colors.elevated};
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TableHeader = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  
  &:first-child {
    padding-left: 2rem;
  }
  
  &:last-child {
    padding-right: 2rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    
    &:first-child {
      padding-left: 1rem;
    }
    
    &:last-child {
      padding-right: 1rem;
    }
  }
`;

const TableBody = styled.tbody``;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
`;

const LoadingSpinner = styled(motion.div)`
  color: ${props => props.theme.colors.primary};
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
`;

const ErrorIcon = styled.div`
  color: ${props => props.theme.colors.error};
`;

const ErrorText = styled.p`
  color: ${props => props.theme.colors.error};
  font-size: ${props => props.theme.fontSizes.sm};
  text-align: center;
`;

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
`;

const EmptyText = styled.p`
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.fontSizes.sm};
  text-align: center;
`;

const TokenFeed = forwardRef<HTMLDivElement, TokenFeedProps>(
  ({ tokens, loading, error, autoScroll, onTokenClick }, ref) => {
    const [filteredTokens, setFilteredTokens] = useState<Token[]>(tokens);
    const [selectedToken, setSelectedToken] = useState<Token | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [sortBy, setSortBy] = useState('alphaScore');
    const [isAnimating, setIsAnimating] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const totalMarketCap = tokens.reduce((sum, token) => sum + token.marketCap, 0);
    const bullishCount = tokens.filter(token => (token.performanceChange || 0) > 0).length;
    const bearishCount = tokens.filter(token => (token.performanceChange || 0) < 0).length;
    const neutralCount = tokens.length - bullishCount - bearishCount;

    const formatMarketCap = (value: number) => {
      if (value >= 1000000000) {
        return `$${(value / 1000000000).toFixed(1)}B`;
      } else if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
      }
      return `$${value}`;
    };

    // Particle system for background effects
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
        size: number;
        opacity: number;
        color: string;
      }> = [];

      const colors = ['#00D9FF', '#8B5CF6', '#10B981', '#F59E0B', '#FFD700'];

      // Initialize particles
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle, index) => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Wrap around edges
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;

          // Draw particle
          ctx.save();
          ctx.globalAlpha = particle.opacity;
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Draw connections
          particles.slice(index + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              ctx.save();
              ctx.globalAlpha = (1 - distance / 100) * 0.1;
              ctx.strokeStyle = particle.color;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
              ctx.restore();
            }
          });
        });

        requestAnimationFrame(animate);
      };

      animate();

      const handleResize = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      };

      window.addEventListener('resize', handleResize);
      handleResize();

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    useEffect(() => {
      let filtered = tokens;

      // Search filter
      if (searchTerm) {
        filtered = filtered.filter(token =>
          token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (token.tokenName && token.tokenName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }

      // Category filter
      if (selectedFilter !== 'All') {
        if (selectedFilter === 'Alpha') {
          filtered = filtered.filter(token => token.alphaScore >= 80);
        } else if (selectedFilter === 'Pumps') {
          filtered = filtered.filter(token => (token.performanceChange || 0) > 5);
        } else if (selectedFilter === 'Whales') {
          filtered = filtered.filter(token => token.category === 'Alpha Hunters');
        }
      }

      // Sort
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'alphaScore':
            return b.alphaScore - a.alphaScore;
          case 'marketCap':
            return b.marketCap - a.marketCap;
          case 'performance':
            return (b.performanceChange || 0) - (a.performanceChange || 0);
          default:
            return 0;
        }
      });

      setFilteredTokens(filtered);
    }, [tokens, searchTerm, selectedFilter, sortBy]);

    const handleTokenClick = (token: Token) => {
      setSelectedToken(token);
      setIsModalOpen(true);
      if (onTokenClick) {
        onTokenClick(token);
      }
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
      setTimeout(() => setSelectedToken(null), 300);
    };

    const getFilterCounts = () => {
      return {
        all: tokens.length,
        pumps: tokens.filter(token => (token.performanceChange || 0) > 5).length,
        whales: tokens.filter(token => token.category === 'Alpha Hunters').length,
        alpha: tokens.filter(token => token.alphaScore >= 80).length
      };
    };

    const counts = getFilterCounts();

    if (loading && tokens.length === 0) {
      return (
        <FeedContainer>
          <LoadingContainer>
            <LoadingSpinner
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 size={48} />
            </LoadingSpinner>
            <LoadingText>Loading token feed...</LoadingText>
          </LoadingContainer>
        </FeedContainer>
      );
    }

    if (error) {
      return (
        <FeedContainer>
          <ErrorContainer>
            <ErrorIcon>
              <AlertCircle size={48} />
            </ErrorIcon>
            <ErrorText>{error}</ErrorText>
          </ErrorContainer>
        </FeedContainer>
      );
    }

    if (tokens.length === 0) {
      return (
        <FeedContainer>
          <EmptyContainer>
            <EmptyText>No tokens found. Waiting for live data...</EmptyText>
          </EmptyContainer>
        </FeedContainer>
      );
    }

    return (
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, rgba(11, 11, 15, 1) 0%, rgba(18, 18, 26, 0.98) 50%, rgba(26, 26, 37, 1) 100%)',
        overflow: 'hidden'
      }}>
        {/* Animated Background Canvas */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Holographic Grid Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 217, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 217, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          zIndex: 2,
          animation: 'gridMove 20s linear infinite'
        }} />

        {/* Scanning Lines */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '200%',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00D9FF, transparent)',
          zIndex: 3,
          animation: 'scanHorizontal 8s linear infinite'
        }} />
        
        <div style={{
          position: 'absolute',
          left: 0,
          top: '-100%',
          width: '2px',
          height: '200%',
          background: 'linear-gradient(0deg, transparent, #8B5CF6, transparent)',
          zIndex: 3,
          animation: 'scanVertical 12s linear infinite'
        }} />

        {/* Main Content */}
        <div 
          ref={containerRef}
          style={{
            position: 'relative',
            zIndex: 4,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '100px 2rem 140px 2rem'
          }}
        >
          {/* Header Section */}
          <div style={{
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              margin: '0 0 1rem 0',
              background: 'linear-gradient(135deg, #00D9FF 0%, #8B5CF6 50%, #10B981 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 0 30px rgba(0, 217, 255, 0.3)',
              animation: 'titleGlow 3s ease-in-out infinite alternate'
            }}>
              ⚡ True Alpha Feed
            </h1>
            <p style={{
              color: '#A8B2D1',
              fontSize: '1.2rem',
              margin: 0,
              opacity: 0.9
            }}>
              Showing {filteredTokens.length} alpha signals
            </p>
          </div>

          {/* Filter Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            {[
              { id: 'All', label: '🌟 All', count: counts.all },
              { id: 'Pumps', label: '🚀 Pumps', count: counts.pumps },
              { id: 'Whales', label: '🐋 Whales', count: counts.whales },
              { id: 'Alpha', label: '⚡ Alpha', count: counts.alpha }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedFilter(filter.id)}
                style={{
                  background: selectedFilter === filter.id 
                    ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.2), rgba(139, 92, 246, 0.1))'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: selectedFilter === filter.id 
                    ? '1px solid rgba(0, 217, 255, 0.5)'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '0.75rem 1.5rem',
                  color: selectedFilter === filter.id ? '#00D9FF' : '#A8B2D1',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  if (selectedFilter !== filter.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.3)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedFilter !== filter.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                {filter.label} ({filter.count})
                {selectedFilter === filter.id && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.2), transparent)',
                    animation: 'shimmer 2s linear infinite'
                  }} />
                )}
              </button>
            ))}
          </div>

          {/* Token Grid */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.02)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(0, 217, 255, 0.3) transparent'
          }}>
            <div style={{
              display: 'grid',
              gap: '1rem',
              padding: '1.5rem'
            }}>
              {filteredTokens.map((token, index) => (
                <div
                  key={token.id || token._id || `${token.symbol}-${index}`}
                  onClick={() => handleTokenClick(token)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  style={{
                    background: hoveredIndex === index 
                      ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.1), rgba(139, 92, 246, 0.05))'
                      : 'rgba(255, 255, 255, 0.03)',
                    border: hoveredIndex === index 
                      ? '1px solid rgba(0, 217, 255, 0.3)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    transform: hoveredIndex === index ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
                    boxShadow: hoveredIndex === index 
                      ? '0 12px 40px rgba(0, 217, 255, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)'
                      : '0 4px 16px rgba(0, 0, 0, 0.1)',
                    animation: `tokenEntry 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Holographic Shimmer Effect */}
                  {hoveredIndex === index && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                      animation: 'hologramScan 1.5s ease-in-out infinite'
                    }} />
                  )}

                  <TokenRow token={token} index={index} />

                  {/* Alpha Score Glow */}
                  {token.alphaScore >= 90 && (
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 16px rgba(255, 215, 0, 0.4)',
                      animation: 'legendaryGlow 2s ease-in-out infinite alternate'
                    }}>
                      🏆 LEGENDARY
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredTokens.length === 0 && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '300px',
                color: '#A8B2D1',
                fontSize: '1.2rem'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
                <div>No tokens match your criteria</div>
                <div style={{ fontSize: '0.9rem', marginTop: '0.5rem', opacity: 0.7 }}>
                  Try adjusting your filters
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Token Modal */}
        <TokenModal
          token={selectedToken}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />

        <style>{`
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
          }
          
          @keyframes scanHorizontal {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          @keyframes scanVertical {
            0% { top: -100%; }
            100% { top: 100%; }
          }
          
          @keyframes titleGlow {
            0% { text-shadow: 0 0 30px rgba(0, 217, 255, 0.3); }
            100% { text-shadow: 0 0 50px rgba(139, 92, 246, 0.5); }
          }
          
          @keyframes shimmer {
            0% { left: -100%; }
            100% { left: 100%; }
          }
          
          @keyframes tokenEntry {
            0% { 
              opacity: 0; 
              transform: translateY(30px) scale(0.9); 
            }
            100% { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
          
          @keyframes hologramScan {
            0% { left: -100%; opacity: 0; }
            50% { opacity: 1; }
            100% { left: 100%; opacity: 0; }
          }
          
          @keyframes legendaryGlow {
            0% { 
              box-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
              transform: scale(1);
            }
            100% { 
              box-shadow: 0 8px 32px rgba(255, 215, 0, 0.8);
              transform: scale(1.05);
            }
          }
        `}</style>
      </div>
    );
  }
);

TokenFeed.displayName = 'TokenFeed';

export default TokenFeed; 