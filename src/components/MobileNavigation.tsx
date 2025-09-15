import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  BarChart3, 
  FileBarChart, 
  Settings, 
  Home
} from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Contracts', href: '/dashboard', icon: FileText },
    { name: 'Insights', href: '/insights', icon: BarChart3 },
    { name: 'Reports', href: '/reports', icon: FileBarChart },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                active
                  ? 'text-blue-600 bg-blue-50 shadow-soft'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;
