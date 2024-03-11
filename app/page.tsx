import { getUserOnServer } from '@/utils/supabase/user';
import CreateOrg from '@/components/CreateOrg';
import OrgCreationSuccess from '@/components/OrgCreationSuccess';
import UsageDashboard from '@/components/UsageDashboard';
import { redirect } from 'next/navigation';
import ManageSelfInvites from '@/components/ManageSelfInvites';
import { useServerOrganizationMember } from '@/hooks/useOrganizationMember';

export default async function Index() {
    const user = await getUserOnServer();
    if (!user) return redirect('/login');

    const organizationMember = await useServerOrganizationMember(user.id)

    return (
        <div className="flex w-full flex-1 flex-col items-center">
            {!organizationMember && <CreateOrg user={user} />}
            {organizationMember?.organization && <OrgCreationSuccess organization={organizationMember.organization} /> }

            {/* TODO */}
            {/* <ManageSelfInvites />
            <UsageDashboard /> */}
        </div>
    );
}
