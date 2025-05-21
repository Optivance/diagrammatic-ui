# Interactions

Diagrammatic UI provides rich interaction capabilities for creating dynamic and responsive graph visualizations. This guide covers interaction options and event handling.

## Interaction Options

The `interactionOptions` prop allows you to configure how users can interact with the graph:

```tsx
<Graph
  data={graphData}
  interactionOptions={{
    selectionEnabled: true,
    multiSelectionEnabled: true,
    draggingEnabled: true,
    zoomEnabled: true,
    panningEnabled: true,
    edgeCreationEnabled: false,
    minZoom: 0.1,
    maxZoom: 5,
    fitViewOnInit: true
  }}
/>
```

### Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selectionEnabled` | `boolean` | `true` | Enable node/edge selection |
| `multiSelectionEnabled` | `boolean` | `false` | Enable multi-selection with Ctrl/Cmd key |
| `draggingEnabled` | `boolean` | `true` | Enable node dragging |
| `zoomEnabled` | `boolean` | `true` | Enable zoom with mouse wheel/pinch |
| `panningEnabled` | `boolean` | `true` | Enable panning by dragging the background |
| `edgeCreationEnabled` | `boolean` | `false` | Enable edge creation through interaction |
| `minZoom` | `number` | `0.1` | Minimum zoom level |
| `maxZoom` | `number` | `5` | Maximum zoom level |
| `fitViewOnInit` | `boolean` | `true` | Fit graph to viewport on initialization |

## Event Handlers

Diagrammatic UI provides a comprehensive set of event handlers to respond to user interactions:

```tsx
<Graph
  data={graphData}
  onNodeClick={(event) => console.log('Node clicked:', event.node.id)}
  onEdgeClick={(event) => console.log('Edge clicked:', event.edge.id)}
  onCanvasClick={(event) => console.log('Canvas clicked at:', event.position)}
  onSelectionChange={(event) => console.log('Selection changed:', event.selectedNodes)}
  onDragStart={(event) => console.log('Drag started:', event.nodes)}
  onDrag={(event) => console.log('Dragging:', event.currentPosition)}
  onDragEnd={(event) => console.log('Drag ended')}
  onViewportChange={(event) => console.log('Viewport changed:', event.currentZoom)}
/>
```

### Node Event Handlers

| Handler | Parameters | Description |
|---------|------------|-------------|
| `onNodeClick` | `NodeEvent` | Called when a node is clicked |
| `onNodeDoubleClick` | `NodeEvent` | Called when a node is double-clicked |
| `onNodeMouseEnter` | `NodeEvent` | Called when mouse enters a node |
| `onNodeMouseLeave` | `NodeEvent` | Called when mouse leaves a node |
| `onNodeContextMenu` | `NodeEvent` | Called when right-clicking a node |

### Edge Event Handlers

| Handler | Parameters | Description |
|---------|------------|-------------|
| `onEdgeClick` | `EdgeEvent` | Called when an edge is clicked |
| `onEdgeDoubleClick` | `EdgeEvent` | Called when an edge is double-clicked |
| `onEdgeMouseEnter` | `EdgeEvent` | Called when mouse enters an edge |
| `onEdgeMouseLeave` | `EdgeEvent` | Called when mouse leaves an edge |
| `onEdgeContextMenu` | `EdgeEvent` | Called when right-clicking an edge |

### Canvas Event Handlers

| Handler | Parameters | Description |
|---------|------------|-------------|
| `onCanvasClick` | `CanvasEvent` | Called when clicking the canvas background |
| `onCanvasDoubleClick` | `CanvasEvent` | Called when double-clicking the canvas |
| `onCanvasContextMenu` | `CanvasEvent` | Called when right-clicking the canvas |

### Selection Event Handlers

| Handler | Parameters | Description |
|---------|------------|-------------|
| `onSelectionChange` | `SelectionEvent` | Called when selection changes |

### Drag Event Handlers

| Handler | Parameters | Description |
|---------|------------|-------------|
| `onDragStart` | `DragEvent` | Called when node dragging starts |
| `onDrag` | `DragEvent` | Called during node dragging |
| `onDragEnd` | `DragEvent` | Called when node dragging ends |

### Viewport Event Handlers

| Handler | Parameters | Description |
|---------|------------|-------------|
| `onViewportChange` | `ViewportEvent` | Called when viewport changes (pan/zoom) |

## Event Types

### NodeEvent

```typescript
interface NodeEvent {
  node: Node;
  originalEvent?: React.SyntheticEvent;
  position?: { x: number; y: number };
  timestamp: number;
  stopPropagation?: boolean;
}
```

### EdgeEvent

```typescript
interface EdgeEvent {
  edge: Edge;
  originalEvent?: React.SyntheticEvent;
  position?: { x: number; y: number };
  timestamp: number;
  stopPropagation?: boolean;
}
```

### CanvasEvent

```typescript
interface CanvasEvent {
  position: { x: number; y: number };
  zoom?: number;
  center?: { x: number; y: number };
  originalEvent?: React.SyntheticEvent;
  timestamp: number;
  stopPropagation?: boolean;
}
```

### SelectionEvent

```typescript
interface SelectionEvent {
  selectedNodes: Node[];
  selectedEdges: Edge[];
  isMultiSelect?: boolean;
  originalEvent?: React.SyntheticEvent;
  timestamp: number;
  stopPropagation?: boolean;
}
```

### DragEvent

```typescript
interface DragEvent {
  startPosition: { x: number; y: number };
  currentPosition: { x: number; y: number };
  nodes?: Node[];
  isDragEnd?: boolean;
  originalEvent?: React.SyntheticEvent;
  timestamp: number;
  stopPropagation?: boolean;
}
```

### ViewportEvent

```typescript
interface ViewportEvent {
  previousZoom: number;
  currentZoom: number;
  previousCenter: { x: number; y: number };
  currentCenter: { x: number; y: number };
  originalEvent?: React.SyntheticEvent;
  timestamp: number;
  stopPropagation?: boolean;
}
```

## Examples

### Node Selection

```tsx
import React, { useState } from 'react';
import { Graph, SelectionEvent, Node } from 'diagrammatic-ui';

const SelectionExample = () => {
  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  
  const handleSelectionChange = (event: SelectionEvent) => {
    setSelectedNodes(event.selectedNodes);
  };
  
  return (
    <div>
      <Graph
        data={graphData}
        interactionOptions={{
          selectionEnabled: true,
          multiSelectionEnabled: true
        }}
        onSelectionChange={handleSelectionChange}
      />
      <div>
        Selected nodes: {selectedNodes.map(node => node.label).join(', ')}
      </div>
    </div>
  );
};
```

### Node Dragging

```tsx
import React from 'react';
import { Graph, DragEvent } from 'diagrammatic-ui';

const DraggingExample = () => {
  const handleDragStart = (event: DragEvent) => {
    console.log('Started dragging nodes:', event.nodes?.map(n => n.id));
  };
  
  const handleDragEnd = (event: DragEvent) => {
    console.log('Finished dragging at position:', event.currentPosition);
  };
  
  return (
    <Graph
      data={graphData}
      interactionOptions={{
        draggingEnabled: true
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />
  );
};
```

### Zoom and Pan

```tsx
import React, { useState } from 'react';
import { Graph, ViewportEvent } from 'diagrammatic-ui';

const ZoomPanExample = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [center, setCenter] = useState({ x: 0, y: 0 });
  
  const handleViewportChange = (event: ViewportEvent) => {
    setZoomLevel(event.currentZoom);
    setCenter(event.currentCenter);
  };
  
  return (
    <div>
      <Graph
        data={graphData}
        interactionOptions={{
          zoomEnabled: true,
          panningEnabled: true,
          minZoom: 0.1,
          maxZoom: 3
        }}
        onViewportChange={handleViewportChange}
      />
      <div>
        Zoom: {zoomLevel.toFixed(2)}x | 
        Center: ({center.x.toFixed(0)}, {center.y.toFixed(0)})
      </div>
    </div>
  );
};
```

## Next Steps

- Learn about [Advanced Usage](./advanced-usage.md)
- Explore [Styling & Theming](./styling-and-theming.md)
- See [Examples](../examples/index.md) for more interaction demonstrations 