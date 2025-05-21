# Core Concepts

This guide explains the fundamental concepts of Diagrammatic UI.

## Graph Data Structure

At the core of Diagrammatic UI is the graph data structure, consisting of nodes and edges:

### Nodes

Nodes represent the vertices in your graph. Each node must have a unique identifier and can have additional properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for the node |
| `label` | `string` | No | Display text for the node |
| `type` | `string` | No | Node classification/category for styling |
| `description` | `string` | No | Brief text description |
| `metadata` | `object` | No | Additional structured data |
| `sections` | `Section[]` | No | Structured content sections |
| `data` | `object` | No | Custom data for application use |

### Edges

Edges represent connections between nodes:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier for the edge |
| `source` | `string` | Yes | ID of the source node |
| `target` | `string` | Yes | ID of the target node |
| `type` | `string` | No | Edge classification for styling |
| `label` | `string` | No | Display text for the edge |
| `data` | `object` | No | Custom data for application use |

### GraphData

The complete graph data structure combines nodes and edges:

```typescript
interface GraphData {
  nodes: Node[];
  edges: Edge[];
  metadata?: Record<string, unknown>;
}
```

## Layouts

Diagrammatic UI supports multiple layout algorithms to position your nodes:

| Layout | Description | Best For |
|--------|-------------|----------|
| `force` | Force-directed layout using physics simulation | General-purpose network visualization |
| `circular` | Nodes arranged in a circle | Highlighting cyclic relationships |
| `tree` | Hierarchical tree layout | Parent-child relationships |
| `spiral` | Nodes arranged in a spiral pattern | Compact visualization of many nodes |
| `donut` | Nodes arranged in concentric circles | Grouped hierarchical data |
| `grid` | Nodes arranged in a grid | Orderly presentation of nodes |
| `radial` | Nodes arranged in a radial tree | Hierarchical data with focus on the root |

## Interactions

Diagrammatic UI provides rich interaction options:

| Feature | Description |
|---------|-------------|
| Selection | Select nodes and edges with click or multi-select |
| Dragging | Move nodes by dragging |
| Zooming | Zoom in/out with mouse wheel or pinch gesture |
| Panning | Move the viewport by dragging the background |
| Events | Rich event system for responding to user actions |

## Theming and Styling

The library supports comprehensive styling options:

- Light and dark themes
- Custom node and edge styles based on type
- Custom renderers for completely custom node appearances
- Theme customization for colors, typography, and spacing

## Data Adapters

Diagrammatic UI includes adapters for converting between different graph data formats:

| Adapter | Purpose |
|---------|---------|
| D3ForceAdapter | Convert to/from D3.js force layout format |
| CytoscapeAdapter | Convert to/from Cytoscape.js format |
| AdjacencyMatrixAdapter | Convert to/from adjacency matrix representation |
| DependencyTreeAdapter | Convert to/from hierarchical dependency trees |
| JSONGraphAdapter | Convert to/from standardized JSON graph formats |

## Next Steps

- Learn about [Layout Options](./layouts.md) in detail
- Explore [Styling & Theming](./styling-and-theming.md)
- See [Data Adapters](./data-adapters.md) for working with different formats 