import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AttimoLanding } from "@/components/landing/AttimoLanding";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Attimo Studios — Digital experience systems",
  description:
    "Structured digital experiences. Modular systems. Built to scale. Engineer your moment.",
};

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session?.user) redirect("/dashboard");

  return <AttimoLanding />;
}
