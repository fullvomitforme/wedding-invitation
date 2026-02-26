import { DashboardMockup } from "./DashboardMockup";
import { cn } from "@/lib/utils";

export function ProductProofSection() {
  return (
    <section
      className="px-6 md:px-12 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-labelledby="product-heading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1">
          <h2
            id="product-heading"
            className="font-serif text-3xl md:text-4xl tracking-tight text-foreground mb-6"
          >
            Modular blocks. Live preview.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            Command panel. Live preview. Toggle sections, edit content, release
            to a custom subdomain—no code.
          </p>
          <p
            className={cn(
              "text-xs uppercase tracking-[0.2em] text-muted-foreground/80"
            )}
          >
            Design tool meets event technology
          </p>
        </div>
        <div className="lg:col-span-7 order-1 lg:order-2">
          <DashboardMockup className="w-full max-w-[480px] ml-0 lg:ml-auto" />
        </div>
      </div>
    </section>
  );
}
