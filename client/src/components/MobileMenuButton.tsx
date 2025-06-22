import React from 'react';

interface MobileMenuButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        top: '1rem',
        left: '1rem',
        zIndex: 1000,
        width: '48px',
        height: '48px',
        background: 'linear-gradient(135deg, #00D9FF, #8B5CF6)',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        boxShadow: '0 4px 20px rgba(0, 217, 255, 0.4)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(10px)',
        transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)'
      }}
    >
      <div style={{
        width: '20px',
        height: '2px',
        background: 'white',
        borderRadius: '1px',
        transition: 'all 0.3s ease',
        transform: isOpen ? 'rotate(45deg) translateY(6px)' : 'rotate(0deg) translateY(0px)'
      }}></div>
      <div style={{
        width: '20px',
        height: '2px',
        background: 'white',
        borderRadius: '1px',
        transition: 'all 0.3s ease',
        opacity: isOpen ? 0 : 1
      }}></div>
      <div style={{
        width: '20px',
        height: '2px',
        background: 'white',
        borderRadius: '1px',
        transition: 'all 0.3s ease',
        transform: isOpen ? 'rotate(-45deg) translateY(-6px)' : 'rotate(0deg) translateY(0px)'
      }}></div>
    </button>
  );
};

export default MobileMenuButton; 