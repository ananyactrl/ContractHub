import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

interface Document {
	doc_id: number
	filename: string
	uploaded_on: string
	expiry_date?: string | null
	status: string
	risk_score: string
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
				const { data } = await axios.get(`${API_BASE}/contracts`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
				setDocs(data)
			} catch (err: any) {
				setError(err?.response?.data?.detail || 'Failed to load')
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

	if (loading) return <div>Loading...</div>
	if (error) return <div className="text-red-600">{error}</div>
	if (!docs.length) return <div className="text-gray-600">No contracts yet. Use Upload to add one.</div>

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap gap-2 items-center">
				<input className="border rounded px-3 py-2" placeholder="Search by name" value={search} onChange={e=>setSearch(e.target.value)} />
				<select className="border rounded px-3 py-2" value={status} onChange={e=>setStatus(e.target.value)}>
					<option value="">All Status</option>
					<option>Active</option>
					<option>Renewal Due</option>
					<option>Expired</option>
				</select>
				<select className="border rounded px-3 py-2" value={risk} onChange={e=>setRisk(e.target.value)}>
					<option value="">All Risk</option>
					<option>Low</option>
					<option>Medium</option>
					<option>High</option>
				</select>
			</div>
			<div className="overflow-auto border rounded">
				<table className="min-w-full text-sm">
					<thead className="bg-gray-50">
						<tr>
							<th className="text-left p-2">Contract Name</th>
							<th className="text-left p-2">Uploaded</th>
							<th className="text-left p-2">Expiry Date</th>
							<th className="text-left p-2">Status</th>
							<th className="text-left p-2">Risk</th>
							<th className="text-left p-2"></th>
						</tr>
					</thead>
					<tbody>
						{pageItems.map(d => (
							<tr key={d.doc_id} className="border-t">
								<td className="p-2">{d.filename}</td>
								<td className="p-2">{new Date(d.uploaded_on).toLocaleDateString()}</td>
								<td className="p-2">{d.expiry_date ? new Date(d.expiry_date).toLocaleDateString() : '-'}</td>
								<td className="p-2">{d.status}</td>
								<td className={`p-2 ${d.risk_score==='High'?'text-red-600':d.risk_score==='Medium'?'text-yellow-600':'text-green-600'}`}>{d.risk_score}</td>
								<td className="p-2 text-right"><Link className="text-blue-600" to={`/app/contracts/${d.doc_id}`}>View</Link></td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="flex justify-end gap-2">
				<button disabled={page<=1} onClick={()=>setPage(p=>p-1)} className="px-3 py-2 border rounded">Prev</button>
				<div className="px-3 py-2">Page {page} of {totalPages}</div>
				<button disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)} className="px-3 py-2 border rounded">Next</button>
			</div>
		</div>
	)
}
