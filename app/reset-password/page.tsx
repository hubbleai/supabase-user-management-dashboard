'use client';

import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

const supabase = createClient();

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    const updatePassword = async () => {
      setIsLoading(true)
      const { error } = await supabase.auth.updateUser({ password })
      setIsLoading(false)

      if (error) {
        toast({ description: error.message })
      } else {
        toast({ description: "Password updated." })
      }
    }

    return (
      <div className="flex flex-col gap-2 mx-auto mt-10 w-full flex-1 justify-center px-8 sm:max-w-md">
        <label className="text-md" htmlFor="passworc">
          Please enter a new password.
        </label>
        <input
            className="mb-4 rounded-md border bg-inherit px-4 py-2"
            type="password"
            name="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
            
        <button
            type="button"
            onClick={updatePassword}
            disabled={false}
            className="mb-2 rounded-md bg-zinc-800 px-4 py-2 text-white"
        >
          {
            isLoading
              ? 'Updating'
              : 'Update'
          }
        </button>
      </div>
    );
}

export default ResetPassword