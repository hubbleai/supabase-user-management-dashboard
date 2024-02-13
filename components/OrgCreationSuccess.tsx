'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useOrgsStore } from '@/store/useOrgsStore';
import { CheckCircle } from 'lucide-react';

function OrgCreationSuccess() {
    const searchParams = useSearchParams();
    const { activeOrg } = useOrgsStore();

    const search = searchParams.get('orgCreated');

    if (!activeOrg) {
        return null;
    }

    if (search === 'true') {
        return (
            <div className="my-10 flex flex-col rounded-xl bg-[#506385] px-10 py-5 text-white animate-in">
                <h1 className="flex w-full items-center text-2xl  text-white animate-in">
                    <CheckCircle className="mr-2 stroke-[3px]" />
                    Success
                </h1>
                <h2 className="font-light text-zinc-200">
                    🎉
                    <span className="leading-tight underline underline-offset-4">
                        {activeOrg.org_name}
                    </span>{' '}
                    is now active on of Carbon. You can now manage your
                    organization, invite members and create API keys here.
                </h2>
            </div>
        );
    } else {
        return null;
    }
}

export default OrgCreationSuccess;
