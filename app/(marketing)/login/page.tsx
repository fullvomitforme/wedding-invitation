"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BrandMark } from "@/components/BrandMark";
import { AuthLeftPanel } from '@/components/auth/AuthLeftPanel';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const { data, error: err } = await authClient.signIn.email({
      email: normalizedEmail,
      password,
      callbackURL: "/dashboard",
    });
    setLoading(false);
    if (err) {
      const msg = err.message ?? "Sign in failed";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (data) {
      toast.success("Signed in.");
      router.push("/dashboard");
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (err) {
      console.error(err);
      toast.error("Google sign in failed. Please try again.");
      setGoogleLoading(false);
    }
  }

  return (
		<div className='gap-8 grid grid-cols-1 md:grid-cols-2 bg-background px-4 py-8 min-h-screen text-muted-foreground dark'>
			<div className='flex flex-col justify-between'>
				<div className='flex justify-between items-center gap-8'>
					<Link href='/'>
						<BrandMark />
					</Link>
				</div>
				<AuthLeftPanel pageType='login' />
			</div>
			<div className='flex flex-1 justify-center items-center'>
				<Card className='bg-background shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-sm border-border/10 w-full text-foreground dark/80'>
					<form onSubmit={handleSubmit} className='space-y-8'>
						<CardContent className='space-y-4'>
							{error && (
								<p
									className='bg-destructive/10 px-3 py-2 border border-destructive/50 rounded-md text-destructive text-sm'
									role='alert'
								>
									{error}
								</p>
							)}
							<div className='space-y-2'>
								<Label htmlFor='email'>Email</Label>
								<Input
									id='email'
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									autoComplete='email'
									placeholder='you@example.com'
									className='bg-transparent focus-visible:bg-accent/20 border-border/10 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary placeholder:text-muted-foreground transition-[border-color,box-shadow,background-color] duration-250 ease-out'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='password'>Password</Label>
								<Input
									id='password'
									type='password'
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									autoComplete='current-password'
									placeholder='••••••••'
									className='bg-transparent focus-visible:bg-accent/20 border-border/10 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary placeholder:text-muted-foreground transition-[border-color,box-shadow,background-color] duration-250 ease-out'
								/>
							</div>
						</CardContent>
						<CardFooter className='flex flex-col gap-4'>
							<Button
								type='submit'
								className='bg-background hover:bg-muted disabled:hover:bg-background disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background w-full text-foreground transition-colors duration-250 ease-out'
								disabled={loading || googleLoading}
							>
								{loading ? 'Signing in…' : 'Enter Attimo'}
							</Button>
							<div className='relative py-1 text-[11px] text-muted-foreground uppercase tracking-[0.18em]'>
								<div className='right-0 left-0 absolute inset-y-1 border-border/10 border-t' />
								<span className='inline-block relative bg-background mx-auto px-2 dark'>
									Or continue with
								</span>
							</div>
							<Button
								type='button'
								variant='outline'
								onClick={handleGoogleSignIn}
								className='flex justify-center items-center gap-2 bg-transparent hover:bg-accent/10 disabled:opacity-70 border-border/15 w-full'
								disabled={loading || googleLoading}
							>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='w-4 h-4'
									viewBox='0 0 256 262'
								>
									<path
										fill='#4285f4'
										d='M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027'
									/>
									<path
										fill='#34a853'
										d='M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1'
									/>
									<path
										fill='#fbbc05'
										d='M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z'
									/>
									<path
										fill='#eb4335'
										d='M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251'
									/>
								</svg>
								<span>
									{googleLoading
										? 'Connecting to Google…'
										: 'Sign in with Google'}
								</span>
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	);
}
