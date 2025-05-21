# React Graph Viz

A flexible, customizable graph visualization library for React applications. Built with TypeScript and designed for high performance and extensibility.

## Features

- 🎨 Interactive graph visualization with multiple layout options (force, circular, tree, spiral, donut)
- 🎯 Highly customizable node and edge styling with theme support
- 🔄 Built-in data adapters for various graph formats (D3, Cytoscape, Adjacency Matrix)
- 🖱️ Rich interaction support (selection, drag, pan, zoom)
- 📦 TypeScript support with comprehensive type definitions
- 🎭 Light and dark theme support
- 🚀 Optimized for large datasets
- 📐 Multiple layout algorithms

## Installation

```bash
npm install react-graph-viz
# or
yarn add react-graph-viz
```

## Quick Start

```tsx
import { Graph } from 'react-graph-viz';

const MyComponent = () => {
  const graphData = {
    nodes: [
      { id: '1', label: 'Node 1', data: { x: 100, y: 100 } },
      { id: '2', label: 'Node 2', data: { x: 200, y: 100 } },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
    ]
  };

  return (
    <Graph 
      data={graphData}
      interactionOptions={{
        selectionEnabled: true,
        draggingEnabled: true,
        zoomEnabled: true,
        panningEnabled: true,
      }}
      onNodeClick={(event) => console.log('Node clicked:', event.node.id)}
    />
  );
};
```

## API Reference

### Graph Component

The main component for rendering graphs.

```tsx
import { Graph, GraphData, InteractionOptions } from 'react-graph-viz';

interface GraphProps {
  /** Graph data containing nodes and edges */
  data: GraphData;
  
  /** Configuration for interactive features */
  interactionOptions?: InteractionOptions;
  
  /** Theme configuration for visual styling */
  theme?: ThemeConfig;
  
  /** Layout algorithm to use */
  layout?: 'force' | 'circular' | 'tree' | 'spiral' | 'donut';
  
  /** Width of the graph container */
  width?: number;
  
  /** Height of the graph container */
  height?: number;
}
```

### Data Types

#### GraphData

```tsx
interface GraphData {
  /** Array of nodes in the graph */
  nodes: Node[];
  
  /** Array of edges connecting nodes */
  edges: Edge[];
  
  /** Optional metadata for the graph */
  metadata?: Record<string, unknown>;
}

interface Node {
  /** Unique identifier for the node */
  id: string;
  
  /** Display label for the node */
  label?: string;
  
  /** Node type for styling/behavior */
  type?: string;
  
  /** Additional data associated with the node */
  data?: Record<string, unknown>;
}

interface Edge {
  /** Unique identifier for the edge */
  id: string;
  
  /** ID of the source node */
  source: string;
  
  /** ID of the target node */
  target: string;
  
  /** Edge type for styling/behavior */
  type?: string;
  
  /** Display label for the edge */
  label?: string;
  
  /** Additional data associated with the edge */
  data?: Record<string, unknown>;
}
```

### Interaction Options

```tsx
interface InteractionOptions {
  /** Enable node/edge selection */
  selectionEnabled?: boolean;
  
  /** Enable multi-selection with Ctrl/Cmd key */
  multiSelectionEnabled?: boolean;
  
  /** Enable node dragging */
  draggingEnabled?: boolean;
  
  /** Enable zoom with mouse wheel/pinch */
  zoomEnabled?: boolean;
  
  /** Enable panning by dragging the background */
  panningEnabled?: boolean;
  
  /** Enable edge creation through interaction */
  edgeCreationEnabled?: boolean;
  
  /** Minimum zoom level */
  minZoom?: number;
  
  /** Maximum zoom level */
  maxZoom?: number;
  
  /** Fit graph to viewport on initialization */
  fitViewOnInit?: boolean;
}
```

### Event Handlers

```tsx
interface GraphEventHandlers {
  /** Called when a node is clicked */
  onNodeClick?: (event: NodeEvent) => void;
  
  /** Called when mouse enters a node */
  onNodeMouseEnter?: (event: NodeEvent) => void;
  
  /** Called when mouse leaves a node */
  onNodeMouseLeave?: (event: NodeEvent) => void;
  
  /** Called when an edge is clicked */
  onEdgeClick?: (event: EdgeEvent) => void;
  
  /** Called when the canvas background is clicked */
  onCanvasClick?: (event: CanvasEvent) => void;
  
  /** Called when node dragging starts */
  onDragStart?: (event: DragEvent) => void;
  
  /** Called during node dragging */
  onDrag?: (event: DragEvent) => void;
  
  /** Called when node dragging ends */
  onDragEnd?: (event: DragEvent) => void;
  
  /** Called when selection changes */
  onSelectionChange?: (event: SelectionEvent) => void;
  
  /** Called when viewport changes (pan/zoom) */
  onViewportChange?: (event: ViewportEvent) => void;
}
```

### Data Adapters

The library includes adapters for converting between different graph data formats:

```tsx
import { D3ForceAdapter, CytoscapeAdapter, AdjacencyMatrixAdapter } from 'react-graph-viz';

// Convert from D3 force layout format
const d3Adapter = new D3ForceAdapter();
const graphData = d3Adapter.toGraph(d3Data);

// Convert to Cytoscape.js format
const cytoscapeAdapter = new CytoscapeAdapter();
const cytoscapeData = cytoscapeAdapter.fromGraph(graphData);
```

## Examples

### Basic Graph with Force Layout

```tsx
import { Graph } from 'react-graph-viz';

const ForceLayoutExample = () => {
  const data = {
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
      data={data}
      layout="force"
      interactionOptions={{
        draggingEnabled: true,
        zoomEnabled: true,
        fitViewOnInit: true,
      }}
    />
  );
};
```

### Interactive Selection Example

```tsx
import { Graph, SelectionEvent } from 'react-graph-viz';

const SelectionExample = () => {
  const handleSelectionChange = (event: SelectionEvent) => {
    console.log('Selected nodes:', event.selectedNodes);
    console.log('Selected edges:', event.selectedEdges);
  };

  return (
    <Graph
      data={graphData}
      interactionOptions={{
        selectionEnabled: true,
        multiSelectionEnabled: true,
      }}
      onSelectionChange={handleSelectionChange}
    />
  );
};
```

## Development

### Running the Demo

```bash
# Install dependencies
npm install

# Start the demo application
npm run demo
```

### Building the Library

```bash
# Build the library
npm run build

# Run tests
npm test

# Generate documentation
npm run docs
```

### Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

MIT © [Your Name] 