/**
 * Utility functions for node styling
 */

/**
 * Color palettes for light and dark themes
 */
export const colorPalettes = {
  light: {
    primary: '#3b82f6',
    secondary: '#8b5cf6', 
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: '#0ea5e9',
    neutral: '#6b7280'
  },
  dark: {
    primary: '#4285f4',
    secondary: '#9333ea',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',
    neutral: '#9ca3af'
  }
};

/**
 * Default category to color mappings
 */
export const categoryColorMap: Record<string, keyof typeof colorPalettes.light> = {
  // Generic categories
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'info',
  group: 'neutral',
  container: 'neutral',
  
  // Data oriented
  data: 'info',
  input: 'primary',
  output: 'success',
  process: 'secondary',
  storage: 'info',
  
  // Generic elements
  node: 'primary',
  leaf: 'success',
  root: 'error',
  branch: 'secondary',
  
  // Software specific (for backward compatibility)
  component: 'primary',
  service: 'success',
  module: 'warning',
  class: 'success',
  model: 'secondary',
  app: 'error',
  view: 'info',
  hook: 'secondary',
  context: 'warning',
  file: 'warning'
};

/**
 * Get inline style classes for a node based on its type
 */
export function getNodeStyle(type: string, theme: 'light' | 'dark'): Record<string, string> {
  const isDark = theme === 'dark';
  const palette = colorPalettes[theme];
  
  // Base styles that apply to all node types
  const baseStyles = {
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '8px',
    padding: '12px',
    transition: 'all 0.2s ease',
    boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
  };
  
  // Get the category color key from the map or default to neutral
  const colorKey = categoryColorMap[type.toLowerCase()] || 'neutral';
  const color = palette[colorKey];
  
  // Create styles based on the derived color
  const derivedStyles = {
    backgroundColor: isDark ? `rgba(${hexToRgb(color)}, 0.15)` : `rgba(${hexToRgb(color)}, 0.05)`,
    borderColor: color,
    color: isDark ? '#e4e4e7' : shadeColor(color, -30),
  };
  
  // Merge base styles with type-specific styles
  return {
    ...baseStyles,
    ...derivedStyles,
  };
}

/**
 * Get the color for a node type, used for icons or decorations
 */
export function getNodeTypeColor(type: string, theme: 'light' | 'dark' = 'light'): string {
  const palette = colorPalettes[theme];
  // Get the category color key from the map or default to neutral
  const colorKey = categoryColorMap[type.toLowerCase()] || 'neutral';
  return palette[colorKey];
}

/**
 * Helper function to convert hex color to RGB
 */
function hexToRgb(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `${r}, ${g}, ${b}`;
}

/**
 * Helper function to darken or lighten a color
 * @param color - Hex color string
 * @param percent - Percentage to adjust brightness (-100 to 100)
 */
function shadeColor(color: string, percent: number): string {
  color = color.replace('#', '');
  
  const num = parseInt(color, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  
  r = Math.min(255, Math.max(0, r + Math.floor(r * (percent / 100))));
  g = Math.min(255, Math.max(0, g + Math.floor(g * (percent / 100))));
  b = Math.min(255, Math.max(0, b + Math.floor(b * (percent / 100))));
  
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
} 