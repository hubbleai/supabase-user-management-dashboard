'use client';

import React, { useState } from 'react';
import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useOrgsStore } from '@/store/useOrgsStore';
import { Status } from '@/types/common';
import Loader from '@/components/ui/Loader';
import { useRouter } from 'next/navigation';

export default function CreateOrg(props: { userId: string }) {
    // Global state
    const { orgs, loading } = useOrgsStore();

    // Local state
    const [orgName, setOrgName] = useState('');
    const [status, setStatus] = useState(Status.Idle);

    // utitlity hooks
    const { toast } = useToast();
    const router = useRouter();

    // create a new organization
    const createOrganization = async (orgName: string, userId: string) => {
        const supabase = createBrowserClient();

        const { error } = await supabase
            .from('organizations')
            .insert([
                {
                    org_name: orgName,
                    created_by: userId,
                },
            ])
            .single(); // Use .single() to expect a single row response

        if (error) {
            toast({
                description: 'Organization Creation Failed',
            });
            setStatus(Status.Idle);
        } else {
            toast({
                description: 'New Org Created',
            });
            setOrgName('');
        }
    };

    // assign self as admin of org
    const createAdminRoleForNewOrg = async (userId: string) => {
        const supabase = createBrowserClient();

        // Fetch the latest organization created by the user
        const { data: orgs, error: orgsError } = await supabase
            .from('organizations')
            .select('org_id,org_name')
            .eq('created_by', userId)
            .order('created_at', { ascending: false })
            .limit(1);

        if (orgsError || !orgs.length) {
            toast({
                description: 'Failed to find a new org for the user',
            });
            return;
        }

        const orgId = orgs[0].org_id;
        const orgName = orgs[0].org_name;

        // Check if the user already has a role in the selected organization
        const { data: roles, error: rolesError } = await supabase
            .from('user_org_roles')
            .select('role_id')
            .eq('user_id', userId)
            .eq('org_id', orgId);

        if (rolesError) {
            toast({
                description: 'Error checking existing roles',
            });
            return;
        }

        if (roles.length === 0) {
            // User does not have a role in this organization, proceed to assign
            const { error } = await supabase.from('user_org_roles').insert([
                {
                    user_id: userId,
                    org_id: orgId,
                    role_id: 'admin',
                },
            ]);

            if (error) {
                toast({
                    description: 'Failed to assign admin role',
                });
                setStatus(Status.Idle);
            } else {
                toast({
                    description: `You are now admin of ${orgName}`,
                });
            }
        } else {
            toast({
                description: 'User already has a role in org: ' + orgName,
            });
            setStatus(Status.Idle);
        }
    };

    const handleOrgCreation = async (orgName: string) => {
        setStatus(Status.Loading);
        await createOrganization(orgName, props.userId);
        await createAdminRoleForNewOrg(props.userId);
        setStatus(Status.Success);
        router.push('/?orgCreated=true');
    };

    if (orgs.length > 0 || loading) {
        return null;
    }

    return (
        <div className="mx-auto mt-10 flex w-full max-w-lg flex-col rounded-lg border border-zinc-200 p-5 shadow-md">
            <h3 className="text-xl font-bold leading-10 text-zinc-600">
                Let's get you started
            </h3>
            <h4 className="text-md text-zinc-500">
                Write display name of your organization. You can change this
                later in settings.
            </h4>
            <input
                type="text"
                placeholder="Maple St. Inc."
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                autoFocus
                className="text-md my-4 rounded-lg border border-zinc-200 bg-zinc-100 p-2 transition-colors duration-300 ease-in-out focus:border-zinc-400 focus:outline-none"
            />
            <button
                onClick={() => {
                    handleOrgCreation(orgName);
                }}
                disabled={!orgName}
                className="my-4 flex items-center justify-center rounded-lg border bg-zinc-900 px-4 py-2 text-white transition-colors duration-300 ease-in-out hover:bg-zinc-950 disabled:cursor-not-allowed  disabled:border-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-400"
            >
                {status === Status.Loading && (
                    <Loader color="bg-zinc-200" className="mr-2" />
                )}
                Create Org
            </button>
        </div>
    );
}
