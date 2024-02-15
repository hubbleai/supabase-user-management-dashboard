'use client';

import { useInvitesStore } from '@/store/useInvitesStore';
import { createClient } from '@/utils/supabase/client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Invite, InviteStatus } from '@/types/supabase';
import { useToast } from '@/components/ui/use-toast';
import { useAuthStore } from '@/store/useAuthStore';

function ManageSelfInvites() {
    const { invites } = useInvitesStore();
    const { toast } = useToast();
    const { user } = useAuthStore();

    // Filtered invites: email matches user email & status is pending
    const filteredInvites = invites.filter(
        (invite: Invite) =>
            invite.recipient_email === user?.email &&
            invite.status === InviteStatus.Pending
    );

    const acceptInvite = async (invite: Invite) => {
        if (!user) {
            toast({ description: 'User not authenticated' });
            return;
        }

        const supabase = createClient();

        // Step 1: Update the invite status to 'accepted'
        const { error: updateError } = await supabase
            .from('invites')
            .update({ status: InviteStatus.Accepted })
            .match({ invite_id: invite.invite_id });

        if (updateError) {
            console.error(
                'Failed to update invite status:',
                updateError.message
            );
            toast({ description: 'Failed to accept invite.' });
            return;
        }

        // Step 2: Insert a row in user_org_roles table
        const { error: insertError } = await supabase
            .from('user_org_roles')
            .insert([
                {
                    user_id: user.id,
                    org_id: invite.org_id,
                    role_id: invite.role_id,
                },
            ]);

        if (insertError) {
            console.error(
                'Failed to insert user into org:',
                insertError.message
            );
            toast({ description: 'Failed to accept invite.' });
            return;
        }

        // If everything is successful
        toast({
            title: 'Invite accepted successfully.',
            description: 'You have been added to the organization.',
        });
    };

    const rejectInvite = async (invite: Invite) => {
        if (!user) {
            toast({ description: 'User not authenticated' });
            return;
        }

        const supabase = createClient();

        // Step 1: Update the invite status to 'declined'
        const { error: updateError } = await supabase
            .from('invites')
            .update({ status: InviteStatus.Declined })
            .match({ invite_id: invite.invite_id });

        if (updateError) {
            console.error(
                'Failed to update invite status:',
                updateError.message
            );
            toast({ description: 'Failed to decline invite.' });
            return;
        }

        // If everything is successful
        toast({
            title: 'Invite declined.',
            description: 'You have declined the invite.',
        });
    };

    return (
        <div className="mx-auto mt-10 flex w-full max-w-lg flex-col rounded-lg border border-zinc-200 p-5 shadow-md">
            <h3 className="text-xl font-semibold leading-10 text-zinc-700">
                Manage Invites
            </h3>
            <h4 className="text-md text-zinc-500">
                Accept or reject invites to join organizations
            </h4>
            <hr className="my-5" />
            {filteredInvites.length > 0 ? (
                filteredInvites.map((invite) => (
                    <div
                        key={invite.invite_id}
                        className="mt-4 flex items-center justify-between"
                    >
                        <div className="flex items-center divide-x">
                            <h5 className="pr-2 text-lg font-semibold">
                                {invite.org_name ?? 'Organization'}
                            </h5>
                            <p className="pl-2 text-zinc-500">
                                {invite.role_id}
                            </p>
                        </div>
                        <div className="flex">
                            <Button
                                variant="outline"
                                className="mr-2"
                                onClick={() => acceptInvite(invite)}
                            >
                                Accept
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => rejectInvite(invite)}
                            >
                                Decline
                            </Button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center text-zinc-500">
                    No pending invites.
                </div>
            )}
        </div>
    );
}

export default ManageSelfInvites;
