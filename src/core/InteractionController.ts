/**
 * InteractionController - Manages user interactions with the graph
 */
import { 
  GraphData, 
  Node, 
  Edge 
} from '../types/graph';
import {
  GraphEventHandlers
} from '../types/events';

/**
 * Configuration options for the interaction controller
 */
export interface InteractionOptions {
  /** Whether nodes can be selected */
  selectionEnabled?: boolean;
  /** Whether multiple elements can be selected at once */
  multiSelectionEnabled?: boolean;
  /** Whether nodes can be dragged */
  draggingEnabled?: boolean;
  /** Whether viewport can be zoomed */
  zoomEnabled?: boolean;
  /** Whether viewport can be panned */
  panningEnabled?: boolean;
  /** Whether edges can be created by dragging from one node to another */
  edgeCreationEnabled?: boolean;
  /** Minimum zoom level allowed */
  minZoom?: number;
  /** Maximum zoom level allowed */
  maxZoom?: number;
  /** Whether to fit the graph to the viewport on initialization */
  fitViewOnInit?: boolean;
}

/**
 * Selection state for the graph
 */
export interface SelectionState {
  /** Set of selected node IDs */
  selectedNodeIds: Set<string>;
  /** Set of selected edge IDs */
  selectedEdgeIds: Set<string>;
}

/**
 * Viewport state for the graph
 */
export interface ViewportState {
  /** Current zoom level */
  zoom: number;
  /** Center position of the viewport */
  center: { x: number; y: number };
  /** Viewport dimensions */
  dimensions: { width: number; height: number };
}

/**
 * Main controller class for handling graph interactions
 */
export class InteractionController {
  /** Graph data being visualized */
  private graphData: GraphData;
  /** Interaction configuration options */
  private options: InteractionOptions;
  /** Event handlers */
  private eventHandlers: GraphEventHandlers;
  /** Current selection state */
  private selectionState: SelectionState;
  /** Current viewport state */
  private viewportState: ViewportState;
  /** Whether a drag operation is in progress */
  private isDragging: boolean = false;
  /** Starting position of a drag operation */
  private dragStartPosition: { x: number; y: number } | null = null;
  /** Nodes being dragged */
  private draggedNodes: Node[] = [];
  
  /**
   * Create a new interaction controller
   * @param graphData The graph data to visualize
   * @param options Configuration options
   * @param eventHandlers Event handlers for graph interactions
   */
  constructor(
    graphData: GraphData,
    options: InteractionOptions = {},
    eventHandlers: GraphEventHandlers = {}
  ) {
    this.graphData = graphData;
    this.options = this.getDefaultOptions(options);
    this.eventHandlers = eventHandlers;
    
    // Initialize selection state
    this.selectionState = {
      selectedNodeIds: new Set<string>(),
      selectedEdgeIds: new Set<string>()
    };
    
    // Initialize viewport state with defaults
    this.viewportState = {
      zoom: 1,
      center: { x: 0, y: 0 },
      dimensions: { width: 100, height: 100 }
    };
    
    // If fitViewOnInit is enabled, calculate the appropriate viewport
    if (this.options.fitViewOnInit) {
      this.fitViewToGraph();
    }
  }
  
  /**
   * Get default options merged with provided options
   */
  private getDefaultOptions(options: InteractionOptions): InteractionOptions {
    return {
      selectionEnabled: true,
      multiSelectionEnabled: true,
      draggingEnabled: true,
      zoomEnabled: true,
      panningEnabled: true,
      edgeCreationEnabled: false,
      minZoom: 0.1,
      maxZoom: 2.5,
      fitViewOnInit: true,
      ...options
    };
  }
  
  /**
   * Update the graph data
   */
  public updateGraphData(graphData: GraphData): void {
    this.graphData = graphData;
  }
  
  /**
   * Update event handlers
   */
  public updateEventHandlers(eventHandlers: GraphEventHandlers): void {
    this.eventHandlers = eventHandlers;
  }
  
  /**
   * Update interaction options
   */
  public updateOptions(options: Partial<InteractionOptions>): void {
    this.options = {
      ...this.options,
      ...options
    };
  }
  
  /**
   * Update viewport dimensions
   */
  public setViewportDimensions(width: number, height: number): void {
    this.viewportState.dimensions = { width, height };
  }
  
  /**
   * Adjust viewport to fit the entire graph
   */
  public fitViewToGraph(): void {
    // Find the bounding box of all nodes
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    
    this.graphData.nodes.forEach(node => {
      const position = this.getNodePosition(node);
      if (position) {
        minX = Math.min(minX, position.x);
        minY = Math.min(minY, position.y);
        maxX = Math.max(maxX, position.x);
        maxY = Math.max(maxY, position.y);
      }
    });
    
    // If we have valid bounds
    if (
      minX !== Number.POSITIVE_INFINITY && 
      minY !== Number.POSITIVE_INFINITY &&
      maxX !== Number.NEGATIVE_INFINITY &&
      maxY !== Number.NEGATIVE_INFINITY
    ) {
      // Calculate center
      const center = {
        x: (minX + maxX) / 2,
        y: (minY + maxY) / 2
      };
      
      // Calculate required zoom
      const graphWidth = maxX - minX + 200; // Add padding
      const graphHeight = maxY - minY + 200; // Add padding
      
      const horizontalZoom = this.viewportState.dimensions.width / graphWidth;
      const verticalZoom = this.viewportState.dimensions.height / graphHeight;
      
      // Use the smaller zoom to ensure everything fits
      let zoom = Math.min(horizontalZoom, verticalZoom);
      
      // Clamp zoom to min/max
      zoom = Math.max(this.options.minZoom || 0.1, Math.min(zoom, this.options.maxZoom || 2.5));
      
      // Update viewport
      this.viewportState.center = center;
      this.viewportState.zoom = zoom;
      
      // Trigger viewport change event
      this.triggerViewportChangeEvent();
    }
  }
  
  /**
   * Helper to get node position from its data
   */
  private getNodePosition(node: Node): { x: number; y: number } | null {
    if (node.data) {
      const x = node.data.x as number | undefined;
      const y = node.data.y as number | undefined;
      
      if (typeof x === 'number' && typeof y === 'number') {
        return { x, y };
      }
    }
    return null;
  }
  
  /**
   * Handle node click event
   */
  public handleNodeClick(node: Node, event?: React.MouseEvent): void {
    if (!this.options.selectionEnabled) return;
    
    const isMultiSelect = this.options.multiSelectionEnabled && 
      (event?.ctrlKey || event?.metaKey);
    
    // If not multi-select, clear current selection
    if (!isMultiSelect) {
      this.selectionState.selectedNodeIds.clear();
      this.selectionState.selectedEdgeIds.clear();
    }
    
    // Toggle selection for the clicked node
    if (this.selectionState.selectedNodeIds.has(node.id)) {
      this.selectionState.selectedNodeIds.delete(node.id);
    } else {
      this.selectionState.selectedNodeIds.add(node.id);
    }
    
    // Trigger selection change event
    this.triggerSelectionChangeEvent(isMultiSelect);
    
    // Trigger node click event
    if (this.eventHandlers.onNodeClick) {
      const position = this.getNodePosition(node);
      this.eventHandlers.onNodeClick({
        node,
        position: position || undefined,
        originalEvent: event,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Handle edge click event
   */
  public handleEdgeClick(edge: Edge, event?: React.MouseEvent): void {
    if (!this.options.selectionEnabled) return;
    
    const isMultiSelect = this.options.multiSelectionEnabled && 
      (event?.ctrlKey || event?.metaKey);
    
    // If not multi-select, clear current selection
    if (!isMultiSelect) {
      this.selectionState.selectedNodeIds.clear();
      this.selectionState.selectedEdgeIds.clear();
    }
    
    // Toggle selection for the clicked edge
    if (this.selectionState.selectedEdgeIds.has(edge.id)) {
      this.selectionState.selectedEdgeIds.delete(edge.id);
    } else {
      this.selectionState.selectedEdgeIds.add(edge.id);
    }
    
    // Trigger selection change event
    this.triggerSelectionChangeEvent(isMultiSelect);
    
    // Trigger edge click event
    if (this.eventHandlers.onEdgeClick) {
      // Calculate approximate position (midpoint of source and target)
      const sourceNode = this.graphData.nodes.find(n => n.id === edge.source);
      const targetNode = this.graphData.nodes.find(n => n.id === edge.target);
      
      let position;
      if (sourceNode && targetNode) {
        const sourcePos = this.getNodePosition(sourceNode);
        const targetPos = this.getNodePosition(targetNode);
        
        if (sourcePos && targetPos) {
          position = {
            x: (sourcePos.x + targetPos.x) / 2,
            y: (sourcePos.y + targetPos.y) / 2
          };
        }
      }
      
      this.eventHandlers.onEdgeClick({
        edge,
        position,
        originalEvent: event,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Handle canvas click (background)
   */
  public handleCanvasClick(position: { x: number; y: number }, event?: React.MouseEvent): void {
    // Clear selection when clicking on the background (unless multi-select)
    const isMultiSelect = this.options.multiSelectionEnabled && 
      (event?.ctrlKey || event?.metaKey);
    
    if (this.options.selectionEnabled && !isMultiSelect) {
      const hadSelection = this.selectionState.selectedNodeIds.size > 0 || 
        this.selectionState.selectedEdgeIds.size > 0;
      
      this.selectionState.selectedNodeIds.clear();
      this.selectionState.selectedEdgeIds.clear();
      
      if (hadSelection) {
        this.triggerSelectionChangeEvent(false);
      }
    }
    
    // Trigger canvas click event
    if (this.eventHandlers.onCanvasClick) {
      this.eventHandlers.onCanvasClick({
        position,
        zoom: this.viewportState.zoom,
        center: this.viewportState.center,
        originalEvent: event,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Start node dragging
   */
  public startDrag(position: { x: number; y: number }, event?: React.MouseEvent): void {
    if (!this.options.draggingEnabled) return;
    
    this.isDragging = true;
    this.dragStartPosition = position;
    
    // Get the target node element that triggered the drag
    let targetNodeId: string | null = null;
    if (event) {
      // Try to find the node that was clicked from the event path
      const path = event.nativeEvent.composedPath();
      for (let i = 0; i < path.length; i++) {
        const el = path[i] as HTMLElement;
        if (el.hasAttribute && el.hasAttribute('data-node-id')) {
          targetNodeId = el.getAttribute('data-node-id');
          break;
        }
      }
    }
    
    // Determine dragged nodes (selected nodes or nodes under cursor)
    this.draggedNodes = this.graphData.nodes.filter(node => {
      // If we have a specific target node, only drag that one
      if (targetNodeId) {
        return node.id === targetNodeId;
      }
      // Otherwise, drag all selected nodes
      return this.selectionState.selectedNodeIds.has(node.id);
    });
    
    // If no nodes were found, try using event target or position to find a node
    if (this.draggedNodes.length === 0 && event) {
      // Find the closest node to the click position
      let closestNode = null;
      let closestDistance = Infinity;
      
      for (const node of this.graphData.nodes) {
        // Get node position from its data or default to 0,0
        const nodeX = (node.data?.x as number) || 0;
        const nodeY = (node.data?.y as number) || 0;
        
        // Calculate distance from click to node center
        const dx = position.x - nodeX;
        const dy = position.y - nodeY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Update closest node if this one is closer
        if (distance < closestDistance) {
          closestDistance = distance;
          closestNode = node;
        }
      }
      
      // If we found a node within a reasonable distance, add it to draggedNodes
      if (closestNode && closestDistance < 50) {
        this.draggedNodes = [closestNode];
      }
    }
    
    // Trigger drag start event
    if (this.eventHandlers.onDragStart && this.draggedNodes.length > 0) {
      this.eventHandlers.onDragStart({
        startPosition: position,
        currentPosition: position,
        nodes: this.draggedNodes,
        originalEvent: event,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Update position during drag
   */
  public updateDrag(position: { x: number; y: number }, event?: React.MouseEvent): void {
    if (!this.isDragging || !this.dragStartPosition || !this.options.draggingEnabled) return;
    
    // Calculate delta
    const deltaX = position.x - this.dragStartPosition.x;
    const deltaY = position.y - this.dragStartPosition.y;
    
    // Update positions for dragged nodes
    this.draggedNodes.forEach(node => {
      if (!node.data) {
        node.data = {};
      }
      
      const currentX = (node.data.x as number) || 0;
      const currentY = (node.data.y as number) || 0;
      
      node.data.x = currentX + deltaX;
      node.data.y = currentY + deltaY;
    });
    
    // Update drag start position for next frame
    this.dragStartPosition = position;
    
    // Trigger drag event
    if (this.eventHandlers.onDrag) {
      this.eventHandlers.onDrag({
        startPosition: this.dragStartPosition,
        currentPosition: position,
        nodes: this.draggedNodes,
        originalEvent: event,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * End node dragging
   */
  public endDrag(position: { x: number; y: number }, event?: React.MouseEvent): void {
    if (!this.isDragging || !this.options.draggingEnabled) return;
    
    // Trigger drag end event
    if (this.eventHandlers.onDragEnd) {
      this.eventHandlers.onDragEnd({
        startPosition: this.dragStartPosition || position,
        currentPosition: position,
        nodes: this.draggedNodes,
        isDragEnd: true,
        originalEvent: event,
        timestamp: Date.now()
      });
    }
    
    // Reset drag state
    this.isDragging = false;
    this.dragStartPosition = null;
    this.draggedNodes = [];
  }
  
  /**
   * Update viewport zoom
   */
  public zoom(delta: number, center: { x: number; y: number }, event?: React.WheelEvent): void {
    if (!this.options.zoomEnabled) return;
    
    const previousZoom = this.viewportState.zoom;
    const previousCenter = { ...this.viewportState.center };
    
    // Calculate new zoom level
    let newZoom = previousZoom * (1 + delta * 0.1);
    
    // Clamp to min/max
    newZoom = Math.max(this.options.minZoom || 0.1, Math.min(newZoom, this.options.maxZoom || 2.5));
    
    // Update viewport
    this.viewportState.zoom = newZoom;
    
    // If zooming at a specific point, adjust center to keep that point fixed
    if (center && center !== this.viewportState.center) {
      // Calculate how the center should move based on zoom change
      const zoomRatio = newZoom / previousZoom;
      const centerDeltaX = (center.x - previousCenter.x) * (1 - 1 / zoomRatio);
      const centerDeltaY = (center.y - previousCenter.y) * (1 - 1 / zoomRatio);
      
      this.viewportState.center = {
        x: previousCenter.x + centerDeltaX,
        y: previousCenter.y + centerDeltaY
      };
    }
    
    // Trigger viewport change event
    this.triggerViewportChangeEvent(event);
  }
  
  /**
   * Pan the viewport
   */
  public pan(deltaX: number, deltaY: number, event?: React.MouseEvent): void {
    if (!this.options.panningEnabled) return;
    
    const previousCenter = { ...this.viewportState.center };
    
    // Update center based on delta and zoom level
    this.viewportState.center = {
      x: previousCenter.x - deltaX / this.viewportState.zoom,
      y: previousCenter.y - deltaY / this.viewportState.zoom
    };
    
    // Trigger viewport change event
    this.triggerViewportChangeEvent(event);
  }
  
  /**
   * Get the current viewport state
   */
  public getViewport(): ViewportState {
    return { ...this.viewportState };
  }
  
  /**
   * Get the current selection state
   */
  public getSelection(): {
    selectedNodes: Node[];
    selectedEdges: Edge[];
  } {
    const selectedNodes = this.graphData.nodes.filter(node => 
      this.selectionState.selectedNodeIds.has(node.id)
    );
    
    const selectedEdges = this.graphData.edges.filter(edge => 
      this.selectionState.selectedEdgeIds.has(edge.id)
    );
    
    return {
      selectedNodes,
      selectedEdges
    };
  }
  
  /**
   * Programmatically select nodes
   */
  public selectNodes(nodeIds: string[], clearPrevious: boolean = true): void {
    if (!this.options.selectionEnabled) return;
    
    if (clearPrevious) {
      this.selectionState.selectedNodeIds.clear();
      this.selectionState.selectedEdgeIds.clear();
    }
    
    nodeIds.forEach(id => {
      this.selectionState.selectedNodeIds.add(id);
    });
    
    this.triggerSelectionChangeEvent(false);
  }
  
  /**
   * Programmatically select edges
   */
  public selectEdges(edgeIds: string[], clearPrevious: boolean = true): void {
    if (!this.options.selectionEnabled) return;
    
    if (clearPrevious) {
      this.selectionState.selectedNodeIds.clear();
      this.selectionState.selectedEdgeIds.clear();
    }
    
    edgeIds.forEach(id => {
      this.selectionState.selectedEdgeIds.add(id);
    });
    
    this.triggerSelectionChangeEvent(false);
  }
  
  /**
   * Clear all selections
   */
  public clearSelection(): void {
    if (
      this.selectionState.selectedNodeIds.size > 0 || 
      this.selectionState.selectedEdgeIds.size > 0
    ) {
      this.selectionState.selectedNodeIds.clear();
      this.selectionState.selectedEdgeIds.clear();
      this.triggerSelectionChangeEvent(false);
    }
  }
  
  /**
   * Helper to trigger selection change event
   */
  private triggerSelectionChangeEvent(isMultiSelect: boolean = false): void {
    if (this.eventHandlers.onSelectionChange) {
      const { selectedNodes, selectedEdges } = this.getSelection();
      
      this.eventHandlers.onSelectionChange({
        selectedNodes,
        selectedEdges,
        isMultiSelect,
        timestamp: Date.now()
      });
    }
  }
  
  /**
   * Helper to trigger viewport change event
   */
  private triggerViewportChangeEvent(event?: React.UIEvent): void {
    if (this.eventHandlers.onViewportChange) {
      // We're simplifying by using current values as previous ones
      this.eventHandlers.onViewportChange({
        previousZoom: this.viewportState.zoom,
        currentZoom: this.viewportState.zoom,
        previousCenter: this.viewportState.center,
        currentCenter: this.viewportState.center,
        originalEvent: event,
        timestamp: Date.now()
      });
    }
  }
} 