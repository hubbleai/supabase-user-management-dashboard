'use client';

import { useState, Suspense } from 'react';
import { createClient } from '@/utils/supabase/client';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import Loader from '@/components/ui/Loader';

const supabase = createClient();

enum LoginPageForm {
    AUTHENTICATION = "AUTHENTICATION",
    PASSWORD_RESET = "PASSWORD_RESET",
}

enum AuthState {
    Idle = "IDLE",
    SigningIn = "SIGNING_IN",
    SigningUp = "SIGNING_UP",
    SendingEmailForReset = "SENDING_EMAIL_FOR_RESET",
}

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loginPageForm, setLoginPageForm] = useState(LoginPageForm.AUTHENTICATION)
    const [authState, setAuthState] = useState(AuthState.Idle);

    const { user, loading } = useAuthStore();

    const signIn = async () => {
        setAuthState(AuthState.SigningIn);
        const { error } = await supabase.auth.signInWithPassword(
            {
                email,
                password,
            }
        );
        setAuthState(AuthState.Idle);

        return router.push(
            error
                ? "/login?message=Could not authenticate user"
                : "/"
        )
    };

    const signUp = async () => {
        setAuthState(AuthState.SigningUp);
        const { error } = await supabase.auth.signUp(
            {
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            }
        );
        setAuthState(AuthState.Idle);

        return router.push(
            error
                ? "/login?message=Could not authenticate user."
                : "/login?message=Check your email to continue sign up."
        );
    };

    const sendEmailForReset = async () => {
        setAuthState(AuthState.SendingEmailForReset);
        const { error } = await supabase.auth.resetPasswordForEmail(
            email,
            {
                redirectTo: `${window.location.origin}/reset-password`
            }
        );
        setAuthState(AuthState.Idle)

        return router.push(
            error
                ? "/login?message=Could not send email for password reset."
                : "/login?message=Check your email to continue with password reset."
        )
    } 

    if (user) {
        router.push('/');
        return null;
    }

    if (loading) {
        return (
            <div className="mx-auto mt-10 flex w-full items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <div className="mx-auto mt-10 flex w-full flex-1 flex-col justify-center gap-2 px-8 sm:max-w-md">
                {/* Suspense wrapper added for useSearchParams */}
                <Suspense fallback={<div>Loading...</div>}>
                    <SearchParamsComponent />
                </Suspense>
                { 
                    loginPageForm == LoginPageForm.AUTHENTICATION && 
                    <AuthFormComponent
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        authState={authState}
                        setAuthState={setAuthState}
                        signIn={signIn}
                        signUp={signUp}
                        setLoginPageForm={setLoginPageForm}
                    />
                }
                {
                    loginPageForm == LoginPageForm.PASSWORD_RESET &&
                    <SendEmailForResetForm
                        email={email}
                        setEmail={setEmail}
                        authState={authState}
                        sendEmailForPasswordReset={sendEmailForReset}
                        setLoginPageForm={setLoginPageForm}
                    />
                }
            </div>
        </Suspense>
    );
}

const SearchParamsComponent = () => {
    const searchParams = useSearchParams();
    const message = searchParams.get('message');
    return message ? (
        <p className="my-3 rounded-md border border-zinc-300 bg-zinc-100 px-4 py-3 text-zinc-700">
            <AlertCircle className="w-5 mr-2 inline-flex" /> {message}
        </p>
    ) : null;
}

const AuthFormComponent = ({
    email,
    setEmail,
    password,
    setPassword,
    authState,
    setAuthState,
    signIn,
    signUp,
    setLoginPageForm,
}: {
    email: string;
    setEmail: (email: string) => void;
    password: string;
    setPassword: (password: string) => void;
    authState: AuthState;
    setAuthState: (authState: AuthState) => void;
    signIn: () => Promise<void>;
    signUp: () => Promise<void>;
    setLoginPageForm: (loginPageForm: LoginPageForm) => void;
}) => {
    return (
        <>
            <label className="text-md font-semibold" htmlFor="email">
                Email
            </label>
            <input
                className="mb-4 rounded-md border bg-inherit px-4 py-2"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <label className="text-md font-semibold" htmlFor="password">
                Password
            </label>
            <input
                className="mb-4 rounded-md border bg-inherit px-4 py-2"
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
                className="mb-2 rounded-md bg-[#00A87A] px-4 py-2 text-white"
            >
                {authState === AuthState.SigningIn
                    ? 'Signing In...'
                    : 'Sign In'}
            </button>
            <button
                type="button"
                onClick={signUp}
                disabled={authState !== AuthState.Idle}
                className="rounded-md border border-foreground/20 px-4 py-2 text-foreground"
            >
                {authState === AuthState.SigningUp
                    ? 'Signing Up...'
                    : 'Sign Up'}
            </button>
            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={() => setLoginPageForm(LoginPageForm.PASSWORD_RESET)}
                    disabled={authState !== AuthState.Idle}
                    className="w-fit focus:outline-none  justify-center text-zinc-500 hover:text-zinc-700 text-sm underline"
                >
                    Need to reset your password?
                </button>
            </div>
        </>
    );
}

const SendEmailForResetForm = (
    {
        email,
        setEmail,
        authState,
        sendEmailForPasswordReset,
        setLoginPageForm,

    } : {
        email: string;
        setEmail: (email: string) => void;
        authState: AuthState;
        sendEmailForPasswordReset: () => Promise<void>;
        setLoginPageForm: (loginPageForm: LoginPageForm) => void;
    }
) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-md" htmlFor="email">
                Please enter the email address for your account.
            </label>
            <input
                className="mb-4 rounded-md border bg-inherit px-4 py-2"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            
            <button
                type="button"
                onClick={sendEmailForPasswordReset}
                disabled={authState !== AuthState.Idle}
                className="mb-2 rounded-md bg-[#00A87A] hover:bg-[#00A87A]/85 px-4 py-2 text-white"
            >
                {authState === AuthState.SendingEmailForReset
                    ? 'Sending Reset Email'
                    : 'Reset Password'}
            </button>
            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={() => setLoginPageForm(LoginPageForm.AUTHENTICATION)}
                    disabled={authState !== AuthState.Idle}
                    className="w-fit focus:outline-none  justify-center text-zinc-500 hover:text-zinc-700 text-sm underline"
                >
                    Go back
                </button>
            </div>
        </div>
    );
}
