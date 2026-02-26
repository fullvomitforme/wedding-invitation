import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { DashboardNav } from "./DashboardNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold">
          Dashboard
        </Link>
        <DashboardNav />
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
