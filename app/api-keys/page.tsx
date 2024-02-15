import { authenticatePage } from '@/utils/auth';
import React from 'react';

async function APIKeys() {
    await authenticatePage();

    return (
        <div className="flex min-h-48 items-center justify-center">
            Manage API keys
        </div>
    );
}

export default APIKeys;
