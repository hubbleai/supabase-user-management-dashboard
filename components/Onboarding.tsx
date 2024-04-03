"use client"

import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/Form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { requestCarbon } from "@/utils/carbon";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    firstName: z.string().min(1, { message: "This field is required." }).max(64),
    lastName: z.string().min(1, { message: "This field is required." }).max(64),
    password: z.string().min(6, { message: "Must be at least 6 characters." }).max(64),
})

const supabase = createClient()

const Onboarding = (
    props: {
        user: User,
        secret: string,
    }
) => {
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter();
    const { toast } = useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        const { error } = await supabase.auth.updateUser({ password: values.password })
        const response = await requestCarbon(
            null,
            "POST",
            "/customer/onboard",
            { 
                email: props.user.email,
                first_name: values.firstName,
                last_name: values.lastName,
                supabase_id: props.user.id,
                secret: props.secret,
            },
        )
        setIsLoading(false)

        if (error || response.status !== 200){
            toast({ description: "An error occured."})
        } else {
            router.push("/api-keys")
        }
    }

    return (
       
        <div className="mx-auto mt-10 w-full px-8 sm:max-w-md">

            <div className="border rounded-lg border-none py-3 px-4 text-sm mb-4 bg-green-200">You've successfully accepted the invitation! Please create your account.</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Password" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button className="bg-[#00A87A] hover:bg-[#00A87A]/85" type="submit">
                        {isLoading && "Joining"}
                        {!isLoading && "Join"}
                    </Button>
                </form>
            </Form>
        </div>
    )

}

export default Onboarding