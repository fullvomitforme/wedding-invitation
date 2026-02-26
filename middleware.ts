import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAIN_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  // SaaS root domains (marketing + dashboard), no wedding slug here
  "attimostudios.heulaulab.tech",
  "attimo-studios.vercel.app",
]);

function getSubdomainSlug(host: string): string | null {
  const portStripped = host.replace(/:\d+$/, "");

  // If this is one of our main hosts, never treat it as a wedding slug domain.
  if (MAIN_HOSTS.has(portStripped.toLowerCase())) return null;

  const parts = portStripped.split(".");
  if (parts.length < 2) return null;
  const first = parts[0]?.toLowerCase();
  if (!first || first === "www") return null;

  return first;
}

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const slug = getSubdomainSlug(host);

  if (slug) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-wedding-slug", slug);
    return NextResponse.rewrite(new URL("/invitation", request.url), {
      request: { headers: requestHeaders },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3)$).*)",
  ],
};
