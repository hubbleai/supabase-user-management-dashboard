import { authenticatePage } from '@/utils/auth';
import React from 'react';

async function APIKeys() {
    await authenticatePage();

    return <div className="">Manage API keys</div>;
}

export default APIKeys;
