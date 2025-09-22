import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { mockContracts, mockRecentActivity } from '../mockData'
import { ResponsiveContainer, LineChart, Line, Area, AreaChart, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Contract Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your business contracts efficiently</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50">
              <CalendarIcon />
              <span className="ml-2">This Week</span>
            </button>
            <Link 
              to="/app/upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
            >
              Upload Contract
            </Link>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Total Contracts</div>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <DocumentIcon />
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm text-green-600">
              <TrendUpIcon />
              <span className="ml-1">+12%</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">$2.4M</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Total Value</div>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">$</span>
              </div>
            </div>
            <div className="flex items-center mt-3 text-sm text-green-600">
              <TrendUpIcon />
              <span className="ml-1">+8.2%</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.active}</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Active</div>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.renewalDue}</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Renewal Due</div>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <CalendarIcon />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.expired}</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">Expired</div>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertIcon />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{stats.highRisk}</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">High Risk</div>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertIcon />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Contract Performance Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Contract Performance</h3>
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-gray-500 hover:text-gray-700">7D</button>
                  <button className="text-sm text-blue-600 font-medium">30D</button>
                  <button className="text-sm text-gray-500 hover:text-gray-700">90D</button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="perfFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="m" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ stroke: '#94A3B8', strokeDasharray: '3 3' }} />
                    <Area type="monotone" dataKey="v" stroke="#6366F1" fill="url(#perfFill)" strokeWidth={2} />
                    <Line type="monotone" dataKey="v" stroke="#8B5CF6" dot={{ r: 3 }} strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Contracts Table */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Contracts</h3>
                <Link to="/contracts" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="pb-3">Contract</th>
                      <th className="pb-3">Parties</th>
                      <th className="pb-3">Value</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Expiry</th>
                      <th className="pb-3">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {docs.slice(0, 4).map((doc) => (
                      <tr key={doc.doc_id} className="hover:bg-gray-50">
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                              <DocumentIcon />
                            </div>
                            <span className="font-medium text-gray-900">{doc.filename}</span>
                          </div>
                        </td>
                        <td className="py-3 text-sm text-gray-600">{doc.parties}</td>
                        <td className="py-3 text-sm font-medium text-gray-900">{doc.value}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doc.status === 'Active' ? 'bg-green-100 text-green-800' :
                            doc.status === 'Renewal Due' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">
                          {doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            doc.risk_score === 'Low' ? 'bg-green-50 text-green-700 border border-green-200' :
                            doc.risk_score === 'Medium' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            'bg-red-50 text-red-700 border border-red-200'
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

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <DocumentIcon />
                    <span className="ml-3 font-medium text-gray-900">Upload Contract</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <CalendarIcon />
                    <span className="ml-3 font-medium text-gray-900">Schedule Review</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="flex items-center">
                    <UsersIcon />
                    <span className="ml-3 font-medium text-gray-900">Generate Report</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Upcoming Renewals */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Upcoming Renewals</h3>
                <span className="text-xs text-gray-500">Next 30 days</span>
              </div>
              
              <div className="space-y-4">
                {docs.filter(d => d.status === 'Renewal Due' || d.status === 'Active').slice(0, 3).map((doc) => (
                  <div key={doc.doc_id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{doc.filename}</p>
                      <p className="text-xs text-gray-600">
                        Expires {doc.expiry_date ? new Date(doc.expiry_date).toLocaleDateString() : 'Soon'}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-yellow-700">15 days</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {mockRecentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-blue-600">
                        {activity.user.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user}</span> {activity.action.toLowerCase()} 
                        <span className="font-medium"> {activity.item}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.date} • {activity.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contract Status Distribution */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Status</h3>
              
              <div className="flex items-center justify-center mb-4">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="35" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle 
                      cx="50" cy="50" r="35" stroke="#10b981" strokeWidth="8" fill="none"
                      strokeDasharray={`${(stats.active / stats.total) * 220} 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-900">{stats.active}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stats.active}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Renewal Due</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stats.renewalDue}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Expired</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{stats.expired}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Contract Categories */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Contract Categories</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              Manage Categories
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Service Agreements', count: 12, color: 'bg-blue-100 text-blue-800' },
              { name: 'Employment Contracts', count: 8, color: 'bg-green-100 text-green-800' },
              { name: 'Vendor Contracts', count: 15, color: 'bg-purple-100 text-purple-800' },
              { name: 'Legal Agreements', count: 6, color: 'bg-orange-100 text-orange-800' }
            ].map((category) => (
              <div key={category.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">{category.name}</p>
                  <p className="text-sm text-gray-500">{category.count} contracts</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.color}`}>
                  {category.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
