// store/useOrgsStore.ts
import { Organization } from '@/types/supabase';
import { create } from 'zustand';

interface OrgState {
    orgs: Organization[];
    loading: boolean;
    activeOrg: Organization | null;
    setOrgs: (orgs: Organization[]) => void;
    setLoading: (loading: boolean) => void;
    setActiveOrg: (activeOrg: Organization | null) => void;
}

export const useOrgsStore = create<OrgState>((set) => ({
    orgs: [],
    loading: true,
    activeOrg: null,
    setOrgs: (orgs) => set({ orgs }),
    setLoading: (loading: boolean) => set({ loading }),
    setActiveOrg: (activeOrg: Organization | null) => set({ activeOrg }),
}));
