import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { type Contract } from '../../services/api';

interface RiskDistributionChartProps {
  contracts: Contract[];
}

const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ contracts }) => {
  const data = React.useMemo(() => {
    const riskCounts = contracts.reduce((acc, contract) => {
      acc[contract.risk] = (acc[contract.risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: 'Low Risk', value: riskCounts.Low || 0, color: '#34d399' },
      { name: 'Medium Risk', value: riskCounts.Medium || 0, color: '#fbbf24' },
      { name: 'High Risk', value: riskCounts.High || 0, color: '#f87171' },
    ];
  }, [contracts]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} contracts`, 'Count']}
            labelStyle={{ color: '#374151' }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry) => (
              <span style={{ color: '#374151' }}>
                {value} ({entry.payload?.value || 0})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskDistributionChart;
