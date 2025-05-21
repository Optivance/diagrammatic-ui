# GraphEdge Component

The `GraphEdge` component renders a single edge (connection) between two nodes in the graph. It provides detailed control over the appearance and behavior of individual edges.

## Import

```tsx
import { GraphEdge } from 'diagrammatic-ui';
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `edge` | `Edge` | Yes | - | The edge data to visualize |
| `sourcePosition` | `{ x: number; y: number }` | Yes | - | Position of the source node |
| `targetPosition` | `{ x: number; y: number }` | Yes | - | Position of the target node |
| `isHighlighted` | `boolean` | No | `false` | Whether this edge is highlighted |
| `isSelected` | `boolean` | No | `false` | Whether this edge is selected |
| `isHovered` | `boolean` | No | `false` | Whether this edge is being hovered over |
| `theme` | `'light' \| 'dark'` | No | `'light'` | Visual theme to use |
| `transform` | `{ scale: number }` | No | `{ scale: 1 }` | Current transform state |
| `onClick` | `(edge: Edge) => void` | No | - | Callback when the edge is clicked |
| `onMouseEnter` | `() => void` | No | - | Callback when mouse enters the edge |
| `onMouseLeave` | `() => void` | No | - | Callback when mouse leaves the edge |
| `sourceSize` | `{ width: number; height: number }` | No | - | Size of the source node |
| `targetSize` | `{ width: number; height: number }` | No | - | Size of the target node |
| `strokeWidth` | `number` | No | `1.5` | Width of the edge stroke |
| `color` | `string` | No | - | Color of the edge |
| `showArrow` | `boolean` | No | `true` | Whether to show the direction arrow |
| `arrowSize` | `number` | No | `6` | Size of the direction arrow |
| `dashedLine` | `boolean` | No | `false` | Whether to render the edge as a dashed line |

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

### Edge Styling

The component provides multiple styling options:
- Solid or dashed lines
- Customizable colors and stroke widths
- Direction arrows with adjustable size
- Automatic adjustment for zoom level

### Interactive States

GraphEdge handles different interactive states with appropriate visual feedback:
- Default state: Normal appearance
- Highlighted: Emphasized appearance for highlighted paths
- Selected: Visual indication when the edge is selected
- Hovered: Visual feedback when the user hovers over the edge

## Basic Usage

```tsx
import React from 'react';
import { GraphEdge } from 'diagrammatic-ui';

const MyEdge = () => {
  const edge = {
    id: 'edge1',
    source: 'node1',
    target: 'node2',
    label: 'connects to'
  };
  
  return (
    <svg width="800" height="600">
      <GraphEdge
        edge={edge}
        sourcePosition={{ x: 100, y: 100 }}
        targetPosition={{ x: 300, y: 200 }}
        theme="light"
        onClick={(edge) => console.log('Edge clicked:', edge.id)}
      />
    </svg>
  );
};
```

## Custom Styling

You can customize the appearance of edges:

```tsx
const CustomStyledEdge = () => {
  return (
    <svg width="800" height="600">
      <GraphEdge
        edge={edge}
        sourcePosition={{ x: 100, y: 100 }}
        targetPosition={{ x: 300, y: 200 }}
        color="#ff0000"
        strokeWidth={2.5}
        showArrow={true}
        arrowSize={8}
        dashedLine={true}
      />
    </svg>
  );
};
```

## Edge with Node Sizing

For optimal edge connection points, provide the sizes of connected nodes:

```tsx
const EdgeWithNodeSizing = () => {
  return (
    <svg width="800" height="600">
      <GraphEdge
        edge={edge}
        sourcePosition={{ x: 100, y: 100 }}
        targetPosition={{ x: 300, y: 200 }}
        sourceSize={{ width: 120, height: 80 }}
        targetSize={{ width: 150, height: 100 }}
      />
    </svg>
  );
};
```

## Handling Interaction

Add interactivity to edges:

```tsx
const InteractiveEdge = () => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <svg width="800" height="600">
      <GraphEdge
        edge={edge}
        sourcePosition={{ x: 100, y: 100 }}
        targetPosition={{ x: 300, y: 200 }}
        isHovered={isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={(edge) => console.log('Edge clicked:', edge.id)}
      />
    </svg>
  );
};
```

## See Also

- [Graph](./Graph.md) - Main graph component
- [GraphNode](./GraphNode.md) - Node rendering component
- [GraphEdges](./GraphEdges.md) - All edges rendering component

## Examples

<!-- TODO: Add screenshots or animated GIFs here showing different edge styles and interactions --> 