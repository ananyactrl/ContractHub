import React, { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Settings,
  TrendingUp,
  User,
  Menu,
  X,
  MessageCircle
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Contracts', href: '/contracts', icon: FileText },
    { name: 'Query', href: '/query', icon: MessageCircle },
    { name: 'Insights', href: '/insights', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: TrendingUp },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface shadow-card transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-text-strong">ContractHub</h1>
                <p className="text-xs text-text-muted">SaaS Management</p>
              </div>
            </div>
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-text-muted hover:text-text-strong hover:bg-brand-100/40"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-brand-100 text-brand-600 border border-brand-100 shadow-sm'
                    : 'text-text-muted hover:bg-gray-50 hover:text-text-strong hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 transition-colors ${isActive(item.href) ? 'text-brand-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                  <span className="font-medium">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Upgrade Section */}
        <div className="p-4 border-t border-border">
          <div className="bg-gradient-to-br from-brand-100 to-white rounded-xl p-4 text-center border border-border">
            <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-text-strong mb-2">Upgrade Plan</h3>
            <p className="text-xs text-text-muted mb-3">Unlock advanced contract analytics</p>
            <button className="w-full bg-brand-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-brand-500 transition-colors">
              Upgrade Now
            </button>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-strong">Contract Manager</p>
              <p className="text-xs text-text-muted">Professional Plan</p>
            </div>
            <button className="p-1 hover:bg-brand-100/40 rounded-full transition-colors">
              <Settings className="h-4 w-4 text-text-muted" />
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-surface border-b border-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-text-muted hover:text-text-strong hover:bg-brand-100/40"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold text-text-strong">ContractHub</h1>
          </div>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>

        <main className="flex-1 bg-bg">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            {children}
          </div>
          <footer className="mt-6 border-t border-border px-6 lg:px-8 py-6 text-sm text-text-muted">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span>© 2025 ContractHub. All rights reserved.</span>
              <span>Developed by Ananya Singh.</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Layout;
