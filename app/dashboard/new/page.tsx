"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewWeddingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("loading");
      setError(null);
      const res = await fetch("/api/weddings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
        credentials: "include",
      });
      if (cancelled) return;
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to create wedding");
        setStatus("error");
        return;
      }
      const data = (await res.json()) as { id: string };
      router.replace(`/dashboard/weddings/${data.id}`);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">New wedding</h1>
        <p className="text-foreground/70">Creating your wedding…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">New wedding</h1>
        <p className="text-red-600">{error}</p>
        <Link href="/dashboard" className="text-sm underline">
          ← Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New wedding</h1>
      <p className="text-foreground/70">Redirecting…</p>
    </div>
  );
}
