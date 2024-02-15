'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useInvitesStore } from '@/store/useInvitesStore';

const supabase = createClient();

const useSyncInvites = () => {
    const { setInvites, setLoading } = useInvitesStore();

    const fetchAndUpdateInvites = async () => {
        let { data: invites, error } = await supabase
            .from('invites')
            .select('*');

        if (error) {
            console.error('Error fetching invites:', error);
            return;
        }

        if (invites) {
            setInvites(invites);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndUpdateInvites();

        const authListener = supabase.auth.onAuthStateChange(
            (_event, _session) => {
                fetchAndUpdateInvites();
            }
        );

        const channel = supabase
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'invites' },
                fetchAndUpdateInvites
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            authListener.data.subscription.unsubscribe();
        };
    }, [setInvites, setLoading]);
};

export default useSyncInvites;
