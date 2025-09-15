import React, { useMemo, useState } from 'react';
import { BarChart3, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useContracts } from '../hooks/useContracts';
import KpiCard from '../components/KpiCard';
import DonutWithLegend, { type DonutSlice } from '../components/DonutWithLegend';
import StackedAreaTimeline, { type TimelinePoint } from '../components/StackedAreaTimeline';

const InsightsPage: React.FC = () => {
  const { contracts } = useContracts();

  const stats = useMemo(() => ({
    total: contracts.length,
    active: contracts.filter(c => c.status === 'Active').length,
    renewalDue: contracts.filter(c => c.status === 'Renewal Due').length,
    highRisk: contracts.filter(c => c.risk === 'High').length,
  }), [contracts]);

  const donutData: DonutSlice[] = useMemo(() => {
    const low = contracts.filter(c => c.risk === 'Low').length;
    const med = contracts.filter(c => c.risk === 'Medium').length;
    const high = contracts.filter(c => c.risk === 'High').length;
    return [
      { id: 'low', label: 'Low', value: low, color: '#34C759' },
      { id: 'medium', label: 'Medium', value: med, color: '#FFB020' },
      { id: 'high', label: 'High', value: high, color: '#F2555A' },
    ];
  }, [contracts]);

  const timelineData: TimelinePoint[] = useMemo(() => {
    // Simple grouping by month of expiry as a proxy timeline
    const byMonth = new Map<string, { new: number; active: number; expiring: number }>();
    contracts.forEach(c => {
      const d = new Date(c.expiry);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
      const entry = byMonth.get(key) || { new: 0, active: 0, expiring: 0 };
      entry.active += c.status === 'Active' ? 1 : 0;
      entry.expiring += c.status === 'Renewal Due' ? 1 : 0;
      entry.new += 0; // mock
      byMonth.set(key, entry);
    });
    return Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({ date, ...v }));
  }, [contracts]);

  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-strong">Insights</h1>
          <p className="text-text-muted mt-1">AI risks, recommendations, and renewal outlook</p>
        </div>
      </header>

      {/* First row: Donut left, Top Findings right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DonutWithLegend title="Risk Distribution" data={donutData} selectedIds={selected} onSelectionChange={setSelected} />
        </div>
        <div className="lg:col-span-2 bg-surface rounded-xl shadow-card border border-border p-4">
          <h3 className="text-sm font-semibold text-text-strong mb-3">Top Findings</h3>
          <ul className="divide-y divide-border">
            <li className="py-3 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-danger-500 mt-0.5" />
              <div>
                <p className="text-sm text-text-strong">Liability caps exclude data breach costs</p>
                <p className="text-xs text-text-muted">Observed in 2 high‑risk contracts</p>
              </div>
            </li>
            <li className="py-3 flex items-start gap-3">
              <Clock className="h-5 w-5 text-warning-500 mt-0.5" />
              <div>
                <p className="text-sm text-text-strong">Auto‑renewal requires 60‑day cancellation</p>
                <p className="text-xs text-text-muted">Affects renewal planning in the next quarter</p>
              </div>
            </li>
            <li className="py-3 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-success-500 mt-0.5" />
              <div>
                <p className="text-sm text-text-strong">Termination clauses standardized (90‑day notice)</p>
                <p className="text-xs text-text-muted">Consistent across most active MSAs</p>
              </div>
            </li>
          </ul>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <KpiCard label="Total" value={stats.total} />
            <KpiCard label="Active" value={stats.active} />
            <KpiCard label="Renewal Due" value={stats.renewalDue} />
          </div>
        </div>
      </div>

      {/* Full-width timeline */}
      <div>
        <StackedAreaTimeline title="Volume Over Time" data={timelineData} />
      </div>

      <div className="bg-surface rounded-xl shadow-card border border-border p-4">
        <div className="flex items-center gap-2 mb-2 text-text-muted text-sm">
          <BarChart3 className="h-4 w-4" />
          <span>Click slices or legend to filter insights. Use keyboard: arrows to move, Enter to toggle.</span>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
