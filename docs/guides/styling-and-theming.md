# Styling and Theming

Diagrammatic UI provides extensive styling and theming options to customize the appearance of your graphs.

## Built-in Themes

The library comes with two built-in themes:

| Theme | Description |
|-------|-------------|
| `light` | Light background with dark text and elements |
| `dark` | Dark background with light text and elements |

To apply a theme, use the `theme` prop:

```tsx
<Graph
  data={graphData}
  theme="dark"
/>
```

## Node Styling

### Node Style Types

Diagrammatic UI supports several built-in node style types:

| Style Type | Description |
|------------|-------------|
| `default` | Standard node representation with icon and label |
| `document` | Document-like node with title and content sections |
| `card` | Card-style node with header and body |
| `compact` | Minimal node representation for dense graphs |
| `custom` | Custom renderer for complete control |

### Node Style Configuration

Use the `nodeStyleConfig` prop to customize node appearance:

```tsx
<Graph
  data={graphData}
  nodeStyleConfig={{
    type: 'card',
    typeStyles: {
      // Custom styles for specific node types
      'person': {
        backgroundColor: '#e6f7ff',
        borderColor: '#1890ff',
        borderWidth: 2
      },
      'document': {
        backgroundColor: '#f6ffed',
        borderColor: '#52c41a',
        borderWidth: 2
      }
    },
    // Custom icons for node types
    typeIcons: {
      'person': <UserIcon />,
      'document': <FileIcon />
    }
  }}
/>
```

### Style Properties

The following style properties can be customized:

| Property | Type | Description |
|----------|------|-------------|
| `backgroundColor` | `string` | Background color of the node |
| `borderColor` | `string` | Border color of the node |
| `textColor` | `string` | Text color for node content |
| `borderWidth` | `number` | Width of the node border |
| `borderRadius` | `number` | Corner radius of the node |
| `fontSize` | `number` | Font size for node text |
| `padding` | `number` | Internal padding of the node |
| `shadow` | `string` | CSS shadow effect |
| `hoverEffect` | `string` | Effect when hovering over the node |
| `selectedEffect` | `string` | Effect when the node is selected |

## Edge Styling

Edges can be styled based on their type:

```tsx
<Graph
  data={graphData}
  edgeStyleConfig={{
    typeStyles: {
      'dependency': {
        color: '#1890ff',
        width: 2,
        dashArray: '5,5'
      },
      'relation': {
        color: '#52c41a',
        width: 1,
        endMarker: 'arrow'
      }
    }
  }}
/>
```

### Edge Style Properties

| Property | Type | Description |
|----------|------|-------------|
| `color` | `string` | Color of the edge |
| `width` | `number` | Width/thickness of the edge |
| `opacity` | `number` | Transparency level (0-1) |
| `dashArray` | `string` | SVG dash pattern (e.g., '5,5') |
| `startMarker` | `string` | Marker at the start of the edge |
| `endMarker` | `string` | Marker at the end of the edge |
| `hoverEffect` | `string` | Effect when hovering over the edge |
| `selectedEffect` | `string` | Effect when the edge is selected |

## Custom Node Renderer

For complete control over node appearance, you can provide a custom renderer:

```tsx
const CustomNodeRenderer = (props: GraphNodeProps) => {
  const { node, position, isHighlighted, onNodeClick } = props;
  
  return (
    <g 
      transform={`translate(${position.x}, ${position.y})`}
      onClick={() => onNodeClick?.(node)}
    >
      <rect 
        x={-50} 
        y={-25} 
        width={100} 
        height={50} 
        rx={10}
        fill={isHighlighted ? '#1890ff' : '#e6f7ff'}
        stroke="#1890ff"
        strokeWidth={2}
      />
      <text 
        textAnchor="middle" 
        dominantBaseline="middle"
        fill="#000"
      >
        {node.label}
      </text>
    </g>
  );
};

// Use the custom renderer
<Graph
  data={graphData}
  nodeStyleConfig={{
    type: 'custom',
    renderer: CustomNodeRenderer
  }}
/>
```

## Theme Customization

For advanced theming, you can provide a complete theme object:

```tsx
import { Theme } from 'diagrammatic-ui';

const customTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#1890ff',
    secondary: '#722ed1',
    success: '#52c41a',
    warning: '#faad14',
    error: '#f5222d',
    info: '#13c2c2',
    background: '#ffffff',
    surface: '#f0f2f5',
    text: '#000000',
    border: '#d9d9d9'
  },
  nodeStyles: {
    default: {
      backgroundColor: '#ffffff',
      borderColor: '#1890ff',
      textColor: '#000000',
      borderWidth: 1,
      borderRadius: 4,
      fontSize: 12,
      padding: 8,
      shadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      hoverEffect: 'filter: brightness(0.95);',
      selectedEffect: 'stroke-width: 2; stroke: #1890ff;'
    }
  },
  edgeStyles: {
    default: {
      color: '#bfbfbf',
      width: 1,
      opacity: 0.8,
      dashArray: '',
      startMarker: '',
      endMarker: 'arrow',
      hoverEffect: 'stroke-width: 2;',
      selectedEffect: 'stroke: #1890ff; stroke-width: 2;'
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    headingFontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    baseFontSize: 14,
    fontWeightNormal: 400,
    fontWeightBold: 600
  }
};

<Graph
  data={graphData}
  theme={customTheme}
/>
```

## Next Steps

- Explore [Data Adapters](./data-adapters.md)
- Learn about [Interaction Options](./interactions.md)
- See [Examples](../examples/index.md) for styling demonstrations 