'use client';
import useSyncAuth from '@/hooks/useSyncAuth';
import useSyncInvites from '@/hooks/useSyncInvites';
import useSyncOrgs from '@/hooks/useSyncOrgs';

function Syncer() {
    useSyncAuth();
    useSyncOrgs();
    useSyncInvites();

    return null;
}

export default Syncer;
