
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface BasicAuthProps {
  children: React.ReactNode;
}

const BasicAuth = ({ children }: BasicAuthProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const requiredUsername = import.meta.env.VITE_BASIC_AUTH_USER;
  const requiredPassword = import.meta.env.VITE_BASIC_AUTH_PASS;

  useEffect(() => {
    // Check if Basic Auth is configured
    if (!requiredUsername || !requiredPassword) {
      console.error('Basic Auth credentials not configured. Please set VITE_BASIC_AUTH_USER and VITE_BASIC_AUTH_PASS in your environment variables.');
      setIsLoading(false);
      return;
    }

    // Check if user is already authenticated - use localStorage instead of sessionStorage
    const isBasicAuthValid = localStorage.getItem('basicAuthValid');
    if (isBasicAuthValid === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [requiredUsername, requiredPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!requiredUsername || !requiredPassword) {
      setError('Basic Auth is not properly configured. Please contact the administrator.');
      return;
    }

    if (username === requiredUsername && password === requiredPassword) {
      setIsAuthenticated(true);
      // Use localStorage instead of sessionStorage to persist across browser sessions
      localStorage.setItem('basicAuthValid', 'true');
    } else {
      setError('Invalid username or password');
      setUsername('');
      setPassword('');
    }
  };

  // Clear session data on logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('basicAuthValid');
    setUsername('');
    setPassword('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!requiredUsername || !requiredPassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <CardTitle className="text-xl font-bold text-red-600">Configuration Error</CardTitle>
            <CardDescription>
              Basic Authentication is not properly configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 text-center">
              Please set VITE_BASIC_AUTH_USER and VITE_BASIC_AUTH_PASS environment variables.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <CardTitle className="text-xl font-bold">Access Required</CardTitle>
            <CardDescription>
              Please enter your credentials to access the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
              {error && (
                <div className="text-red-600 text-sm text-center">{error}</div>
              )}
              <Button type="submit" className="w-full">
                Access Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default BasicAuth;
