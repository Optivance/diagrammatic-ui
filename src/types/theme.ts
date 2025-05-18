/**
 * Type definitions for theming and styling
 */

/**
 * Basic theme options
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Color palette interface for theming
 */
export interface ColorPalette {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  border: string;
}

/**
 * Node style properties 
 */
export interface NodeStyle {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  borderWidth: number;
  borderRadius: number;
  fontSize: number;
  padding: number;
  shadow: string;
  hoverEffect: string;
  selectedEffect: string;
}

/**
 * Edge style properties
 */
export interface EdgeStyle {
  color: string;
  width: number;
  opacity: number;
  dashArray: string;
  startMarker: string;
  endMarker: string;
  hoverEffect: string;
  selectedEffect: string;
}

/**
 * Full theme configuration
 */
export interface Theme {
  /** The theme mode (light/dark/system) */
  mode: ThemeMode;
  /** Color palette for the theme */
  colors: ColorPalette;
  /** Node styling by node type */
  nodeStyles: Record<string, NodeStyle>;
  /** Default node style for unspecified types */
  defaultNodeStyle: NodeStyle;
  /** Edge styling by edge type */
  edgeStyles: Record<string, EdgeStyle>;
  /** Default edge style for unspecified types */
  defaultEdgeStyle: EdgeStyle;
  /** Spacing values used throughout the UI */
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  /** Typography settings */
  typography: {
    fontFamily: string;
    headingFontFamily: string;
    baseFontSize: number;
    fontWeightNormal: number;
    fontWeightBold: number;
  };
} 