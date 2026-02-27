"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrandMark } from "@/components/BrandMark";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromGoogle = searchParams.get("from") === "google";
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [brideNickname, setBrideNickname] = useState("");
  const [groomNickname, setGroomNickname] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const userEmail = session?.user?.email ?? "";

  useEffect(() => {
    if (fromGoogle && userEmail) {
      setEmail(userEmail);
    }
  }, [fromGoogle, userEmail]);

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
    const displayName =
      name.trim() ||
      [brideNickname.trim(), groomNickname.trim()]
        .filter(Boolean)
        .join(" & ") ||
      "Guest";
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
		<div className='flex min-h-screen flex-col bg-auth-surface px-4 py-8 text-neutral-200'>
			<div className='flex justify-center'>
				<Link href='/'>
					<BrandMark />
				</Link>
			</div>
			<div className='flex flex-1 items-center justify-center'>
				<Card className='w-full max-w-md border border-white/10 bg-neutral-900/80 text-neutral-100 backdrop-blur-sm shadow-[0_18px_60px_rgba(0,0,0,0.65)] '>
					<CardHeader className='space-y-3'>
						<CardTitle className='font-serif text-3xl tracking-tight text-neutral-50'>
							Create an account.
						</CardTitle>
						<CardDescription className='text-sm text-neutral-300'>
							Access structured systems for digital moments.
						</CardDescription>
					</CardHeader>
					<form onSubmit={handleSubmit} className='space-y-8'>
						<CardContent className='space-y-4'>
							{error && (
								<p
									className='rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive'
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
									className='border border-white/10 bg-transparent text-neutral-100 placeholder:text-neutral-500 transition-[border-color,box-shadow,background-color] duration-250 ease-out focus-visible:border-primary focus-visible:bg-white/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
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
									className='border border-white/10 bg-transparent text-neutral-100 placeholder:text-neutral-500 transition-[border-color,box-shadow,background-color] duration-250 ease-out focus-visible:border-primary focus-visible:bg-white/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary read-only:bg-white/5 read-only:text-neutral-400'
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
									className='border border-white/10 bg-transparent text-neutral-100 placeholder:text-neutral-500 transition-[border-color,box-shadow,background-color] duration-250 ease-out focus-visible:border-primary focus-visible:bg-white/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
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
									className='border border-white/10 bg-transparent text-neutral-100 placeholder:text-neutral-500 transition-[border-color,box-shadow,background-color] duration-250 ease-out focus-visible:border-primary focus-visible:bg-white/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='bride-nickname'>Bride nickname</Label>
								<Input
									id='bride-nickname'
									type='text'
									value={brideNickname}
									onChange={(e) => setBrideNickname(e.target.value)}
									autoComplete='off'
									placeholder='e.g. Ana'
									className='border border-white/10 bg-transparent text-neutral-100 placeholder:text-neutral-500 transition-[border-color,box-shadow,background-color] duration-250 ease-out focus-visible:border-primary focus-visible:bg-white/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
								/>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='groom-nickname'>Groom nickname</Label>
								<Input
									id='groom-nickname'
									type='text'
									value={groomNickname}
									onChange={(e) => setGroomNickname(e.target.value)}
									autoComplete='off'
									placeholder='e.g. Budi'
									className='border border-white/10 bg-transparent text-neutral-100 placeholder:text-neutral-500 transition-[border-color,box-shadow,background-color] duration-250 ease-out focus-visible:border-primary focus-visible:bg-white/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
								/>
							</div>
							<div className='flex items-start gap-2 pt-2 text-xs text-neutral-400'>
								<Checkbox
									id='terms'
									checked={acceptTerms}
									onCheckedChange={(checked) => setAcceptTerms(checked === true)}
									className='mt-0.5'
								/>
								<label htmlFor='terms' className='cursor-pointer leading-snug'>
									I agree to the{" "}
									<button
										type='button'
										onClick={() => setShowTerms(true)}
										className='text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-auth-surface'
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
								className='w-full bg-neutral-100 text-foreground transition-colors duration-250 ease-out hover:bg-neutral-200 disabled:opacity-70 disabled:hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-auth-surface'
								disabled={loading || googleLoading}
							>
								{loading ? 'Creating account…' : 'Create account'}
							</Button>
							<div className='relative py-1 text-[11px] uppercase tracking-[0.18em] text-neutral-500'>
								<div className='absolute inset-y-1 left-0 right-0 border-t border-white/10' />
								<span className='relative mx-auto inline-block bg-neutral-900 px-2'>
									Or continue with
								</span>
							</div>
							<Button
								type='button'
								variant='outline'
								onClick={handleGoogleSignUp}
								className='flex w-full items-center justify-center gap-2 border-white/15 bg-transparent text-neutral-100 hover:bg-white/5 disabled:opacity-70'
								disabled={loading || googleLoading}
							>
								<span className='inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#4285F4]'>
									G
								</span>
								<span>{googleLoading ? 'Connecting to Google…' : 'Sign up with Google'}</span>
							</Button>
							<p className='text-center text-xs text-neutral-500'>
								Already have an account?{' '}
								<Link
									href='/login'
									className='underline-offset-4 transition-colors duration-250 ease-out hover:text-neutral-300 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
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
					className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4'
					aria-modal='true'
					role='dialog'
					aria-labelledby='terms-title'
				>
					<div className='max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-xl bg-card p-6 text-card-foreground shadow-[0_24px_80px_rgba(0,0,0,0.75)]'>
						<div className='mb-4 flex items-start justify-between gap-4'>
							<div>
								<h2 id='terms-title' className='text-lg font-semibold tracking-tight'>
									Terms of Use
								</h2>
							</div>
							<button
								type='button'
								onClick={() => setShowTerms(false)}
								className='inline-flex size-8 items-center justify-center rounded-full border border-border text-sm text-neutral-500 hover:bg-muted hover:text-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
								aria-label='Close terms of use'
							>
								×
							</button>
						</div>
						<p className='mb-3 text-sm text-neutral-700'>
							By continuing, you agree to the following terms for using this invitation platform:
						</p>
						<ul className='mb-6 list-disc space-y-2 pl-5 text-sm text-neutral-700'>
							<li>
								We may use invitations created on the platform as portfolio examples (with anonymised or dummy data).
							</li>
							<li>
								All transactions processed through the platform are handled with industry-standard security practices.
							</li>
							<li>
								We will not share sensitive personal data with third parties, except as required by law.
							</li>
							<li>
								We may deactivate an invitation if its content violates our policies or applicable laws.
							</li>
						</ul>
						<div className='flex justify-end'>
							<Button 
								type='button'
								className='bg-neutral-900 text-neutral-50 hover:bg-neutral-800'
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
