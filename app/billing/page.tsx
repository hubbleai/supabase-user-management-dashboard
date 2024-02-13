import { authenticatePage } from '@/utils/auth';
import React from 'react';

async function Billing() {
    await authenticatePage();

    return <div className="">Connect with Stripe</div>;
}

export default Billing;
