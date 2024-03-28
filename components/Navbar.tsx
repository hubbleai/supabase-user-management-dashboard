import React from 'react';
import OrgSelector from '@/components/OrgSelector';
import UserNav from '@/components/UserNav';
import Link from 'next/link';
import { IoBookOutline } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";


function Navbar() {
    return (
        <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
            <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
                <OrgSelector/>
                <div className="flex gap-2 items-center">         
                                      <UserNav/>
                </div>
               
            </div>
        </nav>
    );
}

export default Navbar;
