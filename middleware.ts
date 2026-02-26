import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Temporarily disable subdomain -> invitation rewrites in production
// so that prod/preview domains hit the normal App Router pages.

export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp3)$).*)",
  ],
};
