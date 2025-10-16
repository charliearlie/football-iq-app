# Football Trivia App Design System

## Table of Contents
1. [Core Principles](#core-principles)
2. [Color Palette](#color-palette)
3. [Typography Scale](#typography-scale)
4. [Spacing System](#spacing-system)
5. [Component Patterns](#component-patterns)
6. [Interaction Patterns](#interaction-patterns)
7. [Accessibility](#accessibility)
8. [Motion & Animation](#motion--animation)
9. [Implementation Guidelines](#implementation-guidelines)

---

## Core Principles

### Design Philosophy
- **Bold & Energetic**: Reflect the excitement of football through strong visual elements
- **Dark & Immersive**: Create focus and reduce eye strain during gameplay
- **Clear Hierarchy**: Information should be instantly scannable
- **Performance First**: Lightweight components that respond instantly
- **Accessible by Default**: Every user should enjoy the game equally

---

## Color Palette

### Foundation Colors

#### Background Layers
```javascript
const backgrounds = {
  primary: '#0A0E1A',    // Deep navy black - main app background
  surface: '#141823',     // Elevated surface - cards, modals
  surfaceAlt: '#1C2231',  // Alternative surface - hover states
  overlay: 'rgba(0, 0, 0, 0.7)', // Modal overlays
};
```

#### Primary Brand Colors
```javascript
const brand = {
  primary: '#00DC82',     // Vibrant green - primary actions, success
  primaryDark: '#00B86B',  // Darker variant for pressed states
  primaryLight: '#33E39B', // Lighter variant for hover
  primaryAlpha: 'rgba(0, 220, 130, 0.1)', // Subtle backgrounds
};
```

#### Accent Colors
```javascript
const accent = {
  blue: '#2B87F0',        // Information, links
  purple: '#8B5CF6',      // Special actions, achievements
  yellow: '#FFC107',      // Warnings, hints available
  orange: '#FF6B35',      // Medium difficulty, attention
};
```

### Text Colors
```javascript
const text = {
  primary: '#FFFFFF',      // Primary text - 100% opacity
  secondary: '#B8BCC8',    // Secondary text - 72% opacity
  tertiary: '#7C8091',     // Tertiary text - 48% opacity
  disabled: '#4A4E5C',     // Disabled text - 29% opacity
  inverse: '#0A0E1A',      // Text on light backgrounds
};
```

### Semantic Colors
```javascript
const semantic = {
  success: '#00DC82',      // Correct answers, achievements
  error: '#FF4757',        // Wrong answers, errors
  warning: '#FFC107',      // Warnings, hints
  info: '#2B87F0',         // Information, tips
};
```

### Game Mode Colors
```javascript
const gameModes = {
  careerPath: {
    primary: '#00DC82',    // Career path brand color
    background: 'rgba(0, 220, 130, 0.05)',
    border: 'rgba(0, 220, 130, 0.2)',
  },
  careerPathFull: {
    primary: '#8B5CF6',    // Full career variant
    background: 'rgba(139, 92, 246, 0.05)',
    border: 'rgba(139, 92, 246, 0.2)',
  },
  transfer: {
    primary: '#2B87F0',    // Transfer game color
    background: 'rgba(43, 135, 240, 0.05)',
    border: 'rgba(43, 135, 240, 0.2)',
  },
};
```

### Difficulty Colors (Existing Constants)
```javascript
const difficulty = {
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
};
```

---

## Typography Scale

### Font Families
```javascript
const fonts = {
  ios: 'System',           // San Francisco on iOS
  android: 'Roboto',       // Roboto on Android
  fallback: 'system-ui, -apple-system, sans-serif',
};
```

### Type Scale
```javascript
const typography = {
  // Display - Hero text, large numbers
  display: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700',
    letterSpacing: -0.5,
  },

  // Headings
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: 0,
  },
  h4: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0,
  },

  // Body Text
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400',
    letterSpacing: 0,
  },
  bodyRegular: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
    letterSpacing: 0.1,
  },

  // Supporting Text
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    letterSpacing: 0.1,
    textTransform: 'uppercase',
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
};
```

---

## Spacing System

### Base Unit: 4px Grid
```javascript
const spacing = {
  xxs: 2,   // 2px - Hairline spacing
  xs: 4,    // 4px - Tight spacing
  sm: 8,    // 8px - Compact spacing
  md: 16,   // 16px - Default spacing
  lg: 24,   // 24px - Comfortable spacing
  xl: 32,   // 32px - Generous spacing
  xxl: 48,  // 48px - Section spacing
  xxxl: 64, // 64px - Large section spacing
};
```

### Component Spacing Rules

#### Padding
- **Cards**: 16px (md) all sides
- **Buttons**: 16px horizontal, 12px vertical
- **Input Fields**: 16px horizontal, 12px vertical
- **Modal Content**: 24px (lg) all sides
- **Screen Safe Area**: 16px horizontal, 24px top/bottom

#### Margins
- **Between Cards**: 16px (md)
- **Section Separation**: 32px (xl)
- **Inline Elements**: 8px (sm)
- **Text Blocks**: 16px (md) bottom
- **Button Groups**: 12px between buttons

---

## Component Patterns

### Buttons

#### Primary Button
```javascript
const primaryButton = {
  backgroundColor: '#00DC82',
  paddingHorizontal: 24,
  paddingVertical: 14,
  borderRadius: 12,
  minHeight: 48,

  // Text
  fontSize: 16,
  fontWeight: '600',
  color: '#0A0E1A',

  // States
  pressed: {
    backgroundColor: '#00B86B',
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    backgroundColor: '#1C2231',
    opacity: 0.5,
  },
};
```

#### Secondary Button
```javascript
const secondaryButton = {
  backgroundColor: 'transparent',
  borderWidth: 2,
  borderColor: '#00DC82',
  paddingHorizontal: 24,
  paddingVertical: 12,
  borderRadius: 12,
  minHeight: 48,

  // Text
  fontSize: 16,
  fontWeight: '600',
  color: '#00DC82',

  // States
  pressed: {
    backgroundColor: 'rgba(0, 220, 130, 0.1)',
    transform: [{ scale: 0.98 }],
  },
};
```

#### Ghost Button
```javascript
const ghostButton = {
  backgroundColor: 'transparent',
  paddingHorizontal: 16,
  paddingVertical: 8,

  // Text
  fontSize: 16,
  fontWeight: '500',
  color: '#B8BCC8',

  // States
  pressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
};
```

### Cards

#### Base Card
```javascript
const card = {
  backgroundColor: '#141823',
  borderRadius: 16,
  padding: 16,

  // Elevation (iOS)
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 12,

  // Elevation (Android)
  elevation: 8,
};
```

#### Interactive Card
```javascript
const interactiveCard = {
  ...card,
  borderWidth: 1,
  borderColor: 'transparent',

  // States
  pressed: {
    backgroundColor: '#1C2231',
    borderColor: '#00DC82',
    transform: [{ scale: 0.98 }],
  },
};
```

### Input Fields

#### Text Input
```javascript
const textInput = {
  backgroundColor: '#1C2231',
  borderWidth: 2,
  borderColor: '#2A2E3C',
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 14,
  fontSize: 16,
  color: '#FFFFFF',
  minHeight: 52,

  // States
  focused: {
    borderColor: '#00DC82',
    backgroundColor: '#141823',
  },
  error: {
    borderColor: '#FF4757',
    backgroundColor: 'rgba(255, 71, 87, 0.05)',
  },
};
```

### Badges

#### Difficulty Badge
```javascript
const difficultyBadge = {
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8,
  borderWidth: 1,

  // Variants
  easy: {
    backgroundColor: 'rgba(0, 220, 130, 0.1)',
    borderColor: 'rgba(0, 220, 130, 0.3)',
    color: '#00DC82',
  },
  medium: {
    backgroundColor: 'rgba(255, 107, 53, 0.1)',
    borderColor: 'rgba(255, 107, 53, 0.3)',
    color: '#FF6B35',
  },
  hard: {
    backgroundColor: 'rgba(255, 71, 87, 0.1)',
    borderColor: 'rgba(255, 71, 87, 0.3)',
    color: '#FF4757',
  },
};
```

### Progress Indicators

#### Progress Bar
```javascript
const progressBar = {
  height: 8,
  backgroundColor: '#1C2231',
  borderRadius: 4,
  overflow: 'hidden',

  fill: {
    backgroundColor: '#00DC82',
    height: '100%',
    borderRadius: 4,
  },
};
```

#### Circular Progress
```javascript
const circularProgress = {
  size: 48,
  strokeWidth: 4,
  backgroundColor: '#1C2231',
  progressColor: '#00DC82',
};
```

### Modal Overlays

#### Modal Container
```javascript
const modal = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    backgroundColor: '#141823',
    borderRadius: 20,
    padding: 24,
    maxWidth: '90%',
    minWidth: 280,

    // Elevation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
  },
};
```

---

## Interaction Patterns

### Touch Targets
- **Minimum Size**: 44x44 points (iOS) / 48x48 dp (Android)
- **Preferred Size**: 48x48 for primary actions
- **Spacing Between Targets**: Minimum 8px

### Press Feedback
```javascript
const pressStates = {
  opacity: {
    default: 1,
    pressed: 0.7,
    disabled: 0.4,
  },

  scale: {
    default: 1,
    pressed: 0.98,
    disabled: 1,
  },

  duration: 150, // milliseconds
};
```

### Loading States
```javascript
const loadingStates = {
  spinner: {
    size: 24,
    color: '#00DC82',
    animationDuration: 1000,
  },

  skeleton: {
    backgroundColor: '#1C2231',
    highlightColor: '#2A2E3C',
    animationDuration: 1500,
  },

  placeholder: {
    opacity: 0.5,
    pulseAnimation: true,
  },
};
```

### Error States
```javascript
const errorStates = {
  inline: {
    color: '#FF4757',
    fontSize: 14,
    marginTop: 4,
  },

  toast: {
    backgroundColor: '#FF4757',
    color: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
  },

  field: {
    borderColor: '#FF4757',
    backgroundColor: 'rgba(255, 71, 87, 0.05)',
  },
};
```

### Success States
```javascript
const successStates = {
  checkmark: {
    size: 24,
    color: '#00DC82',
    strokeWidth: 3,
  },

  toast: {
    backgroundColor: '#00DC82',
    color: '#0A0E1A',
    padding: 16,
    borderRadius: 12,
  },

  celebration: {
    confettiColors: ['#00DC82', '#8B5CF6', '#2B87F0', '#FFC107'],
    duration: 2000,
  },
};
```

---

## Accessibility

### Color Contrast Ratios
All text colors meet WCAG AA standards:

| Text Color | Background | Contrast Ratio | WCAG Level |
|------------|------------|----------------|------------|
| #FFFFFF | #0A0E1A | 19.5:1 | AAA |
| #B8BCC8 | #0A0E1A | 11.2:1 | AAA |
| #7C8091 | #141823 | 4.8:1 | AA |
| #00DC82 | #0A0E1A | 7.3:1 | AAA |
| #0A0E1A | #00DC82 | 7.3:1 | AAA |

### Screen Reader Support
```javascript
const accessibility = {
  // Required labels
  buttonLabel: 'descriptive action',
  imageAlt: 'descriptive text',

  // Roles
  roles: {
    button: 'button',
    header: 'header',
    main: 'main',
    navigation: 'navigation',
  },

  // States
  states: {
    selected: 'selected',
    disabled: 'disabled',
    expanded: 'expanded',
    busy: 'busy',
  },

  // Hints
  hints: {
    doubleTap: 'Double tap to activate',
    swipe: 'Swipe to navigate',
  },
};
```

### Focus Management
- Focus indicators: 2px solid #00DC82 outline
- Focus trap in modals
- Logical tab order
- Skip links for navigation

### Reduced Motion
```javascript
const reducedMotion = {
  transitions: 'none',
  animations: 'none',
  transforms: 'none',
  // Maintain essential feedback
  opacity: 'allowed',
};
```

---

## Motion & Animation

### Duration Scale
```javascript
const durations = {
  instant: 0,        // No animation
  fast: 150,         // Micro-interactions
  medium: 300,       // Standard transitions
  slow: 500,         // Complex animations
  verySlow: 1000,    // Loading, progress
};
```

### Easing Functions
```javascript
const easings = {
  // Standard easing
  standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',     // Material standard
  decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',   // Entrances
  accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',     // Exits

  // Spring physics
  spring: {
    damping: 15,
    stiffness: 150,
    mass: 1,
  },
};
```

### Animation Patterns

#### Page Transitions
```javascript
const pageTransition = {
  duration: 300,
  easing: 'decelerate',

  enter: {
    from: { opacity: 0, translateX: 30 },
    to: { opacity: 1, translateX: 0 },
  },

  exit: {
    from: { opacity: 1, translateX: 0 },
    to: { opacity: 0, translateX: -30 },
  },
};
```

#### Card Reveal
```javascript
const cardReveal = {
  duration: 500,
  easing: 'decelerate',
  stagger: 50, // Delay between cards

  from: {
    opacity: 0,
    scale: 0.9,
    translateY: 20,
  },
  to: {
    opacity: 1,
    scale: 1,
    translateY: 0,
  },
};
```

#### Success Animation
```javascript
const successAnimation = {
  checkmark: {
    duration: 400,
    strokeDasharray: 100,
    strokeDashoffset: [100, 0],
  },

  scale: {
    duration: 300,
    from: 0,
    to: 1,
    easing: 'spring',
  },

  celebration: {
    confetti: true,
    hapticFeedback: 'success',
  },
};
```

### When to Use Animation
- **Always**: Button press feedback, loading indicators
- **Usually**: Page transitions, card reveals, modals
- **Sometimes**: Data updates, progress changes
- **Rarely**: Static content, large batches of items
- **Never**: Critical error messages, accessibility mode

---

## Implementation Guidelines

### Color Constants File
```javascript
// src/constants/colors.js
export const Colors = {
  background: {
    primary: '#0A0E1A',
    surface: '#141823',
    surfaceAlt: '#1C2231',
    overlay: 'rgba(0, 0, 0, 0.7)',
  },

  brand: {
    primary: '#00DC82',
    primaryDark: '#00B86B',
    primaryLight: '#33E39B',
  },

  text: {
    primary: '#FFFFFF',
    secondary: '#B8BCC8',
    tertiary: '#7C8091',
    disabled: '#4A4E5C',
  },

  // ... rest of colors
};
```

### Typography Constants File
```javascript
// src/constants/typography.js
import { Platform } from 'react-native';

export const Typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),

  display: {
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700',
  },

  // ... rest of typography
};
```

### Spacing Constants File
```javascript
// src/constants/spacing.js
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};
```

### Component Usage Example
```javascript
// Example Button Component
import { Colors, Typography, Spacing } from '@/constants';

const Button = ({ variant = 'primary', onPress, children }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.text, styles[`${variant}Text`]]}>
        {children}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primary: {
    backgroundColor: Colors.brand.primary,
  },

  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },

  text: {
    ...Typography.button,
  },

  primaryText: {
    color: Colors.background.primary,
  },
});
```

### Accessibility Implementation
```javascript
// Accessible Component Example
<Pressable
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Start new game"
  accessibilityHint="Double tap to begin a new trivia game"
  accessibilityState={{ disabled: isLoading }}
  onPress={handlePress}
>
  <Text>Start Game</Text>
</Pressable>
```

### Dark Mode Consistency
Since the app is dark-theme only, ensure:
1. Never use pure white (#FFFFFF) for backgrounds
2. Always test on both OLED and LCD screens
3. Provide sufficient contrast for all interactive elements
4. Use subtle shadows/elevation for depth
5. Avoid pure black (#000000) - use #0A0E1A instead

---

## Design Tokens Summary

### Quick Reference
```javascript
// Most Used Values
const quickRef = {
  // Backgrounds
  mainBg: '#0A0E1A',
  cardBg: '#141823',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#B8BCC8',

  // Actions
  primaryAction: '#00DC82',
  dangerAction: '#FF4757',

  // Spacing
  defaultPadding: 16,
  cardPadding: 16,
  screenPadding: 16,

  // Radius
  buttonRadius: 12,
  cardRadius: 16,
  inputRadius: 12,

  // Sizes
  buttonHeight: 48,
  inputHeight: 52,
  touchTarget: 44,
};
```

---

## Conclusion

This design system provides a comprehensive foundation for building a consistent, accessible, and visually appealing football trivia app. By following these guidelines, the development team can:

1. **Build faster** with pre-defined components and patterns
2. **Maintain consistency** across all screens and features
3. **Ensure accessibility** for all users
4. **Create engaging experiences** with thoughtful animations
5. **Scale efficiently** as new features are added

Remember: The design system is a living document. As the app evolves, update these guidelines to reflect new patterns and learnings. Always prioritize user experience and performance over visual complexity.

### Next Steps
1. Create component library implementing these patterns
2. Set up theme provider for consistent styling
3. Build reusable animation utilities
4. Implement accessibility testing
5. Create Storybook or similar for component documentation

---

*Last Updated: October 2025*
*Version: 1.0.0*