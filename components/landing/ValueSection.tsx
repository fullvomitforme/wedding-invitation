export function ValueSection() {
  return (
		<section
			className='mx-auto px-6 md:px-12 py-20 md:py-28 border border-foreground/20 rounded-3xl'
			aria-labelledby='value-heading'
		>
			<div className='max-w-2xl'>
				<h2
					id='value-heading'
					className='mb-6 font-serif text-foreground text-3xl md:text-4xl tracking-tight'
				>
					Structured for ceremony. Designed to scale.
				</h2>
				<p className='text-muted-foreground text-lg leading-relaxed'>
					We build digital experience systems—modular, tenant-scoped, and
					deployable in minutes. No lock-in. Your subdomain, your content, full
					control.
				</p>
			</div>
		</section>
	);
}
