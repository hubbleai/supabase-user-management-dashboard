'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useOrgsStore } from '@/store/useOrgsStore';

const supabase = createClient();

const useSyncOrgs = () => {
    const { activeOrg, setActiveOrg, setOrgs, setLoading } = useOrgsStore();

    const fetchAndUpdateOrgs = async () => {
        let { data: orgs, error } = await supabase
            .from('organizations')
            .select('*');

        if (error) {
            console.error('Error fetching organizations:', error);
            return;
        }

        if (orgs) {
            setOrgs(orgs);
            if (!activeOrg && orgs.length > 0) {
                setActiveOrg(orgs[0]);
            }
            if (orgs.length === 0) {
                setActiveOrg(null);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndUpdateOrgs();

        const authListener = supabase.auth.onAuthStateChange(
            (_event, _session) => {
                console.log('Auth state changed', _event, _session);
                fetchAndUpdateOrgs();
            }
        );

        const channel_1 = supabase
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'user_org_roles' },
                fetchAndUpdateOrgs
            )
            .subscribe();

        const channel_2 = supabase
            .channel('custom-all-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'organizations' },
                fetchAndUpdateOrgs
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel_1);
            supabase.removeChannel(channel_2);
            authListener.data.subscription.unsubscribe();
        };
    }, [setOrgs, setActiveOrg, activeOrg, setLoading]);
};

export default useSyncOrgs;
