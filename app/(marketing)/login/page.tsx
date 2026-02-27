"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrandMark } from "@/components/BrandMark";

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
    <div className="flex min-h-screen flex-col bg-auth-surface px-4 py-8 text-neutral-200">
      <div className="flex justify-center">
        <Link href="/">
          <BrandMark />
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md border border-white/10 bg-neutral-900/80 text-neutral-100 backdrop-blur-sm shadow-[0_18px_60px_rgba(0,0,0,0.65)]">
          <CardHeader className="space-y-3">
            <CardTitle className="font-serif text-3xl tracking-tight text-neutral-50">
              Access the Platform.
            </CardTitle>
            <CardDescription className="text-sm text-neutral-300">
              Structured systems for digital moments.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} className="space-y-8">
            <CardContent className="space-y-4">
              {error && (
                <p
                  className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  role="alert"
                >
                  {error}
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="border border-white/10 bg-transparent text-neutral-100 placeholder:text-neutral-500 transition-[border-color,box-shadow,background-color] duration-250 ease-out focus-visible:border-primary focus-visible:bg-white/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="border border-white/10 bg-transparent text-neutral-100 placeholder:text-neutral-500 transition-[border-color,box-shadow,background-color] duration-250 ease-out focus-visible:border-primary focus-visible:bg-white/2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-neutral-100 text-foreground transition-colors duration-250 ease-out hover:bg-neutral-200 disabled:opacity-70 disabled:hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-auth-surface"
                disabled={loading || googleLoading}
              >
                {loading ? "Signing in…" : "Enter Attimo"}
              </Button>
              <div className="relative py-1 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                <div className="absolute inset-y-1 left-0 right-0 border-t border-white/10" />
                <span className="relative mx-auto inline-block bg-neutral-900 px-2">
                  Or continue with
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-2 border-white/15 bg-transparent text-neutral-100 hover:bg-white/5 disabled:opacity-70"
                disabled={loading || googleLoading}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-semibold text-[#4285F4]">
                  G
                </span>
                <span>{googleLoading ? "Connecting to Google…" : "Sign in with Google"}</span>
              </Button>
              <p className="text-center text-xs text-neutral-500">
                Need access?{" "}
                <Link
                  href="/signup"
                  className="underline-offset-4 transition-colors duration-250 ease-out hover:text-neutral-300 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-auth-surface"
                >
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
