'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useOrgsStore } from '@/store/useOrgsStore';
import { CheckCircle } from 'lucide-react';

function OrgCreationSuccess() {
    const searchParams = useSearchParams();
    const org = useOrgsStore((state) => state.orgs)[0];

    const search = searchParams.get('orgCreated');

    if (search === 'true') {
        return (
            <div className="my-10 flex flex-col rounded-xl bg-[#506385] px-10 py-5 font-mono text-white">
                <h1 className="flex w-full items-center text-2xl text-white">
                    <CheckCircle className="mr-2 stroke-[3px]" />
                    Success
                </h1>
                <h2>
                    <span className="underline underline-offset-4">
                        {org.org_name}
                    </span>{' '}
                    is now active on of Carbon. 🎉
                </h2>
            </div>
        );
    } else {
        return null;
    }
}

export default OrgCreationSuccess;
