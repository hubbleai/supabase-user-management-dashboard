import Organization from "@/components/Organization"
import { useServerOrganizationMember } from "@/hooks/useOrganizationMember"
import { authenticatePage } from "@/utils/auth"

const OrganizationPage = async () => {
    const [user, secret] = await authenticatePage()
    const organizationMember = await useServerOrganizationMember(secret)

    return <Organization secret={secret} organizationMember={organizationMember} />;
}

export default OrganizationPage