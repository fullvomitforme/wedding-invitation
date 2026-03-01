interface BrandTaglineProps {
  pageType: "login" | "signup";
}

export function BrandTagline({ pageType }: BrandTaglineProps) {
  const isLogin = pageType === "login";

  return (
    <div className="landing-reveal space-y-4">
      <h1 className="font-serif text-3xl md:text-5xl font-semibold text-foreground tracking-tight">
        {isLogin ? "Welcome back." : "Create your account."}
      </h1>
      <p className="text-sm md:text-base text-muted-foreground max-w-md">
        {isLogin
          ? "Continue where you left off. Manage your invitations, track RSVPs, and create beautiful digital moments."
          : "Access structured systems for digital moments. Create beautiful invitations, share instantly, and track RSVPs in real-time."}
      </p>
    </div>
  );
}
