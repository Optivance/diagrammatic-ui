import React, { useState, useRef, useEffect } from 'react';
import { Node, NodeMenuItem, NodeStyleConfig } from '../../types/graph';
import SimpleNodeMenu from './SimpleNodeMenu';
import { File, Code, Database, Layout, Box, ChevronDown, ChevronRight } from 'lucide-react';

export interface CustomDocumentNodeProps {
  /** The node data to visualize */
  node: Node;
  /** Position coordinates for the node */
  position: { x: number; y: number };
  /** Callback when the node position changes */
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  /** Whether this node is currently selected */
  isHighlighted?: boolean;
  /** Whether this node is part of a highlighted path */
  isPathHighlighted?: boolean;
  /** Callback when the node is clicked */
  onNodeClick?: (node: Node) => void;
  /** Scale factor for node size */
  sizeScale?: number;
  /** Theme to use (light or dark) */
  theme?: 'light' | 'dark';
  /** Whether the node is interactive (can be clicked/dragged) */
  isInteractive?: boolean;
  /** Whether the node is currently being dragged */
  isDragging?: boolean;
  /** Callback when node size changes */
  onSizeChange?: (size: { width: number; height: number }) => void;
  /** Custom menu items for the node */
  menuItems?: NodeMenuItem[];
  /** Whether to show the dropdown menu button */
  showDropdownMenu?: boolean;
  /** Whether to enable the context menu */
  enableContextMenu?: boolean;
  /** Optional handler for mouse down events */
  onMouseDown?: (e: React.MouseEvent) => void;
  /** Handler for context menu events */
  onContextMenu?: (e: React.MouseEvent) => void;
  /** Style configuration */
  styleConfig?: NodeStyleConfig;
}

/**
 * Custom document-style node component
 */
export const CustomDocumentNode: React.FC<CustomDocumentNodeProps> = ({
  node,
  position,
  isHighlighted = false,
  isPathHighlighted = false,
  onNodeClick,
  sizeScale = 1,
  theme = 'light',
  isInteractive = true,
  isDragging,
  onSizeChange,
  menuItems = [],
  showDropdownMenu = true,
  enableContextMenu = true,
  onMouseDown,
  onContextMenu,
  styleConfig,
}) => {
  // State
  const [showMenu, setShowMenu] = useState(false);
  const [nodeWidth, setNodeWidth] = useState(280);
  const [nodeHeight, setNodeHeight] = useState(280);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  
  // Refs
  const nodeRef = useRef<SVGGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize expanded sections
  useEffect(() => {
    if (node.sections) {
      const initialExpandedState: Record<string, boolean> = {};
      node.sections.forEach(section => {
        initialExpandedState[section.id] = true; // Start expanded by default
      });
      setExpandedSections(initialExpandedState);
    }
  }, [node.id]); // Only run when node ID changes
  
  // Calculate content size on mount and when node changes
  useEffect(() => {
    if (contentRef.current) {
      const { offsetWidth, offsetHeight } = contentRef.current;
      setNodeWidth(Math.max(280, offsetWidth));
      setNodeHeight(Math.max(280, offsetHeight));
      
      if (onSizeChange) {
        onSizeChange({ width: Math.max(280, offsetWidth), height: Math.max(280, offsetHeight) });
      }
    }
  }, [node, onSizeChange, expandedSections, sizeScale]);

  // Prevent wheel events from propagating to the canvas (which would zoom)
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      const container = scrollContainer;
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      // Check if scrolling is possible
      const canScrollUp = scrollTop > 0;
      const canScrollDown = scrollTop < scrollHeight - clientHeight;
      
      // If we're trying to scroll up and there's room to scroll, or
      // we're trying to scroll down and there's room to scroll
      if ((e.deltaY < 0 && canScrollUp) || (e.deltaY > 0 && canScrollDown)) {
        e.stopPropagation();
        
        // Only prevent default if we're actually handling the scroll
        // This allows scrolling to propagate when we reach the top/bottom
        e.preventDefault();
        
        // Manual scroll adjustment
        container.scrollTop += e.deltaY;
      }
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Handle node click
  const handleNodeClick = (e: React.MouseEvent) => {
    if (onNodeClick) {
      e.preventDefault();
      e.stopPropagation();
      onNodeClick(node);
    }
  };

  // Handle mouse down
  const handleMouseDown = (e: React.MouseEvent) => {
    if (onMouseDown) {
      onMouseDown(e);
    }
  };

  // Menu toggle handler
  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // Handle context menu (right click)
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!enableContextMenu) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Close dropdown menu if open
    setShowMenu(false);
    
    // Get the exact cursor position
    const x = e.clientX;
    const y = e.clientY;
    
    // Set the position and show the context menu
    setContextMenuPosition({ x, y });
    setShowContextMenu(true);
    
    if (onContextMenu) {
      onContextMenu(e);
    }
  };
  
  // Toggle section expand/collapse
  const toggleSection = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  // Format display values
  const title = node.name || node.id;
  const filePath = node.description || '';
  const sections = node.sections || [];
  const nodeType = node.type || 'Default';
  
  // Get color styles for different node types
  const getColorStyles = () => {
    const nodeType = node.type || 'default';
    const defaultColors = {
      header: theme === 'dark' ? '#1e293b' : '#f8fafc',
      headerText: theme === 'dark' ? '#e2e8f0' : '#1e293b',
      border: theme === 'dark' ? '#475569' : '#cbd5e1',
      tag: theme === 'dark' ? '#334155' : '#e2e8f0',
      tagText: theme === 'dark' ? '#e2e8f0' : '#475569',
      sections: theme === 'dark' ? '#0f172a' : '#ffffff',
      icon: theme === 'dark' ? '#94a3b8' : '#64748b'
    };
    
    // Check if styleConfig has custom colors for this node type
    if (styleConfig?.typeStyles?.[nodeType]) {
      const customStyle = styleConfig.typeStyles[nodeType];
      // Apply custom colors if available
      return {
        header: customStyle.backgroundColor ? String(customStyle.backgroundColor) : defaultColors.header,
        headerText: customStyle.textColor ? String(customStyle.textColor) : defaultColors.headerText,
        border: customStyle.color ? String(customStyle.color) : defaultColors.border,
        tag: customStyle.backgroundColor ? String(customStyle.backgroundColor) : defaultColors.tag,
        tagText: customStyle.textColor ? String(customStyle.textColor) : defaultColors.tagText,
        sections: theme === 'dark' ? '#0f172a' : '#ffffff',
        icon: customStyle.color ? String(customStyle.color) : defaultColors.icon
      };
    }
    
    // Color mapping based on node type
    const colorMap: Record<string, typeof defaultColors> = {
      primary: {
        header: theme === 'dark' ? '#312e81' : '#e0e7ff',
        headerText: theme === 'dark' ? '#e0e7ff' : '#312e81',
        border: theme === 'dark' ? '#4f46e5' : '#6366f1',
        tag: theme === 'dark' ? '#4338ca' : '#c7d2fe',
        tagText: theme === 'dark' ? '#e0e7ff' : '#4338ca',
        sections: theme === 'dark' ? '#1e1b4b' : '#ffffff',
        icon: theme === 'dark' ? '#818cf8' : '#4f46e5'
      },
      secondary: {
        header: theme === 'dark' ? '#064e3b' : '#d1fae5',
        headerText: theme === 'dark' ? '#d1fae5' : '#064e3b',
        border: theme === 'dark' ? '#059669' : '#10b981',
        tag: theme === 'dark' ? '#047857' : '#a7f3d0',
        tagText: theme === 'dark' ? '#d1fae5' : '#047857',
        sections: theme === 'dark' ? '#022c22' : '#ffffff',
        icon: theme === 'dark' ? '#34d399' : '#059669'
      },
      tertiary: {
        header: theme === 'dark' ? '#7c2d12' : '#ffedd5',
        headerText: theme === 'dark' ? '#ffedd5' : '#7c2d12',
        border: theme === 'dark' ? '#ea580c' : '#f97316',
        tag: theme === 'dark' ? '#c2410c' : '#fed7aa',
        tagText: theme === 'dark' ? '#ffedd5' : '#c2410c',
        sections: theme === 'dark' ? '#431407' : '#ffffff',
        icon: theme === 'dark' ? '#fb923c' : '#ea580c'
      }
    };

    return colorMap[nodeType.toLowerCase()] || defaultColors;
  };

  const colorStyles = getColorStyles();
  
  // Get node styling
  const highlightStyles = isHighlighted ? {
    boxShadow: theme === 'dark' 
      ? `0 0 0 2px ${colorStyles.border}, 0 0 15px rgba(59, 130, 246, 0.5)`
      : `0 0 0 2px ${colorStyles.border}, 0 0 15px rgba(59, 130, 246, 0.3)`
  } : isPathHighlighted ? {
    boxShadow: theme === 'dark'
      ? `0 0 0 2px ${colorStyles.border}aa, 0 0 10px rgba(99, 102, 241, 0.3)`
      : `0 0 0 2px ${colorStyles.border}aa, 0 0 10px rgba(99, 102, 241, 0.2)`
  } : {};

  // Get document icon based on node type
  const getNodeIcon = () => {
    const nodeType = node.type || 'default';
    const iconSize = 18;
    const iconColor = colorStyles.icon;

    switch (nodeType.toLowerCase()) {
      case 'file':
      case 'document':
        return <File size={iconSize} color={iconColor} />;
      case 'code':
      case 'function':
        return <Code size={iconSize} color={iconColor} />;
      case 'data':
      case 'database':
        return <Database size={iconSize} color={iconColor} />;
      case 'component':
      case 'ui':
        return <Layout size={iconSize} color={iconColor} />;
      default:
        return <Box size={iconSize} color={iconColor} />;
    }
  };

  // Apply dragging styles if node is being dragged
  const dragStyles = isDragging ? {
    cursor: 'grabbing',
    transform: 'scale(1.05)',
    boxShadow: theme === 'dark' 
      ? `0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3), 0 0 0 2px ${colorStyles.border}80`
      : `0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1), 0 0 0 2px ${colorStyles.border}80`
  } : {};

  return (
    <g
      ref={nodeRef}
      transform={`translate(${position.x}, ${position.y})`}
      className={`document-node ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
      onClick={handleNodeClick}
      onContextMenu={handleContextMenu}
      style={{ 
        cursor: isDragging ? 'grabbing' : (isInteractive ? 'grab' : 'default'), 
        pointerEvents: 'all'
      }}
      data-node-type="document"
      data-node-id={node.id}
    >
      <foreignObject
        x={-nodeWidth / 2}
        y={-nodeHeight / 2}
        width={nodeWidth}
        height={nodeHeight}
        style={{ overflow: 'visible', pointerEvents: 'all' }}
      >
        <div 
          ref={contentRef}
          style={{
            width: '100%',
            height: '100%',
            userSelect: 'none',
            touchAction: 'none',
            pointerEvents: 'all',
            boxSizing: 'border-box',
            borderRadius: '12px',
            overflow: 'hidden',
            border: `2px solid ${colorStyles.border}`,
            backgroundColor: theme === 'dark' ? colorStyles.sections : '#ffffff',
            boxShadow: theme === 'dark' 
              ? `0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2), 0 0 0 1px ${colorStyles.border}40` 
              : `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1), 0 0 0 1px ${colorStyles.border}40`,
            ...highlightStyles,
            display: 'flex',
            flexDirection: 'column',
            ...dragStyles,
          }}
          // We add onMouseDown here to prevent wheel events from default action when cursor is over content
          onMouseDown={(e) => {
            if (onMouseDown) {
              onMouseDown(e);
            }
            // Stop event here to prevent it from reaching foreignObject handlers
            e.stopPropagation();
          }}
        >
          {/* Header with title and icon */}
          <div style={{ 
            padding: '12px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${colorStyles.border}`,
            backgroundColor: colorStyles.header,
            color: colorStyles.headerText,
            flexShrink: 0,
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '8px'
            }}>
              {getNodeIcon()}
              <span style={{ 
                fontWeight: 600, 
                fontSize: '16px',
                color: colorStyles.headerText
              }}>
                {title}
              </span>
            </div>
            <div>
              {showDropdownMenu && (
                <button 
                  className="node-menu-btn"
                  onClick={handleMenuToggle}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colorStyles.headerText,
                    padding: '4px'
                  }}
                >
                  {/* Three dots menu icon */}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                    <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Description/filepath */}
          <div style={{ 
            padding: '8px 16px', 
            fontSize: '13px',
            color: theme === 'dark' ? '#94a3b8' : '#64748b',
            borderBottom: `1px solid ${colorStyles.border}40`,
            backgroundColor: theme === 'dark' 
              ? `${colorStyles.sections}99` 
              : `${colorStyles.header}20`,
            flexShrink: 0,
          }}>
            {filePath}
          </div>
          
          {/* Tags or metadata */}
          <div style={{ 
            padding: '8px 16px',
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            borderBottom: `1px solid ${colorStyles.border}40`,
            backgroundColor: theme === 'dark' 
              ? `${colorStyles.sections}99` 
              : `${colorStyles.header}20`,
            flexShrink: 0,
          }}>
            <div style={{
              fontSize: '12px',
              padding: '2px 8px',
              borderRadius: '4px',
              backgroundColor: colorStyles.tag,
              color: colorStyles.tagText,
              fontWeight: 500,
              border: `1px solid ${colorStyles.border}50`,
            }}>
              {nodeType}
            </div>
          </div>
          
          {/* Sections - Scrollable content */}
          <div 
            ref={scrollContainerRef}
            style={{ 
              flex: '1 1 auto',
              overflow: 'auto',
              backgroundColor: sections.length > 0 ? colorStyles.sections : 'transparent',
              maxHeight: '180px', // Limit height and enable scrolling
              scrollbarWidth: 'none', // Hide scrollbar in Firefox
              msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
            }}
            className="hide-scrollbar" // Class for hiding WebKit scrollbars
          >
            <style>
              {`
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            {sections.map((section, index) => (
              <div key={section.id} 
                style={{
                  borderBottom: index < sections.length - 1 ? 
                    `1px solid ${colorStyles.border}30` : 
                    'none'
                }}
              >
                {/* Section header with expand/collapse */}
                <div 
                  onClick={(e) => toggleSection(e, section.id)}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: colorStyles.headerText,
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  {expandedSections[section.id] ? (
                    <ChevronDown size={16} color={colorStyles.border} style={{ marginRight: '4px' }} />
                  ) : (
                    <ChevronRight size={16} color={colorStyles.border} style={{ marginRight: '4px' }} />
                  )}
                  
                  <span style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: colorStyles.border,
                    marginRight: '6px',
                  }}></span>
                  {section.name}
                </div>
                
                {/* Section content - collapsible */}
                {expandedSections[section.id] && (
                  <div style={{
                    padding: '0 16px 8px 40px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}>
                    {Array.isArray(section.items) && section.items.map((item: {id: string, value: string}, i: number) => (
                      <div key={i} style={{
                        fontSize: '12px',
                        color: theme === 'dark' ? colorStyles.headerText + '99' : colorStyles.headerText + 'cc',
                        padding: '2px 0 2px 14px',
                        position: 'relative',
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word',
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: '0',
                          top: '7px',
                          width: '6px',
                          height: '1px',
                          backgroundColor: colorStyles.border,
                        }}></span>
                        {typeof item === 'string' ? item : item.value}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Menu - single instance for both dropdown and context */}
          <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1000 }}>
            <SimpleNodeMenu
              node={node}
              show={showMenu || showContextMenu}
              theme={theme}
              onClose={() => {
                setShowMenu(false);
                setShowContextMenu(false);
              }}
              position={showContextMenu ? 'contextmenu' : 'above'}
              contextMenuPosition={contextMenuPosition}
              items={menuItems}
            />
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

export default CustomDocumentNode; 