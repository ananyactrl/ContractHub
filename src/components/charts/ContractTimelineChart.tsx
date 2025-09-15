import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { type Contract } from '../../services/api';

interface ContractTimelineChartProps {
  contracts: Contract[];
}

const ContractTimelineChart: React.FC<ContractTimelineChartProps> = ({ contracts }) => {
  const data = React.useMemo(() => {
    const monthlyData: Record<string, { month: string; expiring: number; active: number }> = {};
    
    contracts.forEach(contract => {
      const date = new Date(contract.expiry);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, expiring: 0, active: 0 };
      }
      
      if (contract.status === 'Renewal Due') {
        monthlyData[monthKey].expiring++;
      } else if (contract.status === 'Active') {
        monthlyData[monthKey].active++;
      }
    });
    
    return Object.values(monthlyData).sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [contracts]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            fontSize={12}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: '#374151', fontWeight: 'bold' }}
          />
          <Bar 
            dataKey="active" 
            fill="#60a5fa" 
            name="Active Contracts"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="expiring" 
            fill="#fbbf24" 
            name="Expiring Soon"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ContractTimelineChart;
