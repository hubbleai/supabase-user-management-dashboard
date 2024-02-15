// useAPIKeysStore.ts
import { APIKey } from '@/types/supabase';
import { create } from 'zustand';

interface APIKeyState {
    apiKeys: APIKey[];
    loading: boolean;
    setAPIKeys: (apiKeys: APIKey[]) => void;
    setLoading: (loading: boolean) => void;
}

export const useAPIKeysStore = create<APIKeyState>((set) => ({
    apiKeys: [],
    loading: true,
    setAPIKeys: (apiKeys) => set({ apiKeys }),
    setLoading: (loading) => set({ loading }),
}));
