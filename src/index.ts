/**
 * Graph UI Library
 * A flexible library for creating and visualizing graph structures
 */

// Main library entry point
// This file exports all components, hooks, and utilities that should be available to consumers

// Export core components
export { Graph, type GraphProps, type InteractionOptions } from './components/Graph/Graph';
export { InteractionController } from './core/InteractionController';

// Export components
export * from './components/edge/GraphEdges';
export { GraphNode, type GraphNodeProps } from './components/node/GraphNode';
export * from './components/node/DocumentGraphNode';
export * from './components/node/CustomDocumentNode';

// Export layout-related modules
export * from './layouts';
export * from './layouts/factory';

// Export adapters
export * from './adapters';

// Export hooks
export * from './hooks';

// Export utilities
export * from './utils';

// Export types and interfaces
export * from './types/graph';
// Export theme types with explicit naming to avoid conflicts
export type { Theme, ThemeMode } from './types/theme';
export * from './types/events';

// Export themes
export * from './themes'; 