# DocumentGraphNode Component

The `DocumentGraphNode` component is a specialized node renderer for displaying nodes with document-like structured content. It provides a rich, sectioned display suitable for complex data representation.

## Import

```tsx
import { DocumentGraphNode } from 'diagrammatic-ui';
```

## Props

This component extends the standard [GraphNode](./GraphNode.md) props with additional document-specific options:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `node` | `Node` | Yes | - | The node data to visualize |
| `expandedSections` | `Set<string>` | No | `new Set()` | Set of section IDs that are expanded |
| `onSectionToggle` | `(sectionId: string) => void` | No | - | Callback when a section is expanded/collapsed |
| `maxSectionItems` | `number` | No | `5` | Maximum number of items to show per section |
| `showAllItems` | `boolean` | No | `false` | Whether to show all items in all sections |
| `sectionColorMap` | `Record<string, string>` | No | `{}` | Custom colors for sections |
| `highlightedItems` | `Set<string>` | No | `new Set()` | Set of item IDs that should be highlighted |
| `contentRenderer` | `(item: NodeSectionItem) => React.ReactNode` | No | - | Custom renderer for section items |

## Node Structure

The DocumentGraphNode expects nodes with a specific structure:

```typescript
interface DocumentNode extends Node {
  sections?: NodeSection[];
}

interface NodeSection {
  id: string;
  name: string;
  items: NodeSectionItem[];
}

interface NodeSectionItem {
  id: string;
  value: string;
  type?: string;
  data?: Record<string, any>;
}
```

## Features

### Expandable Sections

Document nodes can have multiple collapsible sections, allowing users to focus on relevant information while reducing visual clutter.

### Custom Section Styling

Each section can have its own color scheme, making it easier to distinguish different categories of information.

### Item Highlighting

Individual items within sections can be highlighted to draw attention to specific pieces of information.

### Scrollable Content

When a document node contains more information than can be displayed at once, the component automatically adds scrolling.

## Basic Usage

```tsx
import React, { useState } from 'react';
import { DocumentGraphNode } from 'diagrammatic-ui';

const MyDocumentNode = () => {
  const [expandedSections, setExpandedSections] = useState(new Set(['section1']));
  
  const handleSectionToggle = (sectionId: string) => {
    const newExpandedSections = new Set(expandedSections);
    if (newExpandedSections.has(sectionId)) {
      newExpandedSections.delete(sectionId);
    } else {
      newExpandedSections.add(sectionId);
    }
    setExpandedSections(newExpandedSections);
  };
  
  const nodeData = {
    id: 'doc1',
    name: 'Document Node',
    type: 'document',
    description: 'Contains structured information',
    sections: [
      {
        id: 'section1',
        name: 'Properties',
        items: [
          { id: 'prop1', value: 'Property 1' },
          { id: 'prop2', value: 'Property 2' },
          { id: 'prop3', value: 'Property 3' }
        ]
      },
      {
        id: 'section2',
        name: 'Methods',
        items: [
          { id: 'method1', value: 'Method 1()' },
          { id: 'method2', value: 'Method 2()' }
        ]
      }
    ]
  };
  
  return (
    <DocumentGraphNode
      node={nodeData}
      position={{ x: 100, y: 100 }}
      onPositionChange={(id, pos) => console.log(`Node ${id} moved to:`, pos)}
      totalNodesInView={1}
      theme="light"
      expandedSections={expandedSections}
      onSectionToggle={handleSectionToggle}
    />
  );
};
```

## Customizing Section Colors

```tsx
const ColoredSectionsNode = () => {
  // Custom colors for different sections
  const sectionColorMap = {
    'section1': '#e6f7ff', // Light blue
    'section2': '#f6ffed'  // Light green
  };
  
  return (
    <DocumentGraphNode
      node={nodeData}
      position={{ x: 100, y: 100 }}
      onPositionChange={(id, pos) => {}}
      totalNodesInView={1}
      sectionColorMap={sectionColorMap}
    />
  );
};
```

## Highlighting Items

```tsx
const NodeWithHighlightedItems = () => {
  // Set of item IDs to highlight
  const highlightedItems = new Set(['prop1', 'method2']);
  
  return (
    <DocumentGraphNode
      node={nodeData}
      position={{ x: 100, y: 100 }}
      onPositionChange={(id, pos) => {}}
      totalNodesInView={1}
      highlightedItems={highlightedItems}
    />
  );
};
```

## Custom Item Rendering

```tsx
const NodeWithCustomRendering = () => {
  // Custom renderer for specific item types
  const contentRenderer = (item: NodeSectionItem) => {
    if (item.type === 'code') {
      return (
        <div className="code-item">
          <code>{item.value}</code>
        </div>
      );
    }
    return item.value;
  };
  
  return (
    <DocumentGraphNode
      node={nodeData}
      position={{ x: 100, y: 100 }}
      onPositionChange={(id, pos) => {}}
      totalNodesInView={1}
      contentRenderer={contentRenderer}
    />
  );
};
```

## See Also

- [Graph](./Graph.md) - Main graph component
- [GraphNode](./GraphNode.md) - Base node component
- [CustomDocumentNode](./CustomDocumentNode.md) - For even more customized document display

## Examples

<!-- TODO: Add screenshots or animated GIFs here showing document node rendering and interactions --> 