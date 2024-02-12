"use client";

import React from "react";
import { createClient as createBrowserClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useOrgsStore } from "@/store/useOrgsStore";

export default function CreateOrg(props: { userId: string }) {
  const { orgs } = useOrgsStore();

  const { toast } = useToast();
  // create a new organization
  const createOrganization = async (orgName: string, userId: string) => {
    const supabase = createBrowserClient();

    const { error } = await supabase
      .from("organizations")
      .insert([
        {
          org_name: orgName,
          created_by: userId,
        },
      ])
      .single(); // Use .single() to expect a single row response

    if (error) {
      toast({
        description: "Organization Creation Failed",
      });
    } else {
      toast({
        description: "New Org Created",
      });
    }
  };

  // assign self as admin of org
  const createAdminRoleForNewOrg = async (userId: string) => {
    const supabase = createBrowserClient();

    // Fetch the latest organization created by the user
    const { data: orgs, error: orgsError } = await supabase
      .from("organizations")
      .select("org_id,org_name")
      .eq("created_by", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (orgsError || !orgs.length) {
      toast({
        description: "Failed to find a new org for the user",
      });
      return;
    }

    const orgId = orgs[0].org_id;
    const orgName = orgs[0].org_name;

    // Check if the user already has a role in the selected organization
    const { data: roles, error: rolesError } = await supabase
      .from("user_org_roles")
      .select("role_id")
      .eq("user_id", userId)
      .eq("org_id", orgId);

    if (rolesError) {
      toast({
        description: "Error checking existing roles",
      });
      return;
    }

    if (roles.length === 0) {
      // User does not have a role in this organization, proceed to assign
      const { error } = await supabase.from("user_org_roles").insert([
        {
          user_id: userId,
          org_id: orgId,
          role_id: "admin",
        },
      ]);

      if (error) {
        toast({
          description: "Failed to assign admin role",
        });
      } else {
        toast({
          description: `You are now admin of ${orgName}`,
        });
      }
    } else {
      toast({
        description: "User already has a role in org: " + orgName,
      });
    }
  };

  const handleOrgCreation = async (orgName: string) => {
    await createOrganization(orgName, props.userId);
    await createAdminRoleForNewOrg(props.userId);
  };

  if (orgs.length > 0) {
    return null;
  }

  return (
    <div className='flex flex-col border border-zinc-200 shadow-md p-5 rounded-lg mx-auto w-full max-w-lg mt-10'>
      <h3 className='text-xl text-zinc-600 font-bold leading-10'>
        Name your organization
      </h3>
      <h4 className='text-md text-zinc-500'>
        You can change this later in settings.
      </h4>
      <input
        type='text'
        placeholder='Maple St. Inc.'
        className='border text-md bg-zinc-100 border-zinc-200 p-2 my-4 rounded-lg focus:outline-none focus:border-zinc-400 transition-colors duration-300 ease-in-out'
      />
      <button
        onClick={() => {
          handleOrgCreation("Maple St. Inc.");
        }}
        className='bg-zinc-800 text-white rounded-lg px-4 py-2 my-4 hover:bg-zinc-950 transition-colors duration-300 ease-in-out'
      >
        Create Org
      </button>
    </div>
  );
}
