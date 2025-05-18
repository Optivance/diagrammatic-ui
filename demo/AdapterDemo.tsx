import React, { useState } from 'react';
import { 
  Graph, 
  DataFormatType,
  AdapterFactory,
  D3ForceData,
  CytoscapeData,
  AdjacencyMatrixData,
  DependencyTreeData,
  JSONGraphFormat,
  LayoutType
} from '../src';

// Sample data for each format
const sampleData = {
  'd3': {
    nodes: [
      { id: '1', name: 'Node 1' },
      { id: '2', name: 'Node 2' },
      { id: '3', name: 'Node 3' },
      { id: '4', name: 'Node 4' },
      { id: '5', name: 'Node 5' }
    ],
    links: [
      { source: '1', target: '2', weight: 1 },
      { source: '1', target: '3', weight: 2 },
      { source: '2', target: '4', weight: 1 },
      { source: '3', target: '4', weight: 3 },
      { source: '4', target: '5', weight: 1 }
    ]
  } as D3ForceData,
  
  'cytoscape': {
    elements: {
      nodes: [
        { data: { id: '1', label: 'Node 1' } },
        { data: { id: '2', label: 'Node 2' } },
        { data: { id: '3', label: 'Node 3' } },
        { data: { id: '4', label: 'Node 4' } },
        { data: { id: '5', label: 'Node 5' } }
      ],
      edges: [
        { data: { id: 'e1', source: '1', target: '2' } },
        { data: { id: 'e2', source: '1', target: '3' } },
        { data: { id: 'e3', source: '2', target: '4' } },
        { data: { id: 'e4', source: '3', target: '4' } },
        { data: { id: 'e5', source: '4', target: '5' } }
      ]
    }
  } as CytoscapeData,
  
  'adjacency-matrix': {
    nodes: ['1', '2', '3', '4', '5'],
    matrix: [
      [0, 1, 1, 0, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 1, 0],
      [0, 0, 0, 0, 1],
      [0, 0, 0, 0, 0]
    ],
    nodeAttributes: {
      '1': { label: 'Node 1' },
      '2': { label: 'Node 2' },
      '3': { label: 'Node 3' },
      '4': { label: 'Node 4' },
      '5': { label: 'Node 5' }
    }
  } as AdjacencyMatrixData,
  
  'dependency-tree': {
    root: {
      id: '1',
      name: 'Node 1',
      children: [
        {
          id: '2',
          name: 'Node 2',
          children: [
            {
              id: '4',
              name: 'Node 4',
              children: [
                {
                  id: '5',
                  name: 'Node 5'
                }
              ]
            }
          ]
        },
        {
          id: '3',
          name: 'Node 3',
          children: [
            {
              id: '4',
              name: 'Node 4'
            }
          ]
        }
      ]
    }
  } as DependencyTreeData,
  
  'json-graph': {
    graph: {
      directed: true,
      nodes: [
        { id: '1', label: 'Node 1' },
        { id: '2', label: 'Node 2' },
        { id: '3', label: 'Node 3' },
        { id: '4', label: 'Node 4' },
        { id: '5', label: 'Node 5' }
      ],
      edges: [
        { id: 'e1', source: '1', target: '2' },
        { id: 'e2', source: '1', target: '3' },
        { id: 'e3', source: '2', target: '4' },
        { id: 'e4', source: '3', target: '4' },
        { id: 'e5', source: '4', target: '5' }
      ]
    }
  } as JSONGraphFormat
};

export const AdapterDemo: React.FC = () => {
  const [sourceFormat, setSourceFormat] = useState<DataFormatType>('d3');
  const [targetFormat, setTargetFormat] = useState<DataFormatType>('json-graph');
  const [layoutType, setLayoutType] = useState<LayoutType>('force');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Convert data from source format to internal format
  const internalData = AdapterFactory.toGraph(sampleData[sourceFormat], sourceFormat);
  
  // Convert data from internal format to target format
  const convertedData = AdapterFactory.fromGraph(internalData, targetFormat);
  
  return (
    <div className="adapter-demo">
      <div className="controls">
        <h1>Data Adapter Demo</h1>
        
        <div className="control-section">
          <h2>Data Format Conversion</h2>
          
          <div className="control-group">
            <label>Source Format:</label>
            <select
              value={sourceFormat}
              onChange={(e) => setSourceFormat(e.target.value as DataFormatType)}
            >
              <option value="d3">D3 Force</option>
              <option value="cytoscape">Cytoscape</option>
              <option value="adjacency-matrix">Adjacency Matrix</option>
              <option value="dependency-tree">Dependency Tree</option>
              <option value="json-graph">JSON Graph Format</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>Target Format:</label>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value as DataFormatType)}
            >
              <option value="d3">D3 Force</option>
              <option value="cytoscape">Cytoscape</option>
              <option value="adjacency-matrix">Adjacency Matrix</option>
              <option value="dependency-tree">Dependency Tree</option>
              <option value="json-graph">JSON Graph Format</option>
            </select>
          </div>
        </div>
        
        <div className="control-section">
          <h2>Visualization Options</h2>
          
          <div className="control-group">
            <label>Layout:</label>
            <select
              value={layoutType}
              onChange={(e) => setLayoutType(e.target.value as LayoutType)}
            >
              <option value="force">Force-Directed</option>
              <option value="circular">Circular</option>
              <option value="tree">Tree</option>
              <option value="grid">Grid</option>
              <option value="radial">Radial</option>
            </select>
          </div>
          
          <div className="control-group">
            <label>Theme:</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="visualization">
        <div className="graph-container" style={{ height: '400px', width: '100%' }}>
          <Graph
            data={internalData}
            autoLayout={layoutType}
            theme={theme}
          />
        </div>
      </div>
      
      <div className="data-display">
        <div className="data-section">
          <h3>Source Data ({sourceFormat})</h3>
          <pre>{JSON.stringify(sampleData[sourceFormat], null, 2)}</pre>
        </div>
        
        <div className="data-section">
          <h3>Internal Format</h3>
          <pre>{JSON.stringify(internalData, null, 2)}</pre>
        </div>
        
        <div className="data-section">
          <h3>Converted Data ({targetFormat})</h3>
          <pre>{JSON.stringify(convertedData, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}; 