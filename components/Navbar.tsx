import React from 'react';
import OrgSelector from '@/components/OrgSelector';
import UserNav from '@/components/UserNav';

function Navbar() {
    return (
        <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
            <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
                <OrgSelector />
                <UserNav />
            </div>
        </nav>
    );
}

export default Navbar;
