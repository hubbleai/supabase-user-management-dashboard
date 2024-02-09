import React from "react";
import AuthButton from "./AuthButton";
import Link from "next/link";

function Navbar() {
  return (
    <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
      <div className='w-full max-w-4xl flex justify-between items-center p-3 text-sm'>
        <Link href='/'>
          <h1 className='text-2xl font-bold text-zinc-700'>Carbon</h1>
        </Link>
        <AuthButton />
      </div>
    </nav>
  );
}

export default Navbar;
