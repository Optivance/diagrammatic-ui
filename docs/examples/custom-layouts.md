# Custom Layouts Example

This example demonstrates how to use different layout algorithms to arrange nodes in Diagrammatic UI.

## Force-Directed Layout

Force-directed layouts use physics simulations to position nodes organically, making them great for general-purpose network visualization.

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const ForceLayoutExample = () => {
  const graphData = {
    nodes: [
      { id: '1', name: 'Node 1' },
      { id: '2', name: 'Node 2' },
      { id: '3', name: 'Node 3' },
      { id: '4', name: 'Node 4' },
      { id: '5', name: 'Node 5' },
      { id: '6', name: 'Node 6' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '3', target: '5' },
      { id: 'e5', source: '5', target: '6' },
      { id: 'e6', source: '6', target: '1' },
    ]
  };

  return (
    <div style={{ width: '800px', height: '600px', border: '1px solid #ddd' }}>
      <Graph 
        data={graphData}
        autoLayout="force"
        layoutOptions={{
          forceStrength: 0.3,
          linkDistance: 150,
          iterations: 300
        }}
        interactionOptions={{
          draggingEnabled: true,
          zoomEnabled: true,
          panningEnabled: true
        }}
      />
    </div>
  );
};

export default ForceLayoutExample;
```

## Tree Layout

Tree layouts are ideal for hierarchical data like organizational charts, file systems, or parent-child relationships.

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const TreeLayoutExample = () => {
  const hierarchicalData = {
    nodes: [
      { id: 'ceo', name: 'CEO' },
      { id: 'cto', name: 'CTO' },
      { id: 'cfo', name: 'CFO' },
      { id: 'dev1', name: 'Developer 1' },
      { id: 'dev2', name: 'Developer 2' },
      { id: 'des1', name: 'Designer 1' },
      { id: 'acc1', name: 'Accountant 1' },
      { id: 'acc2', name: 'Accountant 2' },
    ],
    edges: [
      { id: 'e1', source: 'ceo', target: 'cto' },
      { id: 'e2', source: 'ceo', target: 'cfo' },
      { id: 'e3', source: 'cto', target: 'dev1' },
      { id: 'e4', source: 'cto', target: 'dev2' },
      { id: 'e5', source: 'cto', target: 'des1' },
      { id: 'e6', source: 'cfo', target: 'acc1' },
      { id: 'e7', source: 'cfo', target: 'acc2' },
    ]
  };

  return (
    <div style={{ width: '800px', height: '600px', border: '1px solid #ddd' }}>
      <Graph 
        data={hierarchicalData}
        autoLayout="tree"
        layoutOptions={{
          treeDirection: 'vertical',
          nodeSpacing: 70,
          levelSpacing: 150,
          rootNodeId: 'ceo'
        }}
        interactionOptions={{
          draggingEnabled: true,
          zoomEnabled: true,
          panningEnabled: true
        }}
      />
    </div>
  );
};

export default TreeLayoutExample;
```

## Circular Layout

Circular layouts place nodes in a circle, which is useful for visualizing networks with no clear hierarchy.

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const CircularLayoutExample = () => {
  const graphData = {
    nodes: [
      { id: '1', name: 'January' },
      { id: '2', name: 'February' },
      { id: '3', name: 'March' },
      { id: '4', name: 'April' },
      { id: '5', name: 'May' },
      { id: '6', name: 'June' },
      { id: '7', name: 'July' },
      { id: '8', name: 'August' },
      { id: '9', name: 'September' },
      { id: '10', name: 'October' },
      { id: '11', name: 'November' },
      { id: '12', name: 'December' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '4', target: '5' },
      { id: 'e5', source: '5', target: '6' },
      { id: 'e6', source: '6', target: '7' },
      { id: 'e7', source: '7', target: '8' },
      { id: 'e8', source: '8', target: '9' },
      { id: 'e9', source: '9', target: '10' },
      { id: 'e10', source: '10', target: '11' },
      { id: 'e11', source: '11', target: '12' },
      { id: 'e12', source: '12', target: '1' },
    ]
  };

  return (
    <div style={{ width: '800px', height: '600px', border: '1px solid #ddd' }}>
      <Graph 
        data={graphData}
        autoLayout="circular"
        layoutOptions={{
          radius: 250,
          startAngle: Math.PI / 2,  // Start from top (90 degrees)
          endAngle: Math.PI * 2.5   // Full circle plus buffer
        }}
        interactionOptions={{
          draggingEnabled: true,
          zoomEnabled: true,
          panningEnabled: true
        }}
      />
    </div>
  );
};

export default CircularLayoutExample;
```

## Grid Layout

Grid layouts place nodes in a regular grid pattern, ideal for ordered datasets.

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const GridLayoutExample = () => {
  // Generate a 4x4 grid of nodes
  const nodes = [];
  const edges = [];
  
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const id = `${row}-${col}`;
      nodes.push({
        id,
        name: `Node ${row},${col}`
      });
      
      // Connect to right neighbor
      if (col < 3) {
        edges.push({
          id: `e-${row}-${col}-h`,
          source: id,
          target: `${row}-${col + 1}`
        });
      }
      
      // Connect to bottom neighbor
      if (row < 3) {
        edges.push({
          id: `e-${row}-${col}-v`,
          source: id,
          target: `${row + 1}-${col}`
        });
      }
    }
  }

  return (
    <div style={{ width: '800px', height: '600px', border: '1px solid #ddd' }}>
      <Graph 
        data={{ nodes, edges }}
        autoLayout="grid"
        layoutOptions={{
          rows: 4,
          cols: 4,
          cellWidth: 120,
          cellHeight: 100
        }}
        interactionOptions={{
          draggingEnabled: true,
          zoomEnabled: true,
          panningEnabled: true
        }}
      />
    </div>
  );
};

export default GridLayoutExample;
```

## Radial Layout

Radial layouts arrange nodes in concentric circles radiating from a central point.

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const RadialLayoutExample = () => {
  const graphData = {
    nodes: [
      { id: 'center', name: 'Central Concept' },
      { id: 'rel1', name: 'Related 1' },
      { id: 'rel2', name: 'Related 2' },
      { id: 'rel3', name: 'Related 3' },
      { id: 'rel4', name: 'Related 4' },
      { id: 'rel5', name: 'Related 5' },
      { id: 'sub1', name: 'Subtopic 1' },
      { id: 'sub2', name: 'Subtopic 2' },
      { id: 'sub3', name: 'Subtopic 3' },
      { id: 'sub4', name: 'Subtopic 4' },
    ],
    edges: [
      { id: 'e1', source: 'center', target: 'rel1' },
      { id: 'e2', source: 'center', target: 'rel2' },
      { id: 'e3', source: 'center', target: 'rel3' },
      { id: 'e4', source: 'center', target: 'rel4' },
      { id: 'e5', source: 'center', target: 'rel5' },
      { id: 'e6', source: 'rel1', target: 'sub1' },
      { id: 'e7', source: 'rel1', target: 'sub2' },
      { id: 'e8', source: 'rel3', target: 'sub3' },
      { id: 'e9', source: 'rel5', target: 'sub4' },
    ]
  };

  return (
    <div style={{ width: '800px', height: '600px', border: '1px solid #ddd' }}>
      <Graph 
        data={graphData}
        autoLayout="radial"
        layoutOptions={{
          centerNodeId: 'center',
          levelRadius: 120,
          nodePadding: 15
        }}
        interactionOptions={{
          draggingEnabled: true,
          zoomEnabled: true,
          panningEnabled: true
        }}
      />
    </div>
  );
};

export default RadialLayoutExample;
```

## Dynamic Layout Switching

This example demonstrates how to dynamically switch between different layout algorithms:

```tsx
import React, { useState } from 'react';
import { Graph, LayoutType } from 'diagrammatic-ui';

const DynamicLayoutExample = () => {
  const [layoutType, setLayoutType] = useState<LayoutType>('force');
  
  const graphData = {
    nodes: [
      { id: '1', name: 'Node 1' },
      { id: '2', name: 'Node 2' },
      { id: '3', name: 'Node 3' },
      { id: '4', name: 'Node 4' },
      { id: '5', name: 'Node 5' },
      { id: '6', name: 'Node 6' },
      { id: '7', name: 'Node 7' },
      { id: '8', name: 'Node 8' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '1', target: '3' },
      { id: 'e3', source: '2', target: '4' },
      { id: 'e4', source: '2', target: '5' },
      { id: 'e5', source: '3', target: '6' },
      { id: 'e6', source: '3', target: '7' },
      { id: 'e7', source: '4', target: '8' },
    ]
  };
  
  // Layout options for different layouts
  const layoutOptions = {
    force: {
      forceStrength: 0.3,
      linkDistance: 150
    },
    tree: {
      treeDirection: 'vertical',
      nodeSpacing: 80,
      levelSpacing: 150,
      rootNodeId: '1'
    },
    circular: {
      radius: 200
    },
    grid: {
      rows: 3,
      cols: 3,
      cellWidth: 150,
      cellHeight: 120
    },
    radial: {
      centerNodeId: '1',
      levelRadius: 100
    },
    spiral: {
      spacing: 10,
      angleStep: 0.3,
      startRadius: 50
    },
    donut: {
      innerRadius: 100,
      outerRadius: 250,
      groupBy: 'type'
    }
  };

  return (
    <div style={{ width: '800px', height: '700px', border: '1px solid #ddd' }}>
      <div style={{ marginBottom: '20px', padding: '10px' }}>
        <div style={{ marginBottom: '10px' }}>Select Layout Type:</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setLayoutType('force')} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: layoutType === 'force' ? '#4299e1' : '#e2e8f0',
              color: layoutType === 'force' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Force
          </button>
          <button 
            onClick={() => setLayoutType('tree')} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: layoutType === 'tree' ? '#4299e1' : '#e2e8f0',
              color: layoutType === 'tree' ? 'white' : 'black', 
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tree
          </button>
          <button 
            onClick={() => setLayoutType('circular')} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: layoutType === 'circular' ? '#4299e1' : '#e2e8f0',
              color: layoutType === 'circular' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Circular
          </button>
          <button 
            onClick={() => setLayoutType('grid')} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: layoutType === 'grid' ? '#4299e1' : '#e2e8f0',
              color: layoutType === 'grid' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Grid
          </button>
          <button 
            onClick={() => setLayoutType('radial')} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: layoutType === 'radial' ? '#4299e1' : '#e2e8f0',
              color: layoutType === 'radial' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Radial
          </button>
          <button 
            onClick={() => setLayoutType('spiral')} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: layoutType === 'spiral' ? '#4299e1' : '#e2e8f0',
              color: layoutType === 'spiral' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Spiral
          </button>
          <button 
            onClick={() => setLayoutType('donut')} 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: layoutType === 'donut' ? '#4299e1' : '#e2e8f0',
              color: layoutType === 'donut' ? 'white' : 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Donut
          </button>
        </div>
      </div>
      
      <div style={{ width: '100%', height: '600px', border: '1px solid #ddd' }}>
        <Graph 
          data={graphData}
          autoLayout={layoutType}
          layoutOptions={layoutOptions[layoutType]}
          interactionOptions={{
            draggingEnabled: true,
            zoomEnabled: true,
            panningEnabled: true,
            fitViewOnInit: true
          }}
        />
      </div>
    </div>
  );
};

export default DynamicLayoutExample;
```

## Custom Layout Algorithm

For advanced use cases, you can implement your own layout algorithm:

```tsx
import React, { useState, useEffect } from 'react';
import { Graph, Node, Edge, Position } from 'diagrammatic-ui';

const CustomLayoutExample = () => {
  const [positions, setPositions] = useState<Record<string, Position>>({});
  
  const graphData = {
    nodes: [
      { id: '1', name: 'Node 1' },
      { id: '2', name: 'Node 2' },
      { id: '3', name: 'Node 3' },
      { id: '4', name: 'Node 4' },
      { id: '5', name: 'Node 5' },
      { id: '6', name: 'Node 6' },
      { id: '7', name: 'Node 7' },
      { id: '8', name: 'Node 8' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '4', target: '5' },
      { id: 'e5', source: '5', target: '6' },
      { id: 'e6', source: '6', target: '7' },
      { id: 'e7', source: '7', target: '8' },
      { id: 'e8', source: '8', target: '1' },
    ]
  };

  // Custom layout function that arranges nodes in a sine wave pattern
  const calculateSineWaveLayout = (
    nodes: Node[], 
    edges: Edge[], 
    width: number, 
    height: number
  ) => {
    const result: Record<string, Position> = {};
    const centerY = height / 2;
    const amplitude = height / 4;
    const horizontalSpacing = width / (nodes.length + 1);
    
    nodes.forEach((node, index) => {
      const x = horizontalSpacing * (index + 1);
      // Calculate Y position as a sine wave
      const y = centerY + Math.sin(index * 0.5) * amplitude;
      
      result[node.id] = { x, y };
    });
    
    return result;
  };
  
  useEffect(() => {
    // Calculate positions when data changes
    if (graphData.nodes.length > 0) {
      const newPositions = calculateSineWaveLayout(
        graphData.nodes, 
        graphData.edges, 
        800, 
        600
      );
      setPositions(newPositions);
    }
  }, [graphData]);

  return (
    <div style={{ width: '800px', height: '600px', border: '1px solid #ddd' }}>
      <Graph 
        data={graphData}
        // Disable built-in auto layout
        autoLayout={null}
        // Use our calculated positions
        initialPositions={positions}
        interactionOptions={{
          draggingEnabled: true,
          zoomEnabled: true,
          panningEnabled: true
        }}
      />
    </div>
  );
};

export default CustomLayoutExample;
```

## Next Steps

- Explore [styled nodes](./styled-nodes.md)
- Learn about [node selection](./node-selection.md)
- See how to implement [drag and drop](./drag-and-drop.md)

## Demo

<!-- TODO: Add screenshots or animated GIFs here showing different layout types --> 