import ManageAPIKeys from '@/components/ManageAPIKeys';
import { authenticatePage } from '@/utils/auth';
import React from 'react';

async function APIKeys() {
    await authenticatePage();

    return (
        <div className="my-10 flex w-full items-center justify-center">
            <ManageAPIKeys />
        </div>
    );
}

export default APIKeys;
