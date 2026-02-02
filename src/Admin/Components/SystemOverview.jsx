import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Candidates', value: 10, fill: '#FF8A9B' }, // Pink
  { name: 'HRs', value: 20, fill: '#6B71FF' },        // Blue/Purple
  { name: 'JDs', value: 30, fill: '#D9E87D' },        // Lime
  { name: 'Offers', value: 20, fill: '#E589F5' },     // Lavender
  { name: 'RMG', value: 20, fill: '#5BC0DE' },        // Sky Blue
];

const SystemOverview = () => {
  return (
    <div style={{ 
      width: '420px', 
      height: '430px', 
      background: '#fff', 
      padding: '24px', 
      borderRadius: '20px',
      fontFamily: 'sans-serif',
      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
    }}>
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#1A1A4B', fontSize: '24px', margin: 0 }}>System Overview</h2>
        <select style={{ border: '1px solid #EEE', borderRadius: '15px', padding: '5px 15px', color: '#666' }}>
          <option>Yearly</option>
        </select>
      </div>

      {/* Chart Section */}
      <div style={{ width: '100%', height: '230px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="20%" 
            outerRadius="100%" 
            barSize={12} 
            data={data}
            startAngle={90} 
            endAngle={450}
          >
            <RadialBar
              minAngle={15}
              background={{ fill: '#F5F8FF' }}
              clockWise
              dataKey="value"
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '15px', 
        marginTop: '30px' 
      }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
            <div style={{ 
              width: '35px', 
              height: '10px', 
              backgroundColor: item.fill, 
              borderRadius: '5px', 
              marginRight: '8px' 
            }} />
            <span style={{ color: '#444' }}>{item.name} <strong>{item.value}%</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemOverview;