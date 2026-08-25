interface AccessDeniedProps {
  onReturnToLogin: () => void;
}

export function AccessDenied({ onReturnToLogin }: AccessDeniedProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Access Restricted</h1>
        <p className="mt-2 text-sm text-slate-500">
          Your PULSE account does not have permission to access the Transaction Report.
        </p>
        <button
          type="button"
          onClick={onReturnToLogin}
          className="mt-6 w-full rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Return to Login
        </button>
      </div>
    </div>
  );
}
