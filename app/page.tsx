import { getUserOnServer } from '@/utils/supabase/user';
import CreateOrg from '@/components/CreateOrg';
import OrgCreationSuccess from '@/components/OrgCreationSuccess';

export default async function Index() {
    const user = await getUserOnServer();

    if (!user) return <div>Error fething user.</div>;

    return (
        <div className="flex w-full flex-1 flex-col items-center">
            <div className="w-full max-w-4xl px-3 opacity-0 animate-in">
                <CreateOrg userId={user.id} />
                <OrgCreationSuccess />
            </div>
        </div>
    );
}
