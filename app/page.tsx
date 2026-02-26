import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user) redirect("/dashboard");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="max-w-lg text-center space-y-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
          Create your wedding invitation
        </h1>
        <p className="text-foreground/70">
          Build a beautiful, shareable invitation with your own subdomain. Manage content, RSVPs, and wishes in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="min-h-[44px] inline-flex items-center justify-center rounded bg-foreground text-background px-6 py-3 font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-foreground/30 focus-visible:ring-2"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="min-h-[44px] inline-flex items-center justify-center rounded border border-gray-300 px-6 py-3 font-medium text-foreground hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-foreground/20 focus-visible:ring-2"
          >
            Sign in
          </Link>
        </div>
        <p className="text-sm text-foreground/60">
          <Link href="/demo" className="underline hover:no-underline">
            View demo invitation
          </Link>
        </p>
      </div>
    </div>
  );
}
