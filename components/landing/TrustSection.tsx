export function TrustSection() {
  return (
    <section
      className="px-6 md:px-12 py-20 md:py-28 max-w-[1400px] mx-auto"
      aria-labelledby="trust-heading"
    >
      <h2 id="trust-heading" className="sr-only">
        Platform capabilities
      </h2>
      <p className="text-foreground text-xl md:text-2xl font-medium mb-10">
        Built for scale. Deployed in minutes.
      </p>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-8 list-none p-0 m-0">
        <li className="flex gap-3">
          <span className="text-primary mt-0.5" aria-hidden>
            —
          </span>
          <span className="text-muted-foreground">
            Custom subdomains per project. Wildcard DNS, one deploy.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary mt-0.5" aria-hidden>
            —
          </span>
          <span className="text-muted-foreground">
            Multi-tenant from the ground up. Isolated data, shared infra.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="text-primary mt-0.5" aria-hidden>
            —
          </span>
          <span className="text-muted-foreground">
            Full control. Your content, your domain, no lock-in.
          </span>
        </li>
      </ul>
    </section>
  );
}
