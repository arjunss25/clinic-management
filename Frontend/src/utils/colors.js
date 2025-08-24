import { colors } from '../config/colors';

// Get color value by path (e.g., 'primary.blue', 'secondary.DEFAULT')
export const getColor = (path) => {
  const parts = path.split('.');
  let result = colors;
  for (const part of parts) {
    result = result[part];
    if (result === undefined) return null;
  }
  return result;
};

// Get CSS variable value
export const getCssVar = (name) => {
  if (typeof window === 'undefined') return null;
  const style = getComputedStyle(document.documentElement);
  return style.getPropertyValue(`--color-${name}`).trim();
};

// Convert hex to rgba
export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Example usage:
// getColor('primary.blue') => '#0118D8'
// getCssVar('primary') => '#0118D8'
// hexToRgba(getColor('primary.blue'), 0.5) => 'rgba(1, 24, 216, 0.5)' 