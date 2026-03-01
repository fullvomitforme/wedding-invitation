"use client";

import { useState } from 'react';
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { BrandMark } from "@/components/BrandMark";
import { AuthLeftPanel } from '@/components/auth/AuthLeftPanel';

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromGoogle = searchParams.get("from") === "google";
  const { data: session } = useSession();
  const userEmail = session?.user?.email ?? '';
	const [email, setEmail] = useState(fromGoogle ? userEmail : '');
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!acceptTerms) {
      const msg = "Please accept the terms of use to continue.";
      setError(msg);
      toast.error(msg);
      return;
    }

    if (fromGoogle) {
      toast.success("Signed in with Google.");
      router.push("/dashboard");
      return;
    }

    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    const displayName = name.trim() || 'Guest';
    const { data, error: err } = await authClient.signUp.email({
      email: normalizedEmail,
      password,
      name: displayName,
      callbackURL: "/dashboard",
    });
    setLoading(false);
    if (err) {
      const msg = err.message ?? "Sign up failed";
      setError(msg);
      toast.error(msg);
      return;
    }
    if (data) {
      toast.success("Account created.");
      router.push("/dashboard");
    }
  }

  async function handleGoogleSignUp() {
    setError(null);
    setGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/signup?from=google",
      });
    } catch (err) {
      console.error(err);
      toast.error("Google sign up failed. Please try again.");
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
				<AuthLeftPanel pageType='signup' />
			</div>
			<div className='flex flex-1 justify-center items-center'>
				<Card className='bg-background shadow-[0_18px_60px_rgba(0,0,0,0.65)] backdrop-blur-sm border-border/10 w-full md:max-w-md text-foreground dark/80'>
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
								<Label htmlFor='name'>Name</Label>
								<Input
									id='name'
									type='text'
									value={name}
									onChange={(e) => setName(e.target.value)}
									autoComplete='name'
									placeholder='Your name'
									className='bg-transparent focus-visible:bg-accent/20 border-border/10 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary placeholder:text-muted-foreground transition-[border-color,box-shadow,background-color] duration-250 ease-out'
								/>
							</div>
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
									readOnly={fromGoogle}
									className='bg-transparent focus-visible:bg-accent/20 read-only:bg-muted/50 border-border/10 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary placeholder:text-muted-foreground read-only:text-muted-foreground transition-[border-color,box-shadow,background-color] duration-250 ease-out'
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
									autoComplete='new-password'
									placeholder='••••••••'
									className='bg-transparent focus-visible:bg-accent/20 border-border/10 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary placeholder:text-muted-foreground transition-[border-color,box-shadow,background-color] duration-250 ease-out'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='whatsapp'>Active WhatsApp number</Label>
								<Input
									id='whatsapp'
									type='tel'
									value={whatsapp}
									onChange={(e) => setWhatsapp(e.target.value)}
									autoComplete='tel'
									placeholder='6289XXXXXXXX'
									className='bg-transparent focus-visible:bg-accent/20 border-border/10 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary placeholder:text-muted-foreground transition-[border-color,box-shadow,background-color] duration-250 ease-out'
								/>
							</div>
							<div className='flex items-start gap-2 pt-2 text-muted-foreground text-xs'>
								<Checkbox
									id='terms'
									checked={acceptTerms}
									onCheckedChange={(checked) =>
										setAcceptTerms(checked === true)
									}
									className='mt-0.5'
								/>
								<label htmlFor='terms' className='leading-snug cursor-pointer'>
									I agree to the{' '}
									<button
										type='button'
										onClick={() => setShowTerms(true)}
										className='focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-auth-surface text-primary hover:underline underline-offset-4'
									>
										terms of use
									</button>
									.
								</label>
							</div>
						</CardContent>
						<CardFooter className='flex flex-col gap-4'>
							<Button
								type='submit'
								className='bg-background hover:bg-muted disabled:hover:bg-background disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background w-full text-foreground transition-colors duration-250 ease-out'
								disabled={loading || googleLoading}
							>
								{loading ? 'Creating account…' : 'Create account'}
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
								onClick={handleGoogleSignUp}
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
									{googleLoading ? 'Connecting to Google…' : 'Google'}
								</span>
							</Button>
							<p className='text-muted-foreground text-xs text-center'>
								Already have an account?{' '}
								<Link
									href='/login'
									className='focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:text-foreground hover:underline underline-offset-4 transition-colors duration-250 ease-out'
								>
									Sign in
								</Link>
							</p>
						</CardFooter>
					</form>
				</Card>
			</div>
			{showTerms && (
				<div
					className='z-50 fixed inset-0 flex justify-center items-center bg-black/60 px-4'
					aria-modal='true'
					role='dialog'
					aria-labelledby='terms-title'
				>
					<div className='bg-background shadow-[0_24px_80px_rgba(0,0,0,0.75)] p-6 rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto text-card-foreground dark'>
						<div className='flex justify-between items-start gap-4 mb-4'>
							<div>
								<h2
									id='terms-title'
									className='font-semibold text-lg tracking-tight'
								>
									Terms of Use
								</h2>
							</div>
							<button
								type='button'
								onClick={() => setShowTerms(false)}
								className='inline-flex justify-center items-center hover:bg-muted border border-border rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background size-8 text-muted-foreground hover:text-foreground text-sm'
								aria-label='Close terms of use'
							>
								×
							</button>
						</div>
						<p className='mb-3 text-card-foreground text-sm'>
							By continuing, you agree to the following terms for using this
							invitation platform:
						</p>
						<ul className='space-y-2 mb-6 pl-5 text-card-foreground text-sm list-disc'>
							<li>
								We may use invitations created on the platform as portfolio
								examples (with anonymised or dummy data).
							</li>
							<li>
								All transactions processed through the platform are handled with
								industry-standard security practices.
							</li>
							<li>
								We will not share sensitive personal data with third parties,
								except as required by law.
							</li>
							<li>
								We may deactivate an invitation if its content violates our
								policies or applicable laws.
							</li>
						</ul>
						<div className='flex justify-end'>
							<Button
								type='button'
								className='bg-background hover:bg-muted text-foreground dark'
								onClick={() => {
									setAcceptTerms(true);
									setShowTerms(false);
								}}
							>
								I agree to the terms of use
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
