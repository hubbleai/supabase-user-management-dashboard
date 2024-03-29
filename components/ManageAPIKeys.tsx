'use client';

import React, { useEffect, useState } from 'react';
import CreateAPIKeys, { APIKey } from '@/components/CreateAPIKeys';
import { OrganizationMember } from '@/hooks/useOrganizationMember';
import { User } from '@supabase/supabase-js';
import DeleteAPIKey from './DeleteAPIKey';
import { requestCarbon } from '@/utils/carbon';
import { useToast } from './ui/use-toast';
import { IoCopyOutline } from "react-icons/io5";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";





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
    const [newKey, setNewKey] = useState<APIKey | null>(null);
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

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-bold text-lg">Manage API Keys</h1>
                    <p className=""> Create or manage your API keys here.</p>
                </div>

                <CreateAPIKeys
                    organizationMember={props.organizationMember}
                    secret={props.secret}
                    setNewKey={setNewKey}
                    getAPIKeys={getAPIKeys}
                />
            </div>

            {
                newKey && (
                    <div className="mb-8 border p-4 rounded-lg">
                        <h3 className="text-lg font-semibold">New API Key</h3>
                        <p className="text-sm text-zinc-500 pb-2">
                            Please save this key since it will not be shown again.
                        </p>
                        
                        <div className="mt-2 rounded-lg bg-zinc-100 p-4 flex justify-between items-center">
                            {/* added icons for you to use */} <div className="flex items-center"><IoEyeOffOutline className="mr-2"/><IoEyeOutline className="mr-2"/>{newKey.token_hash}</div>
                            <div><IoCopyOutline/></div>
                        </div>
                    </div>
                )
            }
           
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
                            <DeleteAPIKey
                                apiKey={apiKey}
                                getAPIKeys={getAPIKeys}
                                secret={props.secret}
                                newKey={newKey}
                                setNewKey={setNewKey}
                            />
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

export default ManageAPIKeys;
