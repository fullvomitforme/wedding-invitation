import Link from "next/link";
import { cn } from "@/lib/utils";

export function LandingNav() {
  return (
    <nav
      className="flex items-center justify-between px-6 md:px-12 py-6"
      aria-label="Main"
    >
      <Link
        href="/"
        className="font-serif text-lg tracking-tight text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
      >
        Attimo
      </Link>
      <div className="flex items-center gap-3">
        <Link
          href="/request-access"
          className={cn(
            "min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg px-4 text-sm font-medium",
            "text-muted-foreground hover:text-foreground border border-border/60 hover:border-border",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
          )}
        >
          Request Access
        </Link>
        <Link
          href="/signup"
          className={cn(
            "min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg px-4 text-sm font-medium",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
          )}
        >
          Build with Attimo
        </Link>
      </div>
    </nav>
  );
}
