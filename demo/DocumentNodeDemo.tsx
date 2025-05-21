import React, { useState } from 'react';
import { Graph, GraphData } from '../src';
import { LayoutType } from '../src/layouts';

// Sample data for demonstration with sections
export const sampleDocumentData: GraphData = {
  nodes: [
    { 
      id: 'doc1', 
      name: 'RowingBoat', 
      type: 'interface',
      path: 'RowingBoat.java',
      description: 'Java interface for rowing boats',
      sections: [
        {
          id: 'methods',
          name: 'Methods',
          items: [
            { id: 'method1', value: 'public abstract void row(int speed, Direction direction) throws MotionException' },
            { id: 'method2', value: 'public abstract boolean anchor(Location location, int depth) throws AnchorException' },
            { id: 'method3', value: 'public abstract BoatStatus getStatus()' },
            { id: 'method4', value: 'public abstract void setConfiguration(BoatConfiguration config)' }
          ]
        },
        {
          id: 'imports',
          name: 'Imports',
          items: [
            { id: 'import1', value: 'java.lang' },
            { id: 'import2', value: 'java.util.List' },
            { id: 'import3', value: 'com.boats.exceptions.MotionException' },
            { id: 'import4', value: 'com.boats.exceptions.AnchorException' },
            { id: 'import5', value: 'com.boats.data.Location' },
            { id: 'import6', value: 'com.boats.enums.Direction' }
          ]
        }
      ]
    },
    { 
      id: 'doc2', 
      name: 'SpeedBoat', 
      type: 'class',
      path: 'SpeedBoat.java',
      description: 'High-speed boat implementation',
      sections: [
        {
          id: 'methods',
          name: 'Methods',
          items: [
            { id: 'method1', value: 'public void accelerate(int speedIncrement) throws MaxSpeedExceededException' },
            { id: 'method2', value: 'public void dock(Marina marina, DockingBay bay) throws DockingException' },
            { id: 'method3', value: 'public void row(int speed, Direction direction) throws MotionException' },
            { id: 'method4', value: 'public boolean anchor(Location location, int depth) throws AnchorException' },
            { id: 'method5', value: 'public BoatStatus getStatus()' },
            { id: 'method6', value: 'private void updateFuelConsumption(int speed, Weather currentWeather)' }
          ]
        },
        {
          id: 'properties',
          name: 'Properties',
          items: [
            { id: 'prop1', value: 'private int maxSpeed' },
            { id: 'prop2', value: 'private int currentSpeed' },
            { id: 'prop3', value: 'private Engine engine' },
            { id: 'prop4', value: 'private FuelTank fuelTank' },
            { id: 'prop5', value: 'private NavigationSystem navigationSystem' }
          ]
        },
        {
          id: 'constructors',
          name: 'Constructors',
          items: [
            { id: 'cons1', value: 'public SpeedBoat()' },
            { id: 'cons2', value: 'public SpeedBoat(int maxSpeed, Engine engine, FuelTank fuelTank)' },
            { id: 'cons3', value: 'public SpeedBoat(BoatConfiguration config)' }
          ]
        }
      ]
    },
    { 
      id: 'doc3', 
      name: 'FishingBoat', 
      type: 'class',
      path: 'FishingBoat.java',
      description: 'Fishing boat implementation',
      sections: [
        {
          id: 'methods',
          name: 'Methods',
          items: [
            { id: 'method1', value: 'public void castNet(int depth, NetType netType) throws NetDeploymentException' },
            { id: 'method2', value: 'public List<Fish> collect() throws EmptyNetException' },
            { id: 'method3', value: 'public void row(int speed, Direction direction) throws MotionException' },
            { id: 'method4', value: 'public boolean anchor(Location location, int depth) throws AnchorException' },
            { id: 'method5', value: 'public BoatStatus getStatus()' },
            { id: 'method6', value: 'public void setFishingEquipment(FishingEquipment equipment)' }
          ]
        },
        {
          id: 'properties',
          name: 'Properties',
          items: [
            { id: 'prop1', value: 'private int netSize' },
            { id: 'prop2', value: 'private int catchCapacity' },
            { id: 'prop3', value: 'private FishDetector fishDetector' },
            { id: 'prop4', value: 'private List<NetType> availableNets' },
            { id: 'prop5', value: 'private FishStorage fishStorage' }
          ]
        }
      ]
    },
    { 
      id: 'doc4', 
      name: 'BoatFactory', 
      type: 'component',
      path: 'BoatFactory.java',
      description: 'Factory for creating boat instances',
      sections: [
        {
          id: 'methods',
          name: 'Methods',
          items: [
            { id: 'method1', value: 'public static RowingBoat createRowingBoat(BoatConfiguration config)' },
            { id: 'method2', value: 'public static RowingBoat createSpecializedBoat(BoatType type, BoatConfiguration config)' },
            { id: 'method3', value: 'public static SpeedBoat createSpeedBoat(int maxSpeed, EngineType engineType)' },
            { id: 'method4', value: 'public static FishingBoat createFishingBoat(int netSize, int catchCapacity, List<NetType> availableNets)' }
          ]
        },
        {
          id: 'static',
          name: 'Static',
          items: [
            { id: 'static1', value: 'private static final BoatRegistry registry = new BoatRegistry()' },
            { id: 'static2', value: 'private static final ConfigurationValidator validator = new ConfigurationValidator()' }
          ]
        }
      ]
    },
    { 
      id: 'doc5', 
      name: 'BoatRepository', 
      type: 'model',
      path: 'BoatRepository.java',
      description: 'Data access for boat entities',
      sections: [
        {
          id: 'methods',
          name: 'Methods',
          items: [
            { id: 'method1', value: 'public List<Boat> findAll()' },
            { id: 'method2', value: 'public Boat findById(long id)' },
            { id: 'method3', value: 'public void save(Boat boat)' },
            { id: 'method4', value: 'public void delete(long id)' },
            { id: 'method5', value: 'public List<Boat> findByType(BoatType type)' },
            { id: 'method6', value: 'public List<Boat> findByCapacityGreaterThan(int minCapacity)' },
            { id: 'method7', value: 'public List<Boat> findByManufacturerAndModel(String manufacturer, String model)' }
          ]
        },
        {
          id: 'dependencies',
          name: 'Dependencies',
          items: [
            { id: 'dep1', value: 'private final BoatDatabase database' },
            { id: 'dep2', value: 'private final BoatMapper mapper' },
            { id: 'dep3', value: 'private final BoatValidator validator' }
          ]
        }
      ]
    }
  ],
  edges: [
    { id: 'edge1', source: 'doc1', target: 'doc2', label: 'implements' },
    { id: 'edge2', source: 'doc1', target: 'doc3', label: 'implements' },
    { id: 'edge3', source: 'doc4', target: 'doc1', label: 'creates' },
    { id: 'edge4', source: 'doc4', target: 'doc2', label: 'creates' },
    { id: 'edge5', source: 'doc4', target: 'doc3', label: 'creates' },
    { id: 'edge6', source: 'doc5', target: 'doc2', label: 'stores' },
    { id: 'edge7', source: 'doc5', target: 'doc3', label: 'stores' },
  ]
};

export function DocumentNodeDemo() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [layout, setLayout] = useState<LayoutType>('circular');
  
  const layouts: LayoutType[] = ['force', 'circular', 'tree', 'grid', 'spiral', 'radial'];
  
  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'system-ui, sans-serif',
      backgroundColor: theme === 'dark' ? '#0f172a' : '#f8fafc',
      minHeight: '100vh',
      color: theme === 'dark' ? '#f8fafc' : '#1e293b'
    }}>
      <h2>Document-Style Node Demo</h2>
      
      <div style={{ margin: '1rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ padding: '0.5rem 1rem' }}
        >
          Toggle Theme ({theme})
        </button>
        
        <select
          value={layout}
          onChange={(e) => setLayout(e.target.value as LayoutType)}
          style={{ padding: '0.5rem 1rem' }}
        >
          {layouts.map(l => (
            <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
          ))}
        </select>
      </div>
      
      <div style={{ marginTop: '2rem', border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', width: '100%' }}>
        <Graph 
          data={sampleDocumentData}
          height={600}
          autoLayout={layout}
          theme={theme}
          onNodeClick={(nodeId) => console.log('Node clicked:', nodeId)}
          nodeStyleConfig={{ 
            type: 'document',
            typeStyles: {
              interface: { 
                header: theme === 'dark' ? '#3b4252' : '#e0e7ff',
                border: '#6366f1'
              },
              class: { 
                header: theme === 'dark' ? '#2d3748' : '#dcfce7',
                border: '#22c55e' 
              },
              component: { 
                header: theme === 'dark' ? '#1e40af' : '#dbeafe',
                border: '#3b82f6' 
              },
              model: { 
                header: theme === 'dark' ? '#4c1d95' : '#ede9fe',
                border: '#8b5cf6' 
              }
            }
          }}
          interactionOptions={{ 
            draggingEnabled: true,
            zoomEnabled: true,
            panningEnabled: true,
            fitViewOnInit: true
          }}
        />
      </div>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Features</h3>
        <ul>
          <li>Collapsible sections - click on section headers to expand/collapse</li>
          <li>Scrollable content - handles long method signatures or large number of items</li>
          <li>Clean UI - hidden scrollbars maintain a clean look while allowing scrolling</li>
          <li>Non-interfering scrolling - content scrolls without triggering canvas zoom</li>
          <li>Color-coded by type - different node types have distinct visual styles</li>
          <li>Interactive - can drag nodes, click for details, and right-click for context menu</li>
        </ul>
        
        <h3>Node Types with Colors</h3>
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexWrap: 'wrap',
          marginBottom: '1rem' 
        }}>
          <div style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            backgroundColor: theme === 'dark' ? '#3b4252' : '#e0e7ff',
            border: '2px solid #6366f1',
            color: theme === 'dark' ? '#e2e8f0' : '#4338ca'
          }}>
            Interface
          </div>
          
          <div style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            backgroundColor: theme === 'dark' ? '#2d3748' : '#dcfce7',
            border: '2px solid #22c55e',
            color: theme === 'dark' ? '#e2e8f0' : '#15803d'
          }}>
            Class
          </div>
          
          <div style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            backgroundColor: theme === 'dark' ? '#1e40af' : '#dbeafe',
            border: '2px solid #3b82f6',
            color: theme === 'dark' ? '#e2e8f0' : '#1e40af'
          }}>
            Component
          </div>
          
          <div style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '4px', 
            backgroundColor: theme === 'dark' ? '#4c1d95' : '#ede9fe',
            border: '2px solid #8b5cf6',
            color: theme === 'dark' ? '#e2e8f0' : '#6d28d9'
          }}>
            Model
          </div>
        </div>
        
        <h3>Sample Data Structure</h3>
        <pre style={{ 
          backgroundColor: theme === 'dark' ? '#1e293b' : '#f1f5f9',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto'
        }}>
          {JSON.stringify({
            id: 'doc1', 
            name: 'RowingBoat', 
            type: 'interface',
            path: 'RowingBoat.java',
            sections: [
              {
                id: 'methods',
                name: 'Methods',
                items: [{ id: 'method1', value: 'public abstract void row(int speed, Direction direction) throws MotionException' }]
              },
              {
                id: 'imports',
                name: 'Imports',
                items: [{ id: 'import1', value: 'java.lang' }]
              }
            ]
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
} 