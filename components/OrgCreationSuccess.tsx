'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Organization } from '@/hooks/useOrganizationMember';

function OrgCreationSuccess(props: { organization: Organization }) {
    const searchParams = useSearchParams();
    const isOrganizationNew = searchParams.get('orgCreated');

    if (!isOrganizationNew) {
        return null;
    }

    return (
        <div className="my-10 mx-8 flex flex-col rounded-xl bg-[#00A87A] px-10 py-5 text-white animate-in">
            <h1 className="flex w-full items-center text-2xl mt-3 text-white animate-in">
                <CheckCircle className="mr-2 stroke-[3px]" />
                Success
            </h1>
            <h2 className="font-light my-2 text-zinc-200">
                🎉
                <span className="leading-tight underline underline-offset-4">
                    {props.organization.name}
                </span>{' '}
                is now active on of Carbon. You can now manage your
                organization, invite members and create API keys here.
            </h2>
        </div>
    );
}

export default OrgCreationSuccess;
