import { useState } from 'react';
import { Graph, GraphData } from '../src';

// Simple test data
const testData: GraphData = {
  nodes: [
    { 
      id: 'node1', 
      name: 'Document Node', 
      type: 'interface',
      description: 'This node should be draggable',
      sections: [
        {
          id: 'test',
          name: 'Test Section',
          items: [
            { id: 'item1', value: 'Test item 1' },
            { id: 'item2', value: 'Test item 2' },
            { id: 'item3', value: 'Test item 3' }
          ]
        }
      ]
    },
    { 
      id: 'node2', 
      name: 'Normal Node', 
      type: 'component',
      description: 'Regular node for comparison'
    }
  ],
  edges: [
    { id: 'edge1', source: 'node1', target: 'node2' }
  ]
};

export function TestDocumentNodeDraggable() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <div style={{ 
      padding: '2rem',
      backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      color: theme === 'dark' ? '#f8fafc' : '#1e293b'
    }}>
      <h2>Document Node Draggable Test</h2>
      
      <div style={{ margin: '1rem 0' }}>
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Toggle Theme ({theme})
        </button>
      </div>
      
      <div style={{ 
        marginTop: '2rem', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        overflow: 'hidden',
        width: '100%', 
        height: '600px'
      }}>
        <Graph 
          data={testData}
          theme={theme}
          nodeStyleConfig={{ 
            type: 'document',
            typeStyles: {
              interface: { 
                header: theme === 'dark' ? '#3b4252' : '#e0e7ff',
                border: '#6366f1'
              },
              component: { 
                header: theme === 'dark' ? '#1e40af' : '#dbeafe',
                border: '#3b82f6' 
              }
            }
          }}
          interactionOptions={{ 
            draggingEnabled: true,
            zoomEnabled: true,
            panningEnabled: true,
            fitViewOnInit: true
          }}
        />
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <p>Both nodes should be draggable. The document node should display with correct colors.</p>
      </div>
    </div>
  );
}

export default TestDocumentNodeDraggable; 