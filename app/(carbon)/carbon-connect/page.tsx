import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Form } from "@/components/ui/Form";
import { useServerOrganizationMember } from "@/hooks/useOrganizationMember";
import { authenticatePage } from "@/utils/auth";
import { useForm } from "react-hook-form";
import { z } from "zod";

// const formSchema = z.object({
//     username: z.string().min(2).max(50),
//   })

async function CarbonConnect() {
    const [user, secret] = await authenticatePage()
    const organizationMember = await useServerOrganizationMember(secret, false)

    // const form = useForm()

    return (
        <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                Carbon Connect
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-2 mb-6">
                Customize the appearance of your Carbon Connect component.
            </p>

            <Card className="my-3">
                <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* <Form>
                    </Form> */}
                </CardContent>
            </Card>

            <Card className="my-3">
                <CardHeader>
                    <CardTitle>White Labeling</CardTitle>
                </CardHeader>
                <CardContent>

                </CardContent>
            </Card>
        </div>
    );
}

export default CarbonConnect;