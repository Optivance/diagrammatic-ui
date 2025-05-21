# Graph Component

The `Graph` component is the main entry point for rendering graph visualizations in Diagrammatic UI.

## Import

```tsx
import { Graph } from 'diagrammatic-ui';
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `data` | `GraphData` | Yes | - | The graph data to visualize |
| `width` | `number` | No | `800` | Width of the graph container in pixels |
| `height` | `number` | No | `600` | Height of the graph container in pixels |
| `autoLayout` | `LayoutType` | No | `'force'` | Type of automatic layout to apply |
| `layoutOptions` | `object` | No | `{}` | Options for the layout algorithm |
| `nodeSizeScale` | `number` | No | `1` | Scale factor for node sizes |
| `theme` | `'light' \| 'dark' \| Theme` | No | `'light'` | Visual theme to use |
| `interactionOptions` | `InteractionOptions` | No | `{}` | Configuration for interactive features |
| `nodeMenuConfig` | `NodeMenuConfig` | No | `{}` | Configuration for node menus |
| `nodeStyleConfig` | `NodeStyleConfig` | No | `{}` | Configuration for node styling |

## Event Handler Props

| Prop | Type | Description |
|------|------|-------------|
| `onNodeClick` | `(nodeId: string) => void` | Callback when a node is clicked |
| `onEdgeClick` | `(sourceId: string, targetId: string) => void` | Callback when an edge is clicked |
| `onViewportChange` | `(transform: { x: number; y: number; scale: number }) => void` | Callback when the viewport changes |
| `onNodeMouseEnter` | `(nodeId: string) => void` | Callback when mouse enters a node |
| `onNodeMouseLeave` | `(nodeId: string) => void` | Callback when mouse leaves a node |
| `onSelectionChange` | `(selectedNodes: string[], selectedEdges: string[]) => void` | Callback when selection changes |
| `onDragStart` | `(nodeIds: string[]) => void` | Callback when dragging starts |
| `onDrag` | `(nodeIds: string[], position: Position) => void` | Callback during dragging |
| `onDragEnd` | `(nodeIds: string[]) => void` | Callback when dragging ends |

## Types

### GraphData

```typescript
interface GraphData {
  nodes: Node[];
  edges: Edge[];
  metadata?: Record<string, unknown>;
}
```

### InteractionOptions

```typescript
interface InteractionOptions {
  selectionEnabled?: boolean;
  multiSelectionEnabled?: boolean;
  draggingEnabled?: boolean;
  zoomEnabled?: boolean;
  panningEnabled?: boolean;
  edgeCreationEnabled?: boolean;
  minZoom?: number;
  maxZoom?: number;
  fitViewOnInit?: boolean;
}
```

### NodeStyleConfig

```typescript
interface NodeStyleConfig {
  type?: NodeStyle;
  renderer?: React.ComponentType<GraphNodeProps>;
  typeStyles?: Record<string, Record<string, string | number>>;
  typeIcons?: Record<string, React.ReactNode>;
  styleSelector?: (node: Node) => NodeStyle;
}
```

### NodeMenuConfig

```typescript
interface NodeMenuConfig {
  showDropdownMenu?: boolean;
  enableContextMenu?: boolean;
  items?: NodeMenuItem[];
}
```

## Basic Usage

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const MyGraph = () => {
  const graphData = {
    nodes: [
      { id: '1', label: 'Node 1' },
      { id: '2', label: 'Node 2' },
      { id: '3', label: 'Node 3' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '1' },
    ]
  };

  return (
    <Graph
      data={graphData}
      width={800}
      height={600}
      autoLayout="force"
      theme="light"
      interactionOptions={{
        draggingEnabled: true,
        zoomEnabled: true,
        panningEnabled: true,
        selectionEnabled: true
      }}
      onNodeClick={(nodeId) => console.log(`Node ${nodeId} clicked`)}
    />
  );
};
```

## With Custom Node Styling

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const StyledGraph = () => {
  return (
    <Graph
      data={graphData}
      nodeStyleConfig={{
        type: 'card',
        typeStyles: {
          'person': {
            backgroundColor: '#e6f7ff',
            borderColor: '#1890ff',
            borderWidth: 2
          },
          'document': {
            backgroundColor: '#f6ffed',
            borderColor: '#52c41a',
            borderWidth: 2
          }
        }
      }}
    />
  );
};
```

## With Custom Layout

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const CircularLayoutGraph = () => {
  return (
    <Graph
      data={graphData}
      autoLayout="circular"
      layoutOptions={{
        radius: 200,
        startAngle: 0,
        endAngle: Math.PI * 2
      }}
    />
  );
};
```

## With Event Handlers

```tsx
import React, { useState } from 'react';
import { Graph } from 'diagrammatic-ui';

const InteractiveGraph = () => {
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  
  return (
    <Graph
      data={graphData}
      interactionOptions={{
        selectionEnabled: true,
        multiSelectionEnabled: true
      }}
      onSelectionChange={(selectedNodes, selectedEdges) => {
        setSelectedNodes(selectedNodes);
        console.log('Selected nodes:', selectedNodes);
        console.log('Selected edges:', selectedEdges);
      }}
      onNodeClick={(nodeId) => {
        console.log(`Node ${nodeId} clicked`);
      }}
      onEdgeClick={(sourceId, targetId) => {
        console.log(`Edge from ${sourceId} to ${targetId} clicked`);
      }}
    />
  );
};
```

## See Also

- [GraphNode](./GraphNode.md) - Default node component
- [GraphEdges](./GraphEdges.md) - Edge rendering component
- [LayoutTypes](../layouts/LayoutTypes.md) - Available layout algorithms 