# Getting Started with Diagrammatic UI

This guide will help you get started with Diagrammatic UI, a powerful graph visualization library for React applications.

## Installation

First, install the package from npm:

```bash
# Using npm
npm install diagrammatic-ui

# Using yarn
yarn add diagrammatic-ui

# Using pnpm
pnpm add diagrammatic-ui
```

## Basic Usage

Here's a simple example to get you started:

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

function BasicGraph() {
  // Define your graph data
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
    <div style={{ height: 500, border: '1px solid #ddd' }}>
      <Graph 
        data={graphData}
        autoLayout="circular"
        theme="light"
      />
    </div>
  );
}

export default BasicGraph;
```

## Advanced Configuration

### Interaction Options

Enable various interaction features:

```tsx
<Graph 
  data={graphData}
  interactionOptions={{
    selectionEnabled: true,    // Enable selecting nodes
    multiSelectionEnabled: true, // Allow selecting multiple nodes
    draggingEnabled: true,     // Allow dragging nodes
    zoomEnabled: true,         // Enable zooming
    panningEnabled: true,      // Enable panning
    minZoom: 0.5,              // Minimum zoom level
    maxZoom: 2,                // Maximum zoom level
    fitViewOnInit: true        // Fit graph to viewport on initialization
  }}
/>
```

### Event Handling

Adding event handlers to respond to user interactions:

```tsx
function InteractiveGraph() {
  // Event handlers
  const handleNodeClick = (nodeId) => {
    console.log(`Clicked on node: ${nodeId}`);
    // Perform actions when a node is clicked
  };

  const handleSelectionChange = (selectedNodes, selectedEdges) => {
    console.log('Selected nodes:', selectedNodes);
    console.log('Selected edges:', selectedEdges);
    // Update UI based on selection
  };

  return (
    <Graph 
      data={graphData}
      onNodeClick={handleNodeClick}
      onSelectionChange={handleSelectionChange}
      onNodeMouseEnter={(nodeId) => console.log(`Hovering node: ${nodeId}`)}
    />
  );
}
```

### Different Layouts

The library supports several layout algorithms:

```tsx
// Force-directed layout
<Graph data={graphData} autoLayout="force" />

// Circular layout
<Graph data={graphData} autoLayout="circular" />

// Tree layout
<Graph data={graphData} autoLayout="tree" />

// Spiral layout
<Graph data={graphData} autoLayout="spiral" />

// Donut layout
<Graph data={graphData} autoLayout="donut" />
```

## Working with Custom Data

You can add custom data to your nodes and edges:

```tsx
const customGraphData = {
  nodes: [
    { 
      id: 'service1',
      label: 'Auth Service',
      type: 'service',
      data: { 
        status: 'healthy',
        instances: 3,
        metrics: {
          cpu: 0.2,
          memory: 512
        }
      }
    },
    // More nodes...
  ],
  edges: [
    {
      id: 'conn1',
      source: 'service1',
      target: 'service2',
      type: 'http',
      label: 'HTTP/2',
      data: {
        requestsPerSecond: 120,
        latency: 50,
        status: 'stable'
      }
    },
    // More edges...
  ]
};
```

## Next Steps

Now that you're familiar with the basics, explore other parts of the documentation:

- [API Reference](../api-reference/README.md) - Detailed API documentation
- [Customization Guide](./customization.md) - Learn how to customize the appearance
- [Examples](../examples/README.md) - More complex usage examples

If you have any questions or encounter issues, please file an issue on our [GitHub repository](https://github.com/diagrammatic-ui/diagrammatic-ui). 