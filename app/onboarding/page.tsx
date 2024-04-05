
import { authenticatePage } from "@/utils/auth";
import { useServerOrganizationMember } from "@/hooks/useOrganizationMember";
import Onboarding from "@/components/Onboarding";
import { redirect } from "next/navigation";
 
const OnboardingPage = async () => {
    const [user, secret] = await authenticatePage()
    const organizationMember = await useServerOrganizationMember(secret, false)
    if (organizationMember) {
        redirect("/api-keys")
    }

    return <Onboarding user={user} secret={secret}/>
}

export default OnboardingPage;