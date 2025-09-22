import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

const primary = '#6366F1'
const accentPurple = '#8B5CF6'
const teal = '#06B6D4'
const green = '#10B981'
const amber = '#F59E0B'
const red = '#F87171'
const grayGrid = '#E5E7EB'

export default function Insights() {
  // Mock datasets
  const valueTrends = [
    { m: 'Jan', v: 120 }, { m: 'Feb', v: 140 }, { m: 'Mar', v: 180 }, { m: 'Apr', v: 220 },
    { m: 'May', v: 210 }, { m: 'Jun', v: 260 }, { m: 'Jul', v: 300 }, { m: 'Aug', v: 290 },
    { m: 'Sep', v: 340 }, { m: 'Oct', v: 320 }, { m: 'Nov', v: 370 }, { m: 'Dec', v: 390 },
  ]

  const risk = [
    { name: 'Low', value: 60, color: green },
    { name: 'Medium', value: 30, color: amber },
    { name: 'High', value: 10, color: red },
  ]

  const categories = [
    { name: 'Service Agreements', value: 42 },
    { name: 'Employment', value: 28 },
    { name: 'Vendor', value: 18 },
    { name: 'NDAs', value: 12 },
  ]

  const renewals = Array.from({ length: 12 }).map((_, i) => ({
    m: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    v: Math.round(10 + Math.sin(i / 2) * 6 + i)
  }))

  return (
    <div className="space-y-12">
      <section>
        <h1 className="text-h1 text-textPrimary">Contract Insights</h1>
        <p className="text-bodyLg text-textSecondary mt-2">Analytics and performance metrics</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Contract Value', value: '$2.4M', gradient: 'bg-gradient-to-r from-blue-400 to-purple-500' },
          { label: 'Average Duration', value: '18 months', gradient: 'bg-gradient-to-r from-green-400 to-emerald-500' },
          { label: 'Compliance Score', value: '94%', gradient: 'bg-gradient-to-r from-teal-400 to-cyan-500' },
          { label: 'Savings Identified', value: '$180K', gradient: 'bg-gradient-to-r from-yellow-400 to-orange-500' },
        ].map(m => (
          <div key={m.label} className={`p-6 rounded-lg text-white shadow-card ${m.gradient}`}>
            <div className="text-caption opacity-90">{m.label}</div>
            <div className="text-h1">{m.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="text-h3 text-textPrimary mb-4">Contract Value Trends</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedValueChart data={valueTrends} />
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="text-h3 text-textPrimary mb-4">Risk Distribution</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={risk} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={2}>
                  {risk.map((r, i) => (<Cell key={i} fill={r.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="text-h3 text-textPrimary mb-4">Contract Categories</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categories} layout="vertical" margin={{ left: 32 }}>
                <CartesianGrid stroke={grayGrid} vertical={false} />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={140} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[8,8,8,8]} fill={primary} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="text-h3 text-textPrimary mb-4">Renewal Timeline</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={renewals}>
                <defs>
                  <linearGradient id="renewalFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={primary} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={primary} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={grayGrid} vertical={false} />
                <XAxis dataKey="m" tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <Tooltip />
                <Area dataKey="v" type="monotone" stroke={primary} fill="url(#renewalFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="text-h3 text-textPrimary mb-4">Key Insights</div>
        <ul className="space-y-3 text-body text-textSecondary">
          <li>• High renewal likelihood detected for 12 contracts in next 60 days.</li>
          <li>• Vendor ABC shows improved compliance trend over last quarter.</li>
          <li>• Consider renegotiation for 3 expiring contracts with high costs.</li>
        </ul>
      </div>

      <div className="card">
        <div className="text-h3 text-textPrimary mb-4">Filters</div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input className="search-input" placeholder="Date Range" />
          <input className="search-input" placeholder="Category" />
          <input className="search-input" placeholder="Risk Level" />
          <input className="search-input" placeholder="Vendor" />
        </div>
      </div>
    </div>
  )
}

function ComposedValueChart({ data }: { data: Array<{ m: string; v: number }> }) {
  return (
    <LineChart data={data}>
      <defs>
        <linearGradient id="valueFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentPurple} stopOpacity={0.35} />
          <stop offset="100%" stopColor={accentPurple} stopOpacity={0.05} />
        </linearGradient>
      </defs>
      <CartesianGrid stroke={grayGrid} vertical={false} />
      <XAxis dataKey="m" tick={{ fill: '#64748B', fontSize: 12 }} />
      <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 12 }} />
      <Tooltip />
      <Area type="monotone" dataKey="v" fill="url(#valueFill)" stroke="transparent" />
      <Line type="monotone" dataKey="v" stroke={accentPurple} strokeWidth={2} dot={{ r: 3, stroke: '#fff', strokeWidth: 1 }} />
    </LineChart>
  )
}


