'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/Button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { IoBookOutline } from "react-icons/io5";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';

const supabase = createClient();

export default function UserNav() {
    const router = useRouter();

    const signOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const { user } = useAuthStore();

    if (!user) {
        return null;
    }

    return (
        <DropdownMenu>
              <Link href="mailto:derek@carbon.ai" className="flex border px-3 hover:bg-gray-50 py-1 rounded-md items-center gap-2"><IoMdHelpCircleOutline /> Help</Link>       
                    <Link href="https://docs.carbon.ai" className="flex border px-3 hover:bg-gray-50 py-1 rounded-md items-center gap-2"><IoBookOutline /> Docs</Link>

            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full ring ring-slate-200"
                >
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>
                            {user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mt-4" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {user?.email?.split('@')[0]}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem className="">
                        <button onClick={() => router.push("/api-keys")}>
                            Manage API Keys
                        </button>
                    </DropdownMenuItem>

                    <DropdownMenuItem className="">
                        <button onClick={() => router.push("/organization")}>
                            My Organization
                        </button>
                    </DropdownMenuItem>
                   
                    {/* <DropdownMenuItem>
                        <button onClick={() => router.push("/carbon-connect")}>
                            Carbon Connect
                        </button>
                    </DropdownMenuItem> */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <button onClick={signOut} className="w-full text-start">
                        Log out
                    </button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
