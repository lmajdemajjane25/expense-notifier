import React from 'react';

interface BasicAuthProps {
  children: React.ReactNode;
}

// Basic Auth is temporarily disabled — passes children through directly.
const BasicAuth = ({ children }: BasicAuthProps) => <>{children}</>;

export default BasicAuth;
