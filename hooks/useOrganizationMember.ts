// import { useCallback, useEffect, useState } from "react";
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

export async function useServerOrganizationMember(secret: string, isRedirectAllowed?: true): Promise<OrganizationMember>;
export async function useServerOrganizationMember(secret: string, isRedirectAllowed: false): Promise<OrganizationMember | null>;
export async function useServerOrganizationMember(secret: string, isRedirectAllowed?: boolean): Promise<OrganizationMember | null> {
    const response = await requestCarbon(secret, "GET", "/customer/me")
    if (response.status == 200) {
        const organizationMember: OrganizationMember = await response.json();
        return organizationMember;
    } else {
        return isRedirectAllowed ?? true ? redirect('/') : null
    }
}