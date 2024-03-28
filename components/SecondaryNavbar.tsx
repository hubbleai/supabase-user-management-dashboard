'use client';

import React from 'react';
import SecondaryNavLinks from './SecondaryNavLinks';
import { useAuthStore } from '@/store/useAuthStore';
import { useOrgsStore } from '@/store/useOrgsStore';

function SecondaryNavbar() {
    const { user } = useAuthStore();

    const { activeOrg } = useOrgsStore();
    if (!user) return null;

    return (
        <div className="flex w-full flex-col items-center">
            <div className="w-full max-w-4xl px-3 opacity-0 animate-in">
                <main className="flex flex-1 flex-col">
                  
                    <SecondaryNavLinks />
                </main>
            </div>
        </div>
    );
}

export default SecondaryNavbar;
