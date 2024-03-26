import ManageAPIKeys from '@/components/ManageAPIKeys';
import { useServerOrganizationMember } from '@/hooks/useOrganizationMember';
import { authenticatePage } from '@/utils/auth';
import { redirect } from 'next/navigation';
import React from 'react';

async function APIKeys() {
    const [user, secret] = await authenticatePage()
    const organizationMember = await useServerOrganizationMember(secret)

    return (
        <div className="my-10 flex w-full items-center justify-center">
            <ManageAPIKeys user={user} organizationMember={organizationMember} secret={secret} />
        </div>
    );
}

export default APIKeys;
