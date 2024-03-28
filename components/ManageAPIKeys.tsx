'use client';

import React, { useEffect, useState } from 'react';
import CreateAPIKeys, { APIKey } from '@/components/CreateAPIKeys';
import { OrganizationMember } from '@/hooks/useOrganizationMember';
import { User } from '@supabase/supabase-js';
import DeleteAPIKey from './DeleteAPIKey';
import { requestCarbon } from '@/utils/carbon';
import { useToast } from './ui/use-toast';

type ListAPIKeysResponse = {
    data: APIKey[];
    count: number;
}

const isPastDate = (date: Date) =>  date <= new Date()

function ManageAPIKeys(
    props: { 
        user: User,
        organizationMember: OrganizationMember,
        secret: string,
    }
) {
    const [apiKeys, setAPIKeys] = useState<APIKey[]>([]);

    const { toast } = useToast();

    const getAPIKeys = async () => {
        // TODO implement pages for api keys
        // Organizations are limited to 100 keys
        const response = await requestCarbon(props.secret, "GET", "/customer/api_key?limit=100")
        if (response.status !== 200) {
            toast({ description: "An error occured. Please try again." })
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

            <div className="flex items-center justify-between pb-12">
                <div>
                    <h1 className="font-bold text-lg">Manage API Keys</h1>
                    <p className=""> Create or manage your API keys here.</p>
                </div>

                <CreateAPIKeys organizationMember={props.organizationMember} secret={props.secret} />
            </div>
           
            <div className="font-regular grid grid-cols-12 text-md pb-2 font-semibold text-black">
                <div className='col-span-3 text-md'>Label</div>
                <div className='text-md'>Status</div>
                <div className='col-span-7 px-4 text-md'>Secret</div>
            </div>
            <hr />
            {apiKeys.map((apiKey) => (
                <React.Fragment key={apiKey.id}>
                    <div
                        className="grid grid-cols-12 text-sm justify-center items-center"
                        key={apiKey.id}
                    >
                        <div className='col-span-3 font-semibold'>{apiKey.description}</div>
                        <div>
                            {isPastDate(apiKey.expires_at) ? (
                                <span className="text-white bg-red-600 rounded-lg px-2 py-1 text-sm">Expired</span>
                            ) : (
                                <span className="text-white bg-green-600 rounded-lg px-2 py-1 text-sm">Active</span>
                            )}
                        </div>
                        <div className='col-span-7 px-4'>{apiKey.token_hash}</div>
                     
                        <div className="col-span-1">
                            <DeleteAPIKey apiKey={apiKey} getAPIKeys={getAPIKeys} secret={props.secret}/>
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

export default ManageAPIKeys;
