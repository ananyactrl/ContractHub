import { useMemo, useState } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

const primary = '#1d4ed8'
const accentPurple = '#7C3AED'
const teal = '#06B6D4'
const green = '#10B981'
const amber = '#F59E0B'
const red = '#EF4444'
const grayGrid = '#E5E7EB'

export default function Insights() {
  const baseTrends = [
    { m: 'Jan', v: 120 }, { m: 'Feb', v: 140 }, { m: 'Mar', v: 180 }, { m: 'Apr', v: 220 },
    { m: 'May', v: 210 }, { m: 'Jun', v: 260 }, { m: 'Jul', v: 300 }, { m: 'Aug', v: 290 },
    { m: 'Sep', v: 340 }, { m: 'Oct', v: 320 }, { m: 'Nov', v: 370 }, { m: 'Dec', v: 390 },
  ]

  const [showForecast, setShowForecast] = useState(true)
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'qtr' | 'ytd'>('qtr')
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [presets, setPresets] = useState<string[]>(() => {
    const saved = localStorage.getItem('insights_presets')
    return saved ? JSON.parse(saved) : ['High Value Contracts','Expiring Soon','Compliance Issues']
  })
  const [newPreset, setNewPreset] = useState('')

  const valueTrends = useMemo(() => baseTrends, [])

  const forecast = useMemo(() => {
    const last = valueTrends[valueTrends.length - 1]?.v || 0
    return [
      { m: 'Jan+1', v: Math.round(last * 1.03) },
      { m: 'Feb+1', v: Math.round(last * 1.06) },
      { m: 'Mar+1', v: Math.round(last * 1.09) },
    ]
  }, [valueTrends])

  const risk = [
    { name: 'Low', value: 65, color: green },
    { name: 'Medium', value: 28, color: amber },
    { name: 'High', value: 7, color: red },
  ]

  const categories = [
    { name: 'Service Agreements', value: 42 },
    { name: 'Employment', value: 28 },
    { name: 'Vendor', value: 18 },
    { name: 'NDAs', value: 12 },
  ]

  const renewals = Array.from({ length: 12 }).map((_, i) => ({
    m: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
    v: Math.round(6 + Math.sin(i / 2) * 4 + i)
  }))

  return (
    <div className="space-y-6 compact">
      {/* Header + Toolbar */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-h1 text-textPrimary">AI Contract Intelligence</h1>
          <p className="text-bodyLg text-textSecondary mt-1">Advanced analytics, predictions, and real-time insights</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-gray-200">
            {(['7d','30d','qtr','ytd'] as const).map(r => (
              <button key={r} onClick={() => setDateRange(r)} className={`px-3 py-2 text-sm ${dateRange===r?'bg-blue-600 text-white':'bg-white text-gray-700 hover:bg-gray-50'}`}>{r.toUpperCase()}</button>
            ))}
          </div>
          <button className="px-3 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50">Export PDF</button>
          <button className="px-3 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50">Export Excel</button>
          <button className="px-3 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50">Share Link</button>
          <button onClick={() => setShowForecast(v=>!v)} className={`px-3 py-2 text-sm rounded-lg border ${showForecast?'bg-emerald-50 text-emerald-700 border-emerald-200':'bg-white hover:bg-gray-50'}`}>Show Predictions ✨</button>
          <div className="text-xs text-gray-500 ml-2">Last updated: {lastUpdated.toLocaleTimeString()}</div>
          <button onClick={() => setLastUpdated(new Date())} className="px-3 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50">Refresh</button>
        </div>
      </section>

      {/* Saved Filter Presets */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-2 text-sm">
        <span className="text-gray-600">Presets:</span>
        {presets.map((p,i) => (
          <button key={i} className="px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700">{p}</button>
        ))}
        <input value={newPreset} onChange={e=>setNewPreset(e.target.value)} placeholder="Save current as..." className="ml-auto px-3 py-1 rounded-md border text-sm" />
        <button onClick={() => { if(!newPreset) return; const next=[...presets,newPreset]; setPresets(next); localStorage.setItem('insights_presets', JSON.stringify(next)); setNewPreset('') }} className="px-3 py-1 rounded-md bg-blue-600 text-white">Save</button>
        <button onClick={() => { localStorage.setItem('insights_presets', JSON.stringify(presets)); }} className="px-3 py-1 rounded-md border">Persist</button>
      </div>

      {/* Smart metrics row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[{ label:'Portfolio Value', value:'$2.4M', delta:'+18% vs Q3', color:'text-blue-700 bg-blue-50' },
          { label:'AI Processing', value:'98.5% Automated', delta:'124 contracts today', color:'text-emerald-700 bg-emerald-50' },
          { label:'Risk Assessment', value:'Medium Risk', delta:'3 contracts need attention', color:'text-amber-700 bg-amber-50' },
          { label:'Compliance Score', value:'94% Compliant', delta:'2 violations detected', color:'text-indigo-700 bg-indigo-50' }]
          .map(m => (
          <div key={m.label} className={`p-3 rounded-xl shadow-card ${m.color}`}>
            <div className="text-[11px] leading-none opacity-90">{m.label}</div>
            <div className="text-xl font-semibold leading-tight">{m.value}</div>
            <div className="text-[11px] mt-1 opacity-80">{m.delta}</div>
          </div>
        ))}
      </div>

      {/* Main analytics grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="text-base font-semibold text-textPrimary">Contract Value Trends</div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">Compare Periods</span>
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">Seasonal</span>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[...valueTrends, ...(showForecast?forecast:[])]} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="vFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={teal} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={teal} stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={grayGrid} vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ stroke: '#94A3B8', strokeDasharray: '3 3' }} />
                  <Area type="monotone" dataKey="v" fill="url(#vFill)" stroke="transparent" />
                  <Line type="monotone" dataKey="v" stroke={teal} strokeWidth={2} dot={{ r: 2 }} />
                  {showForecast && (<Line type="monotone" dataKey="v" data={forecast} stroke={accentPurple} strokeDasharray="4 4" dot={false} />)}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="text-base font-semibold text-textPrimary mb-2">Contract Categories Analysis</div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categories} layout="vertical" margin={{ left: 32 }}>
                  <CartesianGrid stroke={grayGrid} vertical={false} />
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8,8,8,8]} fill={primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <div className="text-base font-semibold text-textPrimary mb-2">Renewal Pipeline</div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={renewals}>
                  <defs>
                    <linearGradient id="renewalFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={primary} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={primary} stopOpacity={0.06} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={grayGrid} vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: '#64748B', fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 11 }} />
                  <Tooltip />
                  <Area dataKey="v" type="monotone" stroke={primary} fill="url(#renewalFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card">
            <div className="text-base font-semibold text-textPrimary mb-2">Key Insights</div>
            <ul className="space-y-3 text-sm text-textSecondary">
              {[ 
                'High renewal likelihood detected for 12 contracts in next 60 days.',
                'Vendor ABC shows improved compliance trend over last quarter.',
                'Consider renegotiation for 5 expiring contracts with high costs.',
                'Identified savings opportunities: $180K through clause optimization.'
              ].map((t,idx)=> (
                <li key={idx} className="flex items-start justify-between gap-3">
                  <span>• {t}</span>
                  <div className="flex items-center gap-1">
                    <button title="Add comment" className="px-2 py-1 rounded-md border text-xs hover:bg-gray-50">Comment</button>
                    <button title="Bookmark" className="px-2 py-1 rounded-md border text-xs hover:bg-gray-50">★</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="text-base font-semibold text-textPrimary mb-2">Risk Distribution</div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={risk} dataKey="value" nameKey="name" innerRadius={56} outerRadius={84} paddingAngle={2}>
                    {risk.map((r, i) => (<Cell key={i} fill={r.color} />))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
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


