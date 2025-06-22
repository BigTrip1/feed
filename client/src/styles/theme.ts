import { DefaultTheme } from 'styled-components';

export const darkTheme: DefaultTheme = {
  colors: {
    // Primary background and surfaces - Deep dark like wom.fun
    background: '#0B0B0F',
    surface: '#12121A',
    elevated: '#1A1A25',
    
    // Text colors - Clean whites and subtle blues
    text: '#FFFFFF',
    textSecondary: '#A8B2D1',
    textMuted: '#6B7280',
    
    // Accent colors - Inspired by wom.fun's vibrant palette
    primary: '#00D9FF',        // Bright cyan blue
    primaryHover: '#00B8E6',   // Darker cyan
    secondary: '#8B5CF6',      // Purple accent
    accent: '#F59E0B',         // Amber/orange
    
    // Status colors - Modern and clean
    success: '#10B981',        // Emerald green
    warning: '#F59E0B',        // Amber
    error: '#EF4444',          // Red
    info: '#3B82F6',          // Blue
    
    // Performance indicators
    bullish: '#10B981',        // Emerald green
    bearish: '#EF4444',        // Red
    neutral: '#6B7280',        // Gray
    
    // Special highlights
    golden: '#F59E0B',         // Amber
    platinum: '#C0C0C0',       // Silver
    neon: '#00D9FF',          // Cyan
    purple: '#8B5CF6',        // Purple
    orange: '#F59E0B',        // Amber
    
    // Border and dividers - Subtle with blue tint
    border: '#1F2937',
    borderHover: '#374151',
    borderGlow: '#00D9FF33',   // Cyan glow
    
    // Overlays and modals
    overlay: 'rgba(11, 11, 15, 0.9)',
    modal: '#1A1A25',
    
    // Gradients - Inspired by wom.fun's style
    gradientPrimary: 'linear-gradient(135deg, #00D9FF 0%, #8B5CF6 100%)',
    gradientSecondary: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)',
    gradientSuccess: 'linear-gradient(135deg, #10B981 0%, #00D9FF 100%)',
    gradientDanger: 'linear-gradient(135deg, #EF4444 0%, #F59E0B 100%)',
    gradientBackground: 'linear-gradient(135deg, #0B0B0F 0%, #12121A 50%, #1A1A25 100%)',
    gradientCard: 'linear-gradient(135deg, #12121A 0%, #1A1A25 100%)',
    gradientBorder: 'linear-gradient(90deg, #00D9FF, #8B5CF6, #F59E0B)',
  },
  
  fonts: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  borderRadius: {
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.375rem',
    xl: '0.5rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.4)',
    md: '0 4px 8px rgba(0, 0, 0, 0.25)',
    lg: '0 8px 20px rgba(0, 0, 0, 0.2)',
    xl: '0 16px 40px rgba(0, 0, 0, 0.15)',
    glow: '0 0 20px rgba(0, 217, 255, 0.4)',           // Cyan glow
    glowSuccess: '0 0 20px rgba(16, 185, 129, 0.4)',   // Emerald glow
    glowDanger: '0 0 20px rgba(239, 68, 68, 0.4)',     // Red glow
    glowPurple: '0 0 20px rgba(139, 92, 246, 0.4)',    // Purple glow
    glowPink: '0 0 20px rgba(236, 72, 153, 0.4)',      // Pink glow
    glowOrange: '0 0 20px rgba(245, 158, 11, 0.4)',    // Amber glow
    innerGlow: 'inset 0 0 20px rgba(0, 217, 255, 0.1)', // Inner cyan glow
    neonBorder: '0 0 12px rgba(0, 217, 255, 0.6), 0 0 24px rgba(0, 217, 255, 0.2)',
  },
  
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.25s ease-in-out',
    slow: '0.35s ease-in-out',
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};

export type Theme = typeof darkTheme;

// Export as default theme
export const theme = darkTheme; 