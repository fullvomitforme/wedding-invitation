import Link from "next/link";
import { cn } from "@/lib/utils";

export function FinalCtaSection() {
  return (
    <section
      className="px-6 md:px-12 py-20 md:py-28 bg-muted/20 border-y border-white/[0.06]"
      aria-labelledby="final-cta-heading"
    >
      <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
        <h2
          id="final-cta-heading"
          className="font-serif text-2xl md:text-3xl tracking-tight text-foreground"
        >
          Ready to build?
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/signup"
            className={cn(
              "min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg px-6 text-sm font-medium",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
            )}
          >
            Build with Attimo
          </Link>
          <Link
            href="/request-access"
            className={cn(
              "min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg px-6 text-sm font-medium",
              "border border-border text-foreground hover:bg-accent/50",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
            )}
          >
            Request Access
          </Link>
        </div>
      </div>
    </section>
  );
}
