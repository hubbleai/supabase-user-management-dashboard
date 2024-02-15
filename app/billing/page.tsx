import { Button } from '@/components/ui/button';
import { authenticatePage } from '@/utils/auth';
import { Link2 } from 'lucide-react';
import React from 'react';

async function Billing() {
    await authenticatePage();

    return (
        <div className="flex min-h-48 items-center justify-center">
            <Button variant="default">
                Connect to Stripe <Link2 className="ml-2" />
            </Button>
        </div>
    );
}

export default Billing;
