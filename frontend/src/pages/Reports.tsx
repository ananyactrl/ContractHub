export default function Reports() {
  return (
    <div className="space-y-8 compact">
      {/* Header & Actions */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-h1 text-textPrimary">Reports & Analytics</h1>
          <p className="text-body text-textSecondary mt-1">Generate executive reports and track contract performance metrics</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-4 h-10 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">Create New Report</button>
          <button className="px-4 h-10 rounded-lg border text-sm bg-white hover:bg-gray-50">Schedule Report</button>
          <button className="px-4 h-10 rounded-lg border text-sm bg-white hover:bg-gray-50">Export All Data</button>
          <div className="relative">
            <input placeholder="Find reports, metrics, or insights..." className="h-10 pl-10 pr-3 rounded-lg border text-sm" />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Executive Summary Report', desc: 'High-level KPIs and metrics' },
            { title: 'Compliance Report', desc: 'Compliance status and violations' },
            { title: 'Financial Analysis', desc: 'Contract values and cost analysis' },
            { title: 'Risk Assessment', desc: 'Risk analysis and mitigation' },
            { title: 'Vendor Performance', desc: 'Vendor relationship insights' },
            { title: 'Renewal Pipeline', desc: 'Upcoming renewals and actions' },
          ].map(t => (
            <div key={t.title} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-lg font-semibold text-textPrimary truncate">{t.title}</div>
                  <div className="text-sm text-textSecondary mt-1 truncate">{t.desc}</div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs text-textSecondary">
                    <span className="px-2 py-1 rounded bg-gray-100">CSV</span>
                    <span className="px-2 py-1 rounded bg-gray-100">PDF</span>
                    <span className="px-2 py-1 rounded bg-gray-100">Filter by vendor</span>
                    <span className="px-2 py-1 rounded bg-gray-100">Save view</span>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 whitespace-nowrap">Generate Report</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Reports */}
      <section className="card">
        <div className="card-header"><div className="text-lg font-semibold text-textPrimary">Recent Reports</div></div>
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr><th>Report Name</th><th>Type</th><th>Generated Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50"><td>Quarterly Summary Q2</td><td>Executive</td><td>2025-06-30</td><td><span className="status-active">Ready</span></td><td><button className="px-3 py-1.5 rounded-lg border text-sm">Download</button></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Scheduled Reports */}
      <section className="card">
        <div className="card-header"><div className="text-h3 text-textPrimary">Scheduled Reports</div></div>
        <ul className="space-y-3 p-6 pt-0 text-body text-textSecondary">
          <li>Weekly Compliance Report – Every Monday 9:00 AM <button className="ml-2 px-3 py-1 rounded-lg border text-sm">Edit</button></li>
          <li>Monthly Executive Summary – 1st of month 8:00 AM <button className="ml-2 px-3 py-1 rounded-lg border text-sm">Edit</button></li>
        </ul>
      </section>

      {/* Custom Builder CTA */}
      <section className="card">
        <div className="card-header">
          <div>
            <div className="text-h3 text-textPrimary">Custom Report Builder</div>
            <div className="text-body text-textSecondary">Drag-and-drop interface preview</div>
          </div>
          <button className="px-4 h-10 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700">Build Custom Report</button>
        </div>
      </section>
    </div>
  )
}


