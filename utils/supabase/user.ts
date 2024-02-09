import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const getUserOnServer = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
};
