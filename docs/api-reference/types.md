# Data Types

This page documents the data structures and types used within Diagrammatic UI.

## GraphData

The main data structure for representing graph data.

```tsx
interface GraphData {
  nodes: Node[];
  edges: Edge[];
  metadata?: Record<string, unknown>;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `nodes` | `Node[]` | Array of nodes in the graph |
| `edges` | `Edge[]` | Array of edges connecting nodes |
| `metadata` | `Record<string, unknown>` | Optional metadata for the graph |

### Example

```tsx
const graphData: GraphData = {
  nodes: [
    { id: '1', label: 'Node 1' },
    { id: '2', label: 'Node 2' }
  ],
  edges: [
    { id: 'e1', source: '1', target: '2' }
  ],
  metadata: {
    title: 'My Graph',
    created: '2023-05-15'
  }
};
```

## Node

Represents a node in the graph.

```tsx
interface Node {
  id: string;
  label?: string;
  type?: string;
  data?: Record<string, unknown>;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the node |
| `label` | `string` | Display label for the node |
| `type` | `string` | Node type for styling/behavior (e.g., 'component', 'service') |
| `data` | `Record<string, unknown>` | Additional data associated with the node |

### Example

```tsx
const node: Node = {
  id: 'node1',
  label: 'User Service',
  type: 'service',
  data: {
    status: 'active',
    instances: 3,
    position: { x: 100, y: 200 }
  }
};
```

## Edge

Represents a connection between two nodes.

```tsx
interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  label?: string;
  data?: Record<string, unknown>;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the edge |
| `source` | `string` | ID of the source node |
| `target` | `string` | ID of the target node |
| `type` | `string` | Edge type for styling/behavior (e.g., 'default', 'dashed') |
| `label` | `string` | Display label for the edge |
| `data` | `Record<string, unknown>` | Additional data associated with the edge |

### Example

```tsx
const edge: Edge = {
  id: 'edge1',
  source: 'node1',
  target: 'node2',
  type: 'dashed',
  label: 'Connects to',
  data: {
    weight: 2,
    bidirectional: false
  }
};
```

## Position

Represents a 2D position in the graph.

```tsx
interface Position {
  x: number;
  y: number;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `x` | `number` | X-coordinate |
| `y` | `number` | Y-coordinate |

## CanvasEvent

Event data for canvas interactions.

```tsx
interface CanvasEvent {
  position: Position;
  originalEvent: React.MouseEvent;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `position` | `Position` | Position on the canvas where the event occurred |
| `originalEvent` | `React.MouseEvent` | Original React mouse event | 