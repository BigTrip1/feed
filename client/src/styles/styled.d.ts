import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      // Base colors
      background: string;
      surface: string;
      elevated: string;
      border: string;
      
      // Text colors
      text: string;
      textSecondary: string;
      textMuted: string;
      
      // Brand colors
      primary: string;
      primaryHover: string;
      secondary: string;
      accent: string;
      
      // Status colors
      success: string;
      error: string;
      warning: string;
      info: string;
      
      // Semantic colors
      bullish: string;
      bearish: string;
      neutral: string;
      golden: string;
      platinum: string;
      
      // Border and dividers
      borderHover: string;
      borderGlow: string;
      
      // Extended colors
      neon: string;
      purple: string;
      orange: string;
      
      // Overlays and modals
      overlay: string;
      modal: string;
      
      // Gradients
      gradientPrimary: string;
      gradientSecondary: string;
      gradientSuccess: string;
      gradientDanger: string;
      gradientBackground: string;
      gradientCard: string;
      gradientBorder: string;
    };
    
    fontSizes: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    
    fonts: {
      primary: string;
      mono: string;
    };
    
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      full: string;
    };
    
    shadows: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      glow: string;
      glowSuccess: string;
      glowDanger: string;
      glowPurple: string;
      glowPink: string;
      glowOrange: string;
      innerGlow: string;
      neonBorder: string;
    };
    
    transitions: {
      fast: string;
      normal: string;
      slow: string;
    };
    
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
    
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
    
    zIndex: {
      dropdown: number;
      sticky: number;
      fixed: number;
      modal: number;
      popover: number;
      tooltip: number;
    };
  }
} 