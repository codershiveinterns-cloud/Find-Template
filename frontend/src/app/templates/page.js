import TransparentNavbar from '@/components/landing/TransparentNavbar';
import Footer from '@/components/landing/Footer';
import TemplatesGallery from '@/components/templates/TemplatesGallery';

export const metadata = {
  title: 'Templates | FindTemplates',
};

export default function TemplatesPage() {
  return (
    <>
      <TransparentNavbar />
      <TemplatesGallery />
      <Footer />
    </>
  );
}
