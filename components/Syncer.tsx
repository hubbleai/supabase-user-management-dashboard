'use client';
import useSyncAuth from '@/hooks/useSyncAuth';
import useSyncOrgs from '@/hooks/useSyncOrgs';

function Syncer() {
    useSyncAuth();
    useSyncOrgs();

    return null;
}

export default Syncer;
