import { AUTHORIZED_ROLES } from '../constants/app';

/**
 * Single source of truth for "can this PULSE user open the Transaction Report".
 * roles is a Postgres text[] read as-is from app_users -- never JSON.parse it.
 */
export function isTransactionReportAuthorized(
  roles: readonly string[] | null | undefined,
): boolean {
  if (!roles || roles.length === 0) return false;
  return roles.some((role) => (AUTHORIZED_ROLES as readonly string[]).includes(role));
}
