import { Organization } from "@/types/supabase";
import { initializeSupabase } from "./server";

export const getOrgsForUser = async (
  user_id: string
): Promise<Organization[]> => {
  const supabase = initializeSupabase();

  // First, get the org_ids for the user
  const { data: userOrgRoles, error: userOrgRolesError } = await supabase
    .from("user_org_roles")
    .select("org_id")
    .eq("user_id", user_id);

  if (userOrgRolesError) {
    throw userOrgRolesError;
  }

  // Extract org_ids from userOrgRoles
  const orgIds = userOrgRoles.map((role) => role.org_id);

  // Then, get organizations where org_id is in the orgIds array
  const { data: organizations, error: orgsError } = await supabase
    .from("organizations")
    .select("*")
    .in("org_id", orgIds);

  if (orgsError) {
    throw orgsError;
  }

  return organizations;
};
