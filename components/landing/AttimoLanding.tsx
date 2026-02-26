import { LandingNav } from "./LandingNav";
import { HeroSection } from "./HeroSection";
import { ValueSection } from "./ValueSection";
import { ProductProofSection } from "./ProductProofSection";
import { TrustSection } from "./TrustSection";
import { FinalCtaSection } from "./FinalCtaSection";
import Link from "next/link";

export function AttimoLanding() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:rounded-lg focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background bg-primary text-primary-foreground"
      >
        Skip to content
      </a>
      <LandingNav />
      <main id="main-content">
        <HeroSection />
        <ValueSection />
        <ProductProofSection />
        <TrustSection />
        <FinalCtaSection />
      </main>
      <footer className="px-6 md:px-12 py-8 border-t border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>Attimo Studios — Digital experience systems</span>
          <Link
            href="/login"
            className="hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
          >
            Sign in
          </Link>
        </div>
      </footer>
    </div>
  );
}
