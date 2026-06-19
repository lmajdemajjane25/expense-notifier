import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Authentication is temporarily disabled — all routes are publicly accessible.
const ProtectedRoute = ({ children }: ProtectedRouteProps) => <>{children}</>;

export default ProtectedRoute;
