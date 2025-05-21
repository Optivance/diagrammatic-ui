import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Graph, GraphData, NodeStyle, NodeStyleConfig } from '../src';
import { CustomDocumentNode } from '../src/components/node';
import { GraphNodeProps } from '../src/components/node/GraphNode';

// Simple CSS to make nodes draggable
const dragStyles = `
.document-node {
  cursor: grab !important;
  pointer-events: auto !important;
}
.document-node * {
  pointer-events: none !important;
}
.node-menu-btn {
  pointer-events: auto !important;
}
`;

// Create a draggable document node
const SuperDraggableDocument: React.FC<GraphNodeProps> = (props) => {
  // Add styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = dragStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Force draggable
  useEffect(() => {
    const forceDraggable = () => {
      const interactionLayer = document.querySelector('svg g.interaction-layer');
      const documentNodes = document.querySelectorAll('.document-node');
      
      if (interactionLayer) {
        // Force dragging to be enabled in the interaction layer
        interactionLayer.setAttribute('data-draggable', 'true');
      }
      
      // Make sure all document nodes have pointer events enabled
      documentNodes.forEach(node => {
        node.setAttribute('style', 'cursor: grab !important; pointer-events: auto !important;');
      });
    };
    
    // Run multiple times to ensure it applies after rendering
    forceDraggable();
    const timer = setTimeout(forceDraggable, 500);
    const periodicCheck = setInterval(forceDraggable, 2000); // Periodically check in case of re-renders
    
    return () => {
      clearTimeout(timer);
      clearInterval(periodicCheck);
    };
  }, []);
  
  // Ensure the onMouseDown is directly attached and propagated correctly
  const handleMouseDown = (e: React.MouseEvent) => {
    if (props.isInteractive && props.onPositionChange && props.position) {
      e.stopPropagation();
      const initialX = e.clientX;
      const initialY = e.clientY;
      const initialPos = { ...props.position };
      
      const handleMouseMove = (moveEvent: MouseEvent) => {
        const dx = (moveEvent.clientX - initialX) / (props.zoomScale || 1);
        const dy = (moveEvent.clientY - initialY) / (props.zoomScale || 1);
        
        props.onPositionChange(props.node.id, {
          x: initialPos.x + dx,
          y: initialPos.y + dy
        });
      };
      
      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = 'default';
      };
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
    }
  };
  
  return (
    <CustomDocumentNode 
      {...props} 
      isInteractive={true}
      onMouseDown={handleMouseDown}
    />
  );
};

// --- Organization Chart data ---
const orgChartData: GraphData = {
  nodes: [
    { 
      id: 'ceo', 
      name: 'Jane Smith', 
      type: 'primary',
      description: 'Chief Executive Officer',
      sections: [
        {
          id: 'responsibilities',
          name: 'Responsibilities',
          items: [
            { id: 'resp1', value: 'Company Strategy' },
            { id: 'resp2', value: 'Investor Relations' },
            { id: 'resp3', value: 'Executive Leadership' }
          ]
        },
        {
          id: 'contact',
          name: 'Contact',
          items: [
            { id: 'cont1', value: 'jane@example.com' },
            { id: 'cont2', value: '+1 (555) 123-4567' }
          ]
        }
      ]
    },
    { 
      id: 'cto', 
      name: 'Bob Johnson', 
      type: 'secondary',
      description: 'Chief Technology Officer' 
    },
    { 
      id: 'cfo', 
      name: 'Alice Williams', 
      type: 'secondary',
      description: 'Chief Financial Officer' 
    },
    { 
      id: 'vpe', 
      name: 'Tom Davis', 
      type: 'tertiary',
      description: 'VP of Engineering' 
    },
    { 
      id: 'vps', 
      name: 'Sarah Brown', 
      type: 'tertiary',
      description: 'VP of Sales' 
    },
  ],
  edges: [
    { id: 'e1', source: 'ceo', target: 'cto' },
    { id: 'e2', source: 'ceo', target: 'cfo' },
    { id: 'e3', source: 'cto', target: 'vpe' },
    { id: 'e4', source: 'cfo', target: 'vps' },
  ],
  name: 'Company Org Chart',
  category: 'organization'
};

// --- Process Flow data ---
const processFlowData: GraphData = {
  nodes: [
    { id: 'start', name: 'Start', type: 'input' },
    { id: 'processA', name: 'Process A', type: 'process', description: 'First step in our workflow' },
    { id: 'decision', name: 'Decision Point', type: 'process' },
    { id: 'processB', name: 'Process B', type: 'process' },
    { id: 'processC', name: 'Process C', type: 'process' },
    { id: 'end', name: 'End', type: 'output' },
  ],
  edges: [
    { id: 'e1', source: 'start', target: 'processA', label: 'Begin' },
    { id: 'e2', source: 'processA', target: 'decision', label: 'Evaluate' },
    { id: 'e3', source: 'decision', target: 'processB', label: 'If True' },
    { id: 'e4', source: 'decision', target: 'processC', label: 'If False' },
    { id: 'e5', source: 'processB', target: 'end' },
    { id: 'e6', source: 'processC', target: 'end' },
  ],
  name: 'Workflow Process',
  category: 'process'
};

// --- Customer Journey data ---
const customerJourneyData: GraphData = {
  nodes: [
    { 
      id: 'awareness', 
      name: 'Awareness', 
      type: 'data',
      description: 'Customer becomes aware of the product/service',
      sections: [
        {
          id: 'channels',
          name: 'Channels',
          items: [
            { id: 'ch1', value: 'Social Media' },
            { id: 'ch2', value: 'Search Engines' },
            { id: 'ch3', value: 'Word of Mouth' }
          ]
        },
        {
          id: 'metrics',
          name: 'Metrics',
          items: [
            { id: 'm1', value: 'New Visitors' },
            { id: 'm2', value: 'Ad Impressions' },
            { id: 'm3', value: 'Brand Recognition' }
          ]
        }
      ]
    },
    { 
      id: 'consideration', 
      name: 'Consideration', 
      type: 'data',
      description: 'Customer evaluates options'
    },
    { 
      id: 'purchase', 
      name: 'Purchase', 
      type: 'data',
      description: 'Transaction occurs'
    },
    { 
      id: 'retention', 
      name: 'Retention', 
      type: 'data',
      description: 'Ongoing relationship'
    },
    { 
      id: 'advocacy', 
      name: 'Advocacy', 
      type: 'data',
      description: 'Customer promotes the brand'
    }
  ],
  edges: [
    { id: 'e1', source: 'awareness', target: 'consideration', label: 'Research' },
    { id: 'e2', source: 'consideration', target: 'purchase', label: 'Decision' },
    { id: 'e3', source: 'purchase', target: 'retention', label: 'Experience' },
    { id: 'e4', source: 'retention', target: 'advocacy', label: 'Satisfaction' },
    { id: 'e5', source: 'advocacy', target: 'awareness', type: 'dashed', label: 'Referral' }
  ],
  name: 'Customer Journey Map',
  category: 'journey'
};

// --- Network Topology data ---
const networkTopologyData: GraphData = {
  nodes: [
    { id: 'router', name: 'Main Router', type: 'root' },
    { id: 'switch1', name: 'Switch 1', type: 'branch' },
    { id: 'switch2', name: 'Switch 2', type: 'branch' },
    { id: 'server1', name: 'Web Server', type: 'leaf' },
    { id: 'server2', name: 'Database', type: 'leaf' },
    { id: 'server3', name: 'File Server', type: 'leaf' },
    { id: 'client1', name: 'Workstation 1', type: 'leaf' },
    { id: 'client2', name: 'Workstation 2', type: 'leaf' },
    { id: 'client3', name: 'Workstation 3', type: 'leaf' },
  ],
  edges: [
    { id: 'e1', source: 'router', target: 'switch1' },
    { id: 'e2', source: 'router', target: 'switch2' },
    { id: 'e3', source: 'switch1', target: 'server1' },
    { id: 'e4', source: 'switch1', target: 'server2' },
    { id: 'e5', source: 'switch1', target: 'server3' },
    { id: 'e6', source: 'switch2', target: 'client1' },
    { id: 'e7', source: 'switch2', target: 'client2' },
    { id: 'e8', source: 'switch2', target: 'client3' },
  ],
  name: 'Network Topology',
  category: 'network'
};

type UseCaseType = 'org' | 'process' | 'journey' | 'network';

// Simple standalone org chart component that ensures draggable nodes
const StandaloneOrgChart = ({ data, theme }: { data: GraphData, theme: 'light' | 'dark' }) => {
  const [positions, setPositions] = useState<Record<string, { x: number, y: number }>>({});
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Initialize positions in a tree layout
  useEffect(() => {
    // Simple tree layout algorithm
    const layout = () => {
      const newPositions: Record<string, { x: number, y: number }> = {};
      const width = 800;
      
      // Get root node (CEO)
      const root = data.nodes.find(n => n.id === 'ceo');
      
      if (root) {
        // Place CEO at top center
        newPositions[root.id] = { x: width / 2, y: 100 };
        
        // Find direct reports (level 1)
        const level1Nodes = data.nodes.filter(n => 
          data.edges.some(e => e.source === root.id && e.target === n.id)
        );
        
        // Arrange level 1 nodes horizontally
        const level1Count = level1Nodes.length;
        const level1Width = width * 0.8;
        const level1Spacing = level1Width / (level1Count + 1);
        const level1Y = 250;
        
        level1Nodes.forEach((node, index) => {
          const x = (width * 0.1) + ((index + 1) * level1Spacing);
          newPositions[node.id] = { x, y: level1Y };
          
          // Find level 2 nodes (reports to this person)
          const level2Nodes = data.nodes.filter(n => 
            data.edges.some(e => e.source === node.id && e.target === n.id)
          );
          
          // Arrange level 2 nodes
          const level2Count = level2Nodes.length;
          const level2Width = level1Spacing * 0.8;
          const level2Spacing = level2Width / (level2Count + 1);
          const level2Y = 400;
          
          level2Nodes.forEach((l2Node, l2Index) => {
            const l2X = x - (level2Width / 2) + ((l2Index + 1) * level2Spacing);
            newPositions[l2Node.id] = { x: l2X, y: level2Y };
          });
        });
      }
      
      setPositions(newPositions);
    };
    
    layout();
  }, [data]);
  
  // Drag state
  const [dragState, setDragState] = useState<{
    isDragging: boolean,
    nodeId: string | null,
    startPos: { x: number, y: number } | null,
    offset: { x: number, y: number } | null
  }>({
    isDragging: false,
    nodeId: null,
    startPos: null,
    offset: { x: 0, y: 0 }
  });
  
  // Start dragging
  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    const position = positions[nodeId];
    if (!position) return;
    
    setDragState({
      isDragging: true,
      nodeId,
      startPos: { x: e.clientX, y: e.clientY },
      offset: { x: 0, y: 0 }
    });
    
    // Prevent default to avoid text selection
    e.preventDefault();
  };
  
  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.isDragging || !dragState.nodeId || !dragState.startPos) return;
    
    const dx = e.clientX - dragState.startPos.x;
    const dy = e.clientY - dragState.startPos.y;
    
    setDragState(prev => ({
      ...prev,
      offset: { x: dx, y: dy }
    }));
  }, [dragState]);
  
  // End dragging
  const handleMouseUp = useCallback(() => {
    if (!dragState.isDragging || !dragState.nodeId) return;
    
    // Update positions with the final position
    setPositions(prev => {
      const oldPos = prev[dragState.nodeId!];
      if (!oldPos) return prev;
      
      return {
        ...prev,
        [dragState.nodeId!]: {
          x: oldPos.x + (dragState.offset?.x || 0),
          y: oldPos.y + (dragState.offset?.y || 0)
        }
      };
    });
    
    // Reset drag state
    setDragState({
      isDragging: false,
      nodeId: null,
      startPos: null,
      offset: { x: 0, y: 0 }
    });
  }, [dragState]);
  
  // Add/remove global mouse handlers
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);
  
  // Get edges as SVG paths
  const renderEdges = () => {
    return data.edges.map(edge => {
      const source = positions[edge.source];
      const target = positions[edge.target];
      
      if (!source || !target) return null;
      
      // Apply offset to dragged node
      const sourcePos = {
        x: source.x + ((dragState.isDragging && dragState.nodeId === edge.source) ? (dragState.offset?.x || 0) : 0),
        y: source.y + ((dragState.isDragging && dragState.nodeId === edge.source) ? (dragState.offset?.y || 0) : 0)
      };
      
      const targetPos = {
        x: target.x + ((dragState.isDragging && dragState.nodeId === edge.target) ? (dragState.offset?.x || 0) : 0),
        y: target.y + ((dragState.isDragging && dragState.nodeId === edge.target) ? (dragState.offset?.y || 0) : 0)
      };
      
      // Create a curved path
      const path = `M ${sourcePos.x} ${sourcePos.y} C ${sourcePos.x} ${(sourcePos.y + targetPos.y) / 2}, ${targetPos.x} ${(sourcePos.y + targetPos.y) / 2}, ${targetPos.x} ${targetPos.y}`;
      
      return (
        <path
          key={`${edge.source}-${edge.target}`}
          d={path}
          stroke={theme === 'dark' ? '#64748b' : '#94a3b8'}
          strokeWidth={2}
          fill="none"
          markerEnd="url(#arrowhead)"
        />
      );
    });
  };
  
  // Render nodes
  const renderNodes = () => {
    return data.nodes.map(node => {
      const position = positions[node.id];
      if (!position) return null;
      
      // Apply offset for dragged node
      const actualPos = {
        x: position.x + ((dragState.isDragging && dragState.nodeId === node.id) ? (dragState.offset?.x || 0) : 0),
        y: position.y + ((dragState.isDragging && dragState.nodeId === node.id) ? (dragState.offset?.y || 0) : 0)
      };
      
      // Calculate dimensions based on content
      const isRoot = node.id === 'ceo';
      const nodeWidth = isRoot ? 200 : 180;
      const nodeHeight = node.sections?.length ? 160 : 100;
      
      // Styles
      const bgColor = theme === 'dark' ? '#1e293b' : '#ffffff';
      const borderColor = node.type === 'primary' ? '#6366f1' : 
                         node.type === 'secondary' ? '#10b981' : '#f97316';
      const headerBg = node.type === 'primary' ? (theme === 'dark' ? '#312e81' : '#e0e7ff') : 
                      node.type === 'secondary' ? (theme === 'dark' ? '#064e3b' : '#d1fae5') : 
                      (theme === 'dark' ? '#7c2d12' : '#ffedd5');
      
      return (
        <g
          key={node.id}
          transform={`translate(${actualPos.x - nodeWidth/2}, ${actualPos.y - nodeHeight/2})`}
          onMouseDown={(e) => handleMouseDown(e, node.id)}
          style={{ cursor: 'grab' }}
        >
          {/* Node background */}
          <rect
            width={nodeWidth}
            height={nodeHeight}
            rx={8}
            ry={8}
            fill={bgColor}
            stroke={borderColor}
            strokeWidth={2}
            filter="drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))"
          />
          
          {/* Header */}
          <rect
            width={nodeWidth}
            height={28}
            rx={8}
            ry={8}
            fill={headerBg}
            style={{ clipPath: 'inset(0 0 50% 0 round 8px)' }}
          />
          
          {/* Title */}
          <text
            x={nodeWidth / 2}
            y={20}
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize={14}
            fontWeight="bold"
            fill={theme === 'dark' ? '#f1f5f9' : '#1e293b'}
          >
            {node.name}
          </text>
          
          {/* Description */}
          <text
            x={nodeWidth / 2}
            y={50}
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontSize={12}
            fill={theme === 'dark' ? '#cbd5e1' : '#64748b'}
          >
            {node.description}
          </text>
          
          {/* Additional content */}
          {node.sections && node.sections.map((section, i) => (
            <g key={section.id} transform={`translate(10, ${70 + i * 30})`}>
              <text
                fontFamily="Arial, sans-serif"
                fontSize={11}
                fontWeight="bold"
                fill={theme === 'dark' ? '#94a3b8' : '#475569'}
              >
                {section.name}:
              </text>
              {section.items.slice(0, 1).map((item, j) => (
                <text
                  key={`item-${j}`}
                  y={16}
                  fontFamily="Arial, sans-serif"
                  fontSize={10}
                  fill={theme === 'dark' ? '#cbd5e1' : '#64748b'}
                >
                  {item.value}
                </text>
              ))}
            </g>
          ))}
        </g>
      );
    });
  };
  
  return (
    <div style={{ width: '100%', height: 600, border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden' }}>
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 800 600"
        style={{ backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc' }}
      >
        <defs>
          <marker
            id="arrowhead"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path
              d="M 0 0 L 10 5 L 0 10 z"
              fill={theme === 'dark' ? '#64748b' : '#94a3b8'}
            />
          </marker>
        </defs>
        {renderEdges()}
        {renderNodes()}
      </svg>
    </div>
  );
};

export function UseCasesDemo() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [activeUseCase, setActiveUseCase] = useState<UseCaseType>('org');
  const [nodePositions, setNodePositions] = useState<Record<string, {x: number, y: number}>>({});
  
  // Update node positions when dragged
  const handleNodeDrag = useCallback((nodeId: string, position: {x: number, y: number}) => {
    setNodePositions(prev => ({
      ...prev,
      [nodeId]: position
    }));
  }, []);
  
  // Get the appropriate data and layout for the selected use case
  const getUseCase = () => {
    switch (activeUseCase) {
      case 'org':
        return {
          data: orgChartData,
          layout: 'tree' as const,
          config: {
            type: 'document' as NodeStyle,
            typeStyles: {
              primary: { borderWidth: '3px' },
              secondary: { borderWidth: '2px' },
              tertiary: { borderWidth: '1px' }
            }
          } as NodeStyleConfig
        };
      case 'process':
        return {
          data: processFlowData,
          layout: 'tree' as const,
          config: {
            typeStyles: {
              input: { borderRadius: '50%' },
              output: { borderRadius: '50%' },
              process: { borderRadius: '8px' }
            }
          } as NodeStyleConfig
        };
      case 'journey':
        return {
          data: customerJourneyData,
          layout: 'circular' as const,
          config: {
            styleSelector: (node) => {
              if (node.id === 'awareness' || node.id === 'purchase') {
                return 'document' as NodeStyle;
              }
              return 'default' as NodeStyle;
            }
          } as NodeStyleConfig
        };
      case 'network':
        return {
          data: networkTopologyData,
          layout: 'force' as const,
          config: {
            type: 'default' as NodeStyle
          } as NodeStyleConfig
        };
    }
  };
  
  const useCase = getUseCase();
  
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      color: theme === 'dark' ? '#f8fafc' : '#1e293b'
    }}>
      <h2>Use Cases Demo</h2>
      <p>The graph library can visualize many different types of data beyond code relationships.</p>
      
      <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ padding: '0.5rem 1rem' }}
        >
          Toggle Theme ({theme})
        </button>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => {
              setActiveUseCase('org');
              setNodePositions({});
            }}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: activeUseCase === 'org' ? (theme === 'dark' ? '#4f46e5' : '#818cf8') : 'transparent',
              color: activeUseCase === 'org' ? '#ffffff' : 'inherit',
              border: activeUseCase === 'org' ? 'none' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            Organization Chart
          </button>
          
          <button 
            onClick={() => {
              setActiveUseCase('process');
              setNodePositions({});
            }}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: activeUseCase === 'process' ? (theme === 'dark' ? '#4f46e5' : '#818cf8') : 'transparent',
              color: activeUseCase === 'process' ? '#ffffff' : 'inherit',
              border: activeUseCase === 'process' ? 'none' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            Process Flow
          </button>
          
          <button 
            onClick={() => {
              setActiveUseCase('journey');
              setNodePositions({});
            }}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: activeUseCase === 'journey' ? (theme === 'dark' ? '#4f46e5' : '#818cf8') : 'transparent',
              color: activeUseCase === 'journey' ? '#ffffff' : 'inherit',
              border: activeUseCase === 'journey' ? 'none' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            Customer Journey
          </button>
          
          <button 
            onClick={() => {
              setActiveUseCase('network');
              setNodePositions({});
            }}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: activeUseCase === 'network' ? (theme === 'dark' ? '#4f46e5' : '#818cf8') : 'transparent',
              color: activeUseCase === 'network' ? '#ffffff' : 'inherit',
              border: activeUseCase === 'network' ? 'none' : '1px solid #ccc',
              borderRadius: '4px'
            }}
          >
            Network Topology
          </button>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '1rem',
        backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
        padding: '1rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ margin: '0 0 0.5rem 0' }}>
          {useCase.data.name}
        </h3>
        <p style={{ margin: '0 0 1rem 0', opacity: 0.8 }}>
          {getUseCaseDescription(activeUseCase)}
        </p>
      </div>
      
      <div 
        style={{ 
          marginTop: '2rem', 
          border: '1px solid #ccc', 
          borderRadius: '8px', 
          overflow: 'hidden', 
          width: '100%' 
        }}
        className={activeUseCase === 'org' ? 'app-org-chart' : ''}
      >
        {activeUseCase === 'org' ? (
          // Use our custom component for org charts
          <StandaloneOrgChart 
            data={useCase.data}
            theme={theme}
          />
        ) : (
          // Use the library Graph component for other visualizations
          <Graph 
            data={{
              ...useCase.data,
              nodes: useCase.data.nodes.map(node => ({
                ...node,
                data: {
                  ...(node.data || {}),
                  x: nodePositions[node.id]?.x,
                  y: nodePositions[node.id]?.y
                }
              }))
            }}
            height={600}
            autoLayout={useCase.layout} 
            theme={theme}
            nodeStyleConfig={{
              ...useCase.config,
              type: 'document' as NodeStyle,
              renderer: SuperDraggableDocument
            }}
            interactionOptions={{
              draggingEnabled: true,
              zoomEnabled: true,
              panningEnabled: true,
              selectionEnabled: true,
              fitViewOnInit: nodePositions && Object.keys(nodePositions).length === 0,
              multiSelectionEnabled: true
            }}
            layoutOptions={{
              spacingFactor: activeUseCase === 'process' ? 2 :
                            activeUseCase === 'journey' ? 3 : 2,
              nodeSeparation: activeUseCase === 'process' ? 150 : 100,
              rankSeparation: 80,
              preventOverlap: true,
              forceUpdate: true,
              direction: 'top-down'
            }}
            onNodeClick={(nodeId) => console.log('Node clicked:', nodeId)}
            onDrag={(nodeIds, position) => {
              if (nodeIds.length > 0) {
                handleNodeDrag(nodeIds[0], position);
              }
            }}
            onDragStart={(nodeIds) => {
              console.log('Starting drag for nodes:', nodeIds);
            }}
            onDragEnd={(nodeIds) => {
              console.log('Finished dragging nodes:', nodeIds);
              
              // Ensure positions are saved
              if (nodeIds.length > 0) {
                const nodeElement = document.querySelector(`[data-node-id="${nodeIds[0]}"]`);
                if (nodeElement) {
                  const transform = nodeElement.getAttribute('transform');
                  if (transform) {
                    const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
                    if (match) {
                      const x = parseFloat(match[1]);
                      const y = parseFloat(match[2]);
                      handleNodeDrag(nodeIds[0], { x, y });
                    }
                  }
                }
              }
            }}
          />
        )}
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Configuration</h3>
        <pre style={{ 
          backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {activeUseCase === 'org' ? 
            `<StandaloneOrgChart
  data={orgChartData}
  theme="${theme}"
/>` :
            `<Graph
  data={${activeUseCase}Data}
  autoLayout="${useCase.layout}"
  theme="${theme}"
  nodeStyleConfig={${JSON.stringify(useCase.config, null, 2)}}
  interactionOptions={{
    draggingEnabled: true,
    zoomEnabled: true,
    panningEnabled: true,
    selectionEnabled: true,
    fitViewOnInit: true,
    multiSelectionEnabled: true
  }}
  layoutOptions={{
    spacingFactor: ${activeUseCase === 'process' ? 2 : activeUseCase === 'journey' ? 3 : 2},
    nodeSeparation: ${activeUseCase === 'process' ? 150 : 100},
    rankSeparation: 80,
    preventOverlap: true,
    forceUpdate: true,
    direction: 'top-down'
  }}
/>`
          }
        </pre>
      </div>
    </div>
  );
}

// Helper function to get descriptions for each use case
function getUseCaseDescription(useCase: UseCaseType): string {
  switch (useCase) {
    case 'org':
      return 'Visualize company hierarchy and reporting relationships in a tree structure.';
    case 'process':
      return 'Illustrate step-by-step workflows with decision points and branching paths.';
    case 'journey':
      return 'Map the stages a customer goes through when interacting with a product or service.';
    case 'network':
      return 'Display network infrastructure with connectivity between devices and servers.';
  }
} 