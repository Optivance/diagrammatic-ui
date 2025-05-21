# API Reference

This section provides detailed documentation for all components, types, and utilities in Diagrammatic UI.

## Components

- [Graph](./components/Graph.md) - The main graph visualization component
- [GraphNode](./components/GraphNode.md) - Default node component
- [DocumentGraphNode](./components/DocumentGraphNode.md) - Document-style node component
- [GraphEdges](./components/GraphEdges.md) - Edge rendering component
- [GraphControls](./components/GraphControls.md) - UI controls for the graph

## Types

- [GraphData](./types/GraphData.md) - Core data structure for graph representation
- [Node](./types/Node.md) - Node data structure
- [Edge](./types/Edge.md) - Edge data structure
- [Events](./types/Events.md) - Event types and interfaces
- [Theme](./types/Theme.md) - Theming and styling types

## Layouts

- [LayoutTypes](./layouts/LayoutTypes.md) - Available layout algorithms
- [LayoutOptions](./layouts/LayoutOptions.md) - Configuration options for layouts
- [LayoutFactory](./layouts/LayoutFactory.md) - Factory for creating layouts

## Adapters

- [D3ForceAdapter](./adapters/D3ForceAdapter.md) - Adapter for D3.js force layout
- [CytoscapeAdapter](./adapters/CytoscapeAdapter.md) - Adapter for Cytoscape.js
- [AdjacencyMatrixAdapter](./adapters/AdjacencyMatrixAdapter.md) - Adapter for adjacency matrices
- [DependencyTreeAdapter](./adapters/DependencyTreeAdapter.md) - Adapter for dependency trees
- [JSONGraphAdapter](./adapters/JSONGraphAdapter.md) - Adapter for JSON graph formats
- [AdapterFactory](./adapters/AdapterFactory.md) - Factory for creating adapters

## Hooks

- [useGraph](./hooks/useGraph.md) - Hook for graph state management
- [useNodeDrag](./hooks/useNodeDrag.md) - Hook for node dragging
- [useSelection](./hooks/useSelection.md) - Hook for selection management
- [useViewport](./hooks/useViewport.md) - Hook for viewport management

## Utilities

- [GraphUtils](./utils/GraphUtils.md) - Utility functions for graph operations
- [LayoutUtils](./utils/LayoutUtils.md) - Utility functions for layouts
- [ThemeUtils](./utils/ThemeUtils.md) - Utility functions for theming 