import Billing from '@/components/Billing';
import { useServerOrganizationMember } from '@/hooks/useOrganizationMember';
import { authenticatePage } from '@/utils/auth';

async function BillingPage() {
    const [user, secret] = await authenticatePage()
    const organizationMember = await useServerOrganizationMember(secret)

    return <Billing secret={secret} organizationMember={organizationMember} />;
}

export default BillingPage;
