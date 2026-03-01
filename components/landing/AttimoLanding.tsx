import { LandingNav } from "./LandingNav";
import { HeroSection } from "./HeroSection";
import { ValueSection } from "./ValueSection";
import { ProductProofSection } from "./ProductProofSection";
import { TrustSection } from "./TrustSection";
import { FinalCtaSection } from "./FinalCtaSection";
import Link from "next/link";

export function AttimoLanding() {
  return (
		<div className='bg-background p-5 min-h-screen text-foreground dark'>
			<main id='main-content' className='space-y-7'>
				<LandingNav />
				<HeroSection />
				<ValueSection />
				<ProductProofSection />
				<TrustSection />
				<FinalCtaSection />
			</main>
			<footer className='px-6 md:px-12 py-8 border-white/[0.06] border-t'>
				<div className='flex sm:flex-row flex-col justify-between items-center gap-4 mx-auto max-w-[1400px] text-muted-foreground text-sm'>
					<span>Attimo Studios — Digital experience systems</span>
					<Link
						href='/login'
						className='rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:text-foreground'
					>
						Sign in
					</Link>
				</div>
			</footer>
		</div>
	);
}
