# Customization Guide

This guide explains how to customize the appearance and behavior of Diagrammatic UI components.

## Theming

Diagrammatic UI comes with built-in light and dark themes:

```tsx
// Light theme (default)
<Graph data={graphData} theme="light" />

// Dark theme
<Graph data={graphData} theme="dark" />
```

## Node Styling

### Using Node Types

You can style nodes differently based on their type:

```tsx
const graphData = {
  nodes: [
    { id: '1', label: 'Database', type: 'database' },
    { id: '2', label: 'Service', type: 'service' },
    { id: '3', label: 'Frontend', type: 'ui' },
  ],
  edges: [
    { id: 'e1', source: '1', target: '2' },
    { id: 'e2', source: '2', target: '3' },
  ]
};
```

The library comes with default styles for common node types:
- `default` - Standard node style
- `component` - For UI components
- `service` - For services or API endpoints
- `database` - For databases
- `model` - For data models or schemas
- `context` - For context providers or state containers

### Custom Menu Options

Add custom actions to nodes by configuring menu items:

```tsx
import { Star, Copy, Info, ExternalLink } from 'lucide-react';

// Define custom menu items
const menuItems = [
  {
    id: 'info',
    label: 'View Details',
    icon: <Info size={16} />,
    onClick: (node) => showNodeDetails(node.id),
  },
  {
    id: 'star',
    label: 'Star',
    icon: <Star size={16} color="#f59e0b" />,
    onClick: (node) => toggleStar(node.id),
  },
  {
    id: 'copy',
    label: 'Copy ID',
    icon: <Copy size={16} />,
    onClick: (node) => navigator.clipboard.writeText(node.id),
    divider: true,
  },
  {
    id: 'open',
    label: 'Open in New Tab',
    icon: <ExternalLink size={16} />,
    onClick: (node) => window.open(`/details/${node.id}`, '_blank'),
  },
];

// Use the custom menu
<Graph 
  data={graphData}
  nodeMenuConfig={{
    items: menuItems,
    showDropdownMenu: true,
    enableContextMenu: true
  }}
/>
```

## Edge Styling

### Using Edge Types

Customize edge appearance based on their type:

```tsx
const graphData = {
  nodes: [
    { id: '1', label: 'User Service' },
    { id: '2', label: 'Payment Service' },
    { id: '3', label: 'Email Service' },
  ],
  edges: [
    { id: 'e1', source: '1', target: '2', type: 'sync' },
    { id: 'e2', source: '1', target: '3', type: 'async' },
    { id: 'e3', source: '2', target: '3', type: 'dashed' },
  ]
};
```

The library supports several edge types:
- `default` - Standard solid line
- `dashed` - Dashed line
- `dotted` - Dotted line
- `thick` - Thicker line
- `thin` - Thinner line
- `async` - Styled to indicate asynchronous connection
- `sync` - Styled to indicate synchronous connection

### Edge Labels

Add descriptive labels to edges:

```tsx
const graphData = {
  // ... nodes
  edges: [
    { 
      id: 'e1', 
      source: '1', 
      target: '2', 
      type: 'sync',
      label: 'Makes API calls' 
    },
    { 
      id: 'e2', 
      source: '1', 
      target: '3', 
      type: 'async',
      label: 'Sends events' 
    },
  ]
};
```

## Layout Customization

### Available Layouts

Choose from several layout algorithms:

```tsx
// Force-directed layout (good for general purpose)
<Graph data={graphData} autoLayout="force" />

// Circular layout (good for cyclic structures)
<Graph data={graphData} autoLayout="circular" />

// Tree layout (good for hierarchical data)
<Graph data={graphData} autoLayout="tree" />

// Spiral layout (compact arrangement)
<Graph data={graphData} autoLayout="spiral" />

// Donut layout (circular with empty center)
<Graph data={graphData} autoLayout="donut" />
```

### Custom Positioning

For precise control, you can specify positions for nodes:

```tsx
const graphData = {
  nodes: [
    { 
      id: '1', 
      label: 'Node 1',
      data: { x: 100, y: 100 }
    },
    { 
      id: '2', 
      label: 'Node 2',
      data: { x: 200, y: 100 }
    },
    { 
      id: '3', 
      label: 'Node 3',
      data: { x: 150, y: 200 }
    },
  ],
  // ... edges
};
```

## Advanced Customization

### Custom Node Sizes

Adjust the overall size of nodes with the `nodeSizeScale` prop:

```tsx
// Make nodes 20% larger
<Graph data={graphData} nodeSizeScale={1.2} />

// Make nodes 10% smaller
<Graph data={graphData} nodeSizeScale={0.9} />
```

### Container Dimensions

Control the size of the graph container:

```tsx
// Fixed dimensions
<Graph 
  data={graphData} 
  width={800} 
  height={600} 
/>

// Responsive container (using parent element size)
<div style={{ width: '100%', height: '500px' }}>
  <Graph data={graphData} />
</div>
```

### Viewport Control

Use viewport controls to adjust the view programmatically:

```tsx
function GraphWithControls() {
  const handleResetView = () => {
    // Reset the graph view to default
    // ...
  };

  const handleZoomToNode = (nodeId) => {
    // Zoom to a specific node
    // ...
  };

  return (
    <div>
      <div className="controls">
        <button onClick={handleResetView}>Reset View</button>
        <button onClick={() => handleZoomToNode('node1')}>Zoom to Node 1</button>
      </div>
      <Graph 
        data={graphData}
        onViewportChange={(transform) => {
          console.log('Current scale:', transform.scale);
        }}
      />
    </div>
  );
}
``` 