"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function DashboardHeader() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <header className="flex items-center justify-between border-b border-border px-4 py-3">
      <Link href="/dashboard" className="font-semibold text-foreground">
        Dashboard
      </Link>
      <nav className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          Log out
        </Button>
      </nav>
    </header>
  );
}
