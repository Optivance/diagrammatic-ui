import React from 'react';
import { Node, NodeMenuItem } from '../../types/graph';
// Import Lucide React icons for default icons (if needed)
import { Info, Star, Copy, ExternalLink, Trash2, Settings, EyeOff } from 'lucide-react';

interface NodeMenuProps {
  /** The node this menu applies to */
  node: Node;
  /** Whether to show the menu */
  show: boolean;
  /** Theme (light or dark) */
  theme: 'light' | 'dark';
  /** Callback when the menu should close */
  onClose: () => void;
  /** Custom menu items to display */
  items?: NodeMenuItem[];
  /** Position type for the menu */
  position?: 'above' | 'right' | 'contextmenu';
  /** Position for context menu (used when position is 'contextmenu') */
  contextMenuPosition?: { x: number; y: number };
  /** Default standard menu items */
  defaultItems?: NodeMenuItem[];
}

/**
 * Customizable node menu component for showing options when clicking menu button or right-clicking
 */
const NodeMenu: React.FC<NodeMenuProps> = ({
  node,
  show,
  theme,
  onClose,
  items = [],
  position = 'above',
  contextMenuPosition,
  defaultItems = []
}) => {
  if (!show) return null;
  
  const isDark = theme === 'dark';
  const allItems = [...defaultItems, ...items];

  // Define position styles based on menu type
  let positionStyle: React.CSSProperties = {};
  
  if (position === 'contextmenu' && contextMenuPosition) {
    // Context menu positioned at cursor
    positionStyle = {
      position: 'fixed',
      left: contextMenuPosition.x,
      top: contextMenuPosition.y,
    };
  } else if (position === 'above') {
    // Above the node
    positionStyle = {
      position: 'absolute',
      left: '50%',
      top: '-10px',
      transform: 'translate(-50%, -100%)'
    };
  } else if (position === 'right') {
    // To the right of the node
    positionStyle = {
      position: 'absolute',
      left: '100%',
      top: '0',
      transform: 'translateX(10px)'
    };
  }

  return (
    <div 
      style={{
        position: positionStyle.position as any,
        left: positionStyle.left,
        top: positionStyle.top,
        transform: positionStyle.transform,
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        color: isDark ? '#ffffff' : '#000000',
        border: `1px solid ${isDark ? '#475569' : '#e2e8f0'}`,
        borderRadius: '6px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '4px 0',
        minWidth: '160px',
        zIndex: 9999,
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '14px',
        pointerEvents: 'auto'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {allItems.length === 0 && (
        <div style={{ 
          padding: '8px 12px', 
          color: isDark ? '#94a3b8' : '#64748b',
          textAlign: 'center',
          fontSize: '13px'
        }}>
          No actions available
        </div>
      )}
      
      {allItems.map((item, index) => (
        <React.Fragment key={item.id || `menu-item-${index}`}>
          <button 
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              textAlign: 'left',
              padding: '6px 12px',
              border: 'none',
              background: 'none',
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              opacity: item.disabled ? 0.5 : 1,
              color: isDark ? '#fff' : '#000',
              fontSize: '13px',
              backgroundColor: 'transparent',
              transition: 'background-color 0.2s',
              gap: '8px'
            }}
            onMouseOver={(e) => {
              if (!item.disabled) {
                e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f1f5f9';
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (!item.disabled) {
                item.onClick(node);
                onClose();
              }
            }}
            disabled={item.disabled}
          >
            {item.icon && (
              <span 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                  height: '20px',
                  color: isDark ? '#94a3b8' : '#64748b'
                }}
                className="node-menu-icon"
              >
                {item.icon}
              </span>
            )}
            <span style={{ flexGrow: 1 }}>{item.label}</span>
          </button>
          
          {item.divider && (
            <div style={{ 
              height: '1px', 
              margin: '4px 0', 
              backgroundColor: isDark ? '#475569' : '#e2e8f0' 
            }} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default NodeMenu; 