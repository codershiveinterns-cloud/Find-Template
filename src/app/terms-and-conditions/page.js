import TransparentNavbar from '@/components/landing/TransparentNavbar';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'Terms and Conditions | FindTemplates',
};

const sections = [
  {
    title: 'Overview',
    content: 'This website is operated by FindTemplates. Throughout the site, the terms “we”, “us”, and “our” refer to FindTemplates. We offer this website, including template listings, pricing information, inquiry forms, account access, and dashboard features, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.',
  },
  {
    title: 'Section 1 – Online Template Terms',
    content: 'By using FindTemplates, creating an account, browsing templates, submitting inquiries, or purchasing access to templates or plans, you confirm that you are legally permitted to use our services in your jurisdiction. You may not use our templates, dashboard, forms, or services for any illegal, harmful, misleading, or unauthorized purpose. Any breach of these terms may result in suspension or termination of access.',
  },
  {
    title: 'Section 2 – General Conditions',
    content: 'We reserve the right to refuse service to anyone for any reason at any time. You agree not to copy, duplicate, resell, redistribute, exploit, or misuse any part of the website, templates, dashboard experience, pricing content, or services without written permission from FindTemplates.',
  },
  {
    title: 'Section 3 – Accuracy and Availability of Information',
    content: 'We aim to keep template details, categories, ratings, pricing, and dashboard information accurate and current. However, information on this website may occasionally contain errors, omissions, or outdated details. Any reliance on website content is at your own risk.',
  },
  {
    title: 'Section 4 – Modifications to Services and Prices',
    content: 'Prices for templates, monthly plans, yearly plans, and related services may change without notice. We may update, modify, pause, or discontinue any part of the website, dashboard, templates, or services at any time without liability to you or any third party.',
  },
  {
    title: 'Section 5 – Templates, Plans, and Digital Services',
    content: 'Some templates, dashboard features, or plan benefits may be available only online. Template previews, images, names, categories, ratings, and descriptions are provided for presentation and selection purposes. We may limit template availability, plan access, or services based on account type, plan selection, or operational requirements.',
  },
  {
    title: 'Section 6 – Account and Billing Information',
    content: 'When creating an account or submitting information through FindTemplates, you agree to provide accurate and complete details. We may refuse, limit, or cancel access if information appears inaccurate, unauthorized, suspicious, or in violation of these terms.',
  },
  {
    title: 'Section 7 – Third-Party Links and Tools',
    content: 'Our website may include links or references to third-party websites, tools, payment providers, integrations, or external resources. We are not responsible for reviewing, controlling, or guaranteeing third-party content, availability, security, or accuracy.',
  },
  {
    title: 'Section 8 – Personal Information',
    content: 'Your submission of personal information through signup, login, inquiry forms, profile updates, or related workflows is governed by our Privacy Policy. Please do not submit information that you are not authorized to provide.',
  },
  {
    title: 'Section 9 – Errors, Inaccuracies, and Omissions',
    content: 'There may be information on our website that contains typographical errors, inaccuracies, or omissions relating to template descriptions, plan access, pricing, ratings, availability, or dashboard features. We reserve the right to correct, update, or remove such information at any time without prior notice.',
  },
  {
    title: 'Section 10 – Disclaimer of Warranties and Limitation of Liability',
    content: 'We do not guarantee that your use of FindTemplates will be uninterrupted, timely, secure, or error-free. The website, templates, dashboard, and services are provided “as is” and “as available” without warranties of any kind. FindTemplates will not be liable for indirect, incidental, special, consequential, or similar damages arising from your use of the website, templates, or services.',
  },
  {
    title: 'Section 11 – Indemnification',
    content: 'You agree to indemnify and hold harmless FindTemplates, its team, service providers, partners, and affiliates from any claim or demand arising from your breach of these Terms and Conditions, misuse of the website, violation of law, or infringement of third-party rights.',
  },
  {
    title: 'Section 12 – Governing Law',
    content: 'These Terms and Conditions shall be governed by applicable laws in the jurisdiction where FindTemplates operates, unless otherwise required by law.',
  },
  {
    title: 'Section 13 – Changes to Terms and Conditions',
    content: 'You can review the most current version of these Terms and Conditions on this page. We reserve the right to update, change, or replace any part of these terms by posting updates on our website. Continued use of FindTemplates after changes means you accept the updated terms.',
  },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <TransparentNavbar />
      <main className="legal-page">
        <section className="legal-hero">
          <div className="section-kicker">Legal</div>
          <h1>Terms and Conditions</h1>
          <p>
            Please read these terms carefully before using FindTemplates, browsing templates,
            creating an account, submitting inquiries, or purchasing template access.
          </p>
        </section>

        <section className="legal-content-card">
          {sections.map((section) => (
            <article className="legal-section" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
