# Layout Types

Diagrammatic UI provides several layout algorithms for automatically arranging nodes in visually appealing ways. These layouts help organize complex graph data into readable visualizations.

## Available Layouts

| Layout Type | Description | Best For |
|-------------|-------------|----------|
| `force` | Physics-based force-directed layout | General-purpose networks with organic feel |
| `circular` | Arranges nodes in a circle | Showing cycles, loops, or equal relationships |
| `tree` | Hierarchical tree layout | Parent-child relationships, hierarchies |
| `spiral` | Arranges nodes in a spiral pattern | Compact display of sequential data |
| `donut` | Places nodes in concentric rings | Grouped data with hierarchical rings |
| `grid` | Arranges nodes in a grid pattern | Regular structures, matrix-like relationships |
| `radial` | Nodes radiate outward from a center point | Showing relationships to a central concept |

## Force Layout

The force-directed layout uses physics simulation to position nodes. Nodes repel each other while edges act like springs, pulling connected nodes together.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `forceStrength` | `number` | `0.3` | Strength of forces between nodes |
| `linkDistance` | `number` | `150` | Target distance for links between nodes |
| `chargeStrength` | `number` | `-30` | Strength of node repulsion |
| `iterations` | `number` | `300` | Number of simulation iterations |
| `centeringForce` | `number` | `0.1` | Strength of force pulling nodes to center |

### Usage

```tsx
import { Graph } from 'diagrammatic-ui';

const ForceLayoutGraph = () => {
  return (
    <Graph
      data={graphData}
      autoLayout="force"
      layoutOptions={{
        forceStrength: 0.4,
        linkDistance: 200,
        iterations: 500
      }}
    />
  );
};
```

## Circular Layout

The circular layout arranges nodes in a circle, optionally ordered by a specified property.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `radius` | `number` | `null` | Radius of the circle (auto-calculated if null) |
| `startAngle` | `number` | `0` | Starting angle in radians |
| `endAngle` | `number` | `2 * Math.PI` | Ending angle in radians |
| `isDonut` | `boolean` | `false` | Whether to create a donut layout |
| `sortBy` | `string` | `null` | Node property name to sort by |

### Usage

```tsx
import { Graph } from 'diagrammatic-ui';

const CircularLayoutGraph = () => {
  return (
    <Graph
      data={graphData}
      autoLayout="circular"
      layoutOptions={{
        radius: 300,
        startAngle: Math.PI / 2,  // Start from top
        sortBy: "name"            // Sort nodes by name
      }}
    />
  );
};
```

## Tree Layout

The tree layout organizes nodes in a hierarchical structure, ideal for displaying parent-child relationships.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `treeDirection` | `'horizontal' \| 'vertical'` | `'vertical'` | Direction of the tree |
| `nodeSpacing` | `number` | `50` | Horizontal spacing between nodes |
| `levelSpacing` | `number` | `100` | Vertical spacing between levels |
| `rootNodeId` | `string` | `null` | ID of the root node (auto-detected if null) |
| `alignLeaves` | `boolean` | `false` | Whether to align leaf nodes at the same level |

### Usage

```tsx
import { Graph } from 'diagrammatic-ui';

const TreeLayoutGraph = () => {
  return (
    <Graph
      data={graphData}
      autoLayout="tree"
      layoutOptions={{
        treeDirection: 'horizontal',
        nodeSpacing: 80,
        levelSpacing: 150,
        rootNodeId: 'root-node'
      }}
    />
  );
};
```

## Spiral Layout

The spiral layout arranges nodes in a spiral pattern, useful for compact visualization of sequential data.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `spacing` | `number` | `10` | Spacing between spiral turns |
| `angleStep` | `number` | `0.3` | Angle increment per node |
| `startRadius` | `number` | `30` | Starting radius of the spiral |
| `sortBy` | `string` | `null` | Node property to sort by |

### Usage

```tsx
import { Graph } from 'diagrammatic-ui';

const SpiralLayoutGraph = () => {
  return (
    <Graph
      data={graphData}
      autoLayout="spiral"
      layoutOptions={{
        spacing: 15,
        angleStep: 0.25,
        startRadius: 50,
        sortBy: "timestamp"  // Sort nodes by timestamp
      }}
    />
  );
};
```

## Donut Layout

The donut layout places nodes in concentric rings, typically grouped by a specified property.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `innerRadius` | `number` | `100` | Inner radius of the donut |
| `outerRadius` | `number` | `300` | Outer radius of the donut |
| `groupBy` | `string` | `"type"` | Node property to group by |
| `sortBy` | `string` | `null` | Node property to sort by within groups |
| `angleSpacing` | `number` | `0.1` | Angular spacing between nodes |

### Usage

```tsx
import { Graph } from 'diagrammatic-ui';

const DonutLayoutGraph = () => {
  return (
    <Graph
      data={graphData}
      autoLayout="donut"
      layoutOptions={{
        innerRadius: 150,
        outerRadius: 350,
        groupBy: "category",
        sortBy: "priority"
      }}
    />
  );
};
```

## Grid Layout

The grid layout arranges nodes in a regular grid pattern.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `rows` | `number` | `null` | Number of rows (auto-calculated if null) |
| `cols` | `number` | `null` | Number of columns (auto-calculated if null) |
| `cellWidth` | `number` | `150` | Width of each grid cell |
| `cellHeight` | `number` | `150` | Height of each grid cell |
| `sortBy` | `string` | `null` | Node property to sort by before grid arrangement |

### Usage

```tsx
import { Graph } from 'diagrammatic-ui';

const GridLayoutGraph = () => {
  return (
    <Graph
      data={graphData}
      autoLayout="grid"
      layoutOptions={{
        cellWidth: 180,
        cellHeight: 120,
        rows: 4,
        sortBy: "name"
      }}
    />
  );
};
```

## Radial Layout

The radial layout positions nodes radiating outward from a center point, with distance typically representing relationship strength or hierarchy level.

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `centerNodeId` | `string` | `null` | ID of the center node (auto-detected if null) |
| `levelRadius` | `number` | `100` | Radius between concentric levels |
| `nodePadding` | `number` | `10` | Padding between nodes at the same level |
| `sortBy` | `string` | `null` | Node property to sort by within each level |
| `angleSpread` | `number` | `2 * Math.PI` | Angular spread for node placement |

### Usage

```tsx
import { Graph } from 'diagrammatic-ui';

const RadialLayoutGraph = () => {
  return (
    <Graph
      data={graphData}
      autoLayout="radial"
      layoutOptions={{
        centerNodeId: 'central-concept',
        levelRadius: 120,
        sortBy: "weight"
      }}
    />
  );
};
```

## Custom Layouts

You can create custom layouts by implementing your own layout algorithm:

```tsx
import { Graph, Node, Edge, Position } from 'diagrammatic-ui';

// Custom layout function
const myCustomLayout = (
  nodes: Node[], 
  edges: Edge[], 
  width: number, 
  height: number
): Record<string, Position> => {
  const result: Record<string, Position> = {};
  
  // Place nodes in a diamond pattern
  const centerX = width / 2;
  const centerY = height / 2;
  const nodeCount = nodes.length;
  
  nodes.forEach((node, index) => {
    const angle = (index / nodeCount) * 2 * Math.PI;
    const distance = 200;
    
    result[node.id] = {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance
    };
  });
  
  return result;
};

// Use custom layout
const CustomLayoutGraph = () => {
  const [positions, setPositions] = useState<Record<string, Position>>({});
  
  useEffect(() => {
    // Calculate positions once data is available
    if (graphData.nodes.length > 0) {
      const calculatedPositions = myCustomLayout(
        graphData.nodes, 
        graphData.edges, 
        800, 
        600
      );
      setPositions(calculatedPositions);
    }
  }, [graphData]);
  
  return (
    <Graph
      data={graphData}
      initialPositions={positions}
      // Disable auto layout
      autoLayout={null}
    />
  );
};
```

## Examples

Here are examples of different layout types applied to the same graph data:

<!-- TODO: Add screenshots or animated GIFs here showing each layout type -->

## See Also

- [Graph Component](../components/Graph.md)
- [Force Layout](./ForceLayout.md)
- [Tree Layout](./TreeLayout.md) 