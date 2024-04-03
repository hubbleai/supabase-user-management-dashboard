'use client';

import React, { useEffect, useState } from 'react';
import CreateAPIKeys, { APIKey } from '@/components/CreateAPIKeys';
import { OrganizationMember } from '@/hooks/useOrganizationMember';
import { User } from '@supabase/supabase-js';
import DeleteAPIKey from './DeleteAPIKey';
import { requestCarbon } from '@/utils/carbon';
import { useToast } from './ui/use-toast';
import { 
    IoEyeOffOutline,
    IoEyeOutline,
    IoCloseCircleOutline,
    IoCopyOutline,
} from "react-icons/io5";
import { Button } from './ui/Button';

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

            {newKey && <NewAPIKeyCard newKey={newKey} setNewKey={setNewKey}/>}
           
            <div className="font-regular grid grid-cols-12 text-md pb-2 font-semibold text-black">
                <div className='col-span-3 text-md'>Label</div>
                <div className='text-md'>Status</div>
                <div className='col-span-7 px-4 text-md'>Secret</div>
            </div>
            <hr />
            {apiKeys.map((apiKey) => (
                <React.Fragment key={apiKey.id}>
                    <div
                        className="my-5 grid grid-cols-12 text-sm justify-center items-center"
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
                        <ListedApiKey value={apiKey.token_hash}/>

                        <div className="col-span-1 w-fill h-fill">
                            {
                                props.organizationMember.organization_admin && (
                                    <DeleteAPIKey
                                        apiKey={apiKey}
                                        getAPIKeys={getAPIKeys}
                                        secret={props.secret}
                                        newKey={newKey}
                                        setNewKey={setNewKey}
                                    />
                                )
                            }
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}

const NewAPIKeyCard = (
    props: {
        newKey: APIKey,
        setNewKey: (newKey: null) => void,
    },
) => {
    const [isVisible, setIsVisible] = useState(false);

    const { toast } = useToast();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(props.newKey?.token_hash || "")
        toast({ description: "Copied to clipboard." })
    }

    return (
        <div className="mb-8 border p-4 rounded-lg">
            <div className='flex justify-between'>
                <h3 className="text-lg font-semibold">New API Key</h3>
                <Button
                    variant="ghost"
                    className='w-fit h-fit p-0 self-start hover:bg-transparent'
                    onClick={() => props.setNewKey(null)}
                >
                    <IoCloseCircleOutline className='h-5 w-5' />
                </Button>
            </div>
            
            
            <p className="text-sm text-zinc-500 pb-2">
                Please save this key since it will not be shown again.
            </p>
            <div className="mt-2 h-14 flex justify-between items-center rounded-lg bg-zinc-100 p-4">
                <NewApiKey value={props.newKey.token_hash} isVisible={isVisible}/>
                <div className='flex'>
                    <Button
                        variant="ghost"
                        className="w-fit h-fit p-0 mx-2"
                        onClick={copyToClipboard}
                    >
                        <IoCopyOutline/>
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-fit h-fit p-0 mx-2"
                        onClick={() => setIsVisible(!isVisible)}
                    >
                        {isVisible && <IoEyeOffOutline/>}
                        {!isVisible && <IoEyeOutline/>}
                    </Button>
                    
                </div>
            </div>
        </div>

    );
}

const NewApiKey = (
    props: { 
        value: string,
        isVisible: boolean,
    }
) => {
    const displayedValue = props.isVisible
        ? props.value
        : "*".repeat(props.value.length)

    const component = (
        <span className="leading-7 [&:not(:first-child)]:mt-6">
            {displayedValue}
        </span>
    )

    return props.isVisible
        ? component 
        : <div className="h-5">{component}</div>;
}

const ListedApiKey = (props: { value: string }) => {
    return (
        <div className='col-span-7 px-4'>
            {props.value.slice(0, 2)}
            <span className="align-sub">{"*".repeat(props.value.length - 4)}</span>
            {props.value.slice(props.value.length - 2)}
        </div>
    );
}

export default ManageAPIKeys;
