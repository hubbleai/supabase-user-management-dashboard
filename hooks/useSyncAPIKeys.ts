// useSyncAPIKeys.ts
'use client';

import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useAPIKeysStore } from '@/store/useAPIKeysStore';

const supabase = createClient();

const useSyncAPIKeys = () => {
    const { setAPIKeys, setLoading } = useAPIKeysStore();

    const fetchAndUpdateAPIKeys = async () => {
        let { data: apiKeys, error } = await supabase
            .from('api_keys')
            .select('*');

        if (error) {
            console.error('Error fetching API Keys:', error);
            return;
        }

        if (apiKeys) {
            setAPIKeys(apiKeys);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAndUpdateAPIKeys();

        const authListener = supabase.auth.onAuthStateChange(
            (_event, _session) => {
                fetchAndUpdateAPIKeys();
            }
        );

        const apiKeyChangesChannel = supabase
            .channel('custom-api-key-channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'api_keys' },
                fetchAndUpdateAPIKeys
            )
            .subscribe();

        return () => {
            supabase.removeChannel(apiKeyChangesChannel);
            authListener.data.subscription.unsubscribe();
        };
    }, [setAPIKeys, setLoading]);

    return null;
};

export default useSyncAPIKeys;
