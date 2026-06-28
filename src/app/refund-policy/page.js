import TransparentNavbar from '@/components/landing/TransparentNavbar';
import Footer from '@/components/landing/Footer';

export const metadata = {
  title: 'Refund Policy | FindTemplates',
};

const sections = [
  {
    title: '1. Overview',
    content: [
      'This Refund Policy explains the refund practices of Canada Inc., operating as FindTempletes ("FindTempletes", "we", "our", or "us"), for purchases made through FindTempletes.com.',
      'By purchasing products through our website, you acknowledge that you have read, understood, and agreed to this Refund Policy.',
    ],
  },
  {
    title: '2. Nature of Our Products',
    content: [
      'FindTempletes.com provides downloadable digital templates and digital products. These products are delivered electronically and become accessible immediately after successful payment.',
      'Due to the nature of digital products, they cannot be returned once accessed, downloaded, copied, or otherwise made available to the purchaser.',
    ],
  },
  {
    title: '3. No Refunds for Digital Products',
    content: [
      'All sales are final.',
      'We do not offer refunds, exchanges, or cancellations for digital products once the payment has been successfully processed, the download link has been provided, the product has been accessed or downloaded, or the digital product has otherwise been delivered to the customer.',
      'By completing a purchase, you expressly consent to immediate delivery of the digital content and acknowledge that you waive any right to cancel or request a refund for the delivered digital product, except where required by applicable law.',
    ],
  },
  {
    title: '4. Exceptions',
    content: [
      'We may, at our sole discretion, review refund requests in limited circumstances, including duplicate charges caused by a technical error, corrupted or inaccessible files where we cannot provide a functioning replacement within a reasonable period, receiving a product materially different from the product description displayed at the time of purchase, or where a refund is otherwise required under applicable consumer protection laws.',
      'Refund requests made under these exceptions may require supporting documentation and evidence.',
    ],
  },
  {
    title: '5. Chargebacks and Payment Disputes',
    content: [
      'If you believe an error has occurred with your purchase, please contact us before initiating a chargeback or payment dispute through your financial institution.',
      'Initiating fraudulent chargebacks after receiving, accessing, or downloading digital products may result in submission of evidence demonstrating product delivery and access, restriction or termination of access to our services, and additional actions permitted by applicable law.',
      'We reserve the right to contest chargebacks where we have evidence that the digital product was successfully delivered.',
    ],
  },
  {
    title: '6. How to Request Assistance',
    content: [
      'If you experience technical issues with your purchase or believe you qualify under one of the exceptions listed above, please contact us promptly.',
      'Email: admin@findtempletes.com',
      'Phone: +1 825-445-2843',
      'To help us investigate your request efficiently, please include your full name, the email address used for the purchase, your order number or transaction details, the date of purchase, and a description of the issue encountered.',
    ],
  },
  {
    title: '7. Processing of Approved Refunds',
    content: [
      'If a refund is approved, it will be issued through the original payment method used for the purchase.',
      'Refund processing times may vary depending on your financial institution and payment provider. Once initiated, refunds generally appear within several business days, although actual timing is outside our control.',
    ],
  },
  {
    title: '8. Square Payments',
    content: [
      'Payments made through our website may be processed using Square and its affiliated services.',
      'Approval of refunds remains subject to this Refund Policy. Nothing in this policy limits any rights you may have under applicable law or any obligations imposed by Square payment processing requirements.',
    ],
  },
  {
    title: '9. Changes to This Refund Policy',
    content: [
      'We reserve the right to update or modify this Refund Policy at any time. Any changes become effective immediately upon publication on this page. The Last Updated date above indicates when this policy was most recently revised.',
    ],
  },
  {
    title: '10. Contact Information',
    content: [
      'Canada Inc.',
      'Operating as FindTempletes',
      '195 Huntingford Trail, Woodstock, ON N4T 0M4, Canada',
      'Email: admin@findtempletes.com',
      'Phone: +1 825-445-2843',
    ],
  },
];

export default function RefundPolicyPage() {
  return (
    <>
      <TransparentNavbar />
      <main className="legal-page">
        <section className="legal-hero">
          <div className="section-kicker">Refunds</div>
          <h1>Refund Policy</h1>
          <p>
            Last Updated: 22-06-2026. This Refund Policy explains the refund practices for
            purchases made through FindTempletes.com and applies to downloadable digital
            templates and digital products.
          </p>
        </section>

        <section className="legal-content-card">
          <article className="legal-section legal-effective-card">
            <h2>Digital Product Refund Notice</h2>
            <p>
              FindTempletes provides digital products that are delivered electronically and may
              become accessible immediately after payment. Because of this, all digital product
              sales are final except where limited exceptions or applicable law require otherwise.
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
