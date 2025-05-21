import React, { useState } from 'react';
import { Graph, NodeStyle } from '../src';

// Re-use the same data from the document demo
import { sampleDocumentData } from './DocumentNodeDemo';

/**
 * Demo component showing how to use different node styles through configuration
 */
export function NodeStylesDemo() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [nodeStyle, setNodeStyle] = useState<NodeStyle>('default');
  
  // Available node styles
  const nodeStyles: NodeStyle[] = ['default', 'document', 'custom'];
  
  // Custom node style configuration with colors for different node types
  const nodeStyleConfig = {
    type: nodeStyle,
    typeStyles: {
      interface: { 
        color: '#6366f1',
        backgroundColor: theme === 'dark' ? '#3b4252' : '#e0e7ff',
        textColor: theme === 'dark' ? '#e0e7ff' : '#312e81'
      },
      class: { 
        color: '#22c55e',
        backgroundColor: theme === 'dark' ? '#2d3748' : '#dcfce7',
        textColor: theme === 'dark' ? '#dcfce7' : '#064e3b'
      },
      component: { 
        color: '#3b82f6',
        backgroundColor: theme === 'dark' ? '#1e40af' : '#dbeafe',
        textColor: theme === 'dark' ? '#dbeafe' : '#1e40af'
      },
      model: { 
        color: '#8b5cf6',
        backgroundColor: theme === 'dark' ? '#4c1d95' : '#ede9fe',
        textColor: theme === 'dark' ? '#ede9fe' : '#4c1d95'
      }
    }
  };
  
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      color: theme === 'dark' ? '#f8fafc' : '#1e293b'
    }}>
      <h2>Node Styles Configuration Demo</h2>
      
      <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ padding: '0.5rem 1rem' }}
        >
          Toggle Theme ({theme})
        </button>
        
        <select
          value={nodeStyle}
          onChange={(e) => setNodeStyle(e.target.value as NodeStyle)}
          style={{ padding: '0.5rem 1rem' }}
        >
          {nodeStyles.map(style => (
            <option key={style} value={style}>
              {style.charAt(0).toUpperCase() + style.slice(1)} Style
            </option>
          ))}
        </select>
      </div>
      
      <div style={{ marginTop: '2rem', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', width: '100%' }}>
        <Graph 
          data={{
            ...sampleDocumentData
          }}
          height={600}
          autoLayout="circular"
          theme={theme}
          nodeStyleConfig={nodeStyleConfig}
          onNodeClick={(nodeId) => console.log('Node clicked:', nodeId)}
        />
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Configure Node Styles Through API</h3>
        <p>
          You can configure node styles at different levels:
        </p>
        
        <div style={{ marginTop: '1rem', backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9', padding: '1rem', borderRadius: '4px' }}>
          <h4>Option 1: Graph data level</h4>
          <pre style={{ overflow: 'auto' }}>
{`// In your GraphData object:
{
  nodes: [...],
  edges: [...],
  nodeStyleConfig: {
    type: 'document',
    typeStyles: {
      interface: { color: '#6366f1', backgroundColor: '#e0e7ff' },
      class: { color: '#22c55e', backgroundColor: '#dcfce7' },
      component: { color: '#3b82f6', backgroundColor: '#dbeafe' },
      model: { color: '#8b5cf6', backgroundColor: '#ede9fe' }
    }
  }
}`}
          </pre>
        </div>
        
        <div style={{ marginTop: '1rem', backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9', padding: '1rem', borderRadius: '4px' }}>
          <h4>Option 2: Graph component prop</h4>
          <pre style={{ overflow: 'auto' }}>
{`// When rendering the Graph component:
<Graph
  data={graphData}
  nodeStyleConfig={{
    type: 'document',
    typeStyles: {
      interface: { color: '#6366f1', backgroundColor: '#e0e7ff' },
      class: { color: '#22c55e', backgroundColor: '#dcfce7' },
      component: { color: '#3b82f6', backgroundColor: '#dbeafe' },
      model: { color: '#8b5cf6', backgroundColor: '#ede9fe' }
    }
  }}
/>`}
          </pre>
        </div>
        
        <div style={{ marginTop: '1rem', backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9', padding: '1rem', borderRadius: '4px' }}>
          <h4>Option 3: Custom renderer</h4>
          <pre style={{ overflow: 'auto' }}>
{`// Provide your own custom node renderer:
<Graph
  data={graphData}
  nodeStyleConfig={{
    type: 'custom',
    renderer: MyCustomNodeComponent
  }}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
} 