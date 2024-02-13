import { redirect } from 'next/navigation';
import { getUserOnServer } from './supabase/user';

export const authenticatePage = async () => {
    const user = await getUserOnServer();
    if (!user) return redirect('/login');
};
