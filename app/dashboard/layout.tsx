import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DashboardHeader } from "./DashboardHeader";

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
    <div className="min-h-screen bg-surface-auth text-text-primary">
      <DashboardHeader />
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">{children}</main>
    </div>
  );
}
