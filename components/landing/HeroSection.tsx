import Link from "next/link";
import { DashboardMockup } from "./DashboardMockup";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
		<section
			className='items-center gap-12 lg:gap-16 grid grid-cols-1 lg:grid-cols-12 mx-auto px-6 md:px-12 py-16 md:py-24 border border-foreground/20 rounded-3xl'
			aria-labelledby='hero-heading'
		>
			<div className='space-y-8 lg:col-span-5 xl:col-span-6'>
				<h1
					id='hero-heading'
					className={cn(
						'font-serif text-foreground lg:text-[64px] text-4xl sm:text-5xl md:text-6xl leading-[1.1] tracking-tight',
						'landing-reveal',
						'animate-[landing-reveal_0.4s_ease-out_both]',
					)}
					style={{ animationDelay: '0ms' }}
				>
					Engineer your moment.
				</h1>
				<p
					className={cn(
						'max-w-[28ch] text-muted-foreground text-lg',
						'landing-reveal',
						'animate-[landing-reveal_0.4s_ease-out_both]',
					)}
					style={{ animationDelay: '80ms' }}
				>
					Structured digital experiences. Modular systems. Built to scale.
				</p>
				<div
					className={cn(
						'flex flex-wrap gap-3',
						'landing-reveal',
						'animate-[landing-reveal_0.4s_ease-out_both]',
					)}
					style={{ animationDelay: '160ms' }}
				>
					<Link
						href='/signup'
						className={cn(
							'inline-flex justify-center items-center px-6 rounded-lg min-w-[44px] min-h-[44px] font-medium text-sm',
							'bg-primary text-primary-foreground hover:bg-primary/90',
							'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors',
						)}
					>
						Build with Attimo
					</Link>
					<Link
						href='/request-access'
						className={cn(
							'inline-flex justify-center items-center px-6 rounded-lg min-w-[44px] min-h-[44px] font-medium text-sm',
							'border border-border text-foreground hover:bg-accent/50',
							'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors',
						)}
					>
						Request Access
					</Link>
				</div>
			</div>
			<div
				className={cn(
					'flex justify-end lg:col-span-7 xl:col-span-6',
					'landing-reveal',
					'animate-[landing-reveal_0.45s_ease-out_both]',
				)}
				style={{ animationDelay: '240ms' }}
			>
				<DashboardMockup className='w-full max-w-[520px]' />
			</div>
		</section>
	);
}
