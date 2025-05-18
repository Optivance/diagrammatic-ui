import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GraphData, Node as GraphNode, Edge, Position, NodeMenuConfig } from '../../types/graph';
import { GraphEdges } from '../edge/GraphEdges';
import { GraphNode as GraphNodeComponent } from '../node/GraphNode';
import { GraphDefs } from './GraphDefs';
import { GraphControls } from './GraphControls';
import { LayoutType } from '../../layouts';
import { createLayout } from '../../layouts/factory';

export interface InteractionOptions {
  /** Enable node/edge selection */
  selectionEnabled?: boolean;
  /** Enable multi-selection with Ctrl/Cmd key */
  multiSelectionEnabled?: boolean;
  /** Enable node dragging */
  draggingEnabled?: boolean;
  /** Enable zoom with mouse wheel/pinch */
  zoomEnabled?: boolean;
  /** Enable panning by dragging the background */
  panningEnabled?: boolean;
  /** Enable edge creation through interaction */
  edgeCreationEnabled?: boolean;
  /** Minimum zoom level */
  minZoom?: number;
  /** Maximum zoom level */
  maxZoom?: number;
  /** Fit graph to viewport on initialization */
  fitViewOnInit?: boolean;
}

export interface GraphProps {
  /** The graph data to visualize */
  data: GraphData;
  /** Width of the graph container in pixels */
  width?: number;
  /** Height of the graph container in pixels */
  height?: number;
  /** Type of automatic layout to apply */
  autoLayout?: LayoutType;
  /** Options for the layout algorithm */
  layoutOptions?: any;
  /** Scale factor for node sizes */
  nodeSizeScale?: number;
  /** Visual theme to use */
  theme?: 'light' | 'dark';
  /** Configuration for interactive features */
  interactionOptions?: InteractionOptions;
  /** Configuration for node menus (context and dropdown) */
  nodeMenuConfig?: NodeMenuConfig;
  /** Callback when a node is clicked */
  onNodeClick?: (nodeId: string) => void;
  /** Callback when an edge is clicked */
  onEdgeClick?: (sourceId: string, targetId: string) => void;
  /** Callback when the viewport changes */
  onViewportChange?: (transform: { x: number; y: number; scale: number }) => void;
  /** Callback when mouse enters a node */
  onNodeMouseEnter?: (nodeId: string) => void;
  /** Callback when mouse leaves a node */
  onNodeMouseLeave?: (nodeId: string) => void;
  /** Callback when selection changes */
  onSelectionChange?: (selectedNodes: string[], selectedEdges: string[]) => void;
  /** Callback when dragging starts */
  onDragStart?: (nodeIds: string[]) => void;
  /** Callback during dragging */
  onDrag?: (nodeIds: string[], position: Position) => void;
  /** Callback when dragging ends */
  onDragEnd?: (nodeIds: string[]) => void;
}

/**
 * Main Graph component for visualizing nodes and their connections
 */
export const Graph: React.FC<GraphProps> = ({
  data,
  width = 800,
  height = 600,
  autoLayout = 'force',
  layoutOptions = {},
  nodeSizeScale = 1,
  theme = 'light',
  interactionOptions = {},
  nodeMenuConfig = {},
  onNodeClick: externalNodeClickHandler,
  onEdgeClick: externalEdgeClickHandler,
  onViewportChange,
  onNodeMouseEnter,
  onNodeMouseLeave,
  onSelectionChange,
  onDragStart,
  onDrag,
  onDragEnd,
}) => {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<SVGSVGElement>(null);
  const transformGroupRef = useRef<SVGGElement>(null);

  // Extract interaction options with defaults
  const {
    draggingEnabled = true,
    zoomEnabled = true,
    panningEnabled = true,
    selectionEnabled = true,
    multiSelectionEnabled = false,
    minZoom = 0.1,
    maxZoom = 5,
    fitViewOnInit = true
  } = interactionOptions;

  // Validate and process the data
  const processedData = React.useMemo(() => {
    if (!data || !data.nodes || !Array.isArray(data.nodes)) {
      console.error('Invalid graph data format');
      return { nodes: [], edges: [], metadata: {} } as GraphData;
    }
    return data;
  }, [data]);

  // Core state
  const [viewportSize, setViewportSize] = useState({ width, height });
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [nodePositions, setNodePositions] = useState<Record<string, Position>>({});
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<{
    nodes: Set<string>;
    edges: Set<string>;
  }>({ nodes: new Set(), edges: new Set() });
  const [nodeSizes, setNodeSizes] = useState<Record<string, { width: number; height: number }>>({});

  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  
  // Initialization state
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Track previous layout type to detect changes
  const prevLayoutTypeRef = useRef(autoLayout);

  // Reset initialization state when layout type changes
  useEffect(() => {
    if (prevLayoutTypeRef.current !== autoLayout) {
      setIsInitialized(false);
      prevLayoutTypeRef.current = autoLayout;
    }
  }, [autoLayout]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewportSize({
          width: rect.width || width,
          height: rect.height || height,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [width, height]);

  // Initialize graph layout and position
  useEffect(() => {
    if (processedData.nodes.length === 0 || isInitialized) return;

    try {
      // Apply layout algorithm
      const layoutResult = createLayout(
        processedData.nodes,
        processedData.edges,
        {
          type: autoLayout,
          layoutOptions,
          width: viewportSize.width,
          height: viewportSize.height
        }
      );

      // Calculate the bounds of the layout
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
      Object.values(layoutResult).forEach(pos => {
        minX = Math.min(minX, pos.x);
        maxX = Math.max(maxX, pos.x);
        minY = Math.min(minY, pos.y);
        maxY = Math.max(maxY, pos.y);
      });

      // Calculate the center of the layout
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;

      // Center the layout by subtracting the center offset from each position
      const centeredLayout: Record<string, Position> = {};
      Object.entries(layoutResult).forEach(([nodeId, pos]) => {
        centeredLayout[nodeId] = {
          x: pos.x - centerX,
          y: pos.y - centerY
        };
      });

      // Set node positions
      setNodePositions(centeredLayout);
    } catch (e) {
      console.error("Error applying layout:", e);
      
      // Fallback to a simple grid layout
      const initialPositions: Record<string, Position> = {};
      const gridSize = Math.ceil(Math.sqrt(processedData.nodes.length));
      const spacing = 150;

      processedData.nodes.forEach((node, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        
        // Position nodes in a grid, centered at (0,0)
        initialPositions[node.id] = {
          x: (col - gridSize/2) * spacing,
          y: (row - gridSize/2) * spacing
        };
      });

      setNodePositions(initialPositions);
    }

    // Center the view
    setTransform({
      x: viewportSize.width / 2,
      y: viewportSize.height / 2,
      scale: 1
    });

    setIsInitialized(true);
  }, [processedData.nodes, processedData.edges, autoLayout, layoutOptions, viewportSize, isInitialized]);

  // Node position change handler (for dragging)
  const handleNodePositionChange = useCallback((id: string, position: Position) => {
    if (!draggingEnabled) return;

    setNodePositions(prev => ({
      ...prev,
      [id]: position
    }));

    if (onDrag) {
      onDrag([id], position);
    }
  }, [draggingEnabled, onDrag]);

  // Add node size change handler
  const handleNodeSizeChange = useCallback((
    id: string,
    size: { width: number; height: number }
  ) => {
    // Use a ref to avoid triggering re-renders for minor size changes
    setNodeSizes(prev => {
      // Skip update if the change is too small
      const prevSize = prev[id];
      if (prevSize && 
          Math.abs(prevSize.width - size.width) < 5 && 
          Math.abs(prevSize.height - size.height) < 5) {
        return prev;
      }
      
      // Only update if there's a meaningful change
      return {
        ...prev,
        [id]: size
      };
    });
  }, []);

  // Add wheel event listener with non-passive option for zoom
  useEffect(() => {
    const svgElement = graphRef.current;
    if (!svgElement) return;

    const handleWheelEvent = (e: WheelEvent) => {
      if (!zoomEnabled) return;
      
      e.preventDefault();
      
      const svgRect = svgElement.getBoundingClientRect();
      
      // Calculate pointer position relative to SVG
      const pointerX = e.clientX - svgRect.left;
      const pointerY = e.clientY - svgRect.top;
      
      // Calculate zoom factor (smaller value for more gradual zoom)
      const zoomFactor = -e.deltaY * 0.0005;
      const newScale = Math.max(
        minZoom, 
        Math.min(maxZoom, transform.scale * (1 + zoomFactor))
      );
      
      // Calculate point under cursor in graph coordinates
      const graphX = (pointerX - transform.x) / transform.scale;
      const graphY = (pointerY - transform.y) / transform.scale;
      
      // Calculate new transform to keep point under cursor fixed
      const newTransform = {
        x: pointerX - graphX * newScale,
        y: pointerY - graphY * newScale,
        scale: newScale
      };
      
      setTransform(newTransform);
      
      if (onViewportChange) {
        onViewportChange(newTransform);
      }
    };

    svgElement.addEventListener('wheel', handleWheelEvent, { passive: false });
    
    return () => {
      svgElement.removeEventListener('wheel', handleWheelEvent);
    };
  }, [transform, zoomEnabled, minZoom, maxZoom, onViewportChange]);

  // Find connected nodes
  const findConnectedNodes = useCallback((nodeId: string) => {
    const connectedNodes = new Set<string>();
    const connectedEdges = new Set<string>();

    connectedNodes.add(nodeId);

    processedData.edges.forEach((edge) => {
      if (edge.source === nodeId || edge.target === nodeId) {
        connectedEdges.add(`${edge.source}-${edge.target}`);
        connectedNodes.add(edge.source);
        connectedNodes.add(edge.target);
      }
    });

    return { nodes: connectedNodes, edges: connectedEdges };
  }, [processedData.edges]);

  // Node click handler
  const handleNodeClick = useCallback((node: GraphNode) => {
    setSelectedNode(prev => prev?.id === node.id ? null : node);
    const { nodes, edges } = findConnectedNodes(node.id);
    setHighlightedPath({ nodes, edges });
    
    if (externalNodeClickHandler) {
      externalNodeClickHandler(node.id);
    }
  }, [findConnectedNodes, externalNodeClickHandler]);

  // Edge click handler
  const handleEdgeClick = useCallback((edge: Edge) => {
    setHighlightedPath({
      nodes: new Set([edge.source, edge.target]),
      edges: new Set([`${edge.source}-${edge.target}`]),
    });
    
    if (externalEdgeClickHandler) {
      externalEdgeClickHandler(edge.source, edge.target);
    }
  }, [externalEdgeClickHandler]);

  // Background click handler
  const handleBackgroundClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as Element).tagName === 'svg') {
      setSelectedNode(null);
      setHighlightedPath({ nodes: new Set(), edges: new Set() });
    }
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!panningEnabled || e.button !== 0) return; // Only left mouse button
    
    const target = e.target as Element;
    if (target.tagName === 'svg' || target === transformGroupRef.current) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
      document.body.style.cursor = 'grabbing';
    }
  }, [panningEnabled]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    
    setTransform(prev => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setPanStart({ x: e.clientX, y: e.clientY });
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      document.body.style.cursor = 'default';
      
      if (onViewportChange) {
        onViewportChange(transform);
      }
    }
  }, [isPanning, onViewportChange, transform]);

  // Reset view handler
  const handleResetView = useCallback(() => {
    // Calculate the bounds of all nodes
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    Object.values(nodePositions).forEach(pos => {
      minX = Math.min(minX, pos.x);
      maxX = Math.max(maxX, pos.x);
      minY = Math.min(minY, pos.y);
      maxY = Math.max(maxY, pos.y);
    });

    // Calculate the width and height of the graph
    const width = maxX - minX;
    const height = maxY - minY;

    // Calculate the scale needed to fit the graph in the viewport
    const scaleX = width > 0 ? viewportSize.width * 0.8 / width : 1;
    const scaleY = height > 0 ? viewportSize.height * 0.8 / height : 1;
    const scale = Math.min(Math.min(scaleX, scaleY), 1);

    // Update the transform to center and fit the graph
    setTransform({
      x: viewportSize.width / 2,
      y: viewportSize.height / 2,
      scale: scale
    });
    
    // Reset the layout if needed
    setIsInitialized(false);
  }, [nodePositions, viewportSize]);

  // Zoom control handlers
  const handleZoomIn = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.min(prev.scale * 1.2, maxZoom)
    }));
  }, [maxZoom]);

  const handleZoomOut = useCallback(() => {
    setTransform(prev => ({
      ...prev,
      scale: Math.max(prev.scale / 1.2, minZoom)
    }));
  }, [minZoom]);

  return (
    <div 
      ref={containerRef}
      className={`graph-container theme-${theme}`}
      style={{ 
        width: '100%', 
        height: height || '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#f8f8f8'
      }}
    >
      <svg
        ref={graphRef}
        width="100%"
        height="100%"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleBackgroundClick}
        style={{ display: 'block' }}
      >
        <GraphDefs theme={theme} />
        <g 
          ref={transformGroupRef}
          transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
        >
          <GraphEdges 
            edges={processedData.edges}
            nodePositions={nodePositions}
            nodeSizeScale={nodeSizeScale}
            selectedNode={selectedNode}
            highlightedPath={highlightedPath}
            theme={theme}
            transform={transform}
            onEdgeClick={handleEdgeClick}
            nodeSizes={nodeSizes}
          />
          {processedData.nodes.map(node => (
            <GraphNodeComponent
              key={node.id}
              node={node}
              position={nodePositions[node.id] || { x: 0, y: 0 }}
              sizeScale={nodeSizeScale}
              theme={theme}
              isHighlighted={selectedNode?.id === node.id}
              isPathHighlighted={highlightedPath.nodes.has(node.id)}
              onPositionChange={handleNodePositionChange}
              onNodeClick={() => handleNodeClick(node)}
              onShowDependencies={() => {}} 
              onShowDependents={() => {}}
              totalNodesInView={processedData.nodes.length}
              zoomScale={transform.scale}
              isInteractive={draggingEnabled}
              onSizeChange={(size) => handleNodeSizeChange(node.id, size)}
              minNodeSize={80}
              maxNodeSize={180}
              menuItems={nodeMenuConfig.items}
              showDropdownMenu={nodeMenuConfig.showDropdownMenu !== false}
              enableContextMenu={nodeMenuConfig.enableContextMenu !== false}
            />
          ))}
        </g>
      </svg>
      <GraphControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetView={handleResetView}
        theme={theme}
      />
    </div>
  );
}; 