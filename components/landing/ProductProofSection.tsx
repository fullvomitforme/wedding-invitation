import { DashboardMockup } from "./DashboardMockup";
import { cn } from "@/lib/utils";

export function ProductProofSection() {
  return (
		<section
			className='mx-auto px-6 md:px-12 py-20 md:py-28 border border-foreground/20 rounded-3xl'
			aria-labelledby='product-heading'
		>
			<div className='items-center gap-12 lg:gap-16 grid grid-cols-1 lg:grid-cols-12'>
				<div className='order-2 lg:order-1 lg:col-span-5'>
					<h2
						id='product-heading'
						className='mb-6 font-serif text-foreground text-3xl md:text-4xl tracking-tight'
					>
						Modular blocks. Live preview.
					</h2>
					<p className='mb-4 text-muted-foreground text-lg leading-relaxed'>
						Command panel. Live preview. Toggle sections, edit content, release
						to a custom subdomain—no code.
					</p>
					<p
						className={cn(
							'text-muted-foreground/80 text-xs uppercase tracking-[0.2em]',
						)}
					>
						Design tool meets event technology
					</p>
				</div>
				<div className='order-1 lg:order-2 lg:col-span-7'>
					<DashboardMockup className='ml-0 lg:ml-auto w-full max-w-[480px]' />
				</div>
			</div>
		</section>
	);
}
