/**
 * Design System Theme Constants
 *
 * Comprehensive theme implementation based on the Football Trivia App Design System.
 * All values are derived from docs/DESIGN_SYSTEM.md
 *
 * Usage:
 *   import { COLORS, TYPOGRAPHY, SPACING } from '@/src/constants/theme';
 */

import { Platform } from 'react-native';

// =============================================================================
// COLORS
// =============================================================================

export const COLORS = {
  /** Background layers */
  background: {
    primary: '#0A0E1A',      // Deep navy black - main app background
    surface: '#141823',       // Elevated surface - cards, modals
    surfaceAlt: '#1C2231',    // Alternative surface - hover states
    overlay: 'rgba(0, 0, 0, 0.7)', // Modal overlays
  },

  /** Primary brand colors */
  brand: {
    primary: '#00DC82',       // Vibrant green - primary actions, success
    primaryDark: '#00B86B',   // Darker variant for pressed states
    primaryLight: '#33E39B',  // Lighter variant for hover
    primaryAlpha: 'rgba(0, 220, 130, 0.1)', // Subtle backgrounds
  },

  /** Accent colors */
  accent: {
    blue: '#2B87F0',          // Information, links
    purple: '#8B5CF6',        // Special actions, achievements
    yellow: '#FFC107',        // Warnings, hints available
    orange: '#FF6B35',        // Medium difficulty, attention
  },

  /** Text colors */
  text: {
    primary: '#FFFFFF',       // Primary text - 100% opacity
    secondary: '#B8BCC8',     // Secondary text - 72% opacity
    tertiary: '#7C8091',      // Tertiary text - 48% opacity
    disabled: '#4A4E5C',      // Disabled text - 29% opacity
    inverse: '#0A0E1A',       // Text on light backgrounds
  },

  /** Semantic colors */
  semantic: {
    success: '#00DC82',       // Correct answers, achievements
    error: '#FF4757',         // Wrong answers, errors
    warning: '#FFC107',       // Warnings, hints
    info: '#2B87F0',          // Information, tips
  },

  /** Game mode colors */
  gameModes: {
    careerPath: {
      primary: '#00DC82',
      background: 'rgba(0, 220, 130, 0.05)',
      border: 'rgba(0, 220, 130, 0.2)',
    },
    careerPathFull: {
      primary: '#8B5CF6',
      background: 'rgba(139, 92, 246, 0.05)',
      border: 'rgba(139, 92, 246, 0.2)',
    },
    transfer: {
      primary: '#2B87F0',
      background: 'rgba(43, 135, 240, 0.05)',
      border: 'rgba(43, 135, 240, 0.2)',
    },
  },

  /** Difficulty colors */
  difficulty: {
    easy: {
      primary: '#00DC82',
      background: 'rgba(0, 220, 130, 0.1)',
      border: 'rgba(0, 220, 130, 0.3)',
    },
    medium: {
      primary: '#FF6B35',
      background: 'rgba(255, 107, 53, 0.1)',
      border: 'rgba(255, 107, 53, 0.3)',
    },
    hard: {
      primary: '#FF4757',
      background: 'rgba(255, 71, 87, 0.1)',
      border: 'rgba(255, 71, 87, 0.3)',
    },
  },

  /** Border colors */
  border: {
    default: '#2A2E3C',
    focus: '#00DC82',
    error: '#FF4757',
  },
} as const;

// =============================================================================
// TYPOGRAPHY
// =============================================================================

export const TYPOGRAPHY = {
  /** Font families */
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
    default: 'system-ui',
  }),

  /** Display - Hero text, large numbers */
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },

  /** Headings */
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  h4: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },

  /** Body text */
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  bodyRegular: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },

  /** Supporting text */
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
    letterSpacing: 0.1,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
} as const;

// =============================================================================
// SPACING
// =============================================================================

/** Base unit: 4px grid */
export const SPACING = {
  xxs: 2,      // 2px - Hairline spacing
  xs: 4,       // 4px - Tight spacing
  sm: 8,       // 8px - Compact spacing
  md: 16,      // 16px - Default spacing
  lg: 24,      // 24px - Comfortable spacing
  xl: 32,      // 32px - Generous spacing
  xxl: 48,     // 48px - Section spacing
  xxxl: 64,    // 64px - Large section spacing
} as const;

// =============================================================================
// BORDER RADIUS
// =============================================================================

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 9999,
} as const;

// =============================================================================
// SHADOWS
// =============================================================================

/** iOS shadow presets */
export const SHADOWS_IOS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
  },
} as const;

/** Android elevation presets */
export const ELEVATION = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 16,
} as const;

/**
 * Get platform-specific shadow/elevation styles
 */
export const getShadow = (level: 'sm' | 'md' | 'lg' | 'xl') => {
  if (Platform.OS === 'ios') {
    return SHADOWS_IOS[level];
  }
  return {
    elevation: ELEVATION[level],
  };
};

// =============================================================================
// ANIMATION DURATIONS
// =============================================================================

export const DURATIONS = {
  instant: 0,        // No animation
  fast: 150,         // Micro-interactions
  medium: 300,       // Standard transitions
  slow: 500,         // Complex animations
  verySlow: 1000,    // Loading, progress
} as const;

// =============================================================================
// SIZES
// =============================================================================

export const SIZES = {
  /** Touch target minimum size */
  touchTarget: 44,

  /** Button heights */
  button: {
    small: 36,
    medium: 48,
    large: 56,
  },

  /** Input heights */
  input: {
    default: 52,
  },

  /** Icon sizes */
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
  },

  /** Progress bar height */
  progressBar: 8,
} as const;

// =============================================================================
// OPACITY
// =============================================================================

export const OPACITY = {
  disabled: 0.4,
  pressed: 0.7,
  overlay: 0.7,
  subtle: 0.05,
  semiTransparent: 0.5,
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type ColorTheme = typeof COLORS;
export type Typography = typeof TYPOGRAPHY;
export type Spacing = typeof SPACING;
export type BorderRadius = typeof BORDER_RADIUS;
export type Durations = typeof DURATIONS;
export type Sizes = typeof SIZES;
