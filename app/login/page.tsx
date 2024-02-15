'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AlertCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Loader from '@/components/ui/Loader';
import { Suspense } from 'react';

const supabase = createClient();

enum AuthState {
    Idle = 'IDLE',
    SigningIn = 'SIGNING_IN',
    SigningUp = 'SIGNING_UP',
}

export default function Login() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const message = searchParams.get('message');
    const [authState, setAuthState] = useState(AuthState.Idle);

    const { user, loading } = useAuthStore();

    const signIn = async () => {
        setAuthState(AuthState.SigningIn);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setAuthState(AuthState.Idle);
            return router.push('/login?message=Could not authenticate user');
        }
        return router.push('/');
    };

    const signUp = async () => {
        setAuthState(AuthState.SigningUp);
        const origin = window.location.origin;

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            },
        });

        if (error) {
            setAuthState(AuthState.Idle);
            return router.push('/login?message=Could not authenticate user');
        }

        setAuthState(AuthState.Idle);
        return router.push(
            '/login?message=Check email to continue sign in process'
        );
    };

    if (user) {
        router.push('/');
        return null;
    }

    if (loading) {
        return (
            <Suspense>
                <div className="mx-auto mt-10 flex w-full items-center justify-center">
                    <Loader />
                </div>
            </Suspense>
        );
    }

    return (
        <Suspense>
            <div className="mx-auto mt-10 flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
                <div className="flex w-full flex-1 flex-col justify-center gap-2 text-foreground animate-in">
                    <label className="text-md" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="mb-6 rounded-md border bg-inherit px-4 py-2"
                        name="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label className="text-md" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="mb-6 rounded-md border bg-inherit px-4 py-2"
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={signIn}
                        disabled={authState !== AuthState.Idle}
                        className="mb-2 rounded-md bg-zinc-800 px-4 py-2 text-white"
                    >
                        {authState === AuthState.SigningIn
                            ? 'Signing In...'
                            : 'Sign In'}
                    </button>
                    <button
                        type="button"
                        onClick={signUp}
                        disabled={authState !== AuthState.Idle}
                        className="mb-2 rounded-md border border-foreground/20 px-4 py-2 text-foreground"
                    >
                        {authState === AuthState.SigningUp
                            ? 'Signing Up...'
                            : 'Sign Up'}
                    </button>
                    {message && (
                        <p className="my-4 rounded-md border border-zinc-300 bg-zinc-100 p-4 text-zinc-700">
                            <AlertCircle className="mr-2 inline-flex" />{' '}
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </Suspense>
    );
}
