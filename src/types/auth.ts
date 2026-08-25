export interface PulseUserProfile {
  id: string;
  authUid: string;
  email: string | null;
  displayName: string | null;
  roles: string[];
}
