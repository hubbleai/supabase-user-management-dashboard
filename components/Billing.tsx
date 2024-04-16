"use client"

import { useEffect, useState } from "react";
import { OrganizationMember } from "@/hooks/useOrganizationMember"
import { requestCarbon } from "@/utils/carbon";
import { useToast } from "./ui/use-toast";
import Loader from "./ui/Loader";
import { useRouter } from "next/navigation";

type GetPaigoTokenResponse = {
    access_token: string | null
}

const Billing = (
    props: {
        secret: string,
        organizationMember: OrganizationMember,
    },
) => {
    const [token, setToken] = useState("")

    const router = useRouter();
    const { toast } = useToast();

    const getPaigoToken = async () => {
        const response = await requestCarbon(props.secret, "GET", "/billing/paigo")
        if (response.status !== 200) {
            toast({ description: "An error occured. Please try again." })
        } else {
            const deserializedResponse: GetPaigoTokenResponse = await response.json()
            if (!deserializedResponse.access_token) {
                router.push("/checkout")
            } else {
                setToken(deserializedResponse.access_token)
            }
        }
    }
    
    useEffect(() => {
        getPaigoToken();
    }, [])

    if (!token) {
        return (
            <div className="mx-auto mt-10 flex w-full items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <div className="w-screen h-screen">
            <iframe
                src={`https://console.paigo.tech/embedded/public/668d7cca-8293-458a-aa4b-5f0c5aa75f30?template=template1&token=${token}`}
                width="100%"
                height="100%"
                title="Carbon Billing Dashboard" 
            />
        </div>
    );
};

export default Billing;