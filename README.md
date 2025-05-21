# Diagrammatic UI

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
npm install diagrammatic-ui
# or
yarn add diagrammatic-ui
```

## Quick Start

```tsx
import { Graph } from 'diagrammatic-ui';

const MyComponent = () => {
  const graphData = {
    nodes: [
      { id: '1', label: 'Node 1' },
      { id: '2', label: 'Node 2' },
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
      onNodeClick={(nodeId) => console.log('Node clicked:', nodeId)}
    />
  );
};
```

## Documentation

For detailed documentation, please visit:

- [Getting Started](./docs/guides/getting-started.md)
- [Core Concepts](./docs/guides/core-concepts.md)
- [API Reference](./docs/api/index.md)
- [Examples](./docs/examples/index.md)

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
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

MIT 