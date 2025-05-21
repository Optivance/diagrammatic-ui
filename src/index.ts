/**
 * Graph UI Library
 * A flexible library for creating and visualizing graph structures
 */

// Main library entry point
// This file exports all components, hooks, and utilities that should be available to consumers

// Export core components
export * from './components/Graph/Graph';
export { InteractionController } from './core/InteractionController';

// Export components
export * from './components/Graph/Graph';
export * from './components/edge/GraphEdges';
export * from './components/node/GraphNode';
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
export * from './types/theme';
export * from './types/events';

// Export themes
export * from './themes';

// Export demo components from demo directory
export { AdapterDemo } from '../demo/AdapterDemo';
export { InteractivityDemo } from '../demo/InteractivityDemo';
export { MenuCustomizationDemo } from '../demo/MenuCustomizationDemo';
export { DocumentNodeDemo } from '../demo/DocumentNodeDemo';
export { LayoutDemo } from '../demo/LayoutDemo';
export { NodeStylesDemo } from '../demo/NodeStylesDemo';
export { UseCasesDemo } from '../demo/UsesCasesDemo';
export { TestDocumentNodeDraggable } from '../demo/TestDocumentNodeDraggable'; 