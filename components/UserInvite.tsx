'use client';

import React, { useState } from 'react';
import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { InviteStatus, RoleId } from '@/types/supabase';
import Loader from '@/components/ui/Loader';
import { useOrgsStore } from '@/store/useOrgsStore';
import { Button } from '@/components/ui/Button';
import { PlusCircle } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface InviteRequest {
    recipient_email: string;
    role_id: RoleId;
}

const UserInvite = () => {
    const [invites, setInvites] = useState<InviteRequest[]>([
        { recipient_email: '', role_id: RoleId.member },
    ]);
    const [loading, setLoading] = useState(false);

    const { activeOrg } = useOrgsStore();
    const { toast } = useToast();

    const sendInvites = async () => {
        setLoading(true);

        // Filter out invalid emails before sending
        const validInvites = invites.filter((invite) =>
            checkIfEmailIsValid(invite.recipient_email)
        );
        if (validInvites.length !== invites.length) {
            toast({
                description:
                    'One or more emails are invalid. Please correct them before creating invites.',
            });
            setLoading(false);
            return;
        }

        const supabase = createBrowserClient();
        const { error } = await supabase.from('invites').insert(
            validInvites.map((invite) => ({
                recipient_email: invite.recipient_email,
                role_id: invite.role_id,
                org_id: activeOrg?.org_id,
                org_name: activeOrg?.org_name,
                status: InviteStatus.Pending,
            }))
        );

        if (error) {
            toast({ description: 'Failed to create invites.' });
        } else {
            toast({
                title: 'Invites created successfully.',

                description: 'Invited users can now login.',
            });
            setInvites([{ recipient_email: '', role_id: RoleId.member }]); // Reset form
        }
        setLoading(false);
    };

    // Function to handle the addition of new invite fields
    const addInviteField = () => {
        setInvites([
            ...invites,
            { recipient_email: '', role_id: RoleId.member },
        ]);
    };

    return (
        <div className="mt-5 flex w-full flex-col">
            <h1 className="text-2xl font-semibold text-zinc-700">Members</h1>
            <h2 className="my-5 text-sm font-normal text-zinc-700">
                Manage and invite Team Members
            </h2>
            <div className="flex flex-col rounded-md border border-zinc-200 p-5">
                <h3>
                    Invite new members by email address to
                    <span className="font-semibold">
                        {' '}
                        {activeOrg?.org_name}
                    </span>
                </h3>
                <hr className="my-5" />
                <div className="grid grid-cols-2 gap-4">
                    <p className="text-sm">Email Address</p>
                    <p className="text-sm">Role</p>
                    {invites.map((invite, index) => (
                        <React.Fragment key={index}>
                            <input
                                type="email"
                                placeholder="Email address"
                                value={invite.recipient_email}
                                onChange={(e) => {
                                    const newInvites = [...invites];
                                    newInvites[index].recipient_email =
                                        e.target.value;
                                    setInvites(newInvites);
                                }}
                                className="mb-4 w-full rounded-lg border border-zinc-200 p-2 focus:border-zinc-400 focus:outline-none"
                            />
                            <Select
                                onValueChange={(value) => {
                                    const newInvites = [...invites];
                                    newInvites[index].role_id = value as RoleId;
                                    setInvites(newInvites);
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="member">
                                        Member
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </React.Fragment>
                    ))}
                    <Button onClick={addInviteField} variant={'outline'}>
                        Add Another Invite{' '}
                        <PlusCircle className="ml-2 size-5" />
                    </Button>
                </div>

                <button
                    onClick={sendInvites}
                    disabled={loading}
                    className="flex items-center justify-center self-end rounded-lg bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:bg-zinc-400"
                >
                    {loading && <Loader color="bg-zinc-200" className="mr-2" />}
                    {loading ? 'Creating Invites...' : 'Create Invites'}
                </button>
            </div>
        </div>
    );
};

// Helper function to validate email format
const checkIfEmailIsValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export default UserInvite;
