'use client';
import useSyncAPIKeys from '@/hooks/useSyncAPIKeys';
import useSyncAuth from '@/hooks/useSyncAuth';
import useSyncInvites from '@/hooks/useSyncInvites';
import useSyncOrgs from '@/hooks/useSyncOrgs';

function Syncer() {
    useSyncAuth();
    useSyncOrgs();
    useSyncInvites();
    useSyncAPIKeys();

    return null;
}

export default Syncer;
