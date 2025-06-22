import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Star } from 'lucide-react';
import { Token } from '../types/token';

interface TokenRowProps {
  token: Token;
  index: number;
}

const TableRow = styled(motion.tr)<{ performance: number; isHighlighted: boolean }>`
  background: ${props => {
    if (props.isHighlighted) {
      return props.theme.colors.golden + '20';
    }
    return 'transparent';
  }};
  border-left: 4px solid ${props => {
    if (props.isHighlighted) return props.theme.colors.golden;
    if (props.performance > 2) return props.theme.colors.bullish;
    if (props.performance < -2) return props.theme.colors.bearish;
    return 'transparent';
  }};
  cursor: pointer;
  transition: ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.elevated};
    box-shadow: ${props => props.theme.shadows.md};
    transform: translateY(-1px);
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.5rem;
  vertical-align: middle;
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

const TokenInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const TokenIcon = styled.div<{ verified: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.gradientPrimary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: ${props => props.theme.fontSizes.sm};
  position: relative;
  
  ${props => props.verified && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 16px;
      height: 16px;
      background: ${props.theme.colors.success};
      border-radius: 50%;
      border: 2px solid ${props.theme.colors.surface};
    }
  `}
`;

const TokenDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const TokenName = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.sm};
`;

const TokenSymbol = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textMuted};
  font-family: ${props => props.theme.fonts.mono};
`;

const CategoryBadge = styled.span<{ category: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  background: ${props => {
    switch (props.category) {
      case 'Alpha Hunters':
        return props.theme.colors.error + '20';
      case 'Moon Scouts':
        return props.theme.colors.warning + '20';
      case 'Diamond Watch':
        return props.theme.colors.success + '20';
      case 'New Launch':
        return props.theme.colors.info + '20';
      case 'Trending':
        return props.theme.colors.primary + '20';
      case 'Featured':
        return props.theme.colors.golden + '20';
      default:
        return props.theme.colors.neutral + '20';
    }
  }};
  
  color: ${props => {
    switch (props.category) {
      case 'Alpha Hunters':
        return props.theme.colors.error;
      case 'Moon Scouts':
        return props.theme.colors.warning;
      case 'Diamond Watch':
        return props.theme.colors.success;
      case 'New Launch':
        return props.theme.colors.info;
      case 'Trending':
        return props.theme.colors.primary;
      case 'Featured':
        return props.theme.colors.golden;
      default:
        return props.theme.colors.neutral;
    }
  }};
`;

const MarketCapValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-family: ${props => props.theme.fonts.mono};
`;

const PerformanceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PerformanceValue = styled.span<{ value: number }>`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.mono};
  color: ${props => {
    if (props.value > 0) return props.theme.colors.bullish;
    if (props.value < 0) return props.theme.colors.bearish;
    return props.theme.colors.neutral;
  }};
`;

const PerformanceIcon = styled.div<{ value: number }>`
  color: ${props => {
    if (props.value > 0) return props.theme.colors.bullish;
    if (props.value < 0) return props.theme.colors.bearish;
    return props.theme.colors.neutral;
  }};
`;

const AlphaScoreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const AlphaScoreValue = styled.span<{ score: number }>`
  font-weight: 700;
  font-family: ${props => props.theme.fonts.mono};
  color: ${props => {
    if (props.score >= 80) return props.theme.colors.golden;
    if (props.score >= 60) return props.theme.colors.success;
    if (props.score >= 40) return props.theme.colors.warning;
    return props.theme.colors.error;
  }};
`;

const AlphaScoreBar = styled.div<{ score: number }>`
  width: 40px;
  height: 4px;
  background: ${props => props.theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.score}%;
    height: 100%;
    background: ${props => {
      if (props.score >= 80) return props.theme.colors.golden;
      if (props.score >= 60) return props.theme.colors.success;
      if (props.score >= 40) return props.theme.colors.warning;
      return props.theme.colors.error;
    }};
    transition: width 0.3s ease;
  }
`;

const TimeValue = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textMuted};
  font-family: ${props => props.theme.fonts.mono};
`;

const HighlightBadge = styled(motion.div)`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: ${props => props.theme.colors.golden};
  color: ${props => props.theme.colors.background};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: ${props => props.theme.fontSizes.xs};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const TokenRow: React.FC<TokenRowProps> = ({ token, index }) => {
  
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

  const formatPerformance = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}x`;
  };

  const getTimeAgo = () => {
    const now = new Date();
    const created = new Date(token.createdAt || new Date());
    const diff = now.getTime() - created.getTime();
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };

  const getPerformanceIcon = (value: number) => {
    if (value > 0) return <TrendingUp size={16} />;
    if (value < 0) return <TrendingDown size={16} />;
    return <Minus size={16} />;
  };

  const performanceChange = token.performanceChange || 0;
  const category = token.category || 'Unknown';
  const isHighlighted = Math.abs(performanceChange) >= 5;

  return (
    <TableRow
      performance={performanceChange}
      isHighlighted={isHighlighted}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}

      whileHover={{ scale: 1.01 }}
      style={{ position: 'relative' }}
    >
      {isHighlighted && (
        <HighlightBadge
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <Star size={12} />
          {formatPerformance(performanceChange)}
        </HighlightBadge>
      )}
      
      <TableCell>
        <TokenInfo>
          <TokenIcon verified={token.isVerified}>
            {token.symbol.substring(0, 2)}
          </TokenIcon>
          <TokenDetails>
            <TokenName>{token.tokenName}</TokenName>
            <TokenSymbol>${token.symbol}</TokenSymbol>
          </TokenDetails>
        </TokenInfo>
      </TableCell>

      <TableCell>
        <CategoryBadge category={category}>
          {category.replace(' Box', '')}
        </CategoryBadge>
      </TableCell>

      <TableCell>
        <MarketCapValue>
          MC: {formatMarketCap(token.marketCap)}
        </MarketCapValue>
      </TableCell>

      <TableCell>
        <PerformanceContainer>
          <PerformanceIcon value={performanceChange}>
            {getPerformanceIcon(performanceChange)}
          </PerformanceIcon>
          <PerformanceValue value={performanceChange}>
            {formatPerformance(performanceChange)}
          </PerformanceValue>
        </PerformanceContainer>
      </TableCell>

      <TableCell>
        <AlphaScoreContainer>
          <AlphaScoreValue score={token.alphaScore}>
            {token.alphaScore}
          </AlphaScoreValue>
          <AlphaScoreBar score={token.alphaScore} />
        </AlphaScoreContainer>
      </TableCell>

      <TableCell>
        <TimeValue>{getTimeAgo()}</TimeValue>
      </TableCell>
    </TableRow>
  );
};

export default TokenRow; 