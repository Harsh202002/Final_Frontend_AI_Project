import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'JAN', candidates: 50, jd: 20, offers: 0 },
  { name: 'FEB', candidates: 62, jd: 0, offers: 10 },
  { name: 'MAR', candidates: 10, jd: 25, offers: 30 },
  { name: 'APR', candidates: 60, jd: 80, offers: 25 },
  { name: 'MAY', candidates: 35, jd: 50, offers: 70 },
  { name: 'JUN', candidates: 15, jd: 60, offers: 0 },
  { name: 'JUL', candidates: 35, jd: 0, offers: 20 },
  { name: 'AUG', candidates: 5, jd: 18, offers: 28 },
  { name: 'SEP', candidates: 68, jd: 45, offers: 15 },
  { name: 'OCT', candidates: 22, jd: 40, offers: 58 },
  { name: 'NOV', candidates: 30, jd: 55, offers: 45 },
  { name: 'DEC', candidates: 65, jd: 22, offers: 50 },
];

const MonthlyTrendsChart = () => {
  return (
    <div style={{ width: '100%', height: 400, backgroundColor: '#fff', padding: '20px', borderRadius: '15px' }}>
      <h2 style={{ fontFamily: 'sans-serif', color: '#1a1a40', marginBottom: '30px' }}>Monthly Trends</h2>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCand" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff8a9a" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ff8a9a" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorJd" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8280ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#8280ff" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorOffers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#c58fff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#c58fff" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9e9e9e', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9e9e9e', fontSize: 12 }} 
          />
          <Tooltip />

          <Area
            type="monotone"
            dataKey="candidates"
            stroke="#ff8a9a"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorCand)"
            dot={{ r: 4, fill: '#fff', stroke: '#ff8a9a', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="jd"
            stroke="#8280ff"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorJd)"
            dot={{ r: 4, fill: '#fff', stroke: '#8280ff', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="offers"
            stroke="#c58fff"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorOffers)"
            dot={{ r: 4, fill: '#fff', stroke: '#c58fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyTrendsChart;