import { getUserOnServer } from '@/utils/supabase/user';
import CreateOrg from '@/components/CreateOrg';
import OrgCreationSuccess from '@/components/OrgCreationSuccess';
import UsageDashboard from '@/components/UsageDashboard';
import { redirect } from 'next/navigation';
import ManageSelfInvites from '@/components/ManageSelfInvites';

export default async function Index() {
    const user = await getUserOnServer();

    if (!user) return redirect('/login');

    return (
        <div className="flex w-full flex-1 flex-col items-center">
            <CreateOrg userId={user.id} />
            <OrgCreationSuccess />
            <UsageDashboard />
            <ManageSelfInvites />
        </div>
    );
}
