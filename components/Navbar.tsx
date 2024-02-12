import React from 'react';
import AuthButton from './AuthButton';
import Link from 'next/link';

function Navbar() {
    return (
        <nav className="flex h-16 w-full justify-center border-b border-b-foreground/10">
            <div className="flex w-full max-w-4xl items-center justify-between p-3 text-sm">
                <Link href="/">
                    <h1 className="text-2xl font-bold text-zinc-700">Carbon</h1>
                </Link>
                <AuthButton />
            </div>
        </nav>
    );
}

export default Navbar;
