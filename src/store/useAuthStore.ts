import type { UserResponse } from '@/types/user';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';



interface AuthState {
    isAuthenticated: boolean;
    user: UserResponse | null;
    authToken: string | null;
    refreshToken: string | null;
    // Azioni
    login: (user: UserResponse) => void;
    logout: () => void;
    setAuthToken: (token: string | null) => void;
    setRefreshToken: (token: string | null) => void;
    setTokens: (authToken: string | null, refreshToken: string | null) => void;
    setUser: (user: UserResponse | null) => void;
    updateUser: (userData: Partial<UserResponse>) => void;
    setAuthenticated: (isAuthenticated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            authToken: null,
            refreshToken: null,
            isAuthenticated: false,
            user: null,

            // Login completo (setta utente e autenticazione)
            login: (user) => set({
                isAuthenticated: true,
                user
            }),

            // Logout (pulisce tutto)
            logout: () => {
                set({
                    isAuthenticated: false,
                    user: null,
                    authToken: null,
                    refreshToken: null
                });
            },

            // Setta solo il token di autenticazione
            setAuthToken: (token) => set({
                authToken: token,
                isAuthenticated: !!token
            }),

            // Setta solo il refresh token
            setRefreshToken: (token) => set({ refreshToken: token }),

            // Setta entrambi i token insieme
            setTokens: (authToken, refreshToken) => set({
                authToken,
                refreshToken,
                isAuthenticated: !!authToken
            }),

            // Setta/sostituisce l'utente
            setUser: (user) => set({ user }),

            // Aggiorna parzialmente i dati utente
            updateUser: (userData) => set((state) => ({
                user: state.user ? { ...state.user, ...userData } : null,
            })),

            // Setta lo stato di autenticazione
            setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
