import TransparentNavbar from '@/components/landing/TransparentNavbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import TemplatesSection from '@/components/landing/TemplatesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import PricingSection from '@/components/landing/PricingSection';
import InquirySection from '@/components/landing/InquirySection';
import Footer from '@/components/landing/Footer';
import PageScrollHandler from '@/components/landing/PageScrollHandler';

export default function HomePage() {
  return (
    <main className="landing-page">
      <PageScrollHandler />
      <TransparentNavbar />
      <HeroSection />
      <FeaturesSection />
      <TemplatesSection />
      <HowItWorksSection />
      <PricingSection />
      <InquirySection />
      <Footer />
    </main>
  );
}
