import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
  TrendingUp,
  BarChart3,
  Eye,
  User,
  Bell,
  Settings
} from 'lucide-react';
import { useContracts } from '../hooks/useContracts';
import { useSearch } from '../hooks/useSearch';
import { useFilters } from '../hooks/useFilters';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import RiskDistributionChart from '../components/charts/RiskDistributionChart';
import ContractTimelineChart from '../components/charts/ContractTimelineChart';
import UploadModal from '../components/UploadModal';
import FloatingActionButton from '../components/FloatingActionButton';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { contracts, loading, error, refetch } = useContracts();
  const { searchTerm, setSearchTerm, filteredContracts } = useSearch(contracts);
  const {
    filters,
    setStatusFilter,
    setRiskFilter,
    setDateRange,
    clearFilters,
    filteredContracts: finalFilteredContracts,
    activeFiltersCount
  } = useFilters(filteredContracts);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const contractsPerPage = 10;

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: contracts.length,
      active: contracts.filter(c => c.status === 'Active').length,
      expiring: contracts.filter(c => c.status === 'Renewal Due').length,
      highRisk: contracts.filter(c => c.risk === 'High').length,
    };
  }, [contracts]);

  // Pagination
  const totalPages = Math.ceil(finalFilteredContracts.length / contractsPerPage);
  const startIndex = (currentPage - 1) * contractsPerPage;
  const endIndex = startIndex + contractsPerPage;
  const paginatedContracts = finalFilteredContracts.slice(startIndex, endIndex);

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>;
      case 'Expired':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      case 'Renewal Due':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
    }
  };

  const getRiskBadge = (risk: string) => {
    const variants = {
      'Low': 'success' as const,
      'Medium': 'warning' as const,
      'High': 'danger' as const
    };
    return (
      <Badge variant={variants[risk as keyof typeof variants] || 'warning'}>
        {risk} Risk
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading contracts</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => refetch()} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-intelly flex-1 min-h-screen space-y-6 animate-fade-in pt-2">
      {/* Top Bar with Search and User Profile */}
      <div className="bg-white/90 backdrop-blur-md shadow-soft border-b border-gray-100 px-8 py-4 sticky top-0 z-20">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
              />
            </div>
          </div>

          {/* User Profile and Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <span>Contracts</span>
              <span className="text-slate-400">•</span>
              <span>Insights</span>
              <span className="text-slate-400">•</span>
              <span>Reports</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-gray-100 transition-colors">
                <User className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-gray-100 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message Card - Soft Yellow with Design Elements */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-8 shadow-soft border border-yellow-100 relative overflow-hidden mt-2">
        {/* Background Design Elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-200/30 rounded-full"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 bg-amber-200/40 rounded-lg rotate-45"></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-yellow-300/50 rounded-full"></div>
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">
              Good morning, {user?.username || 'User'}! 👋
            </h1>
            <p className="text-lg text-slate-600">
              SaaS Dashboard wishes you a good and productive day. {stats.total} contracts waiting for your review today. 
              You also have {stats.expiring} contracts expiring soon.
            </p>
          </div>
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-2xl flex items-center justify-center">
            <FileText className="h-10 w-10 text-yellow-700" />
          </div>
        </div>
      </div>

      {/* Statistics Cards - Healthcare Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Contracts - Soft Blue with Design Elements */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-soft border border-blue-100 hover:shadow-lg transition-all duration-300 animate-slide-up relative overflow-hidden">
          {/* Background Design Elements */}
          <div className="absolute top-2 right-2 w-12 h-12 bg-blue-200/20 rounded-lg rotate-12"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 bg-indigo-200/30 rounded-full"></div>
          <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-300/40 rounded-full"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Total Contracts</p>
              <p className="text-4xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-xs text-blue-600 mt-1">All contracts in system</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-2xl flex items-center justify-center">
              <FileText className="h-8 w-8 text-blue-700" />
            </div>
          </div>
        </div>

        {/* Active Contracts - Soft Green with Design Elements */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 shadow-soft border border-emerald-100 hover:shadow-lg transition-all duration-300 animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.1s' }}>
          {/* Background Design Elements */}
          <div className="absolute top-3 right-3 w-10 h-10 bg-emerald-200/25 rounded-full"></div>
          <div className="absolute bottom-3 left-3 w-8 h-8 bg-green-200/30 rounded-lg rotate-45"></div>
          <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-emerald-300/40 rounded-full"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-emerald-700 mb-1">Active</p>
              <p className="text-4xl font-bold text-slate-800">{stats.active}</p>
              <p className="text-xs text-emerald-600 mt-1">Currently active</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-200 to-green-200 rounded-2xl flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-emerald-700" />
            </div>
          </div>
        </div>

        {/* Expiring Soon - Soft Yellow with Design Elements */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 shadow-soft border border-yellow-100 hover:shadow-lg transition-all duration-300 animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
          {/* Background Design Elements */}
          <div className="absolute top-2 right-2 w-14 h-14 bg-yellow-200/20 rounded-lg rotate-6"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 bg-amber-200/30 rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-yellow-300/50 rounded-full"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-yellow-700 mb-1">Expiring Soon</p>
              <p className="text-4xl font-bold text-slate-800">{stats.expiring}</p>
              <p className="text-xs text-yellow-600 mt-1">Need attention</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-2xl flex items-center justify-center">
              <Clock className="h-8 w-8 text-yellow-700" />
            </div>
          </div>
        </div>

        {/* High Risk - Soft Pink with Design Elements */}
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 shadow-soft border border-pink-100 hover:shadow-lg transition-all duration-300 animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.3s' }}>
          {/* Background Design Elements */}
          <div className="absolute top-3 right-3 w-12 h-12 bg-pink-200/25 rounded-lg rotate-12"></div>
          <div className="absolute bottom-3 left-3 w-7 h-7 bg-rose-200/30 rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-pink-300/40 rounded-full"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-pink-700 mb-1">High Risk</p>
              <p className="text-4xl font-bold text-slate-800">{stats.highRisk}</p>
              <p className="text-xs text-pink-600 mt-1">Requires review</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-pink-200 to-rose-200 rounded-2xl flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-pink-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Healthcare Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution - Soft Purple with Design Elements */}
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 shadow-soft border border-purple-100 relative overflow-hidden">
          {/* Background Design Elements */}
          <div className="absolute top-4 right-4 w-16 h-16 bg-purple-200/20 rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-10 h-10 bg-violet-200/25 rounded-lg rotate-45"></div>
          <div className="absolute top-1/2 right-1/3 w-5 h-5 bg-purple-300/30 rounded-full"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Risk Distribution</h3>
              <p className="text-sm text-purple-600">Contract risk analysis</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-violet-200 rounded-xl flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-purple-700" />
            </div>
          </div>
          <div className="relative z-10">
            <RiskDistributionChart contracts={contracts} />
          </div>
        </div>

        {/* Contract Timeline - Soft Teal with Design Elements */}
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-6 shadow-soft border border-teal-100 relative overflow-hidden">
          {/* Background Design Elements */}
          <div className="absolute top-3 right-3 w-14 h-14 bg-teal-200/20 rounded-lg rotate-6"></div>
          <div className="absolute bottom-3 left-3 w-8 h-8 bg-cyan-200/25 rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-4 h-4 bg-teal-300/30 rounded-full"></div>
          
          <div className="flex items-center justify-between mb-6 relative z-10">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Contract Timeline</h3>
              <p className="text-sm text-teal-600">Monthly contract trends</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-teal-200 to-cyan-200 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-teal-700" />
            </div>
          </div>
          <div className="relative z-10">
            <ContractTimelineChart contracts={contracts} />
          </div>
        </div>
      </div>

      {/* Filters Section - Soft Orange */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 shadow-soft border border-orange-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-200 to-amber-200 rounded-xl flex items-center justify-center">
              <Filter className="h-5 w-5 text-orange-700" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Contract Filters</h3>
              <p className="text-sm text-orange-600">Refine your contract search</p>
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white/80 hover:bg-white border-orange-200 text-orange-700"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge variant="info" size="sm">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200 animate-slide-down">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              {/* Risk Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Risk Level</label>
                <select
                  value={filters.risk}
                  onChange={(e) => setRiskFilter(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                >
                  <option value="">All Risk Levels</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setDateRange(e.target.value, filters.dateRange.end)}
                    className="flex-1 px-3 py-2 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  />
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setDateRange(filters.dateRange.start, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="text-slate-600 hover:text-slate-800"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contracts Table - Soft Indigo */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 shadow-soft border border-indigo-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Contract List</h3>
            <p className="text-sm text-indigo-600">Manage and review your contracts</p>
          </div>
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-xl flex items-center justify-center">
            <FileText className="h-6 w-6 text-indigo-700" />
          </div>
        </div>
        {finalFilteredContracts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
            <p className="text-gray-600">
              {searchTerm || activeFiltersCount > 0
                ? 'Try adjusting your search or filters'
                : 'Upload your first contract to get started'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Contract Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Parties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedContracts.map((contract, index) => (
                    <tr 
                      key={contract.id} 
                      className="hover:bg-gray-50 transition-colors animate-slide-up"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Avatar name={contract.name} size="sm" />
                          <div>
                            <div className="text-sm font-medium text-slate-800">
                              {contract.name}
                            </div>
                            <div className="text-xs text-slate-500">
                              ID: {contract.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-700">
                          {contract.parties}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-700">
                          {formatDate(contract.expiry)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(contract.status)}
                          <span className="text-sm font-medium text-slate-800">{contract.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRiskBadge(contract.risk)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/contract/${contract.id}`}
                          className="text-primary-600 hover:text-primary-900 transition-colors flex items-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View Details</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-600">
                      Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(startIndex + contractsPerPage, finalFilteredContracts.length)}
                      </span>{' '}
                      of <span className="font-medium">{finalFilteredContracts.length}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="rounded-l-md"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={page === currentPage ? "primary" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="rounded-none"
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-r-md"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Upload Section - Soft Green */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-soft border border-green-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Upload New Contract</h3>
            <p className="text-sm text-green-600">Add contracts to your dashboard</p>
          </div>
          <Button
            onClick={() => setUploadModalOpen(true)}
            variant="primary"
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Contract
          </Button>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setUploadModalOpen(true)} />
    </div>
  );
};

export default DashboardPage;