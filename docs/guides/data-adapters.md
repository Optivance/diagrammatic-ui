# Data Adapters

Diagrammatic UI includes adapters for converting between different graph data formats. This guide explains how to use these adapters to integrate with various data sources.

## Available Adapters

| Adapter | Purpose | Input Format | Output Format |
|---------|---------|--------------|---------------|
| D3ForceAdapter | D3.js force layout compatibility | D3 force simulation data | Diagrammatic UI format |
| CytoscapeAdapter | Cytoscape.js compatibility | Cytoscape.js elements | Diagrammatic UI format |
| AdjacencyMatrixAdapter | Matrix representation | Adjacency matrix | Diagrammatic UI format |
| DependencyTreeAdapter | Hierarchical tree structures | Dependency tree | Diagrammatic UI format |
| JSONGraphAdapter | Standard JSON graph formats | JSON Graph Format | Diagrammatic UI format |

## Using Adapters

### Direct Import

You can import adapters directly:

```tsx
import { D3ForceAdapter, CytoscapeAdapter } from 'diagrammatic-ui';

// Create an adapter instance
const d3Adapter = new D3ForceAdapter();

// Convert from D3 format to Diagrammatic UI format
const d3Data = {
  nodes: [
    { id: "1", name: "Node 1" },
    { id: "2", name: "Node 2" }
  ],
  links: [
    { source: "1", target: "2" }
  ]
};

const graphData = d3Adapter.toGraph(d3Data);

// Use the converted data
<Graph data={graphData} />

// Convert back to D3 format
const convertedD3Data = d3Adapter.fromGraph(graphData);
```

### Using Helper Functions

For convenience, the library provides helper functions:

```tsx
import { 
  convertFromD3, 
  convertToD3,
  convertFromCytoscape,
  convertToCytoscape 
} from 'diagrammatic-ui';

// Convert from D3 format
const graphData = convertFromD3(d3Data);

// Convert to Cytoscape format
const cytoscapeData = convertToCytoscape(graphData);
```

### Using the Adapter Factory

For dynamic adapter selection:

```tsx
import { AdapterFactory, DataFormatType } from 'diagrammatic-ui';

function convertData(data: any, format: DataFormatType) {
  return AdapterFactory.toGraph(data, format);
}

// Usage
const graphData = convertData(sourceData, 'cytoscape');
```

## Adapter Details

### D3ForceAdapter

Converts between D3.js force simulation data and Diagrammatic UI format.

#### D3 Format

```typescript
interface D3ForceData {
  nodes: Array<{
    id: string;
    name?: string;
    [key: string]: any;
  }>;
  links: Array<{
    source: string;
    target: string;
    [key: string]: any;
  }>;
}
```

#### Example

```tsx
import { D3ForceAdapter } from 'diagrammatic-ui';

const d3Data = {
  nodes: [
    { id: "1", name: "Node 1", group: 1 },
    { id: "2", name: "Node 2", group: 2 }
  ],
  links: [
    { source: "1", target: "2", value: 1 }
  ]
};

const adapter = new D3ForceAdapter();
const graphData = adapter.toGraph(d3Data);
```

### CytoscapeAdapter

Converts between Cytoscape.js elements and Diagrammatic UI format.

#### Cytoscape Format

```typescript
interface CytoscapeData {
  elements: {
    nodes: Array<{
      data: {
        id: string;
        label?: string;
        [key: string]: any;
      };
      position?: { x: number; y: number };
      [key: string]: any;
    }>;
    edges: Array<{
      data: {
        id: string;
        source: string;
        target: string;
        [key: string]: any;
      };
      [key: string]: any;
    }>;
  };
}
```

#### Example

```tsx
import { CytoscapeAdapter } from 'diagrammatic-ui';

const cytoscapeData = {
  elements: {
    nodes: [
      { data: { id: '1', label: 'Node 1' }, position: { x: 100, y: 100 } },
      { data: { id: '2', label: 'Node 2' }, position: { x: 200, y: 200 } }
    ],
    edges: [
      { data: { id: 'e1', source: '1', target: '2', label: 'connects to' } }
    ]
  }
};

const adapter = new CytoscapeAdapter();
const graphData = adapter.toGraph(cytoscapeData);
```

### AdjacencyMatrixAdapter

Converts between adjacency matrix representation and Diagrammatic UI format.

#### Adjacency Matrix Format

```typescript
interface AdjacencyMatrixData {
  matrix: number[][];
  labels?: string[];
}
```

#### Example

```tsx
import { AdjacencyMatrixAdapter } from 'diagrammatic-ui';

const matrixData = {
  matrix: [
    [0, 1, 0],
    [0, 0, 1],
    [1, 0, 0]
  ],
  labels: ['Node 1', 'Node 2', 'Node 3']
};

const adapter = new AdjacencyMatrixAdapter();
const graphData = adapter.toGraph(matrixData);
```

### DependencyTreeAdapter

Converts between hierarchical dependency trees and Diagrammatic UI format.

#### Dependency Tree Format

```typescript
interface DependencyTreeData {
  id: string;
  name?: string;
  children?: DependencyTreeData[];
  [key: string]: any;
}
```

#### Example

```tsx
import { DependencyTreeAdapter } from 'diagrammatic-ui';

const treeData = {
  id: 'root',
  name: 'Root Module',
  children: [
    {
      id: 'child1',
      name: 'Child Module 1',
      children: [
        { id: 'grandchild1', name: 'Grandchild 1' }
      ]
    },
    { id: 'child2', name: 'Child Module 2' }
  ]
};

const adapter = new DependencyTreeAdapter();
const graphData = adapter.toGraph(treeData);
```

### JSONGraphAdapter

Converts between standardized JSON graph formats and Diagrammatic UI format.

#### JSON Graph Format

```typescript
interface JSONGraphFormat {
  graph: {
    nodes: Array<{
      id: string;
      label?: string;
      [key: string]: any;
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
      [key: string]: any;
    }>;
    [key: string]: any;
  };
}
```

#### Example

```tsx
import { JSONGraphAdapter } from 'diagrammatic-ui';

const jsonGraphData = {
  graph: {
    directed: true,
    nodes: [
      { id: '1', label: 'Node 1', type: 'person' },
      { id: '2', label: 'Node 2', type: 'document' }
    ],
    edges: [
      { id: 'e1', source: '1', target: '2', label: 'created' }
    ]
  }
};

const adapter = new JSONGraphAdapter();
const graphData = adapter.toGraph(jsonGraphData);
```

## Next Steps

- Learn about [Advanced Usage](./advanced-usage.md)
- Explore [Interaction Options](./interactions.md)
- See [Examples](../examples/index.md) for adapter demonstrations 