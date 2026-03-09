import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { StaffProfile, CitizenProfile } from '@maengelmelder/shared-types';

type AuthUser = (StaffProfile & { type: 'staff' }) | (CitizenProfile & { type: 'citizen' });

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (accessToken, user) => set({ accessToken, user, isAuthenticated: true }),
      logout: () => set({ accessToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'maengelmelder-auth',
      partialize: (state) => ({ accessToken: state.accessToken, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
