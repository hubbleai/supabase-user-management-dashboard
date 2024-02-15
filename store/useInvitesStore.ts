// store/useInvitesStore.ts
import { Invite } from '@/types/supabase';
import { create } from 'zustand';

interface InviteState {
    invites: Invite[];
    loading: boolean;
    setInvites: (invites: Invite[]) => void;
    setLoading: (loading: boolean) => void;
}

export const useInvitesStore = create<InviteState>((set) => ({
    invites: [],
    loading: true,
    setInvites: (invites) => set({ invites }),
    setLoading: (loading) => set({ loading }),
}));
