/**
 * Utility functions for node styling
 */

/**
 * Get inline style classes for a node based on its type
 */
export function getNodeStyle(type: string, theme: 'light' | 'dark'): Record<string, string> {
  const isDark = theme === 'dark';
  
  // Base styles that apply to all node types
  const baseStyles = {
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '8px',
    padding: '12px',
    transition: 'all 0.2s ease',
    boxShadow: isDark ? '0 4px 6px rgba(0, 0, 0, 0.3)' : '0 4px 6px rgba(0, 0, 0, 0.1)',
  };
  
  // Type-specific colors
  const typeStyles: Record<string, Record<string, string>> = {
    component: {
      backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.05)',
      borderColor: isDark ? '#4285f4' : '#3b82f6',
      color: isDark ? '#e4e4e7' : '#1e40af',
    },
    hook: {
      backgroundColor: isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.05)',
      borderColor: isDark ? '#9333ea' : '#8b5cf6',
      color: isDark ? '#e4e4e7' : '#6d28d9',
    },
    service: {
      backgroundColor: isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.05)',
      borderColor: isDark ? '#10b981' : '#10b981',
      color: isDark ? '#e4e4e7' : '#047857',
    },
    context: {
      backgroundColor: isDark ? 'rgba(234, 179, 8, 0.15)' : 'rgba(234, 179, 8, 0.05)',
      borderColor: isDark ? '#eab308' : '#eab308',
      color: isDark ? '#e4e4e7' : '#a16207',
    },
    module: {
      backgroundColor: isDark ? 'rgba(249, 115, 22, 0.15)' : 'rgba(249, 115, 22, 0.05)',
      borderColor: isDark ? '#f59e0b' : '#f97316',
      color: isDark ? '#e4e4e7' : '#c2410c',
    },
    class: {
      backgroundColor: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.05)',
      borderColor: isDark ? '#22c55e' : '#22c55e',
      color: isDark ? '#e4e4e7' : '#15803d',
    },
    file: {
      backgroundColor: isDark ? 'rgba(249, 115, 22, 0.15)' : 'rgba(249, 115, 22, 0.05)',
      borderColor: isDark ? '#f97316' : '#f97316',
      color: isDark ? '#e4e4e7' : '#c2410c',
    },
    model: {
      backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.05)',
      borderColor: isDark ? '#6366f1' : '#6366f1',
      color: isDark ? '#e4e4e7' : '#4338ca',
    },
    app: {
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.05)',
      borderColor: isDark ? '#ef4444' : '#ef4444',
      color: isDark ? '#e4e4e7' : '#b91c1c',
    },
    view: {
      backgroundColor: isDark ? 'rgba(14, 165, 233, 0.15)' : 'rgba(14, 165, 233, 0.05)',
      borderColor: isDark ? '#0ea5e9' : '#0ea5e9',
      color: isDark ? '#e4e4e7' : '#0369a1',
    },
  };
  
  // Get the specific type styles or fallback to default gray
  const specificStyles = typeStyles[type.toLowerCase()] || {
    backgroundColor: isDark ? 'rgba(107, 114, 128, 0.15)' : 'rgba(107, 114, 128, 0.05)',
    borderColor: isDark ? '#6b7280' : '#6b7280',
    color: isDark ? '#e4e4e7' : '#374151',
  };
  
  // Merge base styles with type-specific styles
  return {
    ...baseStyles,
    ...specificStyles,
  };
}

/**
 * Get the color for a node type, used for icons or decorations
 */
export function getNodeTypeColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'component': return '#3b82f6'; // blue
    case 'hook': return '#8b5cf6'; // purple
    case 'context': return '#eab308'; // yellow
    case 'class': return '#22c55e'; // green
    case 'file': return '#f97316'; // orange
    case 'service': return '#10b981'; // emerald
    case 'module': return '#f59e0b'; // amber
    case 'model': return '#6366f1'; // indigo
    case 'app': return '#ef4444'; // red
    case 'view': return '#0ea5e9'; // sky
    default: return '#6b7280'; // gray
  }
} 