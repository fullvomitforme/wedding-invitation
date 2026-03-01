export function TrustSection() {
  return (
		<section
			className='mx-auto px-6 md:px-12 py-20 md:py-28 border border-foreground/20 rounded-2xl'
			aria-labelledby='trust-heading'
		>
			<h2 id='trust-heading' className='sr-only'>
				Platform capabilities
			</h2>
			<p className='mb-10 font-medium text-foreground text-xl md:text-2xl'>
				Built for scale. Deployed in minutes.
			</p>
			<ul className='gap-8 grid grid-cols-1 sm:grid-cols-3 m-0 p-0 list-none'>
				<li className='flex gap-3'>
					<span className='mt-0.5 text-primary' aria-hidden>
						—
					</span>
					<span className='text-muted-foreground'>
						Custom subdomains per project. Wildcard DNS, one deploy.
					</span>
				</li>
				<li className='flex gap-3'>
					<span className='mt-0.5 text-primary' aria-hidden>
						—
					</span>
					<span className='text-muted-foreground'>
						Multi-tenant from the ground up. Isolated data, shared infra.
					</span>
				</li>
				<li className='flex gap-3'>
					<span className='mt-0.5 text-primary' aria-hidden>
						—
					</span>
					<span className='text-muted-foreground'>
						Full control. Your content, your domain, no lock-in.
					</span>
				</li>
			</ul>
		</section>
	);
}
