import React from 'react';

export interface GraphControlsProps {
  /** Callback to zoom in */
  onZoomIn: () => void;
  /** Callback to zoom out */
  onZoomOut: () => void;
  /** Callback to reset the view */
  onResetView: () => void;
  /** Visual theme */
  theme: 'light' | 'dark';
}

/**
 * Component that displays zoom and control buttons for the graph
 */
export const GraphControls: React.FC<GraphControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  theme
}) => {
  const isDark = theme === 'dark';
  
  // Base styles for the control panel
  const controlsStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '16px',
    right: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '8px',
    borderRadius: '8px',
    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(4px)',
  };
  
  // Button styles
  const buttonStyle: React.CSSProperties = {
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    backgroundColor: isDark ? 'rgba(51, 65, 85, 0.8)' : 'rgba(241, 245, 249, 0.8)',
    border: 'none',
    cursor: 'pointer',
    color: isDark ? '#e2e8f0' : '#334155',
    transition: 'background-color 0.2s, transform 0.1s',
  };
  
  return (
    <div style={controlsStyle}>
      <button
        style={buttonStyle}
        onClick={onZoomIn}
        title="Zoom In"
        aria-label="Zoom In"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </button>
      
      <button
        style={buttonStyle}
        onClick={onZoomOut}
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      </button>
      
      <button
        style={buttonStyle}
        onClick={onResetView}
        title="Reset View"
        aria-label="Reset View"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="1 4 1 10 7 10" />
          <polyline points="23 20 23 14 17 14" />
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
        </svg>
      </button>
    </div>
  );
}; 