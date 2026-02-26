import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAIN_HOSTS = new Set(["localhost", "127.0.0.1"]);

function getSubdomainSlug(host: string): string | null {
  const portStripped = host.replace(/:\d+$/, "");
  const parts = portStripped.split(".");
  if (parts.length < 2) return null;
  const first = parts[0]?.toLowerCase();
  if (!first || first === "www") return null;
  const isMainDomain = MAIN_HOSTS.has(parts[parts.length - 1] ?? "") && parts.length <= 2;
  if (isMainDomain && (parts[0] === "localhost" || parts[0] === "127.0.0.1")) return null;
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
