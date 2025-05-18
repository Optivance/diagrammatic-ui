# Configuration Options

This page documents the various configuration options available in Diagrammatic UI.

## InteractionOptions

Options for configuring interactive behavior of the graph.

```tsx
interface InteractionOptions {
  selectionEnabled?: boolean;
  multiSelectionEnabled?: boolean;
  draggingEnabled?: boolean;
  zoomEnabled?: boolean;
  panningEnabled?: boolean;
  edgeCreationEnabled?: boolean;
  minZoom?: number;
  maxZoom?: number;
  fitViewOnInit?: boolean;
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `selectionEnabled` | `boolean` | `true` | Enable node/edge selection |
| `multiSelectionEnabled` | `boolean` | `false` | Enable multi-selection with Ctrl/Cmd key |
| `draggingEnabled` | `boolean` | `true` | Enable node dragging |
| `zoomEnabled` | `boolean` | `true` | Enable zoom with mouse wheel/pinch |
| `panningEnabled` | `boolean` | `true` | Enable panning by dragging the background |
| `edgeCreationEnabled` | `boolean` | `false` | Enable edge creation through interaction |
| `minZoom` | `number` | `0.1` | Minimum zoom level |
| `maxZoom` | `number` | `5` | Maximum zoom level |
| `fitViewOnInit` | `boolean` | `true` | Fit graph to viewport on initialization |

### Example

```tsx
<Graph
  data={graphData}
  interactionOptions={{
    selectionEnabled: true,
    multiSelectionEnabled: true,
    draggingEnabled: true,
    zoomEnabled: true,
    panningEnabled: true,
    minZoom: 0.5,
    maxZoom: 2,
    fitViewOnInit: true
  }}
/>
```

## NodeMenuConfig

Configuration for node menu options.

```tsx
interface NodeMenuConfig {
  items?: NodeMenuItem[];
  showDropdownMenu?: boolean;
  enableContextMenu?: boolean;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | `NodeMenuItem[]` | `[]` | Custom menu items to display |
| `showDropdownMenu` | `boolean` | `true` | Whether to show the dropdown menu |
| `enableContextMenu` | `boolean` | `true` | Whether to enable the context menu |

### NodeMenuItem

Defines a menu item in the node menu.

```tsx
interface NodeMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  divider?: boolean;
  onClick: (node: Node) => void;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the menu item |
| `label` | `string` | Display label for the menu item |
| `icon` | `React.ReactNode` | Icon component to display |
| `disabled` | `boolean` | Whether the item is disabled |
| `divider` | `boolean` | Whether to show a divider after this item |
| `onClick` | `(node: Node) => void` | Callback when the item is clicked |

### Example

```tsx
import { Star, Copy, Trash2 } from 'lucide-react';

<Graph
  data={graphData}
  nodeMenuConfig={{
    items: [
      {
        id: 'favorite',
        label: 'Add to Favorites',
        icon: <Star size={16} />,
        onClick: (node) => console.log('Added to favorites:', node.id),
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
        icon: <Trash2 size={16} color="#ef4444" />,
        onClick: (node) => console.log('Delete node:', node.id),
        disabled: true,
      },
    ],
    showDropdownMenu: true,
    enableContextMenu: true
  }}
/>
``` 