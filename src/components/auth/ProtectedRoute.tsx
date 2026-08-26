import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Login } from '../../pages/Login';
import { AccessDenied } from '../../pages/AccessDenied';
import { auditService } from '../../services/auditService';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAuthorized, loading, authError, signIn, signOut } = useAuth();

  // Logs exactly once per successful access to the Transaction Report.
  // Fire-and-forget: auditService swallows its own errors, so a logging
  // failure never blocks or affects the report itself.
  const hasLoggedAccess = useRef(false);
  useEffect(() => {
    if (isAuthenticated && isAuthorized && !hasLoggedAccess.current) {
      hasLoggedAccess.current = true;
      auditService.logAccess();
    }
  }, [isAuthenticated, isAuthorized]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onSignIn={signIn} errorMessage={authError} />;
  }

  if (!isAuthorized) {
    return <AccessDenied onReturnToLogin={signOut} />;
  }

  return <>{children}</>;
}
