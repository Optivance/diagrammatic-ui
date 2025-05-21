# GraphEdges Component

The `GraphEdges` component is responsible for rendering all the edges (connections) between nodes in the graph. It handles edge positioning, styling, and interactive behaviors like hover and click states.

## Import

```tsx
import { GraphEdges } from 'diagrammatic-ui';
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `edges` | `Edge[]` | Yes | - | All edges in the graph |
| `nodePositions` | `Record<string, { x: number; y: number }>` | Yes | - | Record of node positions keyed by node ID |
| `nodeSizeScale` | `number` | Yes | - | Scale factor for node sizes |
| `selectedNode` | `Node \| null` | Yes | - | Currently selected node |
| `highlightedPath` | `{ nodes: Set<string>; edges: Set<string> }` | Yes | - | Record of highlighted paths |
| `theme` | `'light' \| 'dark'` | Yes | - | Visual theme |
| `transform` | `{ scale: number }` | Yes | - | Current transform state |
| `onEdgeClick` | `(edge: Edge) => void` | Yes | - | Callback when an edge is clicked |
| `nodeSizes` | `Record<string, { width: number; height: number }>` | No | `{}` | Record of node sizes keyed by node ID |

## Types

### Edge

```typescript
interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
  data?: Record<string, any>;
}
```

## Features

### Edge Positioning

The GraphEdges component automatically calculates the best connection points between nodes to create visually pleasing edge paths. It takes into account the rectangular shape of nodes and adjusts the start and end points of edges to correctly connect to node boundaries.

### Visual Styling

Edges are styled differently based on their state:
- Default edges: Normal thickness with a subdued color
- Selected edges: Thicker stroke with a highlight color
- Highlighted path: Medium thickness with a bright accent color
- Hovered edges: Thickest stroke with emphasis color

### Arrow Indicators

Edges include arrow indicators to show the direction of the relationship, and the arrow size is automatically adjusted based on the current zoom level.

## Basic Usage

```tsx
import React from 'react';
import { GraphEdges } from 'diagrammatic-ui';

const MyEdges = () => {
  const edges = [
    { id: 'edge1', source: 'node1', target: 'node2' },
    { id: 'edge2', source: 'node2', target: 'node3' }
  ];
  
  const nodePositions = {
    'node1': { x: 100, y: 100 },
    'node2': { x: 300, y: 200 },
    'node3': { x: 500, y: 100 }
  };
  
  return (
    <svg width="800" height="600">
      <GraphEdges
        edges={edges}
        nodePositions={nodePositions}
        nodeSizeScale={1}
        selectedNode={null}
        highlightedPath={{ nodes: new Set(), edges: new Set() }}
        theme="light"
        transform={{ scale: 1 }}
        onEdgeClick={(edge) => console.log('Edge clicked:', edge.id)}
      />
    </svg>
  );
};
```

## Highlighting Paths

You can highlight specific paths in the graph by providing edge IDs to the `highlightedPath` prop:

```tsx
const HighlightedPathExample = () => {
  // Create a Set of edge IDs to highlight
  const highlightedEdges = new Set(['edge1']);
  
  return (
    <svg width="800" height="600">
      <GraphEdges
        edges={edges}
        nodePositions={nodePositions}
        nodeSizeScale={1}
        selectedNode={null}
        highlightedPath={{ nodes: new Set(), edges: highlightedEdges }}
        theme="light"
        transform={{ scale: 1 }}
        onEdgeClick={(edge) => console.log('Edge clicked:', edge.id)}
      />
    </svg>
  );
};
```

## Node Size Integration

For optimal edge rendering, you can provide the sizes of nodes:

```tsx
const SizedEdgesExample = () => {
  const nodeSizes = {
    'node1': { width: 120, height: 80 },
    'node2': { width: 150, height: 100 },
    'node3': { width: 130, height: 90 }
  };
  
  return (
    <svg width="800" height="600">
      <GraphEdges
        edges={edges}
        nodePositions={nodePositions}
        nodeSizeScale={1}
        selectedNode={null}
        highlightedPath={{ nodes: new Set(), edges: new Set() }}
        theme="light"
        transform={{ scale: 1 }}
        onEdgeClick={(edge) => console.log('Edge clicked:', edge.id)}
        nodeSizes={nodeSizes}
      />
    </svg>
  );
};
```

## Theming Support

The component automatically adjusts edge colors based on the current theme:

```tsx
const ThemedEdgesExample = ({ theme }: { theme: 'light' | 'dark' }) => {
  return (
    <svg width="800" height="600">
      <GraphEdges
        edges={edges}
        nodePositions={nodePositions}
        nodeSizeScale={1}
        selectedNode={null}
        highlightedPath={{ nodes: new Set(), edges: new Set() }}
        theme={theme}
        transform={{ scale: 1 }}
        onEdgeClick={(edge) => console.log('Edge clicked:', edge.id)}
      />
    </svg>
  );
};
```

## See Also

- [Graph](./Graph.md) - Main graph component
- [GraphNode](./GraphNode.md) - Node rendering component
- [GraphEdge](./GraphEdge.md) - Individual edge component

## Examples

<!-- TODO: Add screenshots or animated GIFs here showing edge rendering and effects --> 