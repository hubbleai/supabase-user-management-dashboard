// import { useCallback, useEffect, useState } from "react";
import * as crypto from "crypto"
import { requestCarbon } from "@/utils/carbon";
import { redirect } from "next/navigation";

// TODO create interfaces for properties using any
// TODO move these interfaces into a dedicated file
export interface Organization {
    id: number;
    name: string;
    nickname?: string;
    remove_branding: boolean;
    custom_branding?: any;  
    custom_limits?: any;
    aggregate_file_size: any;
    aggregate_num_characters: any;
    aggregate_num_tokens: any;
    aggregate_num_embeddings: any;
    period_ends_at?: Date;
    cancel_at_period_end?: boolean;
}

export interface OrganizationMember {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
    organization_id: number;
    organization: Organization;
    organization_admin: boolean;
    created_at: Date;
    updated: Date;
}

interface OrganizationMemberResponse {
    organizationMember: OrganizationMember;
    encryptedId: string;
}

// NOTE may need to move this to another file
// export function useClientOrganizationMember(supabaseId: string) {
//     const [organizationMember, setOrganizationMember] = useState<OrganizationMember | null>(null);

//     const getOrganizationMember = useCallback(async () => {
//         const response = await fetch("localhost:8000/customer/me", {
//             method: "GET",
//             headers: {
//                 "Authorization": `Bearer ${supabaseId}`,
//             },
//         });
//         const deserializedResponse = await response.json();
//         setOrganizationMember(deserializedResponse);
//     }, [supabaseId]);

//     useEffect(() => {
//         getOrganizationMember();
//     }, [getOrganizationMember]);

//     return organizationMember;
// }

// NOTE encryption of the supbase id only works during server-side rendering for some reason
// This means the supabase id must be encrypted on the page component and be passed to child
// components. Attempting to encrypt the supabase id in in a child component will result in 
// a failed decryption.
const public_key = process.env.NEXT_PUBLIC_PUBLIC_KEY || ""
const encryptSupabaseId = (supabaseId: string): string => {
    const encrypted = crypto.publicEncrypt(
        {
            key: public_key.split(String.raw`\n`).join('\n'), 
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, 
            oaepHash: 'sha256'
        },
        Buffer.from(supabaseId),
    )
    return encrypted.toString('base64')
}

export async function useServerOrganizationMember(supabaseId: string): Promise<OrganizationMemberResponse> {
    const encryptedId = encryptSupabaseId(supabaseId)
    const response = await requestCarbon(encryptedId, "GET", "/customer/me")

    
    if (response.status == 200) {
        const organizationMember: OrganizationMember = await response.json();
        return { organizationMember, encryptedId };
    } else {
        const error_message = await response.json();
        console.log(response.status, error_message)
        return redirect('/')
    }
}