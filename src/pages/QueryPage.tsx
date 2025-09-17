import React, { useState } from 'react';
import { Search, Send, FileText, Clock, AlertCircle, Loader, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface QueryResult {
  answer: string;
  chunks: Array<{
    text: string;
    metadata: {
      page?: number;
      contract_name?: string;
    };
    relevance: number;
  }>;
}

const QueryPage: React.FC = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentQueries] = useState([
    "What are the termination clauses in my contracts?",
    "Show me liability limitations across all documents",
    "Which contracts expire this year?",
    "What are the payment terms mentioned?",
    "Are there any automatic renewal clauses?"
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ q: query }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickQuery = (quickQuery: string) => {
    setQuery(quickQuery);
  };

  const formatRelevance = (relevance: number) => {
    return `${Math.round(relevance * 100)}%`;
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 0.8) return 'text-green-600 bg-green-100';
    if (relevance >= 0.6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-soft border border-blue-100">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">
              Contract Query Assistant
            </h1>
            <p className="text-blue-600">
              Ask questions about your contracts in natural language
            </p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <Card className="bg-white shadow-card border border-border" padding="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-strong mb-2">
              What would you like to know about your contracts?
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., What are the termination clauses in my contracts? Which ones have liability caps?"
                className="block w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-brand-600 transition-colors resize-none"
                rows={3}
              />
            </div>
          </div>
          
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="text-xs text-text-muted">
              Searches across all your uploaded contracts using AI-powered semantic search
            </p>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!query.trim()}
              className="flex items-center space-x-2"
            >
              {loading ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>{loading ? 'Searching...' : 'Ask Question'}</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* Quick Queries */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100" padding="lg">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <FileText className="h-5 w-5 mr-2 text-green-600" />
          Common Questions
        </h3>
        <div className="flex flex-wrap gap-2">
          {recentQueries.map((quickQuery, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuery(quickQuery)}
              className="text-sm px-3 py-2 bg-white border border-green-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors text-green-700"
            >
              {quickQuery}
            </button>
          ))}
        </div>
      </Card>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Answer */}
          <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100" padding="lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
              <MessageCircle className="h-5 w-5 mr-2 text-purple-600" />
              AI Answer
            </h3>
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <p className="text-slate-700 leading-relaxed">{results.answer}</p>
            </div>
          </Card>

          {/* Evidence */}
          {results.chunks && results.chunks.length > 0 && (
            <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100" padding="lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-orange-600" />
                Supporting Evidence ({results.chunks.length} sources)
              </h3>
              <div className="space-y-4">
                {results.chunks.map((chunk, index) => (
                  <div key={index} className="bg-white border border-orange-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2 text-sm text-slate-600">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">
                          {chunk.metadata.contract_name || 'Contract'}
                        </span>
                        {chunk.metadata.page && (
                          <>
                            <span className="text-slate-400">•</span>
                            <span>Page {chunk.metadata.page}</span>
                          </>
                        )}
                      </div>
                      <span 
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getRelevanceColor(chunk.relevance)}`}
                      >
                        {formatRelevance(chunk.relevance)} relevant
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      "{chunk.text}"
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!results && !loading && (
        <Card className="text-center py-12 bg-gray-50" padding="lg">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to help!</h3>
          <p className="text-gray-600">
            Ask any question about your contracts and I'll search through all your documents to find relevant information.
          </p>
        </Card>
      )}
    </div>
  );
};

export default QueryPage;
