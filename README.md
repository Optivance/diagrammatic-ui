# Diagrammatic UI

A powerful and intuitive graph visualization library for React applications. Create beautiful, interactive diagrams with minimal effort.

## 🚀 Quick Start

```bash
npm install diagrammatic-ui
# or
yarn add diagrammatic-ui
```

## 🎯 Basic Usage

Here's a simple example to get you started:

```tsx
import { Graph } from 'diagrammatic-ui';

function MyDiagram() {
  // Define your graph data
  const graphData = {
    nodes: [
    { id: 'node1', name: 'Node 1', type: 'component' },
    { id: 'node2', name: 'Node 2', type: 'service' },
    { id: 'node3', name: 'Node 3', type: 'model' },
    { id: 'node4', name: 'Node 4', type: 'component' },
    { id: 'node5', name: 'Node 5', type: 'context' },
  ],
  edges: [
    { id: 'edge1', source: 'node1', target: 'node2' },
    { id: 'edge2', source: 'node2', target: 'node3' },
    { id: 'edge3', source: 'node3', target: 'node4' },
    { id: 'edge4', source: 'node4', target: 'node5' },
    { id: 'edge5', source: 'node5', target: 'node1' },
  ]
  };

  return (
    <Graph 
      data={graphData}
      height={500}
      theme="light"
      onNodeClick={(nodeId) => console.log('Clicked:', nodeId)}
    />
  );
}
```

<!-- Output: Add screenshot of basic diagram here -->
<img width="723" alt="Basic-image" src="https://github.com/user-attachments/assets/30f57c0e-be61-4d22-83ae-092e5c9437da" />


## 📊 Use Cases

Diagrammatic UI is versatile and can be used for various visualization needs:

### Organization Charts
```tsx
const orgChartData = {
 nodes: [
    { 
      id: 'ceo', 
      name: 'Jane Smith', 
      type: 'primary',
      description: 'Chief Executive Officer',
      sections: [
        {
          id: 'responsibilities',
          name: 'Responsibilities',
          items: [
            { id: 'resp1', value: 'Company Strategy' },
            { id: 'resp2', value: 'Investor Relations' },
            { id: 'resp3', value: 'Executive Leadership' }
          ]
        },
        {
          id: 'contact',
          name: 'Contact',
          items: [
            { id: 'cont1', value: 'jane@example.com' },
            { id: 'cont2', value: '+1 (555) 123-4567' }
          ]
        }
      ]
    },
    { 
      id: 'cto', 
      name: 'Bob Johnson', 
      type: 'secondary',
      description: 'Chief Technology Officer' 
    },
    { 
      id: 'cfo', 
      name: 'Alice Williams', 
      type: 'secondary',
      description: 'Chief Financial Officer' 
    },
    { 
      id: 'vpe', 
      name: 'Tom Davis', 
      type: 'tertiary',
      description: 'VP of Engineering' 
    },
    { 
      id: 'vps', 
      name: 'Sarah Brown', 
      type: 'tertiary',
      description: 'VP of Sales' 
    },
  ],
  edges: [
    { id: 'e1', source: 'ceo', target: 'cto' },
    { id: 'e2', source: 'ceo', target: 'cfo' },
    { id: 'e3', source: 'cto', target: 'vpe' },
    { id: 'e4', source: 'cfo', target: 'vps' },
  ],
  name: 'Company Org Chart',
  category: 'organization'
};

<Graph 
  data={orgChartData}
  theme="light"//light||dark
   
/>
```
<img width="989" alt="Screenshot 2025-05-22 at 12 40 55 PM" src="https://github.com/user-attachments/assets/3c6170b0-cfd3-4de1-a89f-2c52f9c41d68" />


### Process Flows
```tsx
const processFlowData = {
 nodes: [
    { id: 'start', name: 'Start', type: 'input' },
    { id: 'processA', name: 'Process A', type: 'process', description: 'First step in our workflow' },
    { id: 'decision', name: 'Decision Point', type: 'process' },
    { id: 'processB', name: 'Process B', type: 'process' },
    { id: 'processC', name: 'Process C', type: 'process' },
    { id: 'end', name: 'End', type: 'output' },
  ],
  edges: [
    { id: 'e1', source: 'start', target: 'processA', label: 'Begin' },
    { id: 'e2', source: 'processA', target: 'decision', label: 'Evaluate' },
    { id: 'e3', source: 'decision', target: 'processB', label: 'If True' },
    { id: 'e4', source: 'decision', target: 'processC', label: 'If False' },
    { id: 'e5', source: 'processB', target: 'end' },
    { id: 'e6', source: 'processC', target: 'end' },
  ],
  name: 'Workflow Process',
  category: 'process'
};
```
![image](https://github.com/user-attachments/assets/68b6c836-f3e2-40fc-8231-e945a952c167)

### Customer Journey Maps
```tsx
const customerJourneyData: GraphData = {
  nodes: [
    { 
      id: 'awareness', 
      name: 'Awareness', 
      type: 'data',
      description: 'Customer becomes aware of the product/service',
      sections: [
        {
          id: 'channels',
          name: 'Channels',
          items: [
            { id: 'ch1', value: 'Social Media' },
            { id: 'ch2', value: 'Search Engines' },
            { id: 'ch3', value: 'Word of Mouth' }
          ]
        },
        {
          id: 'metrics',
          name: 'Metrics',
          items: [
            { id: 'm1', value: 'New Visitors' },
            { id: 'm2', value: 'Ad Impressions' },
            { id: 'm3', value: 'Brand Recognition' }
          ]
        }
      ]
    },
    { 
      id: 'consideration', 
      name: 'Consideration', 
      type: 'data',
      description: 'Customer evaluates options'
    },
    { 
      id: 'purchase', 
      name: 'Purchase', 
      type: 'data',
      description: 'Transaction occurs'
    },
    { 
      id: 'retention', 
      name: 'Retention', 
      type: 'data',
      description: 'Ongoing relationship'
    },
    { 
      id: 'advocacy', 
      name: 'Advocacy', 
      type: 'data',
      description: 'Customer promotes the brand'
    }
  ],
  edges: [
    { id: 'e1', source: 'awareness', target: 'consideration', label: 'Research' },
    { id: 'e2', source: 'consideration', target: 'purchase', label: 'Decision' },
    { id: 'e3', source: 'purchase', target: 'retention', label: 'Experience' },
    { id: 'e4', source: 'retention', target: 'advocacy', label: 'Satisfaction' },
    { id: 'e5', source: 'advocacy', target: 'awareness', type: 'dashed', label: 'Referral' }
  ],
  name: 'Customer Journey Map',
  category: 'journey'
};
```
![image](https://github.com/user-attachments/assets/6b0e38c7-2c68-46b4-8002-371a70f49923)

### Network Topology
```tsx
const networkData = {
  nodes: [
    { id: 'router', name: 'Main Router', type: 'root' },
    { id: 'switch1', name: 'Switch 1', type: 'branch' },
    { id: 'server1', name: 'Web Server', type: 'leaf' }
  ],
  edges: [
    { id: 'e1', source: 'router', target: 'switch1' },
    { id: 'e2', source: 'switch1', target: 'server1' }
  ]
  
};
```
<img width="937" alt="Network-topology" src="https://github.com/user-attachments/assets/241b4d71-2c4c-4b0e-a640-b144c7aa90bf" />

## 📄 Document-Style Nodes

Create rich, interactive document nodes with collapsible sections and detailed content:

```tsx
const documentNode = {
  id: 'doc1', 
  name: 'RowingBoat', 
  type: 'interface',
  path: 'RowingBoat.java',
  description: 'Java interface for rowing boats',
  sections: [
    {
      id: 'methods',
      name: 'Methods',
      items: [
        { id: 'method1', value: 'public abstract void row(int speed, Direction direction)' }
      ]
    },
    {
      id: 'imports',
      name: 'Imports',
      items: [
        { id: 'import1', value: 'java.lang' }
      ]
    }
  ]
};

<Graph 
  data={documentData}
  nodeStyleConfig={{ 
    type: 'document',
    typeStyles: {
      interface: { 
        header: '#e0e7ff',
        border: '#6366f1'
      },
      class: { 
        header: '#dcfce7',
        border: '#22c55e' 
      }
    }
  }}
/>
```

### Document Node Features
- 🎨 Color-coded by type (Interface, Class, Component, Model)
- 📦 Collapsible sections for better organization
- 📜 Scrollable content for long method signatures
- 🖱️ Interactive elements with hover states
- 🎯 Clean UI with hidden scrollbars
- 🔄 Non-interfering scrolling (content scrolls without affecting canvas zoom)

<!-- Output: Add screenshot of document nodes -->
![image](https://github.com/user-attachments/assets/7eb02ef9-5d08-4e38-9f95-86680bf009d1)


## 🎨 Interactive Features

### Node Selection and Interaction
```tsx
<Graph 
  data={graphData}
  interactionOptions={{
    selectionEnabled: true,
    draggingEnabled: true,
    zoomEnabled: true,
    panningEnabled: true
  }}
  onNodeClick={(nodeId) => console.log('Node clicked:', nodeId)}
  onNodeHover={(nodeId) => console.log('Node hovered:', nodeId)}
/>
```

<!-- Output: Add GIF showing node interaction -->

## 📊 Layout Options

Choose from multiple layout algorithms to best represent your data:

```tsx
// Available layouts: 'force', 'circular', 'tree', 'spiral', 'donut', 'grid'
<Graph 
  data={graphData}
  autoLayout="circular"
/>
```

<!-- Output: Add comparison image of different layouts -->

## 🎭 Theme Support

Switch between light and dark themes:

```tsx
<Graph 
  data={graphData}
  theme="dark" // or "light"
/>
```
| Light Theme | Dark Theme |
|-------------|------------|
| ![Light Theme](https://github.com/user-attachments/assets/7ad6cfb0-acd2-49b4-bd04-4412ae4cd67c) | ![Dark Theme](https://github.com/user-attachments/assets/4293af1e-bca5-4536-b34d-4a3ec2ca08fc) |




<!-- Output: Add side-by-side comparison of themes -->

## 📚 Demo Applications

Explore our comprehensive demo applications to see Diagrammatic UI in action:

- **Basic Demo**: Simple graph visualization
- **Document Nodes**: Advanced node types with document preview
- **Node Styles**: Custom styling and theming
- **Menu Customization**: Context menus and interactions
- **Interactivity**: Advanced interaction features
- **Layout Demo**: Different layout algorithms
- **Use Cases**: Real-world implementation examples

To run the demos locally:

```bash
# Clone the repository
git clone https://github.com/optivance/diagrammatic-ui.git

# Install dependencies
npm install

# Start the demo application
npm run demo
```

## 🔧 Advanced Usage

### Custom Node Types
```tsx
const customNode = {
  id: 'custom1',
  type: 'document',
  label: 'Document Node',
  content: 'This is a custom document node',
  metadata: {
    author: 'John Doe',
    date: '2024-03-20'
  }
};
```

### Event Handling
```tsx
<Graph 
  data={graphData}
  onNodeClick={(nodeId) => handleNodeClick(nodeId)}
  onEdgeClick={(edgeId) => handleEdgeClick(edgeId)}
  onSelectionChange={(selected) => handleSelection(selected)}
  onLayoutComplete={() => console.log('Layout complete!')}
/>
```

## 📖 Documentation

For detailed documentation, visit:
- [Getting Started Guide](./docs/guides/getting-started.md)
- [API Reference](./docs/api/index.md)
- [Examples](./docs/examples/index.md)

## 🤝 Contributing

We welcome contributions! Check out our [Contributing Guide](CONTRIBUTING.md) to get started.

## 📄 License

MIT License - feel free to use in your projects! 
