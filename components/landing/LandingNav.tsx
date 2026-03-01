import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/BrandMark";

export function LandingNav() {
  return (
		<nav
			className='top-5 z-10 sticky flex justify-between items-center bg-background px-6 md:px-12 py-6 border border-foreground/20 rounded-3xl dark'
			aria-label='Main'
		>
			<Link
				href='/'
				className='inline-flex items-center rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
				aria-label='Attimo home'
			>
				<BrandMark />
			</Link>
			<div className='flex items-center gap-3'>
				<Link
					href='/request-access'
					className={cn(
						'inline-flex justify-center items-center px-4 rounded-lg min-w-[44px] min-h-[44px] font-medium text-sm',
						'text-muted-foreground hover:text-foreground border border-border/60 hover:border-border',
						'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors',
					)}
				>
					Request Access
				</Link>
				<Link
					href='/signup'
					className={cn(
						'inline-flex justify-center items-center px-4 rounded-lg min-w-[44px] min-h-[44px] font-medium text-sm',
						'bg-primary text-primary-foreground hover:bg-primary/90',
						'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors',
					)}
				>
					Build with Attimo
				</Link>
			</div>
		</nav>
	);
}
