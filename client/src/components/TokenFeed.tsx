import React, { forwardRef, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import TokenRow from './TokenRow';
import { Token } from '../types/token';

interface TokenFeedProps {
  tokens: Token[];
  loading: boolean;
  error: string | null;
  autoScroll: boolean;
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
  ({ tokens, loading, error, autoScroll }, ref) => {
    const totalMarketCap = tokens.reduce((sum, token) => sum + token.marketCap, 0);
    const bullishCount = tokens.filter(token => token.performanceChange > 0).length;
    const bearishCount = tokens.filter(token => token.performanceChange < 0).length;
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
      <FeedContainer>
        <FeedHeader>
          <div>
            <HeaderTitle>
              <ActivityIcon
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <TrendingUp size={16} color="white" />
              </ActivityIcon>
              Activity Feed
            </HeaderTitle>
          </div>
          
          <StatsRow>
            <StatItem>
              <StatLabel>Total Tokens</StatLabel>
              <StatValue>{tokens.length}</StatValue>
            </StatItem>
            
            <StatItem>
              <StatLabel>Total Market Cap</StatLabel>
              <StatValue>{formatMarketCap(totalMarketCap)}</StatValue>
            </StatItem>
            
            <StatItem>
              <StatLabel>Performance</StatLabel>
              <StatValue style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: '#22C55E' }}>↑{bullishCount}</span>
                <span style={{ color: '#6B7280' }}>—{neutralCount}</span>
                <span style={{ color: '#EF4444' }}>↓{bearishCount}</span>
              </StatValue>
            </StatItem>
          </StatsRow>
        </FeedHeader>

        <TableContainer ref={ref}>
          <Table>
            <TableHead>
              <tr>
                <TableHeader>Token</TableHeader>
                <TableHeader>Category</TableHeader>
                <TableHeader>Market Cap</TableHeader>
                <TableHeader>Performance</TableHeader>
                <TableHeader>AlphaScore</TableHeader>
                <TableHeader>Time</TableHeader>
              </tr>
            </TableHead>
            <TableBody>
              <AnimatePresence mode="popLayout">
                {tokens.map((token, index) => (
                  <TokenRow
                    key={token._id}
                    token={token}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </TableContainer>
      </FeedContainer>
    );
  }
);

TokenFeed.displayName = 'TokenFeed';

export default TokenFeed; 