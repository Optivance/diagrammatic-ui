# Basic Graph Example

This example demonstrates how to create a simple graph visualization with Diagrammatic UI.

## Basic Setup

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const BasicGraph = () => {
  // Define your graph data
  const graphData = {
    nodes: [
      { id: '1', label: 'Node 1' },
      { id: '2', label: 'Node 2' },
      { id: '3', label: 'Node 3' },
      { id: '4', label: 'Node 4' },
      { id: '5', label: 'Node 5' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '4', target: '5' },
      { id: 'e5', source: '5', target: '1' },
      { id: 'e6', source: '1', target: '3' },
      { id: 'e7', source: '2', target: '4' },
    ]
  };

  return (
    <div style={{ width: '800px', height: '600px', border: '1px solid #ddd' }}>
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

export default BasicGraph;
```

## With Event Handling

```tsx
import React, { useState } from 'react';
import { Graph } from 'diagrammatic-ui';

const InteractiveGraph = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  // Define your graph data
  const graphData = {
    nodes: [
      { id: '1', label: 'Node 1' },
      { id: '2', label: 'Node 2' },
      { id: '3', label: 'Node 3' },
      { id: '4', label: 'Node 4' },
      { id: '5', label: 'Node 5' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '4', target: '5' },
      { id: 'e5', source: '5', target: '1' },
    ]
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  return (
    <div>
      <div style={{ width: '800px', height: '600px', border: '1px solid #ddd' }}>
        <Graph 
          data={graphData}
          autoLayout="force"
          interactionOptions={{
            draggingEnabled: true,
            zoomEnabled: true,
            panningEnabled: true,
            selectionEnabled: true
          }}
          onNodeClick={handleNodeClick}
        />
      </div>
      
      {selectedNodeId && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
          Selected Node: {selectedNodeId}
        </div>
      )}
    </div>
  );
};

export default InteractiveGraph;
```

## With Custom Theme

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const ThemedGraph = () => {
  // Define your graph data
  const graphData = {
    nodes: [
      { id: '1', label: 'Node 1' },
      { id: '2', label: 'Node 2' },
      { id: '3', label: 'Node 3' },
      { id: '4', label: 'Node 4' },
      { id: '5', label: 'Node 5' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '4', target: '5' },
      { id: 'e5', source: '5', target: '1' },
    ]
  };

  return (
    <div style={{ width: '800px', height: '600px', border: '1px solid #333', backgroundColor: '#1f1f1f' }}>
      <Graph 
        data={graphData}
        autoLayout="force"
        theme="dark"
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

export default ThemedGraph;
```

## Next Steps

- Learn how to [customize node styles](./styled-nodes.md)
- Explore [different layouts](./custom-layouts.md)
- Add [interactive features](./node-selection.md) 