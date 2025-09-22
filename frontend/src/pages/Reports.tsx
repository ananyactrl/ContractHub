export default function Reports() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-h1 text-textPrimary">Reports & Analytics</h1>
        <p className="text-body text-textSecondary mt-2">Generate and schedule custom reports</p>
        <div className="mt-4"><button className="btn-primary">Create New Report</button></div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: 'Executive Summary Report', desc: 'High-level KPIs and metrics' },
            { title: 'Compliance Report', desc: 'Compliance status and violations' },
            { title: 'Financial Analysis', desc: 'Contract values and cost analysis' },
            { title: 'Risk Assessment', desc: 'Risk analysis and mitigation' },
            { title: 'Vendor Performance', desc: 'Vendor relationship insights' },
            { title: 'Renewal Pipeline', desc: 'Upcoming renewals and actions' },
          ].map(t => (
            <div key={t.title} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-lg font-semibold text-textPrimary truncate">{t.title}</div>
                  <div className="text-sm text-textSecondary mt-1 truncate">{t.desc}</div>
                </div>
                <button className="btn-secondary whitespace-nowrap px-3 py-1.5">Generate Report</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <div className="card-header"><div className="text-lg font-semibold text-textPrimary">Recent Reports</div></div>
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr><th>Report Name</th><th>Type</th><th>Generated Date</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50"><td>Quarterly Summary Q2</td><td>Executive</td><td>2025-06-30</td><td><span className="status-active">Ready</span></td><td><button className="btn-secondary">Download</button></td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <div className="card-header"><div className="text-h3 text-textPrimary">Scheduled Reports</div></div>
        <ul className="space-y-3 p-6 pt-0 text-body text-textSecondary">
          <li>Weekly Compliance Report – Every Monday 9:00 AM <button className="btn-secondary ml-2">Edit</button></li>
          <li>Monthly Executive Summary – 1st of month 8:00 AM <button className="btn-secondary ml-2">Edit</button></li>
        </ul>
      </section>

      <section className="card">
        <div className="card-header">
          <div>
            <div className="text-h3 text-textPrimary">Custom Report Builder</div>
            <div className="text-body text-textSecondary">Drag-and-drop interface preview</div>
          </div>
          <button className="btn-primary">Build Custom Report</button>
        </div>
      </section>
    </div>
  )
}


