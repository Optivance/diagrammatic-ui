// Export theme configurations
import React from 'react';
import { Theme } from '../types/theme';

// Light theme (default)
export const lightTheme: Partial<Theme> = {
  mode: 'light',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',
    background: '#ffffff',
    surface: '#f8fafc',
    text: '#1e293b',
    border: '#e2e8f0'
  }
};

// Dark theme
export const darkTheme: Partial<Theme> = {
  mode: 'dark',
  colors: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#0ea5e9',
    background: '#0f172a',
    surface: '#1e293b',
    text: '#f8fafc',
    border: '#334155'
  }
};

// Default theme provider will be implemented in Phase 3
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return children;
}; 