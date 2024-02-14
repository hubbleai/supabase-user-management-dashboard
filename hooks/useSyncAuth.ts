'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const useSyncAuth = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const setLoading = useAuthStore((state) => state.setLoading);
    const setError = useAuthStore((state) => state.setError);

    useEffect(() => {
        const checkSession = async () => {
            setLoading(true);
            try {
                const { data } = await supabase.auth.getSession();
                setUser(data?.session?.user ?? null);
            } catch (error) {
                console.error('Error fetching session:', error);
                setError('Failed to fetch session');
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setUser(session?.user ?? null);
                if (event === 'SIGNED_OUT') {
                    setUser(null);
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [setUser, setLoading, setError]);
};

export default useSyncAuth;
