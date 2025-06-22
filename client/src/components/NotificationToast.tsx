import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info' | 'alpha';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationToastProps {
  className?: string;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ className }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate random notifications
    const interval = setInterval(() => {
      const notificationTypes = [
        {
          type: 'alpha' as const,
          title: '🎯 Alpha Alert',
          message: 'New high-potential token detected!'
        },
        {
          type: 'success' as const,
          title: '💎 Diamond Hands',
          message: 'Your position is up 47%!'
        },
        {
          type: 'warning' as const,
          title: '⚠️ Risk Alert',
          message: 'Unusual whale activity detected'
        },
        {
          type: 'info' as const,
          title: '📊 Market Update',
          message: 'Solana ecosystem showing strength'
        }
      ];

      if (Math.random() > 0.7) { // 30% chance every interval
        const randomNotif = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        const newNotification: Notification = {
          id: Date.now().toString(),
          ...randomNotif,
          duration: 4000
        };

        setNotifications(prev => [...prev, newNotification]);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-remove notifications after their duration
    notifications.forEach(notification => {
      if (notification.duration) {
        setTimeout(() => {
          removeNotification(notification.id);
        }, notification.duration);
      }
    });
  }, [notifications]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationStyle = (type: Notification['type']) => {
    const baseStyle = {
      background: 'linear-gradient(135deg, rgba(18, 18, 26, 0.95), rgba(26, 26, 37, 0.9))',
      backdropFilter: 'blur(20px)',
      borderRadius: '12px',
      padding: '1rem 1.5rem',
      marginBottom: '0.75rem',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      border: '1px solid',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      animation: 'slideInRight 0.5s ease-out'
    };

    switch (type) {
      case 'success':
        return {
          ...baseStyle,
          borderColor: 'rgba(16, 185, 129, 0.3)',
          boxShadow: '0 8px 32px rgba(16, 185, 129, 0.15)'
        };
      case 'warning':
        return {
          ...baseStyle,
          borderColor: 'rgba(245, 158, 11, 0.3)',
          boxShadow: '0 8px 32px rgba(245, 158, 11, 0.15)'
        };
      case 'error':
        return {
          ...baseStyle,
          borderColor: 'rgba(239, 68, 68, 0.3)',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)'
        };
      case 'alpha':
        return {
          ...baseStyle,
          borderColor: 'rgba(139, 92, 246, 0.3)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(0, 217, 255, 0.05))'
        };
      default:
        return {
          ...baseStyle,
          borderColor: 'rgba(0, 217, 255, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 217, 255, 0.15)'
        };
    }
  };

  const getIconColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      case 'alpha': return '#8B5CF6';
      default: return '#00D9FF';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      left: '1rem',
      zIndex: 9999,
      maxWidth: '400px',
      pointerEvents: 'none'
    }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={getNotificationStyle(notification.type)}
          onClick={() => removeNotification(notification.id)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateX(-5px) scale(1.02)';
            e.currentTarget.style.pointerEvents = 'auto';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateX(0) scale(1)';
          }}
        >
          {/* Progress bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            background: getIconColor(notification.type),
            borderRadius: '0 0 12px 12px',
            animation: `progressBar ${notification.duration || 4000}ms linear`
          }} />

          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: `linear-gradient(135deg, ${getIconColor(notification.type)}, ${getIconColor(notification.type)}CC)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              flexShrink: 0,
              boxShadow: `0 4px 12px ${getIconColor(notification.type)}40`
            }}>
              {notification.type === 'success' && '✅'}
              {notification.type === 'warning' && '⚠️'}
              {notification.type === 'error' && '❌'}
              {notification.type === 'alpha' && '🎯'}
              {notification.type === 'info' && 'ℹ️'}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{
                color: '#E5E7EB',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                marginBottom: '0.25rem'
              }}>
                {notification.title}
              </div>
              <div style={{
                color: '#A8B2D1',
                fontSize: '0.8rem',
                lineHeight: '1.4'
              }}>
                {notification.message}
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#6B7280',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0.25rem',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                pointerEvents: 'auto'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#E5E7EB';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6B7280';
                e.currentTarget.style.background = 'none';
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}

      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationToast; 