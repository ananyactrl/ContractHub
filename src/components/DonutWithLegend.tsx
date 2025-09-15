import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export type DonutSlice = { id: string; label: string; value: number; color?: string };

export type DonutWithLegendProps = {
  title?: string;
  data: DonutSlice[];
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
};

const DonutWithLegend: React.FC<DonutWithLegendProps> = ({ title, data, selectedIds = [], onSelectionChange }) => {
  const toggle = (id: string) => {
    if (!onSelectionChange) return;
    const isSelected = selectedIds.includes(id);
    const next = isSelected ? selectedIds.filter(s => s !== id) : [...selectedIds, id];
    onSelectionChange(next);
  };

  return (
    <section className="bg-surface rounded-xl shadow-card hover:shadow-card-hover transition-shadow p-4 border border-border" aria-label={title || 'Donut chart'}>
      {title && <h3 className="text-sm font-semibold text-text-strong mb-3">{title}</h3>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="label" innerRadius={60} outerRadius={90}>
                {data.map((entry) => (
                  <Cell
                    key={entry.id}
                    fill={entry.color || '#6E56CF'}
                    fillOpacity={selectedIds.includes(entry.id) ? 1 : 0.35}
                    onClick={() => toggle(entry.id)}
                    role="option"
                    aria-selected={selectedIds.includes(entry.id)}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggle(entry.id);
                      }
                    }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="space-y-2">
          {data.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border ${selectedIds.includes(d.id) ? 'bg-brand-100 border-brand-100' : 'bg-white border-border hover:bg-gray-50'}`}
                onClick={() => toggle(d.id)}
                aria-pressed={selectedIds.includes(d.id)}
              >
                <span className="flex items-center gap-2 text-sm text-text-strong">
                  <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: d.color || '#6E56CF' }} />
                  {d.label}
                </span>
                <span className="text-sm text-text-muted">{d.value}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default DonutWithLegend;


