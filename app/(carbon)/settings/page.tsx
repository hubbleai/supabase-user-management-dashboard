import UserInvite from '@/components/UserInvite';
import { authenticatePage } from '@/utils/auth';
import React from 'react';

async function Settings() {
    await authenticatePage();

    return (
        <div className="flex w-full">
            <UserInvite />
        </div>
    );
}

export default Settings;
