import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { createHmac } from "crypto";
import { cookies } from "next/headers";

const hash = (input: string): string => {
  const hmac = createHmac("sha256", Buffer.from(process.env.HMAC_KEY || "", 'hex'))
  return hmac.update(input).digest("hex")
}

export const getUserOnServer = async (): Promise<[User | null, string | null]> => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("ERROR:", error)

  if (!user) {
    return [null, null]
  }

  // When an auth.users is created, a trigger activates and creates a row in the
  // public.users table. That trigger is also responsible for generating a secret
  // using pgcrypto for the user.
  const { data } = await supabase.from("users")
    .select("secret")
    .eq("id", user.id)
  const secret: string | null = data ? hash(data[0].secret) : null

  return [user, secret];
};
