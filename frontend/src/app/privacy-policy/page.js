import TransparentNavbar from '@/components/landing/TransparentNavbar';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'Privacy Policy | FindTemplates',
};

const sections = [
  {
    title: '1. Information We Collect',
    content: [
      'We collect personal information that you voluntarily provide when you create an account, submit an inquiry, update your profile, browse templates, or express interest in FindTemplates services.',
      'Personal Information may include your name, email address, account type, company name, company email, inquiry message, and profile details submitted through our forms.',
      'Account and Authentication Data may include login information, selected role, account type, and security-related session data required to protect your dashboard access.',
      'Payment and Plan Information may be collected when template purchases, subscriptions, or paid plan features are enabled. Payment details may be processed by trusted third-party payment providers. We do not intend to store full credit card details on our servers.',
      'Automatically Collected Data may include device information, browser type, IP address, operating system, page activity, and usage behavior through cookies or similar technologies where applicable.',
    ],
  },
  {
    title: '2. How We Use Your Information',
    content: [
      'We use your information to create and manage your FindTemplates account, authenticate login sessions, and provide access to your dashboard.',
      'We use inquiry details to respond to your questions about templates, pricing, plans, support, onboarding, and workspace requirements.',
      'We use account and company details to personalize your experience for freelancer, individual, company, or business workflows.',
      'We may use usage information to improve the website layout, template browsing experience, dashboard features, performance, and security.',
      'If you choose to receive updates, we may send communications about templates, services, plan updates, or product improvements. You may opt out of marketing communications where applicable.',
    ],
  },
  {
    title: '3. How We Share Your Information',
    content: [
      'We do not sell, rent, or trade your personal information to third parties.',
      'We may share necessary information with trusted service providers who help operate our website, host data, process payments, deliver emails, manage analytics, or support business operations.',
      'We may disclose information if required by law, legal process, government request, or to protect the rights, safety, and security of FindTemplates, our users, or others.',
      'We may share limited information when needed to investigate fraud, prevent abuse, enforce our policies, or respond to security issues.',
    ],
  },
  {
    title: '4. Data Retention and Security',
    content: [
      'We keep personal information only for as long as necessary for the purposes described in this Privacy Policy, unless a longer retention period is required or permitted by law.',
      'We use reasonable technical and organizational measures designed to protect your information, including secure authentication practices, password hashing, protected API access, and security-focused handling of account data.',
      'No method of transmission over the internet or electronic storage is 100% secure. While we work to protect your personal information, we cannot guarantee absolute security.',
    ],
  },
  {
    title: '5. Your Privacy Rights',
    content: [
      'Depending on your location and applicable laws, you may have the right to request access to personal information we hold about you.',
      'You may request correction of inaccurate or incomplete personal information.',
      'You may request deletion of your personal information, subject to legal, security, operational, or account-related exceptions.',
      'You may withdraw consent for marketing communications at any time by following the unsubscribe instructions or contacting us through available support channels.',
    ],
  },
  {
    title: '6. Third-Party Websites and Services',
    content: [
      'FindTemplates may contain links to third-party websites, tools, payment providers, integrations, or external services. We are not responsible for the privacy practices, content, security, or policies of third-party websites.',
      'We encourage you to review third-party privacy policies before sharing personal information with them.',
    ],
  },
  {
    title: '7. Changes to This Privacy Policy',
    content: [
      'We may update this Privacy Policy from time to time to reflect changes in our business practices, services, features, or legal requirements.',
      'The updated version will be indicated by an updated Effective Date at the top of this page. Continued use of FindTemplates after updates means you accept the revised Privacy Policy.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <TransparentNavbar />
      <main className="legal-page">
        <section className="legal-hero">
          <div className="section-kicker">Privacy</div>
          <h1>Privacy Policy</h1>
          <p>
            Effective Date: 17-05-2026. This Privacy Policy explains how FindTemplates collects,
            uses, protects, and handles your information when you use our website, templates,
            inquiry forms, account features, and dashboard services.
          </p>
        </section>

        <section className="legal-content-card">
          <article className="legal-section legal-effective-card">
            <h2>FindTemplates Privacy Commitment</h2>
            <p>
              FindTemplates respects your privacy and is committed to protecting your personal data.
              By accessing or using our website, creating an account, browsing templates, submitting
              an inquiry, or using dashboard services, you agree to this Privacy Policy.
            </p>
          </article>

          {sections.map((section) => (
            <article className="legal-section" key={section.title}>
              <h2>{section.title}</h2>
              {section.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
