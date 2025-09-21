import { useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://3.82.125.8:8000'

export default function Query() {
	const [q, setQ] = useState('What is the termination notice period?')
	const [answer, setAnswer] = useState('')
	const [chunks, setChunks] = useState<any[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const ask = async () => {
		setLoading(true); setError('')
		try{
			const { data } = await axios.post(`${API_BASE}/ask`, { question: q }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
			setAnswer(data.answer)
			setChunks(data.retrieved_chunks)
		}catch(err:any){ setError(err?.response?.data?.detail || 'Query failed') }
		finally{ setLoading(false) }
	}

	return (
		<div className="space-y-4">
			<div className="flex gap-2">
				<input className="flex-1 border rounded px-3 py-2" value={q} onChange={e=>setQ(e.target.value)} placeholder="Ask a question about your contracts" />
				<button onClick={ask} className="px-3 py-2 bg-blue-600 text-white rounded">Ask</button>
			</div>
			{loading && <div>Loading...</div>}
			{error && <div className="text-red-600">{error}</div>}
			{answer && (
				<div className="bg-white border rounded p-4">
					<h3 className="font-semibold mb-1">Answer</h3>
					<p className="text-sm text-gray-800">{answer}</p>
				</div>
			)}
			{chunks.length>0 && (
				<div className="space-y-2">
					<h3 className="font-semibold">Top Retrieved</h3>
					{chunks.map((c:any)=> (
						<div key={c.chunk_id} className="bg-white border rounded p-3">
							<div className="text-xs text-gray-500">Page: {c.metadata?.page ?? '-'} • Relevance: {Math.round((c.relevance||0)*100)}%</div>
							<div className="text-sm mt-1">{c.text_chunk}</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
