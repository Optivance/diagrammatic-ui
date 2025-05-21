import React, { useState } from 'react';
import { Graph, GraphData, InteractivityDemo, MenuCustomizationDemo } from '../src';
import { LayoutDemo } from './LayoutDemo';
import { DocumentNodeDemo } from './DocumentNodeDemo';
import { NodeStylesDemo } from './NodeStylesDemo';
import { UseCasesDemo } from './UsesCasesDemo';
import { TestDocumentNodeDraggable } from './TestDocumentNodeDraggable';

// Sample data for demonstration
const sampleData: GraphData = {
  nodes: [
    { id: 'node1', name: 'Node 1', type: 'component' },
    { id: 'node2', name: 'Node 2', type: 'service' },
    { id: 'node3', name: 'Node 3', type: 'model' },
    { id: 'node4', name: 'Node 4', type: 'component' },
    { id: 'node5', name: 'Node 5', type: 'context' },
  ],
  edges: [
    { id: 'edge1', source: 'node1', target: 'node2' },
    { id: 'edge2', source: 'node2', target: 'node3' },
    { id: 'edge3', source: 'node3', target: 'node4' },
    { id: 'edge4', source: 'node4', target: 'node5' },
    { id: 'edge5', source: 'node5', target: 'node1' },
  ]
};

const layouts = ['force', 'circular', 'tree', 'spiral', 'donut', 'grid'] as const;
type Layout = typeof layouts[number];

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [layout, setLayout] = useState<Layout>('circular');
  const [activeDemo, setActiveDemo] = useState<string>('basic');
  
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      color: theme === 'dark' ? '#f8fafc' : '#1e293b'
    }}>
      <h1>React Graph Viz Demo</h1>
      
      <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem' }}>
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ padding: '0.5rem 1rem' }}
        >
          Toggle Theme ({theme})
        </button>
        
        <select 
          value={layout} 
          onChange={(e) => setLayout(e.target.value as Layout)}
          style={{ padding: '0.5rem 1rem' }}
        >
          {layouts.map(l => (
            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)} Layout</option>
          ))}
        </select>

        <select 
          value={activeDemo} 
          onChange={(e) => setActiveDemo(e.target.value)}
          style={{ padding: '0.5rem 1rem' }}
        >
          <option value="basic">Basic Demo</option>
          <option value="document">Document Nodes Demo</option>
          <option value="nodestyles">Node Styles Config Demo</option>
          <option value="menu">Menu Demo</option>
          <option value="interactivity">Interactivity Demo</option>
          <option value="layout">Layout Demo</option>
          <option value="usesCases">Use Cases Demo</option>
          <option value="test">Document Drag Test</option>
        </select>
      </div>
      
      {activeDemo === 'basic' && (
        <>
          <div style={{ marginTop: '2rem', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', width: '100%' }}>
            <Graph 
              data={sampleData}
              height={600}
              autoLayout={layout}
              theme={theme}
              onNodeClick={(nodeId) => console.log('Node clicked:', nodeId)}
            />
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <h2>Sample Data</h2>
            <pre style={{ 
              backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
              padding: '1rem',
              borderRadius: '4px',
              overflow: 'auto'
            }}>
              {JSON.stringify(sampleData, null, 2)}
            </pre>
          </div>
        </>
      )}

      {activeDemo === 'document' && <DocumentNodeDemo />}
      {activeDemo === 'nodestyles' && <NodeStylesDemo />}
      {activeDemo === 'menu' && <MenuCustomizationDemo />}
      {activeDemo === 'interactivity' && <InteractivityDemo />}
      {activeDemo === 'layout' && <LayoutDemo />}
      {activeDemo === 'usesCases' && <UseCasesDemo />}
      {activeDemo === 'test' && <TestDocumentNodeDraggable />}
    </div>
  );
}

export default App; 