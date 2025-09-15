import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export type TimelinePoint = { date: string; new: number; active: number; expiring: number };

export type StackedAreaTimelineProps = {
  data: TimelinePoint[];
  onHoverDateChange?: (dateISO: string | null) => void;
  title?: string;
};

const StackedAreaTimeline: React.FC<StackedAreaTimelineProps> = ({ data, onHoverDateChange, title }) => {
  return (
    <section className="bg-surface rounded-xl shadow-card hover:shadow-card-hover transition-shadow p-4 border border-border" aria-label={title || 'Stacked timeline'}>
      {title && <h3 className="text-sm font-semibold text-text-strong mb-3">{title}</h3>}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} onMouseLeave={() => onHoverDateChange && onHoverDateChange(null)}>
            <defs>
              <linearGradient id="fillPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6E56CF" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#6E56CF" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#E5E7EB" vertical={false} />
            <XAxis dataKey="date" tickMargin={8} />
            <YAxis tickMargin={8} />
            <Tooltip cursor={{ stroke: '#E5E7EB' }}
              contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB' }}
              wrapperStyle={{ outline: 'none' }}
              isAnimationActive={false}
              formatter={(value: any) => [value as number, 'Count']}
              labelFormatter={(label: any) => {
                onHoverDateChange && onHoverDateChange(String(label));
                return String(label);
              }}
            />
            <Area type="monotone" dataKey="new" name="New" stackId="1" stroke="#3BA3FF" fill="rgba(59,163,255,0.25)" />
            <Area type="monotone" dataKey="active" name="Active" stackId="1" stroke="#6E56CF" fill="url(#fillPrimary)" />
            <Area type="monotone" dataKey="expiring" name="Expiring" stackId="1" stroke="#FFB020" fill="rgba(255,176,32,0.2)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default StackedAreaTimeline;


