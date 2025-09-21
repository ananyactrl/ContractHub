import { FormEvent, useState } from 'react'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://3.82.125.8:8000'

export default function Login() {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	const submit = async (e: FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError('')
		try {
			const params = new URLSearchParams()
			params.append('username', username)
			params.append('password', password)
			const { data } = await axios.post(`${API_BASE}/login`, params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
			localStorage.setItem('token', data.access_token)
			window.location.href = '/app/dashboard'
		} catch (err: any) {
			setError(err?.response?.data?.detail || 'Login failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen grid place-items-center p-6">
			<form onSubmit={submit} className="bg-white rounded shadow p-6 w-full max-w-sm space-y-4">
				<h1 className="text-xl font-semibold">Sign in</h1>
				{error && <div className="text-red-600 text-sm">{error}</div>}
				<input className="w-full border rounded px-3 py-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
				<input className="w-full border rounded px-3 py-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
				<button disabled={loading} className="w-full bg-blue-600 text-white rounded px-3 py-2">{loading ? 'Signing in...' : 'Sign in'}</button>
				<p className="text-sm text-gray-600">No account? <button type="button" onClick={async ()=>{
					try{ const {data}= await axios.post(`${API_BASE}/signup`, { username, password }); localStorage.setItem('token', data.access_token); window.location.href='/app/dashboard'}catch(err:any){ setError(err?.response?.data?.detail||'Signup failed')}
				}}>Create one</button></p>
			</form>
		</div>
	)
}
