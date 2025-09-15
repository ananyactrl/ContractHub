import React from 'react';
import { FileBarChart, Calendar, Filter } from 'lucide-react';
import ReportCard from '../components/ReportCard';
import QuickActions from '../components/QuickActions';
import { useState } from 'react';

const ReportsPage: React.FC = () => {
  const [banner, setBanner] = React.useState<string | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-strong">Reports</h1>
        <p className="text-text-muted mt-1">Generate and download contract reports</p>
      </div>

      {banner && (
        <div className="rounded-lg border border-border bg-brand-100 text-brand-600 px-3 sm:px-4 py-3">
          {banner}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ReportCard title="Contract Summary Report" schedule="Weekly" nextRunAt="Today 9:00 AM" />
          <ReportCard title="Risk Analysis Report" schedule="Weekly" nextRunAt="Today 9:05 AM" />
          <ReportCard title="Expiry Report" schedule="Daily" nextRunAt="Tomorrow 7:00 AM" />
          <div className="bg-surface rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-strong">Custom Report</h2>
              <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Configure</span>
              </button>
            </div>
            <p className="text-sm text-text-muted">Create custom reports with specific filters and data points.</p>
            <div className="flex items-center gap-4 text-sm text-text-muted mt-4">
              <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Not generated</div>
              <div className="flex items-center gap-1"><FileBarChart className="h-4 w-4" /> Multiple formats</div>
            </div>
          </div>
        </div>
        <div>
          <QuickActions
            actions={[
              { id: 'summary', label: 'Generate Summary', onClick: () => setBanner('Summary report queued. You will be notified when it is ready.') },
              { id: 'risk', label: 'Run Risk Audit', onClick: () => setBanner('Risk audit started across all active contracts.') },
              { id: 'expiry', label: 'Schedule Expiry Report', onClick: () => setShowSchedule(true) },
              { id: 'custom', label: 'Create Custom Template', onClick: () => setBanner('Opened template editor (coming soon).') },
            ]}
            title="Report Shortcuts"
          />
        </div>
      </div>

      {showSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowSchedule(false)} />
          <div className="relative bg-surface border border-border rounded-xl shadow-card w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-text-strong mb-3">Schedule Expiry Report</h3>
            <p className="text-sm text-text-muted mb-4">Choose how often to run the Expiry Report and we’ll email you a link.</p>
            <div className="space-y-3">
              <button className="w-full px-3 py-2 rounded-lg border border-border hover:bg-gray-50" onClick={() => { setBanner('Expiry report scheduled: Daily 7:00 AM'); setShowSchedule(false); }}>Daily at 7:00 AM</button>
              <button className="w-full px-3 py-2 rounded-lg border border-border hover:bg-gray-50" onClick={() => { setBanner('Expiry report scheduled: Weekly Monday 9:00 AM'); setShowSchedule(false); }}>Weekly Monday 9:00 AM</button>
            </div>
            <button className="mt-4 text-text-muted hover:text-text-strong" onClick={() => setShowSchedule(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
