"use client"

import { useSearchParams } from 'next/navigation';
import { OrganizationMember } from "@/hooks/useOrganizationMember";
import { requestCarbon } from '@/utils/carbon';
import { useToast } from './ui/use-toast';
import { useEffect, useState } from 'react';
import Loader from './ui/Loader';

type GetPaigoCheckoutTokenResponse = {
    access_token: string
}

const Checkout = (
    props: {
        secret: string,
        organizationMember: OrganizationMember,
    },
) => {
    const [paigoParams, setPaigoParams] = useState<URLSearchParams>(new URLSearchParams())

    const queries = useSearchParams();
    const planId = queries.get("planId")

    const { toast } = useToast();

    const getPaigoCheckoutToken = async () => {
        if (!planId) {
            const response = await requestCarbon(props.secret, "GET", "/billing/paigo/checkout")
            if (response.status !== 200) {
                toast({ description: "An error occured. Please try again." })
            } else {
                const deserializedResponse: GetPaigoCheckoutTokenResponse = await response.json()
                setPaigoParams(new URLSearchParams({
                    token: deserializedResponse.access_token
                }))
            }

        } else {
            setPaigoParams(new URLSearchParams({
                token: process.env.NEXT_PUBLIC_PAIGO_CHECKOUT_TOKEN || "",
                offeringId: planId,
                name: props.organizationMember.organization.name,
                email: props.organizationMember.email,
                customerId: String(props.organizationMember.organization_id),
            }))
        }
    }

    useEffect(() => {
        getPaigoCheckoutToken();
    }, [planId])

    if (!paigoParams.toString()) {
        return <Loader />
    }

    console.log(paigoParams.toString())

    return (
        <div className="w-fill h-screen">
            {
                !planId && (
                    <iframe 
                        src={`https://console.paigo.tech/embedded/public/ff0f6eca-924a-46f4-a12d-6dce4a941bf3?${paigoParams.toString()}`}
                        width="100%"
                        height="100%"
                        title="Carbon Dev Price Table"
                    />
                )
            }
            {
                planId && (
                    <
                        iframe
                            src={`https://console.paigo.tech/embedded/public/b5087098-ab1e-4ce4-a442-e7931580fa19?${paigoParams.toString()}`}
                            width="100%"
                            height="100%"
                            title="Carbon Dev Onboarding" 
                    />
                )
            }
        </div>
    );
};

export default Checkout