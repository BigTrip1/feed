import React from 'react';
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
  onRefresh
}) => {
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
    <StatusContainer>
      <StatusContent>
        <LeftSection>
          <ConnectionIndicator
            status={connectionStatus}
            animate={{
              scale: connectionStatus === 'connecting' ? [1, 1.05, 1] : 1
            }}
            transition={{
              duration: 1,
              repeat: connectionStatus === 'connecting' ? Infinity : 0
            }}
          >
            {getConnectionIcon()}
            <LiveFeedText>{getConnectionText()}</LiveFeedText>
            {connectionStatus === 'connected' && (
              <Pulse
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            )}
          </ConnectionIndicator>

          <NotificationBadge
            count={notifications}
            onClick={notifications > 0 ? onClearNotifications : undefined}
            whileHover={notifications > 0 ? { scale: 1.05 } : {}}
            whileTap={notifications > 0 ? { scale: 0.95 } : {}}
          >
            <Bell size={16} />
            <span>notifications</span>
            <NotificationCount count={notifications}>
              {notifications.toString().padStart(2, '0')}
            </NotificationCount>
          </NotificationBadge>
        </LeftSection>

        <RightSection>
          <ControlButton
            active={autoScroll}
            onClick={onToggleAutoScroll}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={autoScroll ? 'Disable auto-scroll' : 'Enable auto-scroll'}
          >
            {autoScroll ? <Pause size={18} /> : <Play size={18} />}
          </ControlButton>

          <ControlButton
            onClick={onRefresh}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, rotate: 180 }}
            title="Refresh data"
          >
            <RotateCcw size={18} />
          </ControlButton>
        </RightSection>
      </StatusContent>
    </StatusContainer>
  );
};

export default StatusBar; 