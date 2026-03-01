import Link from "next/link";
import { cn } from "@/lib/utils";

export function FinalCtaSection() {
  return (
		<section
			className='bg-muted/20 mx-auto px-6 md:px-12 py-20 md:py-28 border border-foreground/20 rounded-3xl'
			aria-labelledby='final-cta-heading'
		>
			<div className='flex sm:flex-row flex-col justify-between items-start sm:items-center gap-8 mx-auto max-w-[1400px]'>
				<h2
					id='final-cta-heading'
					className='font-serif text-foreground text-2xl md:text-3xl tracking-tight'
				>
					Ready to build?
				</h2>
				<div className='flex flex-wrap gap-3'>
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
		</section>
	);
}
