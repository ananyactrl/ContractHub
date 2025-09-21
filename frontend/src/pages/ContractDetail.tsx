import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE 

export default function ContractDetail() {
	const { id } = useParams()
	const [data, setData] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const [evidenceOpen, setEvidenceOpen] = useState(false)
	const [evidence, setEvidence] = useState<any[]>([])

	useEffect(() => {
		const run = async () => {
			try {
				setLoading(true)
				const { data } = await axios.get(`${API_BASE}/contracts/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
				setData(data)
			} catch (err: any) {
				setError(err?.response?.data?.detail || 'Failed to load')
			} finally { setLoading(false) }
		}
		run()
	}, [id])

	if (loading) return <div>Loading...</div>
	if (error) return <div className="text-red-600">{error}</div>
	if (!data) return null

	const doc = data.document

	return (
		<div className="space-y-6">
			<header className="bg-white border rounded p-4">
				<h1 className="text-xl font-semibold">{doc.filename}</h1>
				<div className="text-sm text-gray-600">Status: {doc.status} • Risk: <span className={`${doc.risk_score==='High'?'text-red-600':doc.risk_score==='Medium'?'text-yellow-600':'text-green-600'}`}>{doc.risk_score}</span> • Uploaded: {new Date(doc.uploaded_on).toLocaleString()}</div>
			</header>
			<section className="grid md:grid-cols-2 gap-4">
				{data.clauses.map((c:any, idx:number) => (
					<div key={idx} className="bg-white border rounded p-4">
						<h3 className="font-semibold mb-2">{c.title}</h3>
						<p className="text-sm text-gray-800">{c.text}</p>
						<div className="text-xs text-gray-500 mt-2">Confidence: {(c.confidence*100).toFixed(0)}%</div>
					</div>
				))}
			</section>
			<section className="bg-white border rounded p-4">
				<h2 className="font-semibold mb-2">AI Insights</h2>
				<ul className="list-disc pl-5 space-y-1">
					{data.insights.map((i:any, idx:number)=> (
						<li key={idx}><span className="font-medium">{i.risk}</span>: {i.recommendation}</li>
					))}
				</ul>
				<div className="mt-4">
					<button className="px-3 py-2 border rounded" onClick={async ()=>{
						try{
							const { data } = await axios.post(`${API_BASE}/ask`, { question: 'Show key clauses', doc_id: Number(id) }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
							setEvidence(data.retrieved_chunks)
							setEvidenceOpen(true)
						}catch(e){/* noop */}
					}}>Open Evidence</button>
				</div>
			</section>

			{evidenceOpen && (
				<div className="fixed inset-0 bg-black/40 flex">
					<div className="ml-auto w-full max-w-xl bg-white h-full p-4 overflow-y-auto">
						<div className="flex justify-between items-center mb-2">
							<h3 className="font-semibold">Evidence</h3>
							<button className="px-3 py-1 border rounded" onClick={()=>setEvidenceOpen(false)}>Close</button>
						</div>
						<div className="space-y-3">
							{evidence.map((e:any)=> (
								<div key={e.chunk_id} className="border rounded p-3">
									<div className="text-xs text-gray-500">Page: {e.metadata?.page ?? '-'} • Relevance: {Math.round((e.relevance||0)*100)}% • Confidence: {Math.round((e.confidence||0)*100)}%</div>
									<div className="text-sm mt-1">{e.text_chunk}</div>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	)
}
