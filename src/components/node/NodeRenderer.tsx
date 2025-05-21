import React from 'react';
import { GraphNode, GraphNodeProps } from './GraphNode';
import { DocumentGraphNode } from './DocumentGraphNode';
import { Node, NodeStyle, NodeStyleConfig } from '../../types/graph';

export interface NodeRendererProps extends GraphNodeProps {
  /** Style type to use for this node */
  nodeStyle?: NodeStyle;
  /** Custom renderer component for 'custom' style */
  customRenderer?: React.ComponentType<GraphNodeProps>;
  /** Complete style configuration */
  styleConfig?: NodeStyleConfig;
}

/**
 * Determine the most appropriate node style based on node content
 */
export function detectNodeStyle(node: Node): NodeStyle {
  // Check for structured content (sections)
  if (node.sections && node.sections.length > 0) {
    return 'document';
  }
  
  // Check for long description that would benefit from card style
  if (node.description && node.description.length > 100) {
    return 'card';
  }
  
  // Check if it's a minimal node with just an ID or very basic info
  if (!node.description && !node.label && !node.name) {
    return 'compact';
  }
  
  // Default style for general nodes
  return 'default';
}

/**
 * Renders a node using the specified style
 * This component acts as a switchboard for different node styles
 */
export const NodeRenderer: React.FC<NodeRendererProps> = ({
  nodeStyle,
  customRenderer: CustomRenderer,
  styleConfig,
  ...props
}) => {
  // Determine if we should use a specific node style
  // This can be based on node type, metadata, or explicit style setting
  const getEffectiveNodeStyle = (): NodeStyle => {
    // 1. Style explicitly set on this node instance takes priority
    if (nodeStyle) return nodeStyle;
    
    // 2. Use the styleSelector function if provided in config
    if (styleConfig?.styleSelector) {
      return styleConfig.styleSelector(props.node);
    }
    
    // 3. Use automatic detection based on node content
    return detectNodeStyle(props.node);
  };
  
  // Get the style to use for this node
  const effectiveStyle = getEffectiveNodeStyle();

  // Render the appropriate component based on style
  switch (effectiveStyle) {
    case 'document':
      return <DocumentGraphNode {...props} styleConfig={styleConfig} />;
      
    case 'card':
      // For now, card style falls back to default since we haven't implemented it yet
      // TODO: Implement CardNode component
      return <GraphNode {...props} styleConfig={styleConfig} />;
      
    case 'compact':
      // For now, compact style falls back to default with modified props
      // TODO: Implement CompactNode component
      return <GraphNode 
        {...props} 
        minNodeSize={40} 
        maxNodeSize={80}
        styleConfig={styleConfig}
      />;
      
    case 'custom':
      // If custom style is specified but no renderer is provided, fall back to default
      if (CustomRenderer) {
        return <CustomRenderer {...props} styleConfig={styleConfig} />;
      }
      return <GraphNode {...props} styleConfig={styleConfig} />;
      
    case 'default':
    default:
      return <GraphNode {...props} styleConfig={styleConfig} />;
  }
};

export default NodeRenderer; 