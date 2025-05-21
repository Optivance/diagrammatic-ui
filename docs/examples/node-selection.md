# Node Selection Example

This example demonstrates how to implement node selection functionality in Diagrammatic UI.

## Basic Node Selection

```tsx
import React, { useState } from 'react';
import { Graph } from 'diagrammatic-ui';

const BasicSelectionExample = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const graphData = {
    nodes: [
      { id: '1', name: 'Node 1' },
      { id: '2', name: 'Node 2' },
      { id: '3', name: 'Node 3' },
      { id: '4', name: 'Node 4' },
      { id: '5', name: 'Node 5' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '4', target: '5' },
      { id: 'e5', source: '5', target: '1' },
    ]
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  return (
    <div>
      <div style={{ width: '800px', height: '500px', border: '1px solid #ddd' }}>
        <Graph 
          data={graphData}
          autoLayout="force"
          onNodeClick={handleNodeClick}
          interactionOptions={{
            draggingEnabled: true,
            zoomEnabled: true,
            panningEnabled: true,
            selectionEnabled: true
          }}
        />
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
        {selectedNodeId ? (
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Selected Node: {selectedNodeId}</div>
            <div>
              {graphData.nodes.find(node => node.id === selectedNodeId)?.name}
            </div>
          </div>
        ) : (
          <div>No node selected. Click a node to select it.</div>
        )}
      </div>
    </div>
  );
};

export default BasicSelectionExample;
```

## Multi-Selection

```tsx
import React, { useState } from 'react';
import { Graph } from 'diagrammatic-ui';

const MultiSelectionExample = () => {
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  
  const graphData = {
    nodes: [
      { id: '1', name: 'Node 1', type: 'component' },
      { id: '2', name: 'Node 2', type: 'component' },
      { id: '3', name: 'Node 3', type: 'service' },
      { id: '4', name: 'Node 4', type: 'service' },
      { id: '5', name: 'Node 5', type: 'model' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '4', target: '5' },
      { id: 'e5', source: '5', target: '1' },
    ]
  };

  const handleSelectionChange = (selectedNodes: string[], selectedEdges: string[]) => {
    setSelectedNodeIds(new Set(selectedNodes));
  };

  const clearSelection = () => {
    setSelectedNodeIds(new Set());
  };

  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={clearSelection} 
          style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '4px' }}
        >
          Clear Selection
        </button>
        <span style={{ marginLeft: '15px', fontStyle: 'italic' }}>
          Hold Shift to select multiple nodes
        </span>
      </div>
      
      <div style={{ width: '800px', height: '500px', border: '1px solid #ddd' }}>
        <Graph 
          data={graphData}
          autoLayout="force"
          onSelectionChange={handleSelectionChange}
          nodeStyleConfig={{
            type: 'card',
            typeStyles: {
              component: { header: '#e0e7ff', border: '#6366f1' },
              service: { header: '#dbeafe', border: '#3b82f6' },
              model: { header: '#f0fdf4', border: '#22c55e' }
            }
          }}
          interactionOptions={{
            draggingEnabled: true,
            zoomEnabled: true,
            panningEnabled: true,
            selectionEnabled: true,
            multiSelectionEnabled: true
          }}
        />
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Selected Nodes ({selectedNodeIds.size}):
        </div>
        {selectedNodeIds.size > 0 ? (
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            {Array.from(selectedNodeIds).map(nodeId => {
              const node = graphData.nodes.find(n => n.id === nodeId);
              return (
                <li key={nodeId}>
                  {node?.name} ({node?.type})
                </li>
              );
            })}
          </ul>
        ) : (
          <div>No nodes selected. Click nodes to select them.</div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectionExample;
```

## Selection with Visual Feedback

```tsx
import React, { useState } from 'react';
import { Graph } from 'diagrammatic-ui';

const SelectionWithFeedbackExample = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [highlightedPath, setHighlightedPath] = useState<{
    nodes: Set<string>;
    edges: Set<string>;
  }>({ nodes: new Set(), edges: new Set() });
  
  const graphData = {
    nodes: [
      { id: '1', name: 'Start' },
      { id: '2', name: 'Process A' },
      { id: '3', name: 'Process B' },
      { id: '4', name: 'Decision' },
      { id: '5', name: 'Process C' },
      { id: '6', name: 'Process D' },
      { id: '7', name: 'End' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '4', target: '5', label: 'Yes' },
      { id: 'e5', source: '4', target: '6', label: 'No' },
      { id: 'e6', source: '5', target: '7' },
      { id: 'e7', source: '6', target: '7' },
    ]
  };

  // Find all connected nodes and edges to the selected node
  const findConnectedPaths = (nodeId: string) => {
    const connectedNodes = new Set<string>([nodeId]);
    const connectedEdges = new Set<string>();
    
    // Find all edges connected to this node
    graphData.edges.forEach(edge => {
      if (edge.source === nodeId || edge.target === nodeId) {
        connectedEdges.add(edge.id);
        
        // Add the node on the other end
        const connectedNodeId = edge.source === nodeId ? edge.target : edge.source;
        connectedNodes.add(connectedNodeId);
      }
    });
    
    return { nodes: connectedNodes, edges: connectedEdges };
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setHighlightedPath(findConnectedPaths(nodeId));
  };

  const clearSelection = () => {
    setSelectedNodeId(null);
    setHighlightedPath({ nodes: new Set(), edges: new Set() });
  };

  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={clearSelection} 
          style={{ padding: '8px 16px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '4px' }}
        >
          Clear Selection
        </button>
      </div>
      
      <div style={{ width: '800px', height: '500px', border: '1px solid #ddd' }}>
        <Graph 
          data={graphData}
          autoLayout="force"
          onNodeClick={handleNodeClick}
          highlightedPath={highlightedPath}
          interactionOptions={{
            draggingEnabled: true,
            zoomEnabled: true,
            panningEnabled: true,
            selectionEnabled: true
          }}
        />
      </div>
      
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '6px' }}>
        {selectedNodeId ? (
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
              Selected Node: {graphData.nodes.find(node => node.id === selectedNodeId)?.name}
            </div>
            <div>
              <strong>Connected to:</strong>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {Array.from(highlightedPath.nodes)
                  .filter(id => id !== selectedNodeId)
                  .map(nodeId => (
                    <li key={nodeId}>
                      {graphData.nodes.find(node => node.id === nodeId)?.name}
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        ) : (
          <div>No node selected. Click a node to see its connections.</div>
        )}
      </div>
    </div>
  );
};

export default SelectionWithFeedbackExample;
```

## Selection with Node Details Panel

```tsx
import React, { useState } from 'react';
import { Graph } from 'diagrammatic-ui';

const NodeDetailsPanelExample = () => {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const graphData = {
    nodes: [
      { 
        id: '1', 
        name: 'User Service', 
        type: 'service',
        description: 'Handles user authentication and profile management',
        metadata: {
          owner: 'Auth Team',
          version: '2.1.0',
          deployedAt: '2023-06-15',
          status: 'stable'
        } 
      },
      { 
        id: '2', 
        name: 'Product Catalog', 
        type: 'service',
        description: 'Manages product data and categories',
        metadata: {
          owner: 'Product Team',
          version: '1.8.5',
          deployedAt: '2023-07-22',
          status: 'stable'
        }
      },
      { 
        id: '3', 
        name: 'Order Processing', 
        type: 'service',
        description: 'Handles order creation and fulfillment',
        metadata: {
          owner: 'Order Team',
          version: '3.2.1',
          deployedAt: '2023-08-05',
          status: 'beta'
        }
      },
      { 
        id: '4', 
        name: 'Payment Gateway', 
        type: 'external',
        description: 'Processes payments securely',
        metadata: {
          vendor: 'Stripe',
          version: 'API v2',
          lastUptime: '99.99%',
          status: 'external'
        }
      },
      { 
        id: '5', 
        name: 'Notification Service', 
        type: 'service',
        description: 'Sends emails, SMS and push notifications',
        metadata: {
          owner: 'Platform Team',
          version: '1.4.2',
          deployedAt: '2023-07-10',
          status: 'stable'
        }
      },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '3', target: '5' },
      { id: 'e5', source: '1', target: '5' },
    ]
  };

  const handleNodeClick = (nodeId: string) => {
    const node = graphData.nodes.find(n => n.id === nodeId);
    setSelectedNode(node || null);
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = () => {
      switch (status.toLowerCase()) {
        case 'stable': return { bg: '#dcfce7', text: '#166534' };
        case 'beta': return { bg: '#fef3c7', text: '#92400e' };
        case 'experimental': return { bg: '#fee2e2', text: '#b91c1c' };
        case 'external': return { bg: '#e0e7ff', text: '#3730a3' };
        default: return { bg: '#f1f5f9', text: '#475569' };
      }
    };
    
    const colors = getStatusColor();
    
    return (
      <span style={{
        backgroundColor: colors.bg,
        color: colors.text,
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        textTransform: 'uppercase'
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ display: 'flex', gap: '20px', height: '600px' }}>
      <div style={{ width: '70%', border: '1px solid #ddd' }}>
        <Graph 
          data={graphData}
          autoLayout="force"
          onNodeClick={handleNodeClick}
          nodeStyleConfig={{
            type: 'card',
            typeStyles: {
              service: { header: '#dbeafe', border: '#3b82f6' },
              external: { header: '#e0e7ff', border: '#6366f1' }
            }
          }}
          interactionOptions={{
            draggingEnabled: true,
            zoomEnabled: true,
            panningEnabled: true,
            selectionEnabled: true
          }}
        />
      </div>
      
      <div style={{ 
        width: '30%', 
        border: '1px solid #ddd', 
        borderRadius: '6px',
        overflow: 'hidden'
      }}>
        <div style={{ backgroundColor: '#f8fafc', padding: '15px', borderBottom: '1px solid #ddd' }}>
          <h3 style={{ margin: '0', fontSize: '16px' }}>Node Details</h3>
        </div>
        
        <div style={{ padding: '15px' }}>
          {selectedNode ? (
            <div>
              <div style={{ marginBottom: '15px' }}>
                <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>{selectedNode.name}</h2>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ 
                    backgroundColor: '#f1f5f9', 
                    padding: '2px 8px', 
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}>
                    {selectedNode.type}
                  </span>
                  {selectedNode.metadata?.status && (
                    <StatusBadge status={selectedNode.metadata.status} />
                  )}
                </div>
              </div>
              
              {selectedNode.description && (
                <div style={{ marginBottom: '15px' }}>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#64748b' }}>Description</h4>
                  <p style={{ margin: '0', fontSize: '14px' }}>{selectedNode.description}</p>
                </div>
              )}
              
              {selectedNode.metadata && (
                <div>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>Metadata</h4>
                  <div style={{ 
                    backgroundColor: '#f8fafc', 
                    borderRadius: '4px', 
                    padding: '10px',
                    fontSize: '14px'
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        {Object.entries(selectedNode.metadata).map(([key, value]) => (
                          <tr key={key} style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <td style={{ padding: '8px 0', color: '#64748b', width: '40%' }}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </td>
                            <td style={{ padding: '8px 0' }}>{String(value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div style={{ marginTop: '20px' }}>
                <button 
                  onClick={() => console.log('View details for', selectedNode.id)}
                  style={{ 
                    padding: '8px 16px', 
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  View Full Details
                </button>
              </div>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '300px',
              color: '#94a3b8'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>No node selected</div>
              <div style={{ fontSize: '14px', textAlign: 'center' }}>
                Click on a node in the graph to view its details
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeDetailsPanelExample;
```

## Programmatic Selection

```tsx
import React, { useState, useEffect } from 'react';
import { Graph } from 'diagrammatic-ui';

const ProgrammaticSelectionExample = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  
  const graphData = {
    nodes: [
      { id: '1', name: 'Node 1', type: 'component' },
      { id: '2', name: 'Node 2', type: 'component' },
      { id: '3', name: 'Node 3', type: 'service' },
      { id: '4', name: 'Node 4', type: 'service' },
      { id: '5', name: 'Node 5', type: 'model' },
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '2', target: '3' },
      { id: 'e3', source: '3', target: '4' },
      { id: 'e4', source: '4', target: '5' },
      { id: 'e5', source: '5', target: '1' },
    ]
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  // Demo of selecting nodes programmatically
  useEffect(() => {
    // Start with no selection
    setSelectedNodeId(null);
    
    // Demo sequence: select nodes in order with timing
    const sequence = [
      { id: '1', delay: 1000 },
      { id: '2', delay: 2000 },
      { id: '3', delay: 3000 },
      { id: '4', delay: 4000 },
      { id: '5', delay: 5000 },
      { id: null, delay: 6000 } // Clear selection at the end
    ];
    
    // Execute the sequence
    sequence.forEach(item => {
      setTimeout(() => {
        setSelectedNodeId(item.id);
      }, item.delay);
    });
    
    // Clean up timeouts on unmount
    return () => {
      // This doesn't actually clear the specific timeouts but 
      // prevents state updates after unmount
    };
  }, []);

  // Create a controlled selection state for the graph
  const controlledSelection = {
    nodes: selectedNodeId ? [selectedNodeId] : [],
    edges: []
  };

  return (
    <div>
      <div style={{ marginBottom: '15px' }}>
        <div>Programmatic selection demo - nodes will be highlighted automatically</div>
        <div style={{ marginTop: '10px' }}>
          Currently selected: {selectedNodeId || 'None'}
        </div>
      </div>
      
      <div style={{ width: '800px', height: '500px', border: '1px solid #ddd' }}>
        <Graph 
          data={graphData}
          autoLayout="force"
          onNodeClick={handleNodeClick}
          // Use controlled selection
          selection={controlledSelection}
          nodeStyleConfig={{
            type: 'card',
            typeStyles: {
              component: { header: '#e0e7ff', border: '#6366f1' },
              service: { header: '#dbeafe', border: '#3b82f6' },
              model: { header: '#f0fdf4', border: '#22c55e' }
            }
          }}
          interactionOptions={{
            draggingEnabled: true,
            zoomEnabled: true,
            panningEnabled: true,
            selectionEnabled: true
          }}
        />
      </div>
    </div>
  );
};

export default ProgrammaticSelectionExample;
```

## Next Steps

- Learn about [drag and drop](./drag-and-drop.md) functionality
- Explore [custom layouts](./custom-layouts.md)
- See how to implement [zoom and pan](./zoom-and-pan.md)

## Demo

<!-- TODO: Add a screenshot or GIF demonstrating node selection --> 