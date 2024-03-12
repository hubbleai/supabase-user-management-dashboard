import ManageAPIKeys from '@/components/ManageAPIKeys';
import { useServerOrganizationMember } from '@/hooks/useOrganizationMember';
import { authenticatePage } from '@/utils/auth';
import { redirect } from 'next/navigation';
import React from 'react';

async function APIKeys() {
    const user = await authenticatePage();
    const organizationMember = await useServerOrganizationMember(user.id)
    // TODO maybe move this redirect into the hook itself
    if (!organizationMember) {
        return redirect('/')
    }

    return (
        <div className="my-10 flex w-full items-center justify-center">
            <ManageAPIKeys user={user} organizationMember={organizationMember} />
        </div>
    );
}

export default APIKeys;
