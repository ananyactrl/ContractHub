import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { mockContracts } from '../mockData'
import { Card } from '../shared/ui/Card'
import { Input } from '../shared/ui/Input'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

// ✅ Updated interface to include fileSize
interface Document {
  doc_id: number
  filename: string
  uploaded_on: string
  expiry_date?: string | null
  status: string
  risk_score: string
  category: string
  fileSize?: string   // <-- added here
}

export default function Dashboard() {
  const [docs, setDocs] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [risk, setRisk] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        setDocs(mockContracts)
      } catch (err: any) {
        setError('Failed to load contracts')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const filtered = useMemo(() => {
    return docs.filter(d => (
      (!search || d.filename.toLowerCase().includes(search.toLowerCase())) &&
      (!status || d.status === status) &&
      (!risk || d.risk_score === risk)
    ))
  }, [docs, search, status, risk])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const pageItems = filtered.slice((page-1)*pageSize, page*pageSize)

  // Statistics
  const stats = useMemo(() => {
    const total = docs.length
    const active = docs.filter(d => d.status === 'Active').length
    const renewalDue = docs.filter(d => d.status === 'Renewal Due').length
    const expired = docs.filter(d => d.status === 'Expired').length
    const highRisk = docs.filter(d => d.risk_score === 'High').length
    
    return { total, active, renewalDue, expired, highRisk }
  }, [docs])

  // Derived for charts (must be declared before any conditional returns)
  const statusData = useMemo(() => {
    const groups: Record<string, number> = {}
    docs.forEach(d => { groups[d.status] = (groups[d.status] || 0) + 1 })
    return Object.entries(groups).map(([name, value]) => ({ name, value }))
  }, [docs])

  const riskData = useMemo(() => {
    const groups: Record<string, number> = { Low: 0, Medium: 0, High: 0 }
    docs.forEach(d => { groups[d.risk_score] = (groups[d.risk_score] || 0) + 1 })
    return Object.entries(groups).map(([name, value]) => ({ name, value }))
  }, [docs])

  const COLORS = ['#22c55e', '#60a5fa', '#a78bfa', '#fdba74', '#fca5a5', '#10b981']

  if (loading) return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-6 rounded-lg shadow-card bg-white">
            <div className="skeleton h-4 w-32 rounded mb-3"></div>
            <div className="skeleton h-8 w-20 rounded"></div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-lg shadow-card bg-white">
          <div className="skeleton h-5 w-40 rounded mb-4"></div>
          <div className="skeleton h-48 w-full rounded"></div>
        </div>
        <div className="p-6 rounded-lg shadow-card bg-white lg:col-span-2">
          <div className="skeleton h-5 w-40 rounded mb-4"></div>
          <div className="skeleton h-48 w-full rounded"></div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-card border border-gray-200">
        <div className="skeleton h-10 w-full"></div>
        <div className="p-6 grid grid-cols-1 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-10 w-full rounded"></div>
          ))}
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        {error}
      </div>
    </div>
  )
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <h1 className="text-h1 text-textPrimary">Dashboard</h1>

      {/* 3x2 Pastel Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[ 
          { label: 'Total Contracts', value: 5, bg: '#D1FAE5', link: '/app/dashboard' },
          { label: 'Active', value: 2, bg: '#DBEAFE', link: '/app/dashboard' },
          { label: 'Renewal Due', value: 2, bg: '#E9D5FF', link: '/app/dashboard' },
          { label: 'Expired', value: 1, bg: '#FFEDD5', link: '/app/dashboard' },
          { label: 'High Risk', value: 1, bg: '#FECACA', link: '/app/dashboard' },
          { label: 'Revenue', value: '$2.4M', bg: '#D1FAE5', link: '/app/dashboard' },
        ].map((c) => (
          <div key={c.label} className="rounded-[16px] p-6 shadow-card border border-gray-200" style={{ backgroundColor: c.bg, minHeight: 120 }}>
            <div className="text-caption text-textSecondary">{c.label}</div>
            <div className="text-[3rem] leading-none font-bold text-textPrimary mt-2">{c.value}</div>
            <div className="text-caption text-blue-600 text-right mt-3"><Link to={c.link}>View All →</Link></div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-card border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <Input placeholder="Search contracts..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Renewal Due">Renewal Due</option>
            <option value="Expired">Expired</option>
          </select>

          <select 
            value={risk} 
            onChange={(e) => setRisk(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Risk Levels</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Recent Activity + Assets by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 rounded-[16px] lg:col-span-2">
          <div className="text-h3 text-textPrimary mb-4">Recent Activity</div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageItems.slice(0,6).map((d,i) => (
                  <tr key={d.doc_id} className={i%2? 'bg-gray-50/50' : ''}>
                    <td className="px-4 py-3 text-sm text-gray-700">{new Date(d.uploaded_on).toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">Admin User</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{['Uploaded','Reviewed','Approved'][i%3]}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{d.filename}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{d.category || 'General'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right"><button className="btn-secondary">View All</button></div>
        </Card>
        <Card className="p-6 rounded-[16px]">
          <div className="text-h3 text-textPrimary mb-4">Contracts by Status</div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {statusData.map((s, i) => (
              <div key={s.name} className="text-sm text-textSecondary">
                <div className="flex items-center justify-between mb-1"><span>{s.name}</span><span>{s.value}</span></div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div className="h-2 rounded-full" style={{ width: `${Math.min(100, s.value)}%`, backgroundColor: COLORS[i % COLORS.length] }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Asset Categories Table */}
      {!pageItems.length ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No contracts found</h3>
          <p className="mt-2 text-gray-500">Get started by uploading your first contract.</p>
          <Link to="/app/upload" className="btn-primary mt-4">
            Upload Contract
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-card border border-gray-200 overflow-hidden">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Name</th>
                <th>#</th>
                <th>Assigned</th>
                <th>Customers</th>
              </tr>
            </thead>
            <tbody>
              {['Service Agreements','Employment','Vendor','NDAs'].map((name, idx) => (
                <tr key={name} className="hover:bg-gray-50">
                  <td className="text-sm text-gray-900">{name}</td>
                  <td className="text-sm text-gray-900">{Math.round(Math.random()*10)+1}</td>
                  <td className="text-sm text-gray-900">{Math.round(Math.random()*10)}</td>
                  <td className="text-sm text-gray-900">{Math.round(Math.random()*10)+5}</td>
                </tr>
              ))}
            </tbody>
          </table>


          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button 
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button 
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button 
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
