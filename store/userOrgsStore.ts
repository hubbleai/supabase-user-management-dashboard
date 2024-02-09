// store/useOrgsStore.ts
import { Organization } from "@/types/supabase";
import { create } from "zustand";

interface OrgState {
  orgs: Organization[];
  setOrgs: (orgs: Organization[]) => void;
}

export const useOrgsStore = create<OrgState>((set) => ({
  orgs: [],
  setOrgs: (orgs) => set({ orgs }),
}));
