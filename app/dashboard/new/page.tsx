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
      <div className="rounded-md border border-white/6 bg-[#141416] px-6 py-6">
        <h2 className="text-lg font-semibold text-neutral-50">New wedding</h2>
        <p className="text-sm text-neutral-400 mt-1">Creating your wedding…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-md border border-white/6 bg-[#141416] px-6 py-6 space-y-4">
        <h2 className="text-lg font-semibold text-neutral-50">New wedding</h2>
        <p className="text-sm text-red-300" role="alert">{error}</p>
        <Button variant="outline" asChild className="border-white/10 text-neutral-200 hover:bg-white/5 focus-visible:ring-[#BFA14A]">
          <Link href="/dashboard">← Back to dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-white/6 bg-[#141416] px-6 py-6">
      <h2 className="text-lg font-semibold text-neutral-50">New wedding</h2>
      <p className="text-sm text-neutral-400 mt-1">Redirecting…</p>
    </div>
  );
}
