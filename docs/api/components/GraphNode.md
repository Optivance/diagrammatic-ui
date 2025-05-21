# GraphNode Component

The `GraphNode` component renders individual nodes in the graph visualization. It provides comprehensive styling and interaction capabilities for each node.

## Import

```tsx
import { GraphNode } from 'diagrammatic-ui';
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `node` | `Node` | Yes | - | The node data to visualize |
| `position` | `{ x: number; y: number }` | Yes | - | Position coordinates for the node |
| `onPositionChange` | `(id: string, position: { x: number; y: number }) => void` | Yes | - | Callback when the node position changes |
| `isHighlighted` | `boolean` | No | `false` | Whether this node is currently selected |
| `isPathHighlighted` | `boolean` | No | `false` | Whether this node is part of a highlighted path |
| `onNodeClick` | `(node: Node) => void` | No | - | Callback when the node is clicked |
| `onShowDependencies` | `(node: Node) => void` | No | - | Callback to show dependencies of this node |
| `onShowDependents` | `(node: Node) => void` | No | - | Callback to show dependents of this node |
| `sizeScale` | `number` | No | `1` | Scale factor for node size |
| `theme` | `'light' \| 'dark'` | No | `'light'` | Theme to use (light or dark) |
| `totalNodesInView` | `number` | Yes | - | Total number of nodes currently in view |
| `isInteractive` | `boolean` | No | `true` | Whether the node is interactive (can be clicked/dragged) |
| `zoomScale` | `number` | No | `1` | Current zoom scale of the graph |
| `minNodeSize` | `number` | No | `80` | Minimum node size |
| `maxNodeSize` | `number` | No | `160` | Maximum node size |
| `onSizeChange` | `(size: { width: number; height: number }) => void` | No | - | Callback when node size changes |
| `menuItems` | `NodeMenuItem[]` | No | `[]` | Custom menu items for the node |
| `showDropdownMenu` | `boolean` | No | `true` | Whether to show the dropdown menu button |
| `enableContextMenu` | `boolean` | No | `true` | Whether to enable the context menu |
| `styleConfig` | `NodeStyleConfig` | No | - | Style configuration for the node |

## Types

### Node

```typescript
interface Node {
  id: string;
  name?: string;
  title?: string;
  type?: string;
  description?: string;
  sections?: NodeSection[];
  data?: Record<string, any>;
}
```

### NodeSection

```typescript
interface NodeSection {
  id: string;
  name: string;
  items: NodeSectionItem[];
}
```

### NodeSectionItem

```typescript
interface NodeSectionItem {
  id: string;
  value: string;
}
```

### NodeMenuItem

```typescript
interface NodeMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: (node: Node) => void;
}
```

## Basic Usage

```tsx
import React from 'react';
import { GraphNode } from 'diagrammatic-ui';

const MyNode = () => {
  const nodeData = {
    id: 'node1',
    name: 'Example Node',
    type: 'component',
    description: 'This is an example node'
  };
  
  return (
    <GraphNode
      node={nodeData}
      position={{ x: 100, y: 100 }}
      onPositionChange={(id, pos) => console.log(`Node ${id} moved to:`, pos)}
      totalNodesInView={1}
      theme="light"
      onNodeClick={(node) => console.log('Node clicked:', node.id)}
    />
  );
};
```

## Auto-sizing Behavior

GraphNode automatically calculates its size based on content, node type, and other factors. For example, nodes with longer names or descriptions will be sized larger to accommodate the content.

```tsx
const NodeWithContent = () => {
  const nodeData = {
    id: 'node1',
    name: 'Node with Sections',
    type: 'service',
    description: 'This node has sections that will increase its size',
    sections: [
      {
        id: 'section1',
        name: 'Properties',
        items: [
          { id: 'prop1', value: 'Property 1' },
          { id: 'prop2', value: 'Property 2' }
        ]
      }
    ]
  };
  
  return (
    <GraphNode
      node={nodeData}
      position={{ x: 100, y: 100 }}
      onPositionChange={(id, pos) => {}}
      totalNodesInView={1}
      sizeScale={1.2} // Increase size by 20%
    />
  );
};
```

## Customizing Node Appearance

The appearance of nodes can be customized using the `styleConfig` prop:

```tsx
const CustomStyledNode = () => {
  return (
    <GraphNode
      node={nodeData}
      position={{ x: 100, y: 100 }}
      onPositionChange={(id, pos) => {}}
      totalNodesInView={1}
      styleConfig={{
        type: 'card', // Use card style
        typeStyles: {
          'component': {
            backgroundColor: '#e6f7ff',
            borderColor: '#1890ff',
            fontSize: '14px'
          }
        }
      }}
    />
  );
};
```

## Adding Custom Menu Items

You can add custom menu items to node context menus:

```tsx
import { Edit, Trash } from 'lucide-react';

const NodeWithCustomMenu = () => {
  const customMenuItems = [
    {
      id: 'edit',
      label: 'Edit Node',
      icon: <Edit size={16} />,
      onClick: (node) => console.log('Edit node:', node.id)
    },
    {
      id: 'delete',
      label: 'Delete Node',
      icon: <Trash size={16} />,
      onClick: (node) => console.log('Delete node:', node.id)
    }
  ];
  
  return (
    <GraphNode
      node={nodeData}
      position={{ x: 100, y: 100 }}
      onPositionChange={(id, pos) => {}}
      totalNodesInView={1}
      menuItems={customMenuItems}
      showDropdownMenu={true}
      enableContextMenu={true}
    />
  );
};
```

## See Also

- [Graph](./Graph.md) - Main graph component
- [DocumentGraphNode](./DocumentGraphNode.md) - Specialized node for document-like data
- [GraphEdges](./GraphEdges.md) - Edge rendering component

## Examples

<!-- TODO: Add screenshots or animated GIFs here showing different node styles and interactions --> 