import Link from "next/link";

export default function NewWeddingPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">New wedding</h1>
      <p className="text-foreground/70">
        Create a new wedding invitation. The create flow will be wired in the next step.
      </p>
      <Link href="/dashboard" className="text-sm underline">
        ← Back to dashboard
      </Link>
    </div>
  );
}
