import React, { useState } from 'react';
import { Graph, NodeMenuItem } from '../src';
import { FileText, Star, Copy, ExternalLink, Trash2, Info, Settings, EyeOff } from 'lucide-react';

// Sample data for the demo
const sampleData = {
  nodes: [
    { id: 'node1', label: 'User', type: 'entity' },
    { id: 'node2', label: 'Order', type: 'entity' },
    { id: 'node3', label: 'Product', type: 'entity' },
    { id: 'node4', label: 'Payment', type: 'entity' },
    { id: 'node5', label: 'Shipping', type: 'entity' },
  ],
  edges: [
    { id: 'edge1', source: 'node1', target: 'node2', type: 'default', label: 'Creates' },
    { id: 'edge2', source: 'node2', target: 'node3', type: 'default', label: 'Contains' },
    { id: 'edge3', source: 'node2', target: 'node4', type: 'default', label: 'Requires' },
    { id: 'edge4', source: 'node2', target: 'node5', type: 'default', label: 'Includes' },
    { id: 'edge5', source: 'node3', target: 'node5', type: 'dashed', label: 'Ships via' },
  ]
};

export const MenuCustomizationDemo: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showDropdown, setShowDropdown] = useState(true);
  const [enableContext, setEnableContext] = useState(true);
  const [lastAction, setLastAction] = useState<string>('');
  
  // Define custom menu items
  const customMenuItems: NodeMenuItem[] = [
    {
      id: 'view',
      label: 'View Details',
      icon: <Info size={16} strokeWidth={2} />,
      onClick: (node) => setLastAction(`Viewing details of ${node.label || node.id}`),
    },
    {
      id: 'favorite',
      label: 'Add to Favorites',
      icon: <Star size={16} strokeWidth={2} color="#f59e0b" />,
      onClick: (node) => setLastAction(`Added ${node.label || node.id} to favorites`),
    },
    {
      id: 'copy',
      label: 'Copy ID',
      icon: <Copy size={16} strokeWidth={2} />,
      onClick: (node) => {
        navigator.clipboard.writeText(node.id);
        setLastAction(`Copied ID: ${node.id}`);
      },
      divider: true,
    },
    {
      id: 'open',
      label: 'Open in New Tab',
      icon: <ExternalLink size={16} strokeWidth={2} />,
      onClick: (node) => setLastAction(`Opening ${node.label || node.id} in new tab`),
    },
    {
      id: 'configure',
      label: 'Configure Node',
      icon: <Settings size={16} strokeWidth={2} />,
      onClick: (node) => setLastAction(`Configuring ${node.label || node.id}`),
    },
    {
      id: 'hide',
      label: 'Hide Node',
      icon: <EyeOff size={16} strokeWidth={2} />,
      onClick: (node) => setLastAction(`Hiding node ${node.label || node.id}`),
      divider: true,
    },
    {
      id: 'delete',
      label: 'Delete Node',
      icon: <Trash2 size={16} strokeWidth={2} color="#ef4444" />,
      onClick: (node) => setLastAction(`Deleting ${node.label || node.id}`),
      disabled: true,
    },
  ];
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Custom Menu Demo</h1>
      <p>This demo shows how to customize node menus with custom actions and icons.</p>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ padding: '8px 12px' }}
        >
          Toggle Theme
        </button>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            checked={showDropdown}
            onChange={() => setShowDropdown(!showDropdown)}
          />
          Show Dropdown Menu
        </label>
        
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="checkbox"
            checked={enableContext}
            onChange={() => setEnableContext(!enableContext)}
          />
          Enable Context Menu
        </label>
      </div>
      
      {lastAction && (
        <div 
          style={{ 
            marginBottom: '20px', 
            padding: '10px',
            backgroundColor: theme === 'dark' ? '#334155' : '#f1f5f9',
            borderRadius: '4px',
            color: theme === 'dark' ? '#f8fafc' : '#334155'
          }}
        >
          <strong>Last Action:</strong> {lastAction}
        </div>
      )}
      
      <div 
        style={{ 
          height: '600px', 
          border: '1px solid #ccc', 
          borderRadius: '8px',
          overflow: 'hidden',
          width: '100%'
        }}
      >
        <Graph 
          data={sampleData}
          height={600}
          autoLayout="circular"
          theme={theme}
          nodeMenuConfig={{
            items: customMenuItems,
            showDropdownMenu: showDropdown,
            enableContextMenu: enableContext
          }}
          interactionOptions={{
            draggingEnabled: true,
            zoomEnabled: true,
            panningEnabled: true,
            selectionEnabled: true,
            multiSelectionEnabled: true
          }}
          onNodeClick={(nodeId) => setLastAction(`Clicked on node: ${nodeId}`)}
        />
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Instructions</h2>
        <ul>
          <li>Click the menu button in the top-right of a node to open the dropdown menu</li>
          <li>Right-click a node to open the context menu</li>
          <li>Use the checkboxes above to toggle dropdown and context menu functionality</li>
          <li>The "Delete Node" option is intentionally disabled to show the disabled styling</li>
        </ul>
      </div>
    </div>
  );
}; 