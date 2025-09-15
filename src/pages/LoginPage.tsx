import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User, AlertCircle, Eye, EyeOff, Shield, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl mb-6 shadow-strong">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-text-strong mb-2">Welcome Back</h1>
          <p className="text-text-muted">Sign in to your SaaS Contracts Dashboard</p>
        </div>

        <Card className="animate-slide-up bg-surface border border-border rounded-xl shadow-card" padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <Input
              label="Username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              icon={<User className="h-5 w-5 text-gray-400" />}
            />

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-text-strong mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-600 focus:border-brand-600 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted hover:text-text-strong transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-4 rounded-lg animate-slide-down">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Signing in...' : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-brand-100 rounded-lg border border-brand-100">
            <h3 className="text-sm font-medium text-text-strong mb-2">Demo Credentials</h3>
            <div className="text-sm text-text-muted space-y-1">
              <p><strong>Username:</strong> Any username (e.g., admin, user, demo)</p>
              <p><strong>Password:</strong> test123</p>
            </div>
          </div>
        </Card>

        {/* Features Preview */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
            <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Lock className="h-4 w-4 text-brand-600" />
            </div>
            <p className="text-xs text-gray-600">Secure Authentication</p>
          </div>
          <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
            <div className="w-8 h-8 bg-secondary-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Shield className="h-4 w-4 text-secondary-600" />
            </div>
            <p className="text-xs text-gray-600">AI Risk Analysis</p>
          </div>
          <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
            <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <User className="h-4 w-4 text-accent-600" />
            </div>
            <p className="text-xs text-gray-600">Smart Insights</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;