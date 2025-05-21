import React, { useState, useEffect, useRef } from 'react';
import { 
  Graph, 
  GraphData,
  InteractionOptions
} from '../src';

// Sample graph data
const sampleData: GraphData = {
  nodes: [
    { id: '1', label: 'Node 1', data: { x: 100, y: 100 } },
    { id: '2', label: 'Node 2', data: { x: 200, y: 100 } },
    { id: '3', label: 'Node 3', data: { x: 150, y: 200 } },
    { id: '4', label: 'Node 4', data: { x: 100, y: 300 } },
    { id: '5', label: 'Node 5', data: { x: 200, y: 300 } },
  ],
  edges: [
    { id: 'e1', source: '1', target: '2' },
    { id: 'e2', source: '1', target: '3' },
    { id: 'e3', source: '2', target: '3' },
    { id: 'e4', source: '3', target: '4' },
    { id: 'e5', source: '3', target: '5' },
    { id: 'e6', source: '4', target: '5' },
  ]
};

export const InteractivityDemo: React.FC = () => {
  const [graphData, setGraphData] = useState<GraphData>(sampleData);
  const [interactionOptions, setInteractionOptions] = useState<InteractionOptions>({
    selectionEnabled: true,
    multiSelectionEnabled: true,
    draggingEnabled: true,
    zoomEnabled: true,
    panningEnabled: true,
    edgeCreationEnabled: false,
    minZoom: 0.5,
    maxZoom: 2.0,
    fitViewOnInit: true
  });
  
  // Event logs
  const [eventLogs, setEventLogs] = useState<string[]>([]);
  const eventLogsEndRef = useRef<HTMLDivElement>(null);
  
  // Add a new log entry
  const addLogEntry = (message: string) => {
    setEventLogs(prevLogs => {
      const newLogs = [...prevLogs, `${new Date().toISOString().slice(11, 23)} - ${message}`];
      // Keep only the last 20 logs
      if (newLogs.length > 20) {
        return newLogs.slice(newLogs.length - 20);
      }
      return newLogs;
    });
  };
  
  // Scroll to bottom of logs when they update
  useEffect(() => {
    if (eventLogsEndRef.current) {
      eventLogsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [eventLogs]);
  
  // Event handlers
  const handleNodeClick = (nodeId: string) => {
    addLogEntry(`Node clicked: ${nodeId}`);
  };
  
  const handleNodeMouseEnter = (nodeId: string) => {
    addLogEntry(`Node hover start: ${nodeId}`);
  };
  
  const handleNodeMouseLeave = (nodeId: string) => {
    addLogEntry(`Node hover end: ${nodeId}`);
  };
  
  const handleEdgeClick = (sourceId: string, targetId: string) => {
    addLogEntry(`Edge clicked: ${sourceId} → ${targetId}`);
  };
  
  const handleDragStart = (nodeIds: string[]) => {
    addLogEntry(`Started dragging ${nodeIds.length} node(s)`);
  };
  
  const handleDragEnd = (nodeIds: string[]) => {
    addLogEntry(`Finished dragging ${nodeIds.length} node(s)`);
  };
  
  const handleSelectionChange = (selectedNodes: string[], selectedEdges: string[]) => {
    addLogEntry(`Selection changed: ${selectedNodes.length} nodes, ${selectedEdges.length} edges`);
  };
  
  const handleViewportChange = (transform: { x: number; y: number; scale: number }) => {
    addLogEntry(`Viewport changed: scale=${transform.scale.toFixed(2)}`);
  };
  
  // Toggle interaction features
  const toggleFeature = (feature: keyof InteractionOptions) => {
    setInteractionOptions((prev: InteractionOptions) => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };
  
  // Generate a new random node
  const addRandomNode = () => {
    const newNodeId = `${graphData.nodes.length + 1}`;
    const newNode = {
      id: newNodeId,
      label: `Node ${newNodeId}`,
      data: {
        x: Math.random() * 300 + 50,
        y: Math.random() * 300 + 50
      }
    };
    
    // Connect to 1-3 random existing nodes
    const newEdges = [];
    const numConnections = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numConnections; i++) {
      const targetIndex = Math.floor(Math.random() * graphData.nodes.length);
      const targetId = graphData.nodes[targetIndex].id;
      
      // 50% chance to be incoming or outgoing edge
      const source = Math.random() > 0.5 ? newNodeId : targetId;
      const target = source === newNodeId ? targetId : newNodeId;
      
      newEdges.push({
        id: `e${graphData.edges.length + i + 1}`,
        source,
        target
      });
    }
    
    setGraphData({
      nodes: [...graphData.nodes, newNode],
      edges: [...graphData.edges, ...newEdges]
    });
    
    addLogEntry(`Added new node ${newNodeId} with ${newEdges.length} connections`);
  };
  
  // Reset graph to original sample data
  const resetGraph = () => {
    setGraphData(sampleData);
    addLogEntry('Reset graph to original state');
  };
  
  return (
    <div className="interactivity-demo">
      <h1>Interactivity Features Demo</h1>
      
      <div className="demo-container">
        <div className="control-panel">
          <h2>Interaction Controls</h2>
          
          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={interactionOptions.selectionEnabled}
                onChange={() => toggleFeature('selectionEnabled')}
              />
              Selection Enabled
            </label>
          </div>
          
          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={interactionOptions.multiSelectionEnabled}
                onChange={() => toggleFeature('multiSelectionEnabled')}
              />
              Multi-selection (Ctrl/Cmd+Click)
            </label>
          </div>
          
          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={interactionOptions.draggingEnabled}
                onChange={() => toggleFeature('draggingEnabled')}
              />
              Node Dragging
            </label>
          </div>
          
          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={interactionOptions.zoomEnabled}
                onChange={() => toggleFeature('zoomEnabled')}
              />
              Zoom Enabled
            </label>
          </div>
          
          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={interactionOptions.panningEnabled}
                onChange={() => toggleFeature('panningEnabled')}
              />
              Panning Enabled
            </label>
          </div>
          
          <h2>Graph Actions</h2>
          
          <div className="control-group">
            <button onClick={addRandomNode}>Add Random Node</button>
          </div>
          
          <div className="control-group">
            <button onClick={resetGraph}>Reset Graph</button>
          </div>
          
          <h2>Event Log</h2>
          <div className="event-log">
            {eventLogs.map((log, index) => (
              <div key={index} className="log-entry">{log}</div>
            ))}
            <div ref={eventLogsEndRef} />
          </div>
        </div>
        
        <div className="graph-container">
          <Graph
            data={graphData}
            height={600}
            autoLayout="force"
            interactionOptions={interactionOptions}
            onNodeClick={handleNodeClick}
            onNodeMouseEnter={handleNodeMouseEnter}
            onNodeMouseLeave={handleNodeMouseLeave}
            onEdgeClick={handleEdgeClick}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onSelectionChange={handleSelectionChange}
            onViewportChange={handleViewportChange}
          />
        </div>
      </div>
      
      <div className="instructions">
        <h2>How to Interact</h2>
        <ul>
          <li><strong>Select nodes/edges:</strong> Click on them</li>
          <li><strong>Multi-select:</strong> Hold Ctrl/Cmd while clicking</li>
          <li><strong>Drag nodes:</strong> Click and drag selected nodes</li>
          <li><strong>Pan view:</strong> Click and drag the background</li>
          <li><strong>Zoom:</strong> Mouse wheel or pinch gesture</li>
          <li><strong>Deselect all:</strong> Click on the background</li>
        </ul>
      </div>
      
      <style>{`
        .interactivity-demo {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          padding: 20px;
        }
        
        .demo-container {
          display: flex;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 20px;
        }
        
        .control-panel {
          width: 300px;
          padding: 15px;
          background: #f5f5f5;
          border-right: 1px solid #ddd;
        }
        
        .graph-container {
          flex-grow: 1;
          height: 600px;
          position: relative;
          background: white;
        }
        
        .control-group {
          margin-bottom: 10px;
        }
        
        .control-group label {
          display: flex;
          align-items: center;
        }
        
        .control-group input[type="checkbox"] {
          margin-right: 8px;
        }
        
        button {
          padding: 8px 12px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          margin-right: 10px;
        }
        
        button:hover {
          background: #0051a2;
        }
        
        .event-log {
          height: 200px;
          overflow-y: auto;
          background: #fff;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px;
          font-family: monospace;
          font-size: 12px;
        }
        
        .log-entry {
          margin-bottom: 4px;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 4px;
        }
        
        .instructions {
          background: #f9f9f9;
          padding: 15px 20px;
          border-radius: 4px;
          border: 1px solid #eaeaea;
        }
        
        .instructions ul {
          padding-left: 20px;
        }
      `}</style>
    </div>
  );
}; 