import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Eye, Zap, BarChart3 } from 'lucide-react';

const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.surface};
  border-bottom: 2px solid ${props => props.theme.colors.border};
  padding: 1.5rem 2rem;
  position: sticky;
  top: 0;
  z-index: ${props => props.theme.zIndex.sticky};
  backdrop-filter: blur(20px);
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${props => props.theme.colors.gradientPrimary};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.glow};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSizes['3xl']};
  font-weight: 800;
  background: ${props => props.theme.colors.gradientPrimary};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.025em;
  
  @media (max-width: 768px) {
    font-size: ${props => props.theme.fontSizes['2xl']};
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.fontSizes.sm};
  margin-top: 0.25rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const StatItem = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.colors.elevated};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  min-width: 80px;
`;

const StatValue = styled.span`
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 700;
  color: ${props => props.theme.colors.primary};
`;

const StatLabel = styled.span`
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
`;

const PoweredBy = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.colors.textMuted};
  font-size: ${props => props.theme.fontSizes.xs};
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Header: React.FC = () => {
  return (
    <HeaderContainer>
      <HeaderContent>
        <Brand
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <LogoContainer
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Eye size={24} color="white" />
          </LogoContainer>
          
          <div>
            <Title>FEED</Title>
            <Subtitle>Real-time Solana Token Analytics</Subtitle>
          </div>
        </Brand>

        <StatsContainer>
          <StatItem
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            <StatValue>24/7</StatValue>
            <StatLabel>Live</StatLabel>
          </StatItem>
          
          <StatItem
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            <StatValue>∞</StatValue>
            <StatLabel>Tokens</StatLabel>
          </StatItem>

          <PoweredBy
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Zap size={16} />
            <span>Real-time Analytics</span>
          </PoweredBy>
        </StatsContainer>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header; 