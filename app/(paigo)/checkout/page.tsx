import Checkout from "@/components/Checkout";
import { useServerOrganizationMember } from "@/hooks/useOrganizationMember";
import { authenticatePage } from "@/utils/auth";

const CheckoutPage = async () => {
    const [user, secret] = await authenticatePage()
    const organizationMember = await useServerOrganizationMember(secret)

    return <Checkout secret={secret} organizationMember={organizationMember} />;
}

export default CheckoutPage;