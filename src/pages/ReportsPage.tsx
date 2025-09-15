import React from 'react';
import { FileBarChart, Download, Calendar, Filter } from 'lucide-react';
import ReportCard from '../components/ReportCard';
import QuickActions from '../components/QuickActions';

const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-strong">Reports</h1>
        <p className="text-text-muted mt-1">Generate and download contract reports</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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
              { id: 'summary', label: 'Generate Summary', onClick: () => {} },
              { id: 'risk', label: 'Run Risk Audit', onClick: () => {} },
              { id: 'expiry', label: 'Schedule Expiry Report', onClick: () => {} },
              { id: 'custom', label: 'Create Custom Template', onClick: () => {} },
            ]}
            title="Report Shortcuts"
          />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
