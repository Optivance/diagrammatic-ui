import React, { useState } from 'react';
import { 
  Graph, 
  LayoutType, 
  CircularLayoutOptions,
  ForceLayoutOptions,
  GridLayoutOptions,
  RadialLayoutOptions,
  TreeLayoutOptions
} from '../src';

// Sample data for the demo
const sampleData = {
  nodes: [
    {
      id: 'node1',
      label: 'Node 1',
      type: 'default',
      sections: [
        {
          id: 'sec1',
          name: 'Profile',
          items: [
            {
              id: 'item1',
              value: 'Email',
              metadata: {
                actions: [
                  { label: 'Edit', type: 'edit' },
                  { label: 'Copy', type: 'copy' }
                ]
              }
            },
            {
              id: 'item2',
              value: 'Username',
              metadata: {
                actions: [
                  { label: 'Edit', type: 'edit' }
                ]
              }
            }
          ]
        },
        {
          id: 'sec2',
          name: 'Settings',
          items: [
            {
              id: 'item3',
              value: 'Notifications',
              metadata: {
                actions: [
                  { label: 'Toggle', type: 'toggle' }
                ]
              }
            }
          ]
        }
      ]
    },
    {
      id: 'node2',
      label: 'Node 2',
      type: 'primary',
      sections: [
        {
          id: 'sec3',
          name: 'Tasks',
          items: [
            {
              id: 'item4',
              value: 'Task 1',
              metadata: {
                actions: [
                  { label: 'Complete', type: 'complete' },
                  { label: 'Delete', type: 'delete' }
                ]
              }
            },
            {
              id: 'item5',
              value: 'Task 2',
              metadata: {
                actions: [
                  { label: 'Complete', type: 'complete' }
                ]
              }
            }
          ]
        }
      ]
    },
    { id: 'node3', label: 'Node 3', type: 'default' },
    { id: 'node4', label: 'Node 4', type: 'special' },
    { id: 'node5', label: 'Node 5', type: 'default' },
    { id: 'node6', label: 'Node 6', type: 'primary' },
    { id: 'node7', label: 'Node 7', type: 'special' },
    { id: 'node8', label: 'Node 8', type: 'default' },
    { id: 'node9', label: 'Node 9', type: 'primary' },
    { id: 'node10', label: 'Node 10', type: 'default' },
  ],
  edges: [
    { id: 'edge1', source: 'node1', target: 'node2', type: 'default' },
    { id: 'edge2', source: 'node1', target: 'node3', type: 'default' },
    { id: 'edge3', source: 'node2', target: 'node4', type: 'default' },
    { id: 'edge4', source: 'node2', target: 'node5', type: 'strong' },
    { id: 'edge5', source: 'node3', target: 'node6', type: 'default' },
    { id: 'edge6', source: 'node4', target: 'node7', type: 'dashed' },
    { id: 'edge7', source: 'node5', target: 'node8', type: 'strong' },
    { id: 'edge8', source: 'node6', target: 'node9', type: 'default' },
    { id: 'edge9', source: 'node7', target: 'node10', type: 'dashed' },
    { id: 'edge10', source: 'node8', target: 'node10', type: 'strong' },
    { id: 'edge11', source: 'node9', target: 'node10', type: 'default' },
  ],
  metadata: {
    title: 'Layout Demo Graph'
  }
};

// Layout-specific options
const layoutOptions = {
  circular: {
    startAngle: Math.PI / 4,
    sortNodes: true,
  } as CircularLayoutOptions,
  
  force: {
    iterations: 100,
    attractionForce: 0.2,
    repulsionForce: 1500,
    linkDistance: 120,
    centerGravity: 0.15,
  } as ForceLayoutOptions,
  
  grid: {
    columns: 4,
    spacing: 180,
    margin: 60,
  } as GridLayoutOptions,
  
  radial: {
    centerNodeId: 'node1',
    initialRadius: 150,
    radiusIncrement: 120,
    sortNodesAtLevel: true,
  } as RadialLayoutOptions,
  
  tree: {
    direction: 'top-down',
    rootId: 'node1',
    horizontalSpacing: 180,
    verticalSpacing: 120,
  } as TreeLayoutOptions,
  
  spiral: {
    centerNodeId: 'node1',
    initialRadius: 100,
    radiusIncrement: 40,
    sortNodesAtLevel: true,
  } as RadialLayoutOptions,
  
  donut: {
    startAngle: Math.PI / 3,
    sortNodes: true,
    isDonut: true,
    innerRadius: 120,
    radius: 200,
  } as CircularLayoutOptions,
};

export const LayoutDemo: React.FC = () => {
  const [layoutType, setLayoutType] = useState<LayoutType>('force');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <div className="layout-demo" style={{ padding: '20px' }}>
      <div className="controls" style={{ marginBottom: '20px' }}>
        <h1>Graph Layout Demo</h1>
        
        <div className="control-group" style={{ margin: '10px 0' }}>
          <label>Layout Type:</label>
          <select
            value={layoutType}
            onChange={(e) => setLayoutType(e.target.value as LayoutType)}
            style={{ marginLeft: '10px' }}
          >
            <option value="circular">Circular</option>
            <option value="force">Force-Directed</option>
            <option value="grid">Grid</option>
            <option value="radial">Radial</option>
            <option value="tree">Tree</option>
            <option value="spiral">Spiral</option>
            <option value="donut">Donut</option>
          </select>
        </div>
        
        <div className="control-group" style={{ margin: '10px 0' }}>
          <label>Theme:</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            style={{ marginLeft: '10px' }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        
        <div className="layout-description">
          {layoutType === 'circular' && (
            <p>Circular layout places nodes in a circle with equal spacing.</p>
          )}
          {layoutType === 'force' && (
            <p>Force-directed layout uses physical simulation to position nodes based on their connections.</p>
          )}
          {layoutType === 'grid' && (
            <p>Grid layout arranges nodes in a regular grid pattern.</p>
          )}
          {layoutType === 'radial' && (
            <p>Radial layout places nodes in concentric circles around a central node.</p>
          )}
          {layoutType === 'tree' && (
            <p>Tree layout arranges nodes in a hierarchical tree structure.</p>
          )}
          {layoutType === 'spiral' && (
            <p>Spiral layout organizes nodes in a spiral pattern emanating from the center.</p>
          )}
          {layoutType === 'donut' && (
            <p>Donut layout places nodes in concentric circles, creating a donut-like pattern.</p>
          )}
        </div>
      </div>
      
      <div 
        className="graph-container" 
        style={{ 
          height: '700px', 
          width: '100%',
          border: '1px solid #ccc',
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Graph
          data={sampleData}
          autoLayout={layoutType}
          layoutOptions={layoutOptions[layoutType]}
          theme={theme}
          height={700}
          interactionOptions={{
            draggingEnabled: true,
            zoomEnabled: true,
            panningEnabled: true,
            selectionEnabled: true,
            multiSelectionEnabled: true
          }}
          nodeSizeScale={1}
        />
      </div>
    </div>
  );
}; 