# Diagrammatic UI

A flexible, customizable graph visualization library for React applications. Built with TypeScript and designed for high performance and extensibility.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## Features

- 🎨 Interactive graph visualization with multiple layout options (force, circular, tree, spiral, donut)
- 🎯 Highly customizable node and edge styling with theme support
- 🔄 Built-in data adapters for various graph formats
- 🖱️ Rich interaction support (selection, drag, pan, zoom)
- 📦 TypeScript support with comprehensive type definitions
- 🎭 Light and dark theme support
- 🚀 Optimized for large datasets

## Quick Start

```bash
# Install the package
npm install diagrammatic-ui
```

```tsx
// Import and use the library
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
      autoLayout="force"
      theme="light"
    />
  );
};
```

## Documentation

For detailed documentation, please refer to the following resources:

- [Getting Started](./docs/guides/getting-started.md)
- [API Reference](./docs/api-reference/README.md)
- [Examples](./docs/examples/README.md)
- [Customization](./docs/guides/customization.md)

## Browser Compatibility

Diagrammatic UI is compatible with all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

```bash
# Install dependencies
npm install

# Start the demo application
npm run demo

# Build the library
npm run build

# Run tests
npm test
```

## License

MIT © [Diagrammatic UI Team] 