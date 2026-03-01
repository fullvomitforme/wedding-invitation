import Link from "next/link";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/BrandMark";
import { Button } from '../ui/button';

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
				<Button variant='outline' asChild>
					<Link href='/request-access'>Request Access</Link>
				</Button>
				<Button variant='default' asChild>
					<Link href='/signup'>Sign Up</Link>
				</Button>
			</div>
		</nav>
	);
}