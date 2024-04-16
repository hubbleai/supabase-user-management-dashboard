import React from 'react';
import OrgSelector from '@/components/OrgSelector';
import UserNav from '@/components/UserNav';
import { authenticatePage } from '@/utils/auth';
import { getUserOnServer } from '@/utils/supabase/user';
import { useServerOrganizationMember } from '@/hooks/useOrganizationMember';


async function Navbar() {
    const user_data = await getUserOnServer();
    const [user, secret] = user_data

    return (
        <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
            <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
                <OrgSelector/>
                <div className="flex gap-2 items-center">         
                    <UserNav secret={secret}/>
                </div>
               
            </div>
        </nav>
    );
}

export default Navbar;
