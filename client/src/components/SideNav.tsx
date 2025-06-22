import React, { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: string;
  isActive?: boolean;
  isNew?: boolean;
  isPro?: boolean;
}

interface SideNavProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ isCollapsed = false, onToggle }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string>('feed');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems: NavItem[] = [
    {
      id: 'feed',
      label: 'Alpha Feed',
      icon: '📡',
      path: '/',
      badge: 'LIVE',
      isActive: true,
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      path: '/dashboard',
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      icon: '💼',
      path: '/portfolio',
      badge: '$2.4M',
    },
    {
      id: 'scanner',
      label: 'Token Scanner',
      icon: '🔍',
      path: '/scanner',
      isNew: true,
    },
    {
      id: 'alerts',
      label: 'Smart Alerts',
      icon: '🚨',
      path: '/alerts',
      badge: '12',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      path: '/analytics',
      isPro: true,
    },
    {
      id: 'trading',
      label: 'Trading Bot',
      icon: '🤖',
      path: '/trading',
      isPro: true,
    },
    {
      id: 'social',
      label: 'Social Pulse',
      icon: '💬',
      path: '/social',
      badge: '∞',
    },
    {
      id: 'defi',
      label: 'DeFi Tracker',
      icon: '🏦',
      path: '/defi',
    },
    {
      id: 'nft',
      label: 'NFT Alpha',
      icon: '🎨',
      path: '/nft',
      isNew: true,
    },
  ];

  const bottomItems: NavItem[] = [
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️',
      path: '/settings',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      path: '/profile',
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: '❓',
      path: '/help',
    },
  ];

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    // Close mobile menu after selection
    if (isMobile && onToggle) {
      setTimeout(() => onToggle(), 300);
    }
    console.log(`Navigate to: ${itemId}`);
  };

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {!isCollapsed && isMobile && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(11, 11, 15, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 998,
            animation: 'fadeIn 0.3s ease'
          }}
          onClick={onToggle}
        />
      )}

      <div style={{
        position: 'fixed',
        top: 0,
        left: isMobile && isCollapsed ? '-280px' : '0',
        height: '100vh',
        width: isCollapsed && !isMobile ? '80px' : '280px',
        background: 'linear-gradient(180deg, #12121A 0%, #1A1A25 50%, #0B0B0F 100%)',
        borderRight: '1px solid rgba(0, 217, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 999,
        overflow: 'hidden',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 217, 255, 0.05)',
      }}>
        
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 20%, rgba(0, 217, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 60%, rgba(139, 92, 246, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 40% 90%, rgba(245, 158, 11, 0.02) 0%, transparent 50%)
          `,
          animation: 'pulse 8s ease-in-out infinite alternate',
          pointerEvents: 'none'
        }}></div>

        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(31, 41, 55, 0.3)',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer'
          }} onClick={onToggle}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #00D9FF, #8B5CF6)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: '0 4px 15px rgba(0, 217, 255, 0.3)',
              animation: 'glow 3s infinite'
            }}>
              📡
            </div>
            {(!isCollapsed || isMobile) && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                opacity: (isCollapsed && !isMobile) ? 0 : 1,
                transition: 'opacity 0.3s ease'
              }}>
                <h1 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  margin: 0,
                  background: 'linear-gradient(135deg, #FFFFFF, #00D9FF)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Feed.moi
                </h1>
                <p style={{
                  fontSize: '0.75rem',
                  color: '#A8B2D1',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  Alpha Trading Hub
                </p>
              </div>
            )}
          </div>
          
          {/* Toggle button - only show on desktop */}
          {!isMobile && (
            <button
              onClick={onToggle}
              style={{
                position: 'absolute',
                right: '-12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '24px',
                height: '24px',
                background: 'linear-gradient(135deg, #00D9FF, #8B5CF6)',
                border: 'none',
                borderRadius: '50%',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                boxShadow: '0 2px 8px rgba(0, 217, 255, 0.4)',
                transition: 'all 0.3s ease',
                zIndex: 10
              }}
            >
              {isCollapsed ? '→' : '←'}
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div style={{
          flex: 1,
          padding: '1rem 0',
          overflowY: 'auto',
          overflowX: 'hidden',
          height: 'calc(100vh - 200px)'
        }}>
          {navItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                position: 'relative',
                margin: '0.25rem 1rem',
                padding: '1rem',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: activeItem === item.id 
                  ? 'linear-gradient(135deg, rgba(0, 217, 255, 0.15), rgba(139, 92, 246, 0.1))'
                  : hoveredItem === item.id
                  ? 'rgba(0, 217, 255, 0.08)'
                  : 'transparent',
                border: activeItem === item.id ? '1px solid rgba(0, 217, 255, 0.3)' : '1px solid transparent',
                transform: hoveredItem === item.id ? 'translateX(4px)' : 'translateX(0)',
                boxShadow: activeItem === item.id 
                  ? '0 4px 20px rgba(0, 217, 255, 0.2)' 
                  : hoveredItem === item.id 
                  ? '0 2px 12px rgba(0, 217, 255, 0.1)' 
                  : 'none'
              }}
            >
              {/* Active indicator */}
              {activeItem === item.id && (
                <div style={{
                  position: 'absolute',
                  left: '-1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '24px',
                  background: 'linear-gradient(180deg, #00D9FF, #8B5CF6)',
                  borderRadius: '0 4px 4px 0',
                  boxShadow: '0 0 8px rgba(0, 217, 255, 0.6)'
                }}></div>
              )}

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  fontSize: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '24px',
                  filter: activeItem === item.id ? 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.6))' : 'none'
                }}>
                  {item.icon}
                </div>
                
                {(!isCollapsed || isMobile) && (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    opacity: (isCollapsed && !isMobile) ? 0 : 1,
                    transition: 'opacity 0.3s ease'
                  }}>
                    <span style={{
                      color: activeItem === item.id ? '#FFFFFF' : '#A8B2D1',
                      fontWeight: activeItem === item.id ? '600' : '500',
                      fontSize: '0.9rem',
                      transition: 'color 0.3s ease'
                    }}>
                      {item.label}
                    </span>
                    
                    {/* Badges and indicators */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {item.isNew && (
                        <span style={{
                          background: 'linear-gradient(135deg, #10B981, #059669)',
                          color: 'white',
                          fontSize: '0.6rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                        }}>
                          NEW
                        </span>
                      )}
                      
                      {item.isPro && (
                        <span style={{
                          background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                          color: 'white',
                          fontSize: '0.6rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                        }}>
                          PRO
                        </span>
                      )}
                      
                      {item.badge && !item.isNew && !item.isPro && (
                        <span style={{
                          background: item.badge === 'LIVE' 
                            ? 'linear-gradient(135deg, #EF4444, #DC2626)'
                            : 'rgba(0, 217, 255, 0.2)',
                          color: item.badge === 'LIVE' ? 'white' : '#00D9FF',
                          fontSize: '0.7rem',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          border: item.badge === 'LIVE' ? 'none' : '1px solid rgba(0, 217, 255, 0.3)',
                          animation: item.badge === 'LIVE' ? 'pulse 2s infinite' : 'none'
                        }}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div style={{
          padding: '1rem 0',
          borderTop: '1px solid rgba(31, 41, 55, 0.3)',
          marginTop: 'auto'
        }}>
          {/* User status */}
          {(!isCollapsed || isMobile) && (
            <div style={{
              margin: '0 1rem 1rem 1rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 217, 255, 0.05))',
              borderRadius: '12px',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  background: '#10B981',
                  borderRadius: '50%',
                  boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                  animation: 'pulse 2s infinite'
                }}></div>
                <span style={{
                  color: '#10B981',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  Trading Active
                </span>
              </div>
              <p style={{
                color: '#A8B2D1',
                fontSize: '0.7rem',
                margin: 0,
                opacity: 0.8
              }}>
                24/7 Alpha Monitoring
              </p>
            </div>
          )}

          {bottomItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                margin: '0.25rem 1rem',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: hoveredItem === item.id ? 'rgba(0, 217, 255, 0.06)' : 'transparent',
                transform: hoveredItem === item.id ? 'translateX(2px)' : 'translateX(0)'
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <div style={{
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '20px'
                }}>
                  {item.icon}
                </div>
                
                {(!isCollapsed || isMobile) && (
                  <span style={{
                    color: '#A8B2D1',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    opacity: (isCollapsed && !isMobile) ? 0 : 1,
                    transition: 'opacity 0.3s ease'
                  }}>
                    {item.label}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced CSS animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes glow {
            0%, 100% {
              box-shadow: 0 4px 15px rgba(0, 217, 255, 0.3);
            }
            50% {
              box-shadow: 0 4px 25px rgba(0, 217, 255, 0.5);
            }
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
          }
          
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
          
          /* Custom scrollbar */
          div::-webkit-scrollbar {
            width: 4px;
          }
          
          div::-webkit-scrollbar-track {
            background: rgba(31, 41, 55, 0.3);
            border-radius: 2px;
          }
          
          div::-webkit-scrollbar-thumb {
            background: linear-gradient(180deg, #00D9FF, #8B5CF6);
            border-radius: 2px;
          }
          
          div::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(180deg, #00B8E6, #7C3AED);
          }
        `
      }} />
    </>
  );
};

export default SideNav; 