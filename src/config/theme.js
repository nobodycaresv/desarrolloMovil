

export const colors = {
  
  primary: '#BD201B',     
  primaryDark: '#8A1410',

  background: '#000000',     
  inputBg: '#121212',     
  cardBg: '#141414',      

  // Bordes
  borderInput: '#2C2C2C',    
  borderRed: '#BD201B',   

  // Textos y Placeholders
  textPrimary: '#FFFFFF', 
  textSecondary: '#AAAAAA',  
  textMuted: '#666666',   
  textRed: '#BD201B',
};

export const typography = {
  fontSize: {
    xs: 12,
    sm: 13,
    md: 14,
    lg: 16,
    xl: 20,
    title: 24,
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  pill: 25,
  circle: 9999,
};

export const inputStyles = {
  container: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.borderInput,
    borderRadius: borderRadius.pill,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
  },
};

export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary,
    height: 50,
    borderRadius: borderRadius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  primaryText: {
    color: colors.textPrimary,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
};

const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  inputStyles,
  buttonStyles,
};

export default theme;
