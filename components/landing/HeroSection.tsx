import Link from "next/link";
import { DashboardMockup } from "./DashboardMockup";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center px-6 md:px-12 py-16 md:py-24 max-w-[1400px] mx-auto"
      aria-labelledby="hero-heading"
    >
      <div className="lg:col-span-5 xl:col-span-6 space-y-8">
        <h1
          id="hero-heading"
          className={cn(
            "font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[64px] leading-[1.1] tracking-tight text-foreground",
            "landing-reveal",
            "animate-[landing-reveal_0.4s_ease-out_both]"
          )}
          style={{ animationDelay: "0ms" }}
        >
          Engineer your moment.
        </h1>
        <p
          className={cn(
            "text-lg text-muted-foreground max-w-[28ch]",
            "landing-reveal",
            "animate-[landing-reveal_0.4s_ease-out_both]"
          )}
          style={{ animationDelay: "80ms" }}
        >
          Structured digital experiences. Modular systems. Built to scale.
        </p>
        <div
          className={cn(
            "flex flex-wrap gap-3",
            "landing-reveal",
            "animate-[landing-reveal_0.4s_ease-out_both]"
          )}
          style={{ animationDelay: "160ms" }}
        >
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
      <div
        className={cn(
          "lg:col-span-7 xl:col-span-6 flex justify-end",
          "landing-reveal",
          "animate-[landing-reveal_0.45s_ease-out_both]"
        )}
        style={{ animationDelay: "240ms" }}
      >
        <DashboardMockup className="w-full max-w-[520px]" />
      </div>
    </section>
  );
}
