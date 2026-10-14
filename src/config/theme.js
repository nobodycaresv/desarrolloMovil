// src/theme/theme.js

export const colors = {
  
  primary: '#BD201B',        
  primaryDark: '#8A1410',
  primaryAlpha10: 'rgba(189, 32, 27, 0.1)',
  primaryAlpha20: 'rgba(189, 32, 27, 0.2)',

  
  background: '#000000',     
  cardBg: '#121212',         
  navBg: '#0D0D0D',          
  surface: '#161616',       

  
  borderCard: '#262626',     
  borderRed: '#ca1d10',      

  
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  textMuted: '#777777',
  textRed: '#BD201B',
};

export const typography = {
   //Tamaños de fuente
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 20,
    xxl: 26,
    banner: 34,
  },
  // Pesos de tipografía
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 14,
  xl: 16,
  pill: 20,
  circle: 9999,
};

export const buttonStyles = {
  
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },

  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlinedText: {
    color: colors.primary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },

  chip: {
    backgroundColor: colors.cardBg,
    borderWidth: 1.5,
    borderColor: colors.borderRed,
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
};

const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  buttonStyles,
};

export default theme;
