import React from 'react';
import { Node, NodeMenuItem } from '../../types/graph';
import { 
  Info, 
  Star, 
  Copy, 
  ExternalLink, 
  Trash2, 
  Settings, 
  EyeOff, 
  ArrowUpRight, 
  ArrowDownRight
} from 'lucide-react';

interface SimpleNodeMenuProps {
  node: Node;
  show: boolean;
  theme: 'light' | 'dark';
  onClose: () => void;
  items?: NodeMenuItem[];
  position?: 'above' | 'right' | 'contextmenu';
  contextMenuPosition?: { x: number; y: number };
  defaultItems?: NodeMenuItem[];
}

const SimpleNodeMenu: React.FC<SimpleNodeMenuProps> = ({
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

  // Get position style based on menu type
  let positionStyle: React.CSSProperties = {};
  
  if (position === 'contextmenu' && contextMenuPosition) {
    positionStyle = {
      position: 'fixed',
      left: contextMenuPosition.x,
      top: contextMenuPosition.y,
    };
  } else if (position === 'above') {
    positionStyle = {
      position: 'absolute',
      left: '50%',
      top: '-10px',
      transform: 'translate(-50%, -100%)'
    };
  } else if (position === 'right') {
    positionStyle = {
      position: 'absolute',
      left: '100%',
      top: '0',
      transform: 'translateX(10px)'
    };
  }

  // Function to render the appropriate icon based on ID or name
  const renderIcon = (item: NodeMenuItem) => {
    if (!item.icon) return null;
    
    const id = item.id.toLowerCase();
    const iconProps = { size: 16, strokeWidth: 2, color: isDark ? '#94a3b8' : '#64748b' };
    
    // If we already have a React element, use it
    if (React.isValidElement(item.icon)) {
      return item.icon;
    }
    
    // Fallback to ID-based icon rendering
    if (id.includes('view') || id.includes('detail') || id.includes('info')) {
      return <Info {...iconProps} />;
    } else if (id.includes('favorite') || id.includes('star')) {
      return <Star {...iconProps} color="#f59e0b" />;
    } else if (id.includes('copy')) {
      return <Copy {...iconProps} />;
    } else if (id.includes('open') || id.includes('link')) {
      return <ExternalLink {...iconProps} />;
    } else if (id.includes('config') || id.includes('setting')) {
      return <Settings {...iconProps} />;
    } else if (id.includes('hide')) {
      return <EyeOff {...iconProps} />;
    } else if (id.includes('delete') || id.includes('remove')) {
      return <Trash2 {...iconProps} color="#ef4444" />;
    } else if (id.includes('dependencies')) {
      return <ArrowDownRight {...iconProps} />;
    } else if (id.includes('dependents')) {
      return <ArrowUpRight {...iconProps} />;
    }
    
    return null;
  };

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
            <span 
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                flexShrink: 0
              }}
            >
              {renderIcon(item)}
            </span>
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

export default SimpleNodeMenu; 