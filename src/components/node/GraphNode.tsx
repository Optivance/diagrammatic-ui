import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Node, NodeMenuItem, NodeStyleConfig } from '../../types/graph';
import { useDragHandler } from '../../hooks/useDragHandler';
import { getNodeStyle, getNodeTypeColor } from '../../utils/graph/nodeStyles';
import SimpleNodeMenu from './SimpleNodeMenu';
import { Info, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export interface GraphNodeProps {
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
  /** Callback to show dependencies of this node */
  onShowDependencies?: (node: Node) => void;
  /** Callback to show dependents of this node */
  onShowDependents?: (node: Node) => void;
  /** Scale factor for node size */
  sizeScale?: number;
  /** Theme to use (light or dark) */
  theme?: 'light' | 'dark';
  /** Total number of nodes currently in view */
  totalNodesInView: number;
  /** Whether the node is interactive (can be clicked/dragged) */
  isInteractive?: boolean;
  /** Current zoom scale of the graph */
  zoomScale?: number;
  /** Minimum node size */
  minNodeSize?: number;
  /** Maximum node size */
  maxNodeSize?: number;
  /** Callback when node size changes */
  onSizeChange?: (size: { width: number; height: number }) => void;
  /** Custom menu items for the node */
  menuItems?: NodeMenuItem[];
  /** Whether to show the dropdown menu button */
  showDropdownMenu?: boolean;
  /** Whether to enable the context menu */
  enableContextMenu?: boolean;
  /** Style configuration */
  styleConfig?: NodeStyleConfig;
}

/**
 * Component that renders a single node in the graph
 */
export const GraphNode: React.FC<GraphNodeProps> = ({
  node,
  position,
  onPositionChange,
  isHighlighted = false,
  isPathHighlighted = false,
  onNodeClick,
  onShowDependencies,
  onShowDependents,
  sizeScale = 1,
  theme = 'light',
  totalNodesInView,
  isInteractive = true,
  zoomScale = 1,
  minNodeSize = 80,
  maxNodeSize = 160,
  onSizeChange,
  menuItems = [],
  showDropdownMenu = true,
  enableContextMenu = true,
  styleConfig,
}) => {
  // Use the drag handler hook - moved up to avoid "used before declaration" errors
  const { isDragging, startDrag, updateCurrentPosition } = useDragHandler(
    isInteractive,
    zoomScale,
    onPositionChange,
    node.id
  );
  
  // Track when dragging starts/ends to prevent size changes
  const wasDraggingRef = useRef(false);
  
  // State
  const [showMenu, setShowMenu] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [nodeWidth, setNodeWidth] = useState(100);
  const [nodeHeight, setNodeHeight] = useState(100);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [sizeLocked, setSizeLocked] = useState(false);
  
  // Refs
  const nodeRef = useRef<SVGGElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastValidPositionRef = useRef(position);
  const previousSizeRef = useRef({ width: nodeWidth, height: nodeHeight });
  const dragStateRef = useRef(false);
  
  // Update drag state ref to prevent race conditions and lock size during dragging
  useEffect(() => {
    dragStateRef.current = isDragging;
    
    // Handle drag start
    if (isDragging && !sizeLocked) {
      setSizeLocked(true);
      wasDraggingRef.current = true;
    } 
    // Handle drag end with a delay to ensure stability
    else if (!isDragging && sizeLocked && wasDraggingRef.current) {
      // Keep size locked for longer after drag ends to avoid flickering
      const timeout = setTimeout(() => {
        // Only unlock after we're sure no resize events are pending
        setSizeLocked(false);
      }, 500); // Increased timeout for better stability
      return () => clearTimeout(timeout);
    }
  }, [isDragging, sizeLocked]);
  
  // When the drag is complete, stabilize the size
  useEffect(() => {
    if (wasDraggingRef.current && !isDragging) {
      // Preserve current size after drag ends
      if (contentRef.current) {
        previousSizeRef.current = { width: nodeWidth, height: nodeHeight };
        
        // Apply a short additional delay before allowing any size recalculation
        const stabilizeTimer = setTimeout(() => {
          wasDraggingRef.current = false;
        }, 300);
        
        return () => clearTimeout(stabilizeTimer);
      }
    }
  }, [isDragging, nodeWidth, nodeHeight]);
  
  // Update last valid position when position prop changes
  useEffect(() => {
    if (!dragStateRef.current) {
      lastValidPositionRef.current = position;
      updateCurrentPosition(position);
    }
  }, [position, updateCurrentPosition]);
  
  // Calculate content size and update node dimensions
  const updateNodeSize = useCallback(() => {
    // Skip size updates during or immediately after dragging
    if (isDragging || sizeLocked || wasDraggingRef.current) return;
    
    if (!contentRef.current) return;
    
    // Get the actual content size
    const contentWidth = contentRef.current.scrollWidth;
    const contentHeight = contentRef.current.scrollHeight;
    
    // Calculate appropriate size based on node type and content
    // Use a fixed base size for consistency
    let baseWidth = Math.max(minNodeSize, 120); // Increase minimum width
    let baseHeight = minNodeSize;
    
    // Adjust size based on node type (simpler calculation)
    switch (node.type) {
      case 'service':
      case 'component':
        // Slightly larger for important nodes
        baseWidth = Math.max(baseWidth, 130);
        baseHeight = Math.max(baseHeight, 90);
        break;
      case 'model':
      case 'context':
        baseWidth = Math.max(baseWidth, 120);
        baseHeight = Math.max(baseHeight, 85);
        break;
      default:
        // Use default size for other types
        break;
    }
    
    // For name length-based sizing
    const displayName = node.name || node.title || `Node ${node.id}`;
    const nameLength = displayName.length;
    
    // Increase width for longer names
    if (nameLength > 10) {
      // Add width for long names
      baseWidth = Math.max(baseWidth, 120 + Math.min(nameLength * 3, 60));
    }
    
    // Give more space for nodes with sections or description
    if (node.sections && node.sections.length > 0) {
      // Add height for sections
      baseHeight += Math.min(node.sections.length * 10, 50);
      baseWidth = Math.max(baseWidth, 140); // Wider to fit section text
    }
    
    if (node.description) {
      // Add height for description
      const descLength = node.description.length;
      baseHeight += Math.min(15 + descLength / 20, 40); // Scale with description length
    }
    
    // Simple content-aware sizing with constraints
    // Give more weight to the horizontal content size
    const contentBasedWidth = Math.min(
      Math.max(contentWidth * 1.1, baseWidth), // Add 10% extra width
      maxNodeSize * 1.5 // Allow width to be 50% larger than maxNodeSize
    );
    
    const contentBasedHeight = Math.min(
      Math.max(contentHeight, baseHeight),
      maxNodeSize
    );
    
    // Use a size proportional to content but not too large
    // Apply totalNodesInView scaling for dense graphs
    const densityFactor = Math.max(0.75, 1 - (Math.min(totalNodesInView, 50) / 70));
    const scaledWidth = contentBasedWidth * densityFactor * sizeScale;
    const scaledHeight = contentBasedHeight * densityFactor * sizeScale;
    
    // Only update when significant change detected
    const finalWidth = Math.max(minNodeSize * 1.5, Math.min(maxNodeSize * 1.5, scaledWidth));
    const finalHeight = Math.max(minNodeSize, Math.min(maxNodeSize, scaledHeight));
    
    if (Math.abs(finalWidth - nodeWidth) > 5 || Math.abs(finalHeight - nodeHeight) > 5) {
      setNodeWidth(finalWidth);
      setNodeHeight(finalHeight);
    }
  }, [minNodeSize, maxNodeSize, sizeScale, nodeWidth, nodeHeight, node, totalNodesInView, isDragging, sizeLocked]);
  
  // Update size when node content changes or on initial render
  useEffect(() => {
    // Don't update the size while dragging to prevent visual glitches
    if (isDragging || sizeLocked) return;
    
    // Set a timeout to avoid rapid successive updates
    const timeoutId = setTimeout(() => {
      updateNodeSize();
    }, 50);
    
    // Add resize observer to handle dynamic content changes
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        // Don't process resize events during drag to prevent visual glitches
        if (isDragging || sizeLocked) return;
        updateNodeSize();
      });
      resizeObserver.observe(contentRef.current);
      return () => {
        resizeObserver.disconnect();
        clearTimeout(timeoutId);
      };
    }
    
    return () => clearTimeout(timeoutId);
  }, [updateNodeSize, isDragging, sizeLocked]);
  
  // Report size changes to parent, but only when they've changed significantly
  useEffect(() => {
    // Don't report size changes during drag to prevent visual glitches
    if (isDragging || sizeLocked) return;
    
    if (onSizeChange && 
        (Math.abs(previousSizeRef.current.width - nodeWidth) > 5 || 
         Math.abs(previousSizeRef.current.height - nodeHeight) > 5)) {
      const newSize = { width: nodeWidth, height: nodeHeight };
      previousSizeRef.current = newSize;
      onSizeChange(newSize);
    }
  }, [nodeWidth, nodeHeight, onSizeChange, isDragging, sizeLocked]);

  // Handle node click (when not dragging)
  const handleNodeClick = (e: React.MouseEvent) => {
    if (!isDragging && onNodeClick) {
      e.preventDefault();
      e.stopPropagation();
      onNodeClick(node);
    }
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !isInteractive) return; // Only handle left mouse button
    if ((e.target as HTMLElement).closest('.node-menu-btn')) return; // Don't drag when clicking menu

    e.preventDefault();
    e.stopPropagation();
    startDrag(e, lastValidPositionRef.current);
  };

  // Menu toggle handler
  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  // Show/hide tooltip
  const handleMouseEnter = () => {
    if (totalNodesInView > 3) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
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
    
    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Menu dimensions (approximate)
    const menuWidth = 200;
    const menuHeight = 300; // Approximation based on menu items
    
    // Adjust position to keep menu in viewport
    let adjustedX = x;
    let adjustedY = y;
    
    // If menu would extend beyond right edge
    if (x + menuWidth > viewportWidth) {
      adjustedX = viewportWidth - menuWidth - 10; // Keep 10px margin
    }
    
    // If menu would extend beyond bottom edge
    if (y + menuHeight > viewportHeight) {
      adjustedY = viewportHeight - menuHeight - 10; // Keep 10px margin
    }
    
    // Set the position and show the context menu
    setContextMenuPosition({ x: adjustedX, y: adjustedY });
    setShowContextMenu(true);
  };

  // Format display value for rendering
  const displayName = node.name || node.title || `Node ${node.id}`;
  const description = node.description || '';
  const path = node.path || '';
  const typeName = node.type?.toUpperCase() || 'NODE';
  const nodeType = node.type || 'default';

  // Get node type styles (consider styleConfig if present)
  const nodeTypeColor = (styleConfig?.typeStyles?.[nodeType]?.color || 
                        getNodeTypeColor(nodeType, theme)) as string;
  const nodeStyle = getNodeStyle(nodeType, theme);
  
  // State-based style modifiers
  const highlightStyles = isHighlighted 
    ? {
        outline: `4px solid ${theme === 'dark' ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 1)'}`,
        zIndex: 10,
      }
    : isPathHighlighted 
      ? {
          outline: `2px solid ${theme === 'dark' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(34, 197, 94, 1)'}`,
          zIndex: 5,
        }
      : {};
      
  const dragStyles = isDragging
    ? {
        opacity: 0.8,
        cursor: 'grabbing',
        zIndex: 20,
      }
    : {
        cursor: isInteractive ? 'grab' : 'default'
      };

  // Create default menu items
  const defaultMenuItems = React.useMemo(() => {
    const items: NodeMenuItem[] = [];
    
    if (onNodeClick) {
      items.push({
        id: 'view-details',
        label: 'View Details',
        icon: <Info size={16} strokeWidth={2} />,
        onClick: (node) => onNodeClick(node)
      });
    }
    
    if (onShowDependencies) {
      items.push({
        id: 'show-dependencies',
        label: 'Show Dependencies',
        icon: <ArrowDownRight size={16} strokeWidth={2} />,
        onClick: (node) => onShowDependencies(node)
      });
    }
    
    if (onShowDependents) {
      items.push({
        id: 'show-dependents',
        label: 'Show Dependents',
        icon: <ArrowUpRight size={16} strokeWidth={2} />,
        onClick: (node) => onShowDependents(node)
      });
    }
    
    return items;
  }, [onNodeClick, onShowDependencies, onShowDependents]);

  // Prevent wheel events from propagating to the canvas (which would zoom)
  // And provide a coordinated drag and scroll behavior
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      // Get scroll properties
      const container = scrollContainer;
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      // Check if scrolling is possible in the direction we're scrolling
      const canScrollUp = scrollTop > 0;
      const canScrollDown = scrollTop < scrollHeight - clientHeight;
      
      // If we're trying to scroll up and there's room to scroll, or
      // we're trying to scroll down and there's room to scroll
      if ((e.deltaY < 0 && canScrollUp) || (e.deltaY > 0 && canScrollDown)) {
        // Stop propagation to prevent parent (canvas) from zooming
        e.stopPropagation();
        
        // Only prevent default if we're actually handling the scroll
        // This allows scrolling to propagate when we reach the top/bottom
        e.preventDefault();
        
        // Manual scroll adjustment
        container.scrollTop += e.deltaY;
      }
    };

    // Handle mouse down to allow dragging from the scrollable area
    const handleScrollContainerMouseDown = (e: MouseEvent) => {
      // Only handle left mouse button
      if (e.button !== 0 || !isInteractive) return;
      
      // Prevent starting drag when clicking on interactive elements
      if ((e.target as HTMLElement).closest('.node-menu-btn')) return;
      
      // Allow the event to propagate for drag handling
      // But prevent text selection during drag
      e.preventDefault();
      
      // Start the drag operation directly
      // Convert MouseEvent to React.MouseEvent type that startDrag expects
      // This is a workaround as we can't directly pass a native MouseEvent
      const syntheticEvent = {
        button: e.button,
        clientX: e.clientX,
        clientY: e.clientY,
        preventDefault: () => e.preventDefault(),
        stopPropagation: () => e.stopPropagation(),
        target: e.target,
        currentTarget: e.currentTarget,
      } as unknown as React.MouseEvent;
      
      startDrag(syntheticEvent, lastValidPositionRef.current);
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    scrollContainer.addEventListener('mousedown', handleScrollContainerMouseDown);
    
    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
      scrollContainer.removeEventListener('mousedown', handleScrollContainerMouseDown);
    };
  }, [isInteractive, startDrag]);

  return (
    <g
      ref={nodeRef}
      transform={`translate(${position.x}, ${position.y})`}
      className="graph-node"
      onMouseDown={handleMouseDown}
      onClick={handleNodeClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isInteractive ? 'pointer' : 'default' }}
    >
      <foreignObject
        x={-nodeWidth / 2}
        y={-nodeHeight / 2}
        width={nodeWidth}
        height={nodeHeight}
        style={{ overflow: 'visible' }}
      >
        <div 
          ref={contentRef}
          style={{
            width: '100%',
            height: '100%',
      
            userSelect: 'none',
            touchAction: 'none',
            padding: '8px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            ...nodeStyle,
            ...highlightStyles,
            ...dragStyles,
          }}
        >
          {/* Header row with title and menu */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              minWidth: 0,
              flex: 1
            }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: nodeTypeColor,
                flexShrink: 0,
              }} />
              <span style={{ 
                fontWeight: 500, 
                fontSize: '12px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                minWidth: 0
              }}>
                {displayName}
              </span>
              
              {/* Integrated menu button in the header */}
              {showDropdownMenu && isInteractive && (
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    marginLeft: '4px',
                    flexShrink: 0,
                    transition: 'background-color 0.2s',
                    backgroundColor: theme === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)'
                  }}
                  onClick={handleMenuToggle}
                  aria-label="Node options"
                  className="node-menu-btn"
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark' 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : 'rgba(0, 0, 0, 0.05)';
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1.5" />
                    <circle cx="19" cy="12" r="1.5" />
                    <circle cx="5" cy="12" r="1.5" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Path info (static) */}
          {path && (
            <div style={{ 
              fontSize: '9px', 
              opacity: 0.7, 
              marginTop: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              flexShrink: 0
            }}>
              {path}
            </div>
          )}
          
          {/* Type tag (static) */}
          <div style={{ 
            display: 'flex',
            flexWrap: 'wrap',
            gap: '2px',
            marginTop: '4px',
            flexShrink: 0
          }}>
            <div style={{ 
              display: 'inline-block',
              fontSize: '9px',
              backgroundColor: theme === 'dark' 
                ? 'rgba(0, 0, 0, 0.2)' 
                : 'rgba(255, 255, 255, 0.5)',
              padding: '1px 4px',
              borderRadius: '3px',
              flexShrink: 0
            }}>
              {typeName}
            </div>
            
            {node.sections && node.sections.length > 0 && (
              <div style={{ 
                display: 'inline-block',
                fontSize: '9px',
                backgroundColor: theme === 'dark' 
                  ? 'rgba(0, 0, 0, 0.15)' 
                  : 'rgba(255, 255, 255, 0.4)',
                padding: '1px 4px',
                borderRadius: '3px',
                flexShrink: 0
              }}>
                {node.sections.length} section{node.sections.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {/* Scrollable content area */}
          <div
            ref={scrollContainerRef}
            style={{ 
              flex: '1 1 auto',
              overflow: 'auto',
              marginTop: '4px',
              minHeight: '40px', // Ensure there's always visible content
              maxHeight: '150px', // Cap maximum height for large content
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
            
            {/* Description (scrollable) */}
            {description && (
              <div style={{
                fontSize: '10px',
                opacity: 0.85,
                wordWrap: 'break-word',
                whiteSpace: 'normal',
                marginBottom: '4px'
              }}>
                {description}
              </div>
            )}
            
            {/* Section content (scrollable) */}
            {node.sections && node.sections.length > 0 && nodeWidth > 120 && (
              <div style={{ fontSize: '9px' }}>
                <ul style={{ 
                  margin: '1px 0 0 0', 
                  padding: '0 0 0 12px',
                }}>
                  {node.sections.map(section => (
                    <li key={section.id}>
                      {section.name}: {section.items.length}
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              defaultItems={defaultMenuItems}
              items={menuItems}
            />
          </div>
          
          {/* Node Tooltip */}
          {showTooltip && !showMenu && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '4px',
              backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
              borderRadius: '6px',
              boxShadow: theme === 'dark' 
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -4px rgba(0, 0, 0, 0.2)' 
                : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
              zIndex: 50,
              padding: '8px 12px',
              minWidth: '200px',
            }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{displayName}</div>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>Type: {typeName}</div>
              {path && (
                <div style={{ fontSize: '12px', opacity: 0.8 }}>Path: {path}</div>
              )}
              {node.sections && node.sections.length > 0 && (
                <div style={{ marginTop: '4px', fontSize: '12px' }}>
                  <div style={{ fontWeight: 500 }}>Contains:</div>
                  <ul style={{ 
                    margin: '2px 0 0 0', 
                    padding: '0 0 0 16px',
                    maxHeight: '60px',
                    overflow: 'hidden'
                  }}>
                    {node.sections.map(section => (
                      <li key={section.id}>
                        {section.name}: {section.items.length} items
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  );
}; 