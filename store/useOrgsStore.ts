// store/useOrgsStore.ts
import { Organization } from '@/types/supabase';
import { create } from 'zustand';

interface OrgState {
    orgs: Organization[];
    loading: boolean;
    setOrgs: (orgs: Organization[]) => void;
    setLoading: (loading: boolean) => void;
}

export const useOrgsStore = create<OrgState>((set) => ({
    orgs: [],
    loading: true,
    setOrgs: (orgs) => set({ orgs }),
    setLoading: (loading: boolean) => set({ loading }),
}));
