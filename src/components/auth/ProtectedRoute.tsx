import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Login } from '../../pages/Login';
import { AccessDenied } from '../../pages/AccessDenied';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isAuthorized, loading, authError, signIn, signOut } = useAuth();

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
