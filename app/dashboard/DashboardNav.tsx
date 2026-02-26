"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function DashboardNav() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <nav className="flex items-center gap-4">
      <button
        type="button"
        onClick={handleSignOut}
        className="text-sm text-foreground/80 hover:text-foreground"
      >
        Log out
      </button>
    </nav>
  );
}
