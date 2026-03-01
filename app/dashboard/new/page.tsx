"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

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
        const msg = data.error ?? "Failed to create wedding";
        setError(msg);
        toast.error(msg);
        setStatus("error");
        return;
      }
      const data = (await res.json()) as { id: string };
      toast.success("Project created.");
      router.replace(`/dashboard/weddings/${data.id}`);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (status === "loading") {
    return (
      <div className="border-b border-border bg-card px-3 py-3">
        <h2 className="text-[16px] font-semibold text-foreground">New wedding</h2>
        <p className="text-[11px] text-tertiary-foreground mt-1">Creating your wedding…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="border-b border-border bg-card px-3 py-3 space-y-4">
        <h2 className="text-[16px] font-semibold text-foreground">New wedding</h2>
        <p className="text-[11px] text-destructive" role="alert">{error}</p>
        <Button variant="outline" asChild className="border border-border text-[11px] text-muted-foreground transition-all duration-150 hover:bg-white/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
          <Link href="/dashboard">← Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="border-b border-border bg-card px-3 py-3">
      <h2 className="text-[16px] font-semibold text-foreground">New wedding</h2>
      <p className="text-[11px] text-tertiary-foreground mt-1">Redirecting…</p>
    </div>
  );
}
