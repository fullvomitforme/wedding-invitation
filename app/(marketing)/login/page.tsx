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

  return (
    <div className="flex min-h-screen flex-col bg-surface-auth px-4 py-8 text-text-inverse">
      <div className="flex justify-center">
        <BrandMark />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md border border-border-subtle bg-surface-secondary/80 text-text-primary backdrop-blur-sm shadow-lg">
          <CardHeader className="space-y-3">
            <CardTitle className="font-serif text-display-md tracking-tight text-text-primary">
              Access the Platform.
            </CardTitle>
            <CardDescription className="text-sm text-text-secondary">
              Structured systems for digital moments.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
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
                  className="border border-border-subtle bg-transparent text-text-primary placeholder:text-text-tertiary"
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
                  className="border border-border-subtle bg-transparent text-text-primary placeholder:text-text-tertiary"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-text-inverse text-text-primary hover:bg-text-secondary disabled:opacity-70 focus-visible:ring-action-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-auth"
                disabled={loading}
              >
                {loading ? "Signing in…" : "Enter Attimo"}
              </Button>
              <div className="flex items-center justify-between text-caption text-text-tertiary">
                <Link
                  href="/forgot-password"
                  className="text-action-primary underline-offset-4 hover:underline focus-visible:ring-action-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-auth"
                >
                  Forgot password?
                </Link>
                <p className="text-right">
                  <span className="hidden sm:inline">Need access?</span>{" "}
                  <Link
                    href="/signup"
                    className="text-action-primary underline-offset-4 hover:underline focus-visible:ring-action-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-auth"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
