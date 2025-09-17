import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

export default function AppLayout() {
	const navigate = useNavigate()
	return (
		<div className="min-h-screen flex">
			<aside className="w-64 bg-white border-r hidden md:block">
				<div className="p-4 font-semibold">Contracts SaaS</div>
				<nav className="px-2 py-2 space-y-1">
					<NavLink to="/app/dashboard" className={({isActive}) => `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-100' : ''}`}>Contracts</NavLink>
					<NavLink to="/app/query" className={({isActive}) => `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-100' : ''}`}>Insights</NavLink>
					<NavLink to="/app/query" className={({isActive}) => `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-100' : ''}`}>Reports</NavLink>
					<NavLink to="/app/dashboard" className={({isActive}) => `block px-3 py-2 rounded hover:bg-gray-100 ${isActive ? 'bg-gray-100' : ''}`}>Settings</NavLink>
				</nav>
			</aside>
			<main className="flex-1">
				<div className="sticky top-0 bg-white border-b z-10">
					<div className="container h-14 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<button className="md:hidden px-3 py-2">☰</button>
							<Link to="/app/dashboard" className="font-semibold md:hidden">Contracts SaaS</Link>
						</div>
						<div className="flex items-center gap-2">
							<Link to="/app/upload" className="px-3 py-2 bg-blue-600 text-white rounded">Upload</Link>
							<button onClick={() => { localStorage.removeItem('token'); navigate('/') }} className="px-3 py-2 border rounded">Logout</button>
						</div>
					</div>
				</div>
				<div className="container py-6">
					<Outlet />
				</div>
			</main>
		</div>
	)
}
