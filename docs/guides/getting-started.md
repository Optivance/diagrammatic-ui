# Getting Started with Diagrammatic UI

This guide will help you get up and running with Diagrammatic UI in your React application.

## Installation

You can install Diagrammatic UI using npm or yarn:

```bash
npm install diagrammatic-ui
# or
yarn add diagrammatic-ui
```

## Basic Usage

Here's a simple example of how to use the Graph component:

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const SimpleGraph = () => {
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
    <div style={{ width: '800px', height: '600px' }}>
      <Graph 
        data={graphData}
        autoLayout="force"
        interactionOptions={{
          draggingEnabled: true,
          zoomEnabled: true,
          panningEnabled: true,
          selectionEnabled: true
        }}
      />
    </div>
  );
};

export default SimpleGraph;
```

## Required Props

The `Graph` component requires at minimum:

| Prop | Type | Description |
|------|------|-------------|
| `data` | `GraphData` | Object containing `nodes` and `edges` arrays |

## Common Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | `number` | `800` | Width of the graph container |
| `height` | `number` | `600` | Height of the graph container |
| `autoLayout` | `LayoutType` | `'force'` | Layout algorithm to use |
| `theme` | `'light' \| 'dark'` | `'light'` | Visual theme |
| `interactionOptions` | `InteractionOptions` | `{}` | Configuration for interactive features |

## Next Steps

- Learn about [Core Concepts](./core-concepts.md)
- Explore [Layout Options](./layouts.md)
- See [Examples](../examples/index.md) for more usage patterns 