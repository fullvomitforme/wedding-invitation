import { BrandTagline } from './BrandTagline';
import { BenefitList } from './BenefitList';
import { SocialProof } from './SocialProof';

interface AuthLeftPanelProps {
	pageType: 'login' | 'signup';
}

export function AuthLeftPanel({ pageType }: AuthLeftPanelProps) {
	return (
		<section className='flex flex-col justify-center px-4 py-8 min-h-[50vh] md:min-h-screen'>
			<BrandTagline pageType={pageType} />
			<BenefitList />
			<SocialProof />
		</section>
	);
}
