'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'API Keys', path: '/api-keys' },
    { name: 'Billing', path: '/billing' },
    { name: 'Settings', path: '/settings' },
];

function NavLink({
    name,
    path,
    isActive,
}: {
    name: string;
    path: string;
    isActive: boolean;
}) {
    return (
        <Link
            href={path}
            className={`px-2 ${isActive ? 'border-b-2 border-zinc-700' : ''}`}
        >
            {name}
        </Link>
    );
}

function SecondaryNavLinks() {
    const pathname = usePathname();

    return (
        <div className="mt-5 flex w-full border-b border-b-foreground/10">
            {navLinks.map(({ name, path }) => (
                <NavLink
                    key={path}
                    name={name}
                    path={path}
                    isActive={pathname === path}
                />
            ))}
        </div>
    );
}

export default SecondaryNavLinks;
