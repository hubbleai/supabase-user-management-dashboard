// store/useAuthStore.ts
import { create } from 'zustand';
import { User } from '@supabase/supabase-js';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,
    error: null,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));
