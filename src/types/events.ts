/**
 * Event types and interfaces for graph interactivity
 */
import React from 'react';
import { Node, Edge } from './graph';

/**
 * Base event interface
 */
export interface GraphEvent {
  /** Original DOM event that triggered the graph event */
  originalEvent?: React.SyntheticEvent;
  /** Whether event propagation should be stopped */
  stopPropagation?: boolean;
  /** Timestamp when the event occurred */
  timestamp: number;
}

/**
 * Node-related event interface
 */
export interface NodeEvent extends GraphEvent {
  /** The node that triggered the event */
  node: Node;
  /** Position where the event occurred */
  position?: { x: number; y: number };
}

/**
 * Edge-related event interface
 */
export interface EdgeEvent extends GraphEvent {
  /** The edge that triggered the event */
  edge: Edge;
  /** Position where the event occurred */
  position?: { x: number; y: number };
}

/**
 * Canvas-related event interface for interactions with the graph background
 */
export interface CanvasEvent extends GraphEvent {
  /** Position where the event occurred */
  position: { x: number; y: number };
  /** Current zoom level */
  zoom?: number;
  /** Center of the viewport */
  center?: { x: number; y: number };
}

/**
 * Selection event interface
 */
export interface SelectionEvent extends GraphEvent {
  /** Selected nodes */
  selectedNodes: Node[];
  /** Selected edges */
  selectedEdges: Edge[];
  /** Whether this is a multi-selection (e.g., with Ctrl/Cmd key) */
  isMultiSelect?: boolean;
}

/**
 * Drag event interface
 */
export interface DragEvent extends GraphEvent {
  /** Position where the drag started */
  startPosition: { x: number; y: number };
  /** Current position during the drag */
  currentPosition: { x: number; y: number };
  /** Dragged nodes */
  nodes?: Node[];
  /** Whether drag has finished */
  isDragEnd?: boolean;
}

/**
 * Viewport change event interface for pan/zoom operations
 */
export interface ViewportEvent extends GraphEvent {
  /** Previous zoom level */
  previousZoom: number;
  /** Current zoom level */
  currentZoom: number;
  /** Previous center position */
  previousCenter: { x: number; y: number };
  /** Current center position */
  currentCenter: { x: number; y: number };
}

/**
 * Event handler types
 */
export type NodeEventHandler = (event: NodeEvent) => void;
export type EdgeEventHandler = (event: EdgeEvent) => void;
export type CanvasEventHandler = (event: CanvasEvent) => void;
export type SelectionEventHandler = (event: SelectionEvent) => void;
export type DragEventHandler = (event: DragEvent) => void;
export type ViewportEventHandler = (event: ViewportEvent) => void;

/**
 * Graph event handlers interface
 */
export interface GraphEventHandlers {
  // Node event handlers
  onNodeClick?: NodeEventHandler;
  onNodeDoubleClick?: NodeEventHandler;
  onNodeMouseEnter?: NodeEventHandler;
  onNodeMouseLeave?: NodeEventHandler;
  onNodeContextMenu?: NodeEventHandler;
  
  // Edge event handlers
  onEdgeClick?: EdgeEventHandler;
  onEdgeDoubleClick?: EdgeEventHandler;
  onEdgeMouseEnter?: EdgeEventHandler;
  onEdgeMouseLeave?: EdgeEventHandler;
  onEdgeContextMenu?: EdgeEventHandler;
  
  // Canvas/Background event handlers
  onCanvasClick?: CanvasEventHandler;
  onCanvasDoubleClick?: CanvasEventHandler;
  onCanvasContextMenu?: CanvasEventHandler;
  
  // Selection event handlers
  onSelectionChange?: SelectionEventHandler;
  
  // Drag event handlers
  onDragStart?: DragEventHandler;
  onDrag?: DragEventHandler;
  onDragEnd?: DragEventHandler;
  
  // Viewport event handlers
  onViewportChange?: ViewportEventHandler;
} 