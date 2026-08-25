import { PHYSIARE_LOGO_URL } from '../../constants/app';
import type { PulseUserProfile } from '../../types/auth';

interface AppHeaderProps {
  profile: PulseUserProfile | null;
  onSignOut: () => void;
}

export function AppHeader({ profile, onSignOut }: AppHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <img src={PHYSIARE_LOGO_URL} alt="Physiaré" className="h-8 w-8 object-contain" />
          <span className="text-sm font-semibold text-slate-800 sm:text-base">
            PULSE SALES TRANSACTION REPORT
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="hidden text-right sm:block">
            <div className="font-medium text-slate-700">
              {profile?.displayName || profile?.email}
            </div>
            <div className="text-xs uppercase tracking-wide text-slate-400">
              {profile?.roles.join(', ')}
            </div>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
