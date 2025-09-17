import { useRef, useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export default function Upload() {
	const [file, setFile] = useState<File | null>(null)
	const [expiry, setExpiry] = useState('')
	const [status, setStatus] = useState('Active')
	const [risk, setRisk] = useState('Low')
	const [progress, setProgress] = useState(0)
	const [error, setError] = useState('')
	const [done, setDone] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	const onDrop = (e: React.DragEvent) => {
		e.preventDefault()
		const f = e.dataTransfer.files?.[0]
		if (f) setFile(f)
	}

	const onUpload = async () => {
		if (!file) return
		setError(''); setDone(''); setProgress(0)
		try {
			const form = new FormData()
			form.append('file', file)
			if (expiry) form.append('expiry_date', expiry)
			form.append('status', status)
			form.append('risk_score', risk)
			await axios.post(`${API_BASE}/upload`, form, {
				headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				onUploadProgress: (pe) => {
					if (!pe.total) return
					setProgress(Math.round((pe.loaded/pe.total)*100))
				}
			})
			setDone('Uploaded successfully')
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Upload failed')
		}
	}

	return (
		<div className="space-y-4">
			<div
				onDrop={onDrop}
				onDragOver={(e)=>e.preventDefault()}
				className="border-2 border-dashed rounded p-8 text-center bg-white"
			>
				<p className="mb-2">Drag & drop PDF/TXT/DOCX here, or</p>
				<button onClick={()=>inputRef.current?.click()} className="px-3 py-2 border rounded">Choose file</button>
				<input ref={inputRef} type="file" className="hidden" accept=".pdf,.txt,.docx" onChange={(e)=> setFile(e.target.files?.[0] || null)} />
				{file && <div className="mt-4 text-sm">Selected: {file.name}</div>}
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				<input className="border rounded px-3 py-2" type="date" value={expiry} onChange={e=>setExpiry(e.target.value)} placeholder="Expiry date" />
				<select className="border rounded px-3 py-2" value={status} onChange={e=>setStatus(e.target.value)}>
					<option>Active</option>
					<option>Renewal Due</option>
					<option>Expired</option>
				</select>
				<select className="border rounded px-3 py-2" value={risk} onChange={e=>setRisk(e.target.value)}>
					<option>Low</option>
					<option>Medium</option>
					<option>High</option>
				</select>
			</div>
			<div className="flex items-center gap-2">
				<button disabled={!file} onClick={onUpload} className="px-3 py-2 bg-blue-600 text-white rounded">Upload</button>
				{progress>0 && <div className="w-48 bg-gray-200 rounded h-2"><div className="bg-blue-600 h-2 rounded" style={{width: `${progress}%`}}/></div>}
				{done && <div className="text-green-700 text-sm">{done}</div>}
				{error && <div className="text-red-600 text-sm">{error}</div>}
			</div>
		</div>
	)
}
