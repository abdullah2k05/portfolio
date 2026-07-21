import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useSEO from '../hooks/useSEO';

export default function PrivacyPolicy() {
  useSEO({
    title: 'Privacy Policy | Muhammad Abdullah',
    description:
      'Privacy Policy for Muhammad Abdullah portfolio website. Learn how your data is collected, used, and protected when visiting mabdullah.top.',
    keywords:
      'privacy policy, data protection, cookie policy, GDPR, privacy',
    robots: 'index, follow',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: 'Information We Collect',
      content: 'We collect information you provide directly, such as when you fill out the contact form (name, email, message). We also collect certain technical data automatically, including your IP address, browser type, device information, and usage data via Google Analytics and Google AdSense.',
    },
    {
      title: 'How We Use Your Information',
      content: 'The information we collect is used to respond to your inquiries, improve the website experience, analyze traffic patterns, and serve relevant advertisements. We do not sell your personal information to third parties.',
    },
    {
      title: 'Cookies',
      content: 'This website uses cookies and similar tracking technologies. Google Analytics uses cookies to analyze site usage, and Google AdSense uses cookies to serve personalized ads. You can control cookie preferences through your browser settings. By using this site, you consent to the use of cookies as described in this policy.',
    },
    {
      title: 'Third-Party Services',
      content: 'We use the following third-party services: Google Analytics (traffic analysis), Google AdSense (advertising), EmailJS (contact form processing), and Supabase (content management). Each service has its own privacy policy governing the use of your data.',
    },
    {
      title: 'Data Security',
      content: 'We implement reasonable security measures to protect your information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.',
    },
    {
      title: 'Your Rights',
      content: 'You have the right to request access to, correction of, or deletion of your personal data. To exercise these rights, please contact us using the form on the homepage or via email.',
    },
    {
      title: 'Changes to This Policy',
      content: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.',
    },
    {
      title: 'Contact',
      content: 'If you have any questions about this Privacy Policy, please reach out via the contact form on the homepage or email us directly.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: 100, maxWidth: 800, margin: '0 auto', width: '100%', paddingLeft: 24, paddingRight: 24, paddingBottom: 60 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 48, letterSpacing: 3, marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--silver)', fontSize: 13, fontFamily: "var(--font-mono)", marginBottom: 40 }}>
          Last updated: July 2026
        </p>
        <p style={{ color: 'var(--silver)', lineHeight: 1.8, marginBottom: 48, fontSize: 15 }}>
          This Privacy Policy explains how Muhammad Abdullah ("I", "me", "my") collects, uses, and protects your information when you visit this portfolio website.
        </p>
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, letterSpacing: 2, marginBottom: 10 }}>
              {s.title}
            </h2>
            <p style={{ color: 'var(--silver)', lineHeight: 1.8, fontSize: 15 }}>
              {s.content}
            </p>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
