import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing and using this website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you should not use this website.',
    },
    {
      title: 'Use of Content',
      content: 'All content on this website, including text, images, code samples, and project descriptions, is the intellectual property of Muhammad Abdullah unless otherwise stated. You may not reproduce, distribute, or modify any content without prior written permission.',
    },
    {
      title: 'Third-Party Services',
      content: 'This website uses third-party services including Google Analytics, Google AdSense, EmailJS, and Supabase. Your use of these services is subject to their respective terms and policies. We are not responsible for the actions or content of these third parties.',
    },
    {
      title: 'Disclaimer',
      content: 'This website and its content are provided "as is" without any warranties, express or implied. We make no representations regarding the accuracy, completeness, or reliability of any content on this site.',
    },
    {
      title: 'Limitation of Liability',
      content: 'Muhammad Abdullah shall not be liable for any damages arising from the use or inability to use this website, including but not limited to direct, indirect, incidental, or consequential damages.',
    },
    {
      title: 'External Links',
      content: 'This website may contain links to external websites. We are not responsible for the content, privacy practices, or availability of those sites.',
    },
    {
      title: 'Changes to Terms',
      content: 'We reserve the right to update these terms at any time. Changes will be posted on this page. Continued use of the site after changes constitutes acceptance of the new terms.',
    },
    {
      title: 'Contact',
      content: 'For questions about these Terms and Conditions, please reach out via the contact form on the homepage.',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: 100, maxWidth: 800, margin: '0 auto', width: '100%', paddingLeft: 24, paddingRight: 24, paddingBottom: 60 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 48, letterSpacing: 3, marginBottom: 8 }}>
          Terms & Conditions
        </h1>
        <p style={{ color: 'var(--silver)', fontSize: 13, fontFamily: "var(--font-mono)", marginBottom: 40 }}>
          Last updated: July 2026
        </p>
        <p style={{ color: 'var(--silver)', lineHeight: 1.8, marginBottom: 48, fontSize: 15 }}>
          These Terms and Conditions govern your use of the Muhammad Abdullah portfolio website.
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
