# Advanced Usage

This guide covers advanced usage patterns and techniques for Diagrammatic UI.

## Custom Node Renderers

For complete control over node appearance, you can create custom node renderers:

```tsx
import React from 'react';
import { Graph, GraphNodeProps } from 'diagrammatic-ui';

// Custom node renderer component
const CustomNodeRenderer: React.FC<GraphNodeProps> = (props) => {
  const { 
    node, 
    position, 
    isHighlighted, 
    isPathHighlighted,
    onNodeClick, 
    zoomScale = 1 
  } = props;
  
  // Scale node size based on zoom level
  const baseSize = 60;
  const size = baseSize / zoomScale;
  
  // Determine color based on node state
  let fillColor = '#e6f7ff';
  if (isHighlighted) fillColor = '#1890ff';
  if (isPathHighlighted) fillColor = '#91d5ff';
  
  return (
    <g 
      transform={`translate(${position.x}, ${position.y})`}
      onClick={() => onNodeClick?.(node)}
      style={{ cursor: 'pointer' }}
    >
      {/* Node shape */}
      <rect 
        x={-size/2} 
        y={-size/2} 
        width={size} 
        height={size} 
        rx={8}
        fill={fillColor}
        stroke="#1890ff"
        strokeWidth={2}
      />
      
      {/* Node label */}
      <text 
        textAnchor="middle" 
        dominantBaseline="middle"
        fill="#000000"
        fontSize={14 / zoomScale}
        fontWeight={isHighlighted ? 'bold' : 'normal'}
      >
        {node.label || node.id}
      </text>
      
      {/* Custom badge if node has a specific type */}
      {node.type === 'important' && (
        <circle 
          cx={size/2 - 5} 
          cy={-size/2 + 5} 
          r={8 / zoomScale} 
          fill="#f5222d" 
        />
      )}
    </g>
  );
};

// Use the custom renderer
const CustomNodesGraph = () => {
  return (
    <Graph
      data={graphData}
      nodeStyleConfig={{
        type: 'custom',
        renderer: CustomNodeRenderer
      }}
    />
  );
};
```

## Controlled Graph State

For more control over the graph state, you can create a controlled component:

```tsx
import React, { useState, useCallback } from 'react';
import { Graph, GraphData, Node, Edge, Position } from 'diagrammatic-ui';

const ControlledGraph = () => {
  // Maintain graph data in state
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [
      { id: '1', label: 'Node 1' },
      { id: '2', label: 'Node 2' }
    ],
    edges: [
      { id: 'e1', source: '1', target: '2' }
    ]
  });
  
  // Track node positions
  const [nodePositions, setNodePositions] = useState<Record<string, Position>>({});
  
  // Track selected nodes
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  
  // Handle node position changes (dragging)
  const handleNodePositionChange = useCallback((nodeId: string, position: Position) => {
    setNodePositions(prev => ({
      ...prev,
      [nodeId]: position
    }));
  }, []);
  
  // Handle node selection
  const handleSelectionChange = useCallback((event) => {
    setSelectedNodes(event.selectedNodes.map((node: Node) => node.id));
  }, []);
  
  // Add a new node
  const addNode = useCallback(() => {
    const newNodeId = `node-${graphData.nodes.length + 1}`;
    setGraphData(prev => ({
      ...prev,
      nodes: [
        ...prev.nodes,
        { id: newNodeId, label: `Node ${prev.nodes.length + 1}` }
      ]
    }));
  }, [graphData.nodes.length]);
  
  // Connect selected nodes
  const connectNodes = useCallback(() => {
    if (selectedNodes.length === 2) {
      const [source, target] = selectedNodes;
      const newEdgeId = `edge-${graphData.edges.length + 1}`;
      
      setGraphData(prev => ({
        ...prev,
        edges: [
          ...prev.edges,
          { id: newEdgeId, source, target }
        ]
      }));
    }
  }, [selectedNodes, graphData.edges.length]);
  
  return (
    <div>
      <div className="controls">
        <button onClick={addNode}>Add Node</button>
        <button 
          onClick={connectNodes} 
          disabled={selectedNodes.length !== 2}
        >
          Connect Selected Nodes
        </button>
      </div>
      
      <Graph
        data={graphData}
        interactionOptions={{
          selectionEnabled: true,
          multiSelectionEnabled: true,
          draggingEnabled: true
        }}
        onSelectionChange={handleSelectionChange}
        onNodePositionChange={handleNodePositionChange}
      />
    </div>
  );
};
```

## Dynamic Graph Updates

Handle dynamic updates to the graph data:

```tsx
import React, { useState, useEffect } from 'react';
import { Graph, GraphData } from 'diagrammatic-ui';

const DynamicGraph = () => {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: []
  });
  
  // Simulate data loading or real-time updates
  useEffect(() => {
    // Initial data load
    fetchGraphData().then(data => {
      setGraphData(data);
    });
    
    // Set up subscription for real-time updates
    const subscription = subscribeToUpdates(update => {
      setGraphData(prevData => {
        // Handle different update types
        switch (update.type) {
          case 'ADD_NODE':
            return {
              ...prevData,
              nodes: [...prevData.nodes, update.node]
            };
            
          case 'REMOVE_NODE':
            return {
              ...prevData,
              nodes: prevData.nodes.filter(n => n.id !== update.nodeId),
              // Also remove any edges connected to this node
              edges: prevData.edges.filter(
                e => e.source !== update.nodeId && e.target !== update.nodeId
              )
            };
            
          case 'ADD_EDGE':
            return {
              ...prevData,
              edges: [...prevData.edges, update.edge]
            };
            
          case 'UPDATE_NODE':
            return {
              ...prevData,
              nodes: prevData.nodes.map(n => 
                n.id === update.nodeId ? { ...n, ...update.changes } : n
              )
            };
            
          default:
            return prevData;
        }
      });
    });
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  return (
    <Graph
      data={graphData}
      autoLayout="force"
      layoutOptions={{
        // Use incremental layout for better performance with dynamic updates
        incremental: true,
        // Reduce animation time for quicker updates
        animationDuration: 300
      }}
    />
  );
};
```

## Performance Optimization

For large graphs, consider these performance optimizations:

```tsx
import React, { useMemo } from 'react';
import { Graph, GraphData } from 'diagrammatic-ui';

const LargeGraphOptimized = ({ rawData }) => {
  // Filter and process data to reduce complexity
  const optimizedData = useMemo(() => {
    // Only show important nodes if there are too many
    const shouldFilter = rawData.nodes.length > 500;
    
    if (shouldFilter) {
      // Filter to only important nodes
      const importantNodes = rawData.nodes.filter(
        node => node.type === 'important' || node.data?.weight > 10
      );
      
      const importantNodeIds = new Set(importantNodes.map(n => n.id));
      
      // Keep only edges between important nodes
      const relevantEdges = rawData.edges.filter(
        edge => importantNodeIds.has(edge.source) && importantNodeIds.has(edge.target)
      );
      
      return {
        nodes: importantNodes,
        edges: relevantEdges
      };
    }
    
    return rawData;
  }, [rawData]);
  
  return (
    <Graph
      data={optimizedData}
      // Use a simpler layout for large graphs
      autoLayout={optimizedData.nodes.length > 200 ? 'grid' : 'force'}
      // Disable expensive features for large graphs
      interactionOptions={{
        draggingEnabled: optimizedData.nodes.length < 300,
        zoomEnabled: true,
        panningEnabled: true,
        // Disable multi-selection for better performance
        multiSelectionEnabled: false
      }}
      // Use simplified node rendering for large graphs
      nodeStyleConfig={{
        type: optimizedData.nodes.length > 200 ? 'compact' : 'default'
      }}
    />
  );
};
```

## Custom Edge Rendering

Customize edge appearance with SVG paths:

```tsx
import React from 'react';
import { Graph } from 'diagrammatic-ui';

const CustomEdgesGraph = () => {
  // Define custom edge renderer
  const renderEdge = ({ edge, sourcePosition, targetPosition, isHighlighted }) => {
    // Calculate control points for a curved edge
    const dx = targetPosition.x - sourcePosition.x;
    const dy = targetPosition.y - sourcePosition.y;
    const controlX = sourcePosition.x + dx / 2;
    const controlY = sourcePosition.y + dy / 2 - 50;
    
    // Create SVG path
    const path = `M ${sourcePosition.x} ${sourcePosition.y} Q ${controlX} ${controlY}, ${targetPosition.x} ${targetPosition.y}`;
    
    return (
      <g>
        <path
          d={path}
          stroke={isHighlighted ? '#1890ff' : '#bfbfbf'}
          strokeWidth={isHighlighted ? 2 : 1}
          fill="none"
          strokeDasharray={edge.type === 'dashed' ? '5,5' : ''}
        />
        {edge.label && (
          <text
            x={controlX}
            y={controlY - 10}
            textAnchor="middle"
            fill="#000000"
            fontSize={12}
            fontWeight={isHighlighted ? 'bold' : 'normal'}
          >
            {edge.label}
          </text>
        )}
      </g>
    );
  };
  
  return (
    <Graph
      data={graphData}
      edgeRenderer={renderEdge}
    />
  );
};
```

## Integration with External Libraries

Integrate with D3.js for advanced visualizations:

```tsx
import React, { useRef, useEffect } from 'react';
import { Graph, GraphData, Node } from 'diagrammatic-ui';
import * as d3 from 'd3';

const D3EnhancedGraph = () => {
  const svgRef = useRef(null);
  
  // Custom node renderer that includes a D3 pie chart
  const renderNode = (props) => {
    const { node, position, isHighlighted } = props;
    
    // Create a unique ID for this node's chart
    const chartId = `pie-chart-${node.id}`;
    
    return (
      <g transform={`translate(${position.x}, ${position.y})`}>
        <rect
          x={-50}
          y={-50}
          width={100}
          height={100}
          rx={8}
          fill={isHighlighted ? '#e6f7ff' : '#ffffff'}
          stroke="#1890ff"
          strokeWidth={2}
        />
        <text
          y={-30}
          textAnchor="middle"
          fill="#000000"
          fontSize={14}
        >
          {node.label}
        </text>
        {/* Container for D3 to render into */}
        <g id={chartId} transform="translate(0, 10)" />
      </g>
    );
  };
  
  // Use D3 to create pie charts inside the nodes
  useEffect(() => {
    if (!svgRef.current) return;
    
    // For each node with data
    graphData.nodes.forEach(node => {
      if (!node.data?.chartData) return;
      
      const chartContainer = d3.select(`#pie-chart-${node.id}`);
      if (chartContainer.empty()) return;
      
      // Clear previous chart
      chartContainer.selectAll('*').remove();
      
      // Create pie chart
      const width = 80;
      const height = 80;
      const radius = Math.min(width, height) / 2;
      
      const pie = d3.pie().value(d => d.value);
      const arc = d3.arc().innerRadius(0).outerRadius(radius);
      
      const arcs = chartContainer.selectAll('.arc')
        .data(pie(node.data.chartData))
        .enter()
        .append('g')
        .attr('class', 'arc');
      
      arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.color);
    });
  }, [graphData, svgRef.current]);
  
  return (
    <div ref={svgRef}>
      <Graph
        data={graphData}
        nodeStyleConfig={{
          type: 'custom',
          renderer: renderNode
        }}
      />
    </div>
  );
};
```

## Next Steps

- Explore [API Reference](../api/index.md) for detailed component documentation
- See [Examples](../examples/index.md) for more advanced usage patterns 