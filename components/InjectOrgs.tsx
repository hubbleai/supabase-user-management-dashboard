"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useOrgsStore } from "@/store/useOrgsStore";

const supabase = createClient();

const InjectOrgsState = () => {
  const { setOrgs } = useOrgsStore();

  // Function to fetch organizations and update the state
  const fetchAndUpdateOrgs = async () => {
    console.log("Fetching and updating organizations");

    let { data: orgs, error } = await supabase
      .from("organizations")
      .select("*");

    if (error) {
      console.error("Error fetching organizations:", error);
      return;
    }

    if (orgs) {
      setOrgs(orgs);
    }
  };

  useEffect(() => {
    // Fetch and set organizations on component mount
    fetchAndUpdateOrgs();

    const channel_1 = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_org_roles" },
        () => {
          // Refetch organizations upon any change to user_org_roles
          fetchAndUpdateOrgs();
        }
      )
      .subscribe();

    const channel_2 = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "organizations" },
        () => {
          // Refetch organizations upon any change to organizations
          fetchAndUpdateOrgs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel_1); // Clean up on component unmount
      supabase.removeChannel(channel_2);
    };
  }, [setOrgs]);

  return null;
};

export default InjectOrgsState;
