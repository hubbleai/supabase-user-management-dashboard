import React from "react";

function Footer() {
  return (
    <footer className='w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs'>
      <p>
        Powered by{" "}
        <a
          href='https://carbon.ai/?utm_source=rajeevnaruka.com'
          target='_blank'
          className='font-bold hover:underline'
          rel='noreferrer'
        >
          Carbon AI
        </a>
      </p>
    </footer>
  );
}

export default Footer;
