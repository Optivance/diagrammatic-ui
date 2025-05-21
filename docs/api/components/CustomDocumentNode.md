# CustomDocumentNode Component

The `CustomDocumentNode` component provides the ultimate flexibility for creating document-like nodes with completely customized content rendering. It extends the functionality of DocumentGraphNode with enhanced customization capabilities.

## Import

```tsx
import { CustomDocumentNode } from 'diagrammatic-ui';
```

## Props

This component extends the [DocumentGraphNode](./DocumentGraphNode.md) props with additional customization options:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `node` | `Node` | Yes | - | The node data to visualize |
| `headerRenderer` | `(node: Node) => React.ReactNode` | No | - | Custom renderer for the node header |
| `sectionRenderer` | `(section: NodeSection, isExpanded: boolean) => React.ReactNode` | No | - | Custom renderer for sections |
| `footerRenderer` | `(node: Node) => React.ReactNode` | No | - | Custom renderer for the node footer |
| `headerClassName` | `string` | No | - | Custom CSS class for the header |
| `bodyClassName` | `string` | No | - | Custom CSS class for the body |
| `sectionClassName` | `string` | No | - | Custom CSS class for sections |
| `footerClassName` | `string` | No | - | Custom CSS class for the footer |
| `headerStyle` | `React.CSSProperties` | No | `{}` | Inline styles for the header |
| `bodyStyle` | `React.CSSProperties` | No | `{}` | Inline styles for the body |
| `sectionStyle` | `React.CSSProperties` | No | `{}` | Inline styles for sections |
| `footerStyle` | `React.CSSProperties` | No | `{}` | Inline styles for the footer |

## Features

### Fully Customizable Layout

You can completely control how every part of the node is rendered, from the header to individual sections and the footer.

### Custom Styling

Apply custom CSS classes and inline styles to different parts of the node for complete visual control.

### Component Injection

Inject your own React components into any part of the node structure to create specialized visualizations.

### Extended Node Types

While maintaining compatibility with standard node data structures, you can extend nodes with additional properties and custom rendering logic.

## Basic Usage

```tsx
import React from 'react';
import { CustomDocumentNode } from 'diagrammatic-ui';

const MyCustomNode = () => {
  const nodeData = {
    id: 'custom1',
    name: 'Custom Document Node',
    type: 'document',
    description: 'A fully customized document node',
    sections: [
      {
        id: 'section1',
        name: 'Custom Section',
        items: [
          { id: 'item1', value: 'Custom Item 1' },
          { id: 'item2', value: 'Custom Item 2' }
        ]
      }
    ]
  };
  
  // Custom header renderer
  const headerRenderer = (node) => (
    <div className="custom-header">
      <h3>{node.name}</h3>
      <span className="node-type">{node.type}</span>
      {node.description && <p className="description">{node.description}</p>}
    </div>
  );
  
  return (
    <CustomDocumentNode
      node={nodeData}
      position={{ x: 100, y: 100 }}
      onPositionChange={(id, pos) => console.log(`Node ${id} moved to:`, pos)}
      totalNodesInView={1}
      theme="light"
      headerRenderer={headerRenderer}
    />
  );
};
```

## Advanced Customization

```tsx
const AdvancedCustomNode = () => {
  // Custom section renderer with specialized layout
  const sectionRenderer = (section, isExpanded) => {
    return (
      <div className={`custom-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <div className="section-header">
          <span className="icon">{isExpanded ? '▼' : '►'}</span>
          <h4>{section.name}</h4>
          <span className="count">{section.items.length} items</span>
        </div>
        {isExpanded && (
          <ul className="section-items">
            {section.items.map(item => (
              <li key={item.id} className="custom-item">
                <span className="item-id">{item.id}:</span>
                <span className="item-value">{item.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
  
  // Custom footer with action buttons
  const footerRenderer = (node) => (
    <div className="node-actions">
      <button onClick={() => console.log('Edit', node.id)}>Edit</button>
      <button onClick={() => console.log('Delete', node.id)}>Delete</button>
    </div>
  );
  
  return (
    <CustomDocumentNode
      node={nodeData}
      position={{ x: 100, y: 100 }}
      onPositionChange={(id, pos) => {}}
      totalNodesInView={1}
      sectionRenderer={sectionRenderer}
      footerRenderer={footerRenderer}
      headerClassName="custom-header-class"
      bodyClassName="custom-body-class"
      sectionClassName="custom-section-class"
      footerClassName="custom-footer-class"
      headerStyle={{ background: 'linear-gradient(to right, #4a6dff, #45caff)' }}
    />
  );
};
```

## Custom Node with External Data

```tsx
const NodeWithExternalData = () => {
  const [additionalData, setAdditionalData] = React.useState(null);
  
  // Fetch additional data for the node
  React.useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAdditionalData({
        metrics: { usage: 84, performance: 92 },
        status: 'active',
        lastUpdated: '2023-11-10'
      });
    }, 1000);
  }, []);
  
  // Custom body renderer that includes external data
  const bodyRenderer = (node) => {
    return (
      <div className="node-body">
        {additionalData ? (
          <div className="metrics">
            <div className="metric">
              <span>Usage:</span>
              <div className="progress-bar">
                <div style={{ width: `${additionalData.metrics.usage}%` }}></div>
              </div>
            </div>
            <div className="metric">
              <span>Performance:</span>
              <div className="progress-bar">
                <div style={{ width: `${additionalData.metrics.performance}%` }}></div>
              </div>
            </div>
            <div className="status">
              Status: <span className={additionalData.status}>{additionalData.status}</span>
            </div>
            <div className="last-updated">
              Last updated: {additionalData.lastUpdated}
            </div>
          </div>
        ) : (
          <div className="loading">Loading additional data...</div>
        )}
        
        {/* Render the regular sections */}
        {node.sections?.map(section => (
          <div key={section.id} className="section">
            <h4>{section.name}</h4>
            <ul>
              {section.items.map(item => (
                <li key={item.id}>{item.value}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <CustomDocumentNode
      node={nodeData}
      position={{ x: 100, y: 100 }}
      onPositionChange={(id, pos) => {}}
      totalNodesInView={1}
      bodyRenderer={bodyRenderer}
    />
  );
};
```

## See Also

- [Graph](./Graph.md) - Main graph component
- [GraphNode](./GraphNode.md) - Base node component
- [DocumentGraphNode](./DocumentGraphNode.md) - Standard document node component

## Examples

<!-- TODO: Add screenshots or animated GIFs here showing custom document node rendering and interactions --> 