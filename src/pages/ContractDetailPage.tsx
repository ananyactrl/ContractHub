import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, type ContractDetail } from '../services/api';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  TrendingUp,
  Eye,
  ChevronRight,
  X
} from 'lucide-react';

const ContractDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [evidenceDrawerOpen, setEvidenceDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchContract = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await api.getContract(id);
        setContract(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch contract details');
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  const getRiskBadge = (risk: string) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full";
    switch (risk) {
      case 'Low':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'High':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Expired':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Renewal Due':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getInsightIcon = (risk: string) => {
    switch (risk) {
      case 'High':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'Medium':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatConfidence = (confidence: number) => {
    return `${Math.round(confidence * 100)}%`;
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse" />
        <div className="bg-surface rounded-xl border border-border p-6 shadow-card">
          <div className="h-24 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-40 bg-gray-100 rounded animate-pulse" />
            <div className="h-40 bg-gray-100 rounded animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-gray-100 rounded animate-pulse" />
            <div className="h-40 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Contract not found</h3>
        <p className="text-gray-600 mb-4">{error || 'The requested contract could not be found.'}</p>
        <Link
          to="/dashboard"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard"
          className="flex items-center text-text-muted hover:text-text-strong transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      {/* Contract Metadata */}
      <div className="bg-surface rounded-xl shadow-card border border-border p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-strong mb-2">{contract.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{contract.parties}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Start: {formatDate(contract.start)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Expiry: {formatDate(contract.expiry)}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(contract.status)}
              <span className="text-sm font-medium text-text-strong">{contract.status}</span>
            </div>
            <span className={getRiskBadge(contract.risk)}>
              {contract.risk} Risk
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Clauses Section */}
          <div className="bg-surface rounded-xl shadow-card border border-border p-6">
            <h2 className="text-lg font-semibold text-text-strong mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Contract Clauses
            </h2>
            <div className="space-y-4">
              {contract.clauses.map((clause, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-text-strong">{clause.title}</h3>
                    <span className="text-sm text-text-muted bg-gray-100 px-2 py-1 rounded">
                      {formatConfidence(clause.confidence)} confidence
                    </span>
                  </div>
                  <p className="text-text-muted text-sm">{clause.summary}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights Section */}
          <div className="bg-surface rounded-xl shadow-card border border-border p-6">
            <h2 className="text-lg font-semibold text-text-strong mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              AI Risk Analysis
            </h2>
            <div className="space-y-4">
              {contract.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border border-border">
                  {getInsightIcon(insight.risk)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={getRiskBadge(insight.risk)}>
                        {insight.risk} Risk
                      </span>
                    </div>
                    <p className="text-text-muted text-sm">{insight.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Evidence Panel */}
          <div className="bg-surface rounded-xl shadow-card border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-text-strong flex items-center">
                <Eye className="h-5 w-5 mr-2" />
                Evidence
              </h2>
              <button
                onClick={() => setEvidenceDrawerOpen(true)}
                className="text-brand-600 hover:text-brand-500 text-sm font-medium flex items-center"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
            <div className="space-y-3">
              {contract.evidence.slice(0, 2).map((item, index) => (
                <div key={index} className="border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-brand-600 bg-brand-100 px-2 py-1 rounded">
                      {item.source}
                    </span>
                    <span className="text-xs text-text-muted">
                      {formatConfidence(item.relevance)} relevance
                    </span>
                  </div>
                  <p className="text-sm text-text-muted">{item.snippet}</p>
                </div>
              ))}
              {contract.evidence.length > 2 && (
                <p className="text-sm text-text-muted text-center">
                  +{contract.evidence.length - 2} more evidence items
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-surface rounded-xl shadow-card border border-border p-6">
            <h3 className="text-lg font-semibold text-text-strong mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-text-muted">Total Clauses</span>
                <span className="text-sm font-medium text-text-strong">{contract.clauses.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-muted">Risk Insights</span>
                <span className="text-sm font-medium text-text-strong">{contract.insights.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-muted">Evidence Items</span>
                <span className="text-sm font-medium text-text-strong">{contract.evidence.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-text-muted">Avg Confidence</span>
                <span className="text-sm font-medium text-text-strong">
                  {formatConfidence(
                    contract.clauses.reduce((sum, clause) => sum + clause.confidence, 0) / 
                    contract.clauses.length
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evidence Drawer */}
      {evidenceDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75" onClick={() => setEvidenceDrawerOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-surface shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-text-strong">All Evidence</h3>
              <button
                onClick={() => setEvidenceDrawerOpen(false)}
                className="text-text-muted hover:text-text-strong"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-full">
              <div className="space-y-4">
                {contract.evidence.map((item, index) => (
                  <div key={index} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-brand-600 bg-brand-100 px-2 py-1 rounded">
                        {item.source}
                      </span>
                      <span className="text-sm text-text-muted">
                        {formatConfidence(item.relevance)} relevance
                      </span>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">{item.snippet}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractDetailPage;
