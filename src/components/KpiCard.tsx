import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

export type KpiDatum = { x: string | number; y: number };

export type KpiCardProps = {
  label: string;
  value: string | number;
  delta?: { value: number; direction: 'up' | 'down' };
  timeseries?: KpiDatum[];
  isLoading?: boolean;
};

const KpiCard: React.FC<KpiCardProps> = ({ label, value, delta, timeseries, isLoading }) => {
  const deltaColor = delta
    ? delta.direction === 'up'
      ? 'text-success-500'
      : 'text-danger-500'
    : 'text-text-muted';

  return (
    <section
      aria-label={label}
      className="bg-surface rounded-xl shadow-card hover:shadow-card-hover transition-shadow p-4 flex flex-col gap-3 border border-border"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-sm text-text-muted">{label}</span>
          <span className="text-2xl font-semibold text-text-strong">{isLoading ? '—' : value}</span>
        </div>
        {delta && (
          <span
            aria-live="polite"
            className={`text-sm font-medium ${deltaColor}`}
          >
            {delta.direction === 'up' ? '+' : '−'}{delta.value}%
          </span>
        )}
      </div>
      <div className="h-10" aria-hidden="true">
        {timeseries && timeseries.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeseries}>
              <Line
                type="monotone"
                dataKey="y"
                stroke="#6E56CF"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full bg-gray-50 rounded" />
        )}
      </div>
    </section>
  );
};

export default KpiCard;


