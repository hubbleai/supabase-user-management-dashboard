'use client';

import { useAPIKeysStore } from '@/store/useAPIKeysStore';
import React from 'react';
import CreateAPIKeys from '@/components/CreateAPIKeys';

// function that returns strings in a hidden format: "[first two]********[last two readable]"
const hideString = (str: string) => {
    const firstTwo = str.slice(0, 2);
    const lastTwo = str.slice(-2);
    const hidden = str.slice(2, -2).replace(/./g, '*');
    return `${firstTwo}${hidden}${lastTwo}`;
};

function ManageAPIKeys() {
    const { apiKeys } = useAPIKeysStore();

    return (
        <div className="w-full">
            <h1 className="font-semibold">Manage API Keys</h1>
            <h1 className="mb-5"> Create or manage your API keys here.</h1>
            <CreateAPIKeys />
            <div className="font-regular grid grid-cols-3 text-sm text-zinc-500">
                <div>Label</div>
                <div>Secret</div>
                <div>Status</div>
            </div>
            <hr />
            {apiKeys.map((apiKey) => (
                <React.Fragment>
                    <div
                        className="grid grid-cols-3 py-2"
                        key={apiKey.api_key_id}
                    >
                        <div>{apiKey.label}</div>
                        <div>{hideString(apiKey.key)}</div>
                        <div>
                            {apiKey.is_active ? (
                                <span className="text-green-500">Active</span>
                            ) : (
                                <span className="text-red-500">Deactive</span>
                            )}
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

export default ManageAPIKeys;
