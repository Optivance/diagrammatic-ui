# Layout Algorithms

Diagrammatic UI offers several layout algorithms to position nodes in your graph. This guide explains each layout type and its configuration options.

## Available Layouts

| Layout Type | Description | Best Use Cases |
|-------------|-------------|----------------|
| `force` | Physics-based force-directed layout | General network visualization, organic-looking graphs |
| `circular` | Nodes arranged in a circle | Highlighting cyclic relationships, compact representation |
| `tree` | Hierarchical tree layout | Parent-child relationships, organization charts |
| `spiral` | Nodes arranged in a spiral pattern | Compact visualization with many nodes |
| `donut` | Nodes arranged in concentric circles | Grouped hierarchical data, categories |
| `grid` | Nodes arranged in a grid pattern | Orderly presentation, matrix-like visualization |
| `radial` | Nodes arranged in a radial tree | Hierarchical data with focus on the central node |

## Using Layouts

To specify a layout, use the `autoLayout` prop:

```tsx
<Graph
  data={graphData}
  autoLayout="force"
  layoutOptions={{
    nodeSpacing: 100,
    forceStrength: 0.5
  }}
/>
```

## Layout Options

Each layout algorithm accepts specific configuration options:

### Force Layout

The force layout uses a physics simulation to position nodes.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `forceStrength` | `number` | `0.3` | Strength of the forces between nodes |
| `iterations` | `number` | `300` | Number of simulation iterations |
| `nodeSpacing` | `number` | `50` | Target distance between nodes |
| `chargeStrength` | `number` | `-30` | Repulsion force between nodes |
| `centerStrength` | `number` | `0.1` | Strength of centering force |

### Circular Layout

The circular layout arranges nodes in a circle.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `radius` | `number` | `null` | Circle radius (auto-calculated if null) |
| `startAngle` | `number` | `0` | Starting angle in radians |
| `endAngle` | `number` | `2 * Math.PI` | Ending angle in radians |
| `isDonut` | `boolean` | `false` | Whether to create concentric circles |
| `sortBy` | `string` | `null` | Node property to sort by |

### Tree Layout

The tree layout arranges nodes in a hierarchical tree structure.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `direction` | `'horizontal' \| 'vertical'` | `'vertical'` | Direction of the tree |
| `nodeSize` | `[number, number]` | `[100, 100]` | Size of nodes [width, height] |
| `separation` | `number` | `1` | Separation between siblings |
| `rootId` | `string` | `null` | ID of the root node (auto-detected if null) |

### Spiral Layout

The spiral layout arranges nodes in a spiral pattern.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `initialRadius` | `number` | `10` | Starting radius of the spiral |
| `growthFactor` | `number` | `5` | How quickly the spiral expands |
| `spacing` | `number` | `10` | Space between nodes |

### Donut Layout

The donut layout arranges nodes in concentric circles.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `innerRadius` | `number` | `100` | Radius of the inner circle |
| `outerRadius` | `number` | `300` | Radius of the outer circle |
| `groupProperty` | `string` | `'type'` | Node property to group by |

### Grid Layout

The grid layout arranges nodes in a grid pattern.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rows` | `number` | `null` | Number of rows (auto-calculated if null) |
| `cols` | `number` | `null` | Number of columns (auto-calculated if null) |
| `cellWidth` | `number` | `100` | Width of each grid cell |
| `cellHeight` | `number` | `100` | Height of each grid cell |

### Radial Layout

The radial layout arranges nodes in a radial tree structure.

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `radius` | `number` | `null` | Maximum radius (auto-calculated if null) |
| `rootId` | `string` | `null` | ID of the central node (auto-detected if null) |
| `angleWidth` | `number` | `2 * Math.PI` | Angular width in radians |
| `startAngle` | `number` | `0` | Starting angle in radians |

## Custom Layout Factory

For advanced use cases, you can create custom layouts using the layout factory:

```tsx
import { createLayout, LayoutType } from 'react-graph-viz';

// Apply a layout manually
const positions = createLayout(
  graphData.nodes,
  graphData.edges,
  {
    type: 'force',
    layoutOptions: { forceStrength: 0.5 },
    width: 800,
    height: 600
  }
);
```

## Next Steps

- Learn about [Styling & Theming](./styling-and-theming.md)
- Explore [Interaction Options](./interactions.md)
- See [Examples](../examples/index.md) for layout demonstrations 