# Styled Nodes Example

This example demonstrates how to customize the appearance of nodes in Diagrammatic UI.

## Basic Node Styling

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const StyledNodesExample = () => {
  // Define your graph data with node types
  const graphData = {
    nodes: [
      { id: '1', name: 'Component', type: 'component' },
      { id: '2', name: 'Service', type: 'service' },
      { id: '3', name: 'Model', type: 'model' },
      { id: '4', name: 'Interface', type: 'interface' },
      { id: '5', name: 'Context', type: 'context' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '4', target: '5' },
      { id: 'e5', source: '5', target: '1' },
    ]
  };

  return (
    <div style={{ width: '800px', height: '600px', border: '1px solid #ddd' }}>
      <Graph 
        data={graphData}
        autoLayout="force"
        nodeStyleConfig={{ 
          type: 'card',
          typeStyles: {
            component: { 
              header: '#e0e7ff',
              border: '#6366f1'
            },
            service: { 
              header: '#dbeafe',
              border: '#3b82f6' 
            },
            model: { 
              header: '#f0fdf4',
              border: '#22c55e' 
            },
            interface: { 
              header: '#f8fafc',
              border: '#64748b' 
            },
            context: { 
              header: '#fef2f2',
              border: '#ef4444' 
            }
          }
        }}
      />
    </div>
  );
};

export default StyledNodesExample;
```

## With Node Icons

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';
import { Database, Layout, FileCode, Layers, Share2 } from 'lucide-react';

const StyledNodesWithIconsExample = () => {
  // Define your graph data with node types
  const graphData = {
    nodes: [
      { id: '1', name: 'Component', type: 'component' },
      { id: '2', name: 'Service', type: 'service' },
      { id: '3', name: 'Model', type: 'model' },
      { id: '4', name: 'Interface', type: 'interface' },
      { id: '5', name: 'Context', type: 'context' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '4', target: '5' },
      { id: 'e5', source: '5', target: '1' },
    ]
  };

  return (
    <div style={{ width: '800px', height: '600px', border: '1px solid #ddd' }}>
      <Graph 
        data={graphData}
        autoLayout="force"
        nodeStyleConfig={{ 
          type: 'card',
          typeStyles: {
            component: { 
              header: '#e0e7ff',
              border: '#6366f1'
            },
            service: { 
              header: '#dbeafe',
              border: '#3b82f6' 
            },
            model: { 
              header: '#f0fdf4',
              border: '#22c55e' 
            },
            interface: { 
              header: '#f8fafc',
              border: '#64748b' 
            },
            context: { 
              header: '#fef2f2',
              border: '#ef4444' 
            }
          },
          typeIcons: {
            component: <Layout size={16} />,
            service: <Share2 size={16} />,
            model: <Database size={16} />,
            interface: <FileCode size={16} />,
            context: <Layers size={16} />
          }
        }}
      />
    </div>
  );
};

export default StyledNodesWithIconsExample;
```

## Custom Document Node Styles

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const DocumentNodeExample = () => {
  // Define graph data with document-like nodes
  const graphData = {
    nodes: [
      { 
        id: 'doc1', 
        name: 'User Model', 
        type: 'model',
        description: 'Represents a user in the system',
        sections: [
          {
            id: 'props',
            name: 'Properties',
            items: [
              { id: 'id', value: 'id: string' },
              { id: 'name', value: 'name: string' },
              { id: 'email', value: 'email: string' },
              { id: 'role', value: 'role: UserRole' }
            ]
          },
          {
            id: 'methods',
            name: 'Methods',
            items: [
              { id: 'validate', value: 'validate(): boolean' },
              { id: 'hasPermission', value: 'hasPermission(perm: Permission): boolean' }
            ]
          }
        ]
      },
      { 
        id: 'doc2', 
        name: 'Authentication Service', 
        type: 'service',
        description: 'Handles user authentication',
        sections: [
          {
            id: 'methods',
            name: 'Methods',
            items: [
              { id: 'login', value: 'login(credentials: Credentials): Promise<User>' },
              { id: 'logout', value: 'logout(userId: string): Promise<void>' },
              { id: 'verify', value: 'verifyToken(token: string): Promise<boolean>' }
            ]
          }
        ]
      }
    ],
    edges: [
      { id: 'e1', source: 'doc1', target: 'doc2', label: 'uses' }
    ]
  };

  return (
    <div style={{ width: '800px', height: '600px', border: '1px solid #ddd' }}>
      <Graph 
        data={graphData}
        autoLayout="force"
        nodeStyleConfig={{ 
          type: 'document',
          typeStyles: {
            model: { 
              header: '#f0fdf4',
              border: '#22c55e' 
            },
            service: { 
              header: '#dbeafe',
              border: '#3b82f6' 
            }
          }
        }}
      />
    </div>
  );
};

export default DocumentNodeExample;
```

## Dynamic Node Styling

```tsx
import React, { useState } from 'react';
import { Graph } from 'diagrammatic-ui';

const DynamicStyledNodesExample = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Define your graph data with node types
  const graphData = {
    nodes: [
      { id: '1', name: 'Component', type: 'component' },
      { id: '2', name: 'Service', type: 'service' },
      { id: '3', name: 'Model', type: 'model' },
      { id: '4', name: 'Interface', type: 'interface' },
      { id: '5', name: 'Context', type: 'context' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '4', target: '5' },
      { id: 'e5', source: '5', target: '1' },
    ]
  };
  
  // Different style configurations based on theme
  const lightModeStyles = {
    component: { header: '#e0e7ff', border: '#6366f1' },
    service: { header: '#dbeafe', border: '#3b82f6' },
    model: { header: '#f0fdf4', border: '#22c55e' },
    interface: { header: '#f8fafc', border: '#64748b' },
    context: { header: '#fef2f2', border: '#ef4444' }
  };
  
  const darkModeStyles = {
    component: { header: '#312e81', border: '#6366f1' },
    service: { header: '#1e40af', border: '#3b82f6' },
    model: { header: '#166534', border: '#22c55e' },
    interface: { header: '#334155', border: '#64748b' },
    context: { header: '#991b1b', border: '#ef4444' }
  };

  return (
    <div style={{ 
      width: '800px', 
      height: '600px', 
      border: '1px solid #ddd',
      backgroundColor: theme === 'dark' ? '#1f1f1f' : '#ffffff',
      padding: '20px'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ padding: '8px 16px' }}
        >
          Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
      
      <Graph 
        data={graphData}
        autoLayout="force"
        theme={theme}
        nodeStyleConfig={{ 
          type: 'card',
          typeStyles: theme === 'light' ? lightModeStyles : darkModeStyles
        }}
      />
    </div>
  );
};

export default DynamicStyledNodesExample;
```

## Custom Node Renderer

For complete control over node rendering, you can provide a custom renderer:

```tsx
import React from 'react';
import { Graph, GraphNodeProps } from 'diagrammatic-ui';

// Custom node renderer component
const CustomNodeRenderer: React.FC<GraphNodeProps> = ({ 
  node, 
  isHighlighted, 
  onNodeClick 
}) => {
  const handleClick = () => {
    if (onNodeClick) {
      onNodeClick(node);
    }
  };
  
  return (
    <div 
      onClick={handleClick}
      style={{
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: isHighlighted ? '#f0f9ff' : '#ffffff',
        border: `2px solid ${isHighlighted ? '#0ea5e9' : '#e2e8f0'}`,
        minWidth: '150px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>{node.name}</div>
      
      {node.type && (
        <div style={{ 
          padding: '2px 6px', 
          backgroundColor: '#f1f5f9', 
          borderRadius: '4px',
          display: 'inline-block',
          fontSize: '12px'
        }}>
          {node.type}
        </div>
      )}
      
      {node.description && (
        <div style={{ marginTop: '8px', fontSize: '14px' }}>
          {node.description}
        </div>
      )}
    </div>
  );
};

const CustomRendererExample = () => {
  const graphData = {
    nodes: [
      { 
        id: '1', 
        name: 'User Authentication', 
        type: 'service',
        description: 'Handles user login and registration'
      },
      { 
        id: '2', 
        name: 'User Profile', 
        type: 'component',
        description: 'Displays and edits user information'
      },
      { 
        id: '3', 
        name: 'Settings', 
        type: 'component',
        description: 'User preferences and settings'
      }
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' }
    ]
  };

  return (
    <div style={{ width: '800px', height: '600px', border: '1px solid #ddd' }}>
      <Graph 
        data={graphData}
        autoLayout="force"
        nodeStyleConfig={{ 
          renderer: CustomNodeRenderer
        }}
      />
    </div>
  );
};

export default CustomRendererExample;
```

## Next Steps

- Explore [custom layouts](./custom-layouts.md)
- Learn about [node selection](./node-selection.md)
- Try [drag and drop](./drag-and-drop.md) functionality

## Demo

<!-- TODO: Add a screenshot or GIF demonstrating the styled nodes --> 