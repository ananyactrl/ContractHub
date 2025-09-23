import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { mockContracts, mockRecentActivity } from '../mockData'
import { ResponsiveContainer, LineChart, Line, Area, AreaChart, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

// Enhanced Icon Components
const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

const TrendUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
)

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
)

const BrainIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
)

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const ZapIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
)

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

interface Document {
  doc_id: number
  filename: string
  parties: string
  uploaded_on: string
  expiry_date?: string | null
  status: string
  risk_score: string
  category: string
  value: string
}

export default function Dashboard() {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 500))
        setDocs(mockContracts)
      } catch (err: any) {
        setError('Failed to load contracts')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const stats = useMemo(() => {
    const total = docs.length
    const active = docs.filter(d => d.status === 'Active').length
    const renewalDue = docs.filter(d => d.status === 'Renewal Due').length
    const expired = docs.filter(d => d.status === 'Expired').length
    const highRisk = docs.filter(d => d.risk_score === 'High').length
    
    return { total, active, renewalDue, expired, highRisk }
  }, [docs])

  const performanceData = useMemo(() => {
    const byMonth: Record<string, number> = {}
    const formatter = new Intl.DateTimeFormat('en-US', { month: 'short' })
    docs.forEach(d => {
      const dt = new Date(d.uploaded_on)
      const key = `${formatter.format(dt)}`
      byMonth[key] = (byMonth[key] || 0) + 1
    })
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return months.map(m => ({ m, v: byMonth[m] || 0 }))
  }, [docs])

  // Simple calendar opener component for the Key Dates card
  function CalendarOpener() {
    const handleOpen = () => {
      // For now, navigate to the browser's print-friendly calendar: open a simple date input dialog
      const anchor = document.createElement('input')
      anchor.type = 'date'
      anchor.style.position = 'fixed'
      anchor.style.opacity = '0'
      document.body.appendChild(anchor)
      anchor.showPicker?.()
      setTimeout(() => anchor.remove(), 500)
    }
    return (
      <button onClick={handleOpen} className="mt-4 w-full px-3 py-2 rounded-lg border text-sm bg-white hover:bg-gray-50">
        Open Calendar
      </button>
    )
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
    </div>
  )

  if (error) return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#E9E2FF]">
      <div className="px-6 pt-6">
        {/* Main rounded container like reference UI */}
        <div className="bg-white rounded-[24px] shadow-lg ring-1 ring-black/5 p-6 md:p-8 space-y-8">
          {/* Welcome header */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">Welcome back!</h1>
              <p className="text-gray-500 mt-1">It is the best time to manage your contracts</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <input onChange={(e)=>setSearch(e.target.value)} value={search} placeholder="Search contracts, vendors, clauses..." className="w-full md:w-72 h-10 pl-10 pr-3 rounded-full border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200" />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
              </div>
              <button className="px-4 h-10 rounded-full bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 whitespace-nowrap">This month</button>
              <Link to="/app/upload" className="px-4 h-10 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700 whitespace-nowrap">Add new widget</Link>
            </div>
          </div>

          {/* Overview + Quick Tips row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Active Overview card */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
      <div className="flex items-center justify-between">
        <div>
                  <div className="text-sm text-gray-500">Active Balance</div>
                  <div className="text-3xl font-semibold text-gray-900 mt-1">₹ 3,98,400.00</div>
                </div>
                <div className="flex items-center gap-2">
                  {['Send','Request','Top up'].map((a)=> (
                    <button key={a} className="px-3 py-2 rounded-lg border text-sm bg-white hover:bg-gray-50">{a}</button>
                  ))}
                </div>
              </div>
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Processing limit</span>
                  <span>1230 / 2500</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '49%' }}></div>
                </div>
        </div>
      </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-200 flex flex-col justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Quick Tips</div>
                <div className="font-semibold text-gray-900 mb-2">Manage Contracts More Easily</div>
                <p className="text-sm text-gray-600">Use bulk actions to renew, export, or tag contracts faster.</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">View Tips</button>
                <div className="w-10 h-10 rounded-full bg-violet-100" />
              </div>
            </div>
          </div>

        {/* Compact quick stats row (contract-centric) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[ 
            { label:'Active', value: stats.active, color:'bg-emerald-50 text-emerald-700' },
            { label:'Renewal Due', value: stats.renewalDue, color:'bg-amber-50 text-amber-700' },
            { label:'Expired', value: stats.expired, color:'bg-rose-50 text-rose-700' },
            { label:'High Risk', value: stats.highRisk, color:'bg-purple-50 text-purple-700' }
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-3 text-sm shadow-sm ring-1 ring-gray-200 ${s.color}`}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{s.label}</span>
                <span className="text-gray-500">today</span>
              </div>
              <div className="text-xl font-semibold mt-1">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Activity + Key dates */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-xs text-blue-600 hover:text-blue-700">View all</button>
            </div>
            <div className="divide-y divide-gray-100">
              {mockRecentActivity.slice(0,6).map((a,idx)=> (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-semibold">
                      {a.user.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div className="truncate">
                      <div className="text-sm text-gray-900 truncate"><span className="font-medium">{a.user}</span> {a.action.toLowerCase()} <span className="font-medium">{a.item}</span></div>
                      <div className="text-xs text-gray-500">{a.date} • {a.category}</div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{Math.floor(2+idx)}m ago</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Upcoming Key Dates</h3>
              <span className="text-xs text-gray-500">30 days</span>
            </div>
            <ul className="space-y-3 text-sm">
              {docs.filter(d=>d.status==='Renewal Due' || d.status==='Active').slice(0,5).map((d)=> (
                <li key={d.doc_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="font-medium text-gray-900 truncate max-w-[180px]">{d.filename}</span>
                  </div>
                  <span className="text-gray-600">{d.expiry_date ? new Date(d.expiry_date).toLocaleDateString() : 'Soon'}</span>
                </li>
              ))}
            </ul>
            <CalendarOpener />
          </div>
        </div>

        {/* Top metrics row like small cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-gray-500">Total contracts</div>
                <div className="text-2xl font-semibold text-gray-900 mt-1">{stats.total}</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendUpIcon />
              </div>
            </div>
            <div className="text-xs text-emerald-600 mt-2">+12% vs last month</div>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-gray-500">Total value</div>
                <div className="text-2xl font-semibold text-gray-900 mt-1">$2.4M</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                $
              </div>
            </div>
            <div className="text-xs text-emerald-600 mt-2">+8.2% vs last month</div>
        </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-gray-500">Active</div>
                <div className="text-2xl font-semibold text-gray-900 mt-1">{stats.active}</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-green-600 rounded-full"></div>
              </div>
          </div>
        </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase text-gray-500">Renewal due</div>
                <div className="text-2xl font-semibold text-gray-900 mt-1">{stats.renewalDue}</div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <CalendarIcon />
              </div>
          </div>
        </div>
      </div>

        {/* Primary grid like reference: chart + budget donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Money flow</h3>
              <div className="text-xs text-gray-500">This year</div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mfFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#EEF2FF" vertical={false} />
                  <XAxis dataKey="m" tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ stroke: '#CBD5E1', strokeDasharray: '3 3' }} />
                  <Area type="monotone" dataKey="v" stroke="#7C3AED" fill="url(#mfFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Budget</h3>
            <div className="flex items-center justify-center">
              <div className="relative w-40 h-40">
                <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="35" stroke="#E5E7EB" strokeWidth="10" fill="none" />
                  <circle cx="50" cy="50" r="35" stroke="#7C3AED" strokeWidth="10" fill="none" strokeDasharray={`70 220`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xl font-semibold text-gray-900">$5,950</div>
                    <div className="text-xs text-gray-500">of $8,400</div>
                  </div>
                </div>
        </div>
      </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-violet-500 rounded-full"></span> Entertainment</li>
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span> Investments</li>
              <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span> Health & Groceries</li>
            </ul>
          </div>
        </div>

        {/* Recent transactions table like reference */}
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Recent contracts</h3>
            <div className="text-xs text-gray-500">See all</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
            <thead>
                <tr className="text-left text-gray-500">
                  <th className="pb-3 font-medium">Contract</th>
                  <th className="pb-3 font-medium">Parties</th>
                  <th className="pb-3 font-medium">Value</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Expiry</th>
                  <th className="pb-3 font-medium">Risk</th>
              </tr>
            </thead>
              <tbody className="divide-y divide-gray-100">
                {docs.filter(d => {
                  const q = search.trim().toLowerCase()
                  if (!q) return true
                  return (
                    d.filename.toLowerCase().includes(q) ||
                    d.parties.toLowerCase().includes(q) ||
                    (d.value || '').toLowerCase().includes(q) ||
                    d.status.toLowerCase().includes(q) ||
                    d.risk_score.toLowerCase().includes(q)
                  )
                }).slice(0, 5).map((doc) => (
                  <tr key={doc.doc_id} className="hover:bg-gray-50/60">
                    <td className="py-3">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center mr-3">
                          <DocumentIcon />
                      </div>
                        <span className="font-medium text-gray-900">{doc.filename}</span>
                    </div>
                  </td>
                    <td className="py-3 text-gray-600">{doc.parties}</td>
                    <td className="py-3 font-medium text-gray-900">{doc.value}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'Active' ? 'bg-green-100 text-green-700' :
                        doc.status === 'Renewal Due' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {doc.status}
                    </span>
                  </td>
                    <td className="py-3 text-gray-600">
                      {doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        doc.risk_score === 'Low' ? 'bg-green-50 text-green-700 border border-green-200' :
                        doc.risk_score === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {doc.risk_score}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        </div>

        {/* Interactive Product Demo Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">See ReLexWise in Action</h2>
            <p className="text-lg text-gray-600">Experience the power of AI-driven contract intelligence</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Live Upload Simulation */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Upload & Process</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DocumentIcon />
                </div>
                <p className="text-gray-600 mb-4">Drag & drop multiple contracts or browse files</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Choose Files
                </button>
              </div>
              
              {/* Processing Steps */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <CheckCircleIcon />
                  <span className="text-green-800 font-medium">Contract uploaded successfully</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-blue-800 font-medium">AI extracting key terms...</span>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                  <span className="text-gray-600">Generating insights and recommendations</span>
                </div>
              </div>
            </div>
            
            {/* Real-time Analytics */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Live Analytics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="demoFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1d4ed8" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="m" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ stroke: '#94A3B8', strokeDasharray: '3 3' }} />
                    <Area type="monotone" dataKey="v" stroke="#1d4ed8" fill="url(#demoFill)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* ROI Calculator */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4">ROI Calculator</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current contracts:</span>
                    <span className="font-medium">124</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time saved per month:</span>
                    <span className="font-medium text-green-600">40+ hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Identified savings:</span>
                    <span className="font-medium text-green-600">$180K</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Potential ROI:</span>
                      <span className="text-green-600">340%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Pilot Program */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-lg text-gray-600">Start with our free trial or book a 30-day pilot program</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">$0</div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon />
                  <span className="ml-2">50 contracts/month</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon />
                  <span className="ml-2">Basic extraction</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon />
                  <span className="ml-2">Self-serve support</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                Start Free Trial
              </button>
            </div>
            
            {/* Professional Tier */}
            <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">$299</div>
                <div className="text-sm text-gray-600">per month</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon />
                  <span className="ml-2">1,000 contracts/month</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon />
                  <span className="ml-2">Advanced analytics</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon />
                  <span className="ml-2">Email alerts</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon />
                  <span className="ml-2">Priority support</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Book Pilot
              </button>
            </div>
            
            {/* Enterprise Tier */}
            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">Custom</div>
                <div className="text-sm text-gray-600">pricing</div>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon />
                  <span className="ml-2">Unlimited contracts</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon />
                  <span className="ml-2">API access</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon />
                  <span className="ml-2">Custom integrations</span>
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon />
                  <span className="ml-2">Dedicated support</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
          
          {/* 30-Day Pilot Program */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-indigo-200">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">30-Day Pilot Program</h3>
              <p className="text-lg text-gray-600 mb-6">
                Process 100 contracts → Deliver 3 ROI findings → Refundable upon conversion
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  Start Pilot Program
                </button>
                <button className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors">
                  Schedule Demo
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="text-center text-sm text-gray-500 py-8">© 2025 ContractHub. All rights reserved.</div>
      </div>
    </div>
  )
}
