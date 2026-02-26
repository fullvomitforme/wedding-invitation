import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Access — Attimo Studios",
  description: "Request access to Attimo Studios.",
};

export default function RequestAccessPage() {
  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-6 md:px-12 py-6">
        <Link
          href="/"
          className="font-serif text-lg tracking-tight text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          Attimo
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 max-w-md mx-auto text-center">
        <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-foreground mb-4">
          Request access
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          We’re opening access in waves. Share your email and we’ll be in touch.
        </p>
        <a
          href="mailto:access@attimo.studio?subject=Request%20access%20to%20Attimo"
          className="min-h-[44px] inline-flex items-center justify-center rounded-lg px-6 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Email us to request access
        </a>
        <p className="mt-8 text-sm text-muted-foreground">
          <Link
            href="/"
            className="hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
