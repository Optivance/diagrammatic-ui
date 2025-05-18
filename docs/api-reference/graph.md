# Graph Component

The `Graph` component is the main component for rendering interactive graph visualizations.

```tsx
import { Graph } from 'diagrammatic-ui';
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `GraphData` | *Required* | Graph data containing nodes and edges |
| `interactionOptions` | `InteractionOptions` | `{}` | Configuration for interactive features |
| `theme` | `'light' \| 'dark'` | `'light'` | Visual theme for styling |
| `autoLayout` | `'force' \| 'circular' \| 'tree' \| 'spiral' \| 'donut'` | `'force'` | Layout algorithm to use |
| `width` | `number` | `800` | Width of the graph container in pixels |
| `height` | `number` | `600` | Height of the graph container in pixels |
| `nodeMenuConfig` | `NodeMenuConfig` | `{}` | Node menu configuration |
| `onNodeClick` | `(nodeId: string) => void` | - | Called when a node is clicked |
| `onNodeMouseEnter` | `(nodeId: string) => void` | - | Called when mouse enters a node |
| `onNodeMouseLeave` | `(nodeId: string) => void` | - | Called when mouse leaves a node |
| `onEdgeClick` | `(sourceId: string, targetId: string) => void` | - | Called when an edge is clicked |
| `onSelectionChange` | `(selectedNodes: string[], selectedEdges: string[]) => void` | - | Called when selection changes |
| `onDragStart` | `(nodeIds: string[]) => void` | - | Called when node dragging starts |
| `onDragEnd` | `(nodeIds: string[]) => void` | - | Called when node dragging ends |
| `onViewportChange` | `(transform: { x: number; y: number; scale: number }) => void` | - | Called when viewport changes |

## Basic Usage

```tsx
import { Graph } from 'diagrammatic-ui';

function MyGraph() {
  const data = {
    nodes: [
      { id: '1', label: 'Node 1' },
      { id: '2', label: 'Node 2' },
      { id: '3', label: 'Node 3' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '1' },
    ]
  };

  return (
    <Graph 
      data={data}
      autoLayout="circular"
      theme="light"
      height={600}
      width={800}
    />
  );
}
```

## With Interactions

```tsx
import { Graph } from 'diagrammatic-ui';

function InteractiveGraph() {
  const handleNodeClick = (nodeId) => {
    console.log(`Node clicked: ${nodeId}`);
  };

  const handleSelectionChange = (selectedNodes, selectedEdges) => {
    console.log(`Selected ${selectedNodes.length} nodes and ${selectedEdges.length} edges`);
  };

  return (
    <Graph 
      data={graphData}
      interactionOptions={{
        selectionEnabled: true,
        multiSelectionEnabled: true,
        draggingEnabled: true,
        zoomEnabled: true,
        panningEnabled: true,
      }}
      onNodeClick={handleNodeClick}
      onSelectionChange={handleSelectionChange}
    />
  );
}
```

## With Custom Menus

```tsx
import { Graph } from 'diagrammatic-ui';
import { Star, Copy, Trash2 } from 'lucide-react';

function GraphWithCustomMenu() {
  const customMenuItems = [
    {
      id: 'star',
      label: 'Star Node',
      icon: <Star size={16} />,
      onClick: (node) => console.log(`Starred node: ${node.id}`),
    },
    {
      id: 'copy',
      label: 'Copy ID',
      icon: <Copy size={16} />,
      onClick: (node) => navigator.clipboard.writeText(node.id),
      divider: true,
    },
    {
      id: 'delete',
      label: 'Delete Node',
      icon: <Trash2 size={16} color="red" />,
      onClick: (node) => console.log(`Delete node: ${node.id}`),
    },
  ];

  return (
    <Graph 
      data={graphData}
      nodeMenuConfig={{
        items: customMenuItems,
        showDropdownMenu: true,
        enableContextMenu: true,
      }}
    />
  );
}
```

## Notes

- The graph will automatically fit nodes to the available viewport if `fitViewOnInit` is enabled in `interactionOptions`.
- For large graphs (100+ nodes), consider enabling only the necessary interaction features to maintain performance.
- Custom styling can be applied by providing a custom theme. 