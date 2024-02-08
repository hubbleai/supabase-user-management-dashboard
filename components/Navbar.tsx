import React from "react";
import AuthButton from "./AuthButton";

function Navbar() {
  return (
    <nav className='w-full flex justify-center border-b border-b-foreground/10 h-16'>
      <div className='w-full max-w-4xl flex justify-between items-center p-3 text-sm'>
        <h1>Carbon</h1>
        <AuthButton />
      </div>
    </nav>
  );
}

export default Navbar;
