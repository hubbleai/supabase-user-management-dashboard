'use client';

import React, { useEffect, useState } from 'react';
import CreateAPIKeys, { APIKey } from '@/components/CreateAPIKeys';
import { OrganizationMember } from '@/hooks/useOrganizationMember';
import { User } from '@supabase/supabase-js';
import DeleteAPIKey from './DeleteAPIKey';

interface ListAPIKeysResponse {
    data: APIKey[];
    count: number;
}

// function that returns strings in a hidden format: "[first two]********[last two readable]"
const hideString = (str: string) => {
    const firstTwo = str.slice(0, 2);
    const lastTwo = str.slice(-2);
    const hidden = str.slice(2, -2).replace(/./g, '*');
    return `${firstTwo}${hidden}${lastTwo}`;
};

const isPastDate = (date: Date) =>  date <= new Date()

function ManageAPIKeys(
    props: { 
        user: User,
        organizationMember: OrganizationMember,
    }
) {
    const [apiKeys, setAPIKeys] = useState<APIKey[]>([]);

    const getAPIKeys = async () => {
        // TODO properly paginate the api key list
        // As of now, this list only makes one request to fetch 50 api keys.
        // It is unlike an organization will reach that limit soon, so will
        // prioritize later.
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/api-key/list?limit=50`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${props.user.id}`,
            },
        });

        if (response.status !== 200) {
            const deserializedResponse = await response.json()
            console.log(response.status, deserializedResponse)
        } else {
            const deserializedResponse: ListAPIKeysResponse = await response.json()
            setAPIKeys(deserializedResponse.data)
        }
    }
    
    useEffect(() => {
        getAPIKeys();
    }, [])

    return (
        <div className="w-full">
            <h1 className="font-semibold">Manage API Keys</h1>
            <h1 className="mb-5"> Create or manage your API keys here.</h1>
            <CreateAPIKeys organizationMember={props.organizationMember} />
            <div className="font-regular grid grid-cols-12 text-sm text-zinc-500">
                <div className='col-span-3'>Label</div>
                <div className='col-span-7'>Secret</div>
                <div>Status</div>
            </div>
            <hr />
            {apiKeys.map((apiKey) => (
                <React.Fragment key={apiKey.id}>
                    <div
                        className="grid grid-cols-12 py-2 flex justify-center items-center"
                        key={apiKey.id}
                    >
                        <div className='col-span-3'>{apiKey.description}</div>
                        <div className='col-span-7'>{hideString(apiKey.token_hash)}</div>
                        <div>
                            {isPastDate(apiKey.expires_at) ? (
                                <span className="text-red-500">Expired</span>
                            ) : (
                                <span className="text-green-500">Active</span>
                            )}
                        </div>
                        <div className="col-span-1">
                            <DeleteAPIKey apiKey={apiKey} getAPIKeys={getAPIKeys}/>
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

export default ManageAPIKeys;
