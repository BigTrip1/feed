import React, { useState } from 'react';

interface FloatingActionButtonProps {
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    { 
      icon: '🔍', 
      label: 'Quick Scan', 
      color: '#00D9FF',
      action: () => console.log('Quick scan triggered')
    },
    { 
      icon: '⚡', 
      label: 'Flash Alert', 
      color: '#F59E0B',
      action: () => console.log('Flash alert triggered')
    },
    { 
      icon: '🎯', 
      label: 'Snipe Mode', 
      color: '#EF4444',
      action: () => console.log('Snipe mode triggered')
    },
    { 
      icon: '💎', 
      label: 'Diamond Hands', 
      color: '#8B5CF6',
      action: () => console.log('Diamond hands activated')
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column-reverse',
      alignItems: 'flex-end',
      gap: '1rem'
    }}>
      {/* Action Buttons */}
      {isExpanded && actions.map((action, index) => (
        <div
          key={action.label}
          onClick={action.action}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            cursor: 'pointer',
            animation: `slideInUp 0.3s ease ${index * 0.1}s both`,
            transform: 'translateY(20px)',
            opacity: 0
          }}
        >
          {/* Label */}
          <div style={{
            background: 'rgba(18, 18, 26, 0.95)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${action.color}40`,
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            color: '#E5E7EB',
            fontSize: '0.8rem',
            fontWeight: '500',
            whiteSpace: 'nowrap',
            boxShadow: `0 4px 20px ${action.color}20`
          }}>
            {action.label}
          </div>

          {/* Action Button */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${action.color}, ${action.color}CC)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            boxShadow: `0 8px 32px ${action.color}40, 0 0 20px ${action.color}30`,
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = `0 12px 40px ${action.color}60, 0 0 30px ${action.color}50`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = `0 8px 32px ${action.color}40, 0 0 20px ${action.color}30`;
          }}
          >
            {action.icon}
          </div>
        </div>
      ))}

      {/* Main FAB */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #00D9FF, #8B5CF6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: '0 12px 40px rgba(0, 217, 255, 0.4), 0 0 30px rgba(139, 92, 246, 0.3)',
          transition: 'all 0.3s ease',
          transform: isExpanded ? 'rotate(45deg)' : 'rotate(0deg)',
          border: '2px solid rgba(255, 255, 255, 0.1)'
        }}
        onMouseEnter={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 16px 50px rgba(0, 217, 255, 0.6), 0 0 40px rgba(139, 92, 246, 0.5)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isExpanded) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 217, 255, 0.4), 0 0 30px rgba(139, 92, 246, 0.3)';
          }
        }}
      >
        {isExpanded ? '✕' : '⚡'}
      </div>

      {/* Backdrop for mobile */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(2px)',
            zIndex: -1
          }}
        />
      )}

      <style>{`
        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingActionButton; 