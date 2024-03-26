import { redirect } from 'next/navigation';
import { getUserOnServer } from './supabase/user';
import { User } from '@supabase/supabase-js';

export const authenticatePage = async (): Promise<[User, string]> => {
    const user_data = await getUserOnServer();
    const [user, secret] = user_data
    if (!user || !secret) {
        throw Error()
        // return redirect('/login');
    }
    return [user, secret];
};
