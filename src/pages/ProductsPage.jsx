import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Products from '../components/Products';
import Footer from '../components/Footer';
import useSEO from '../hooks/useSEO';
import { usePortfolioContent } from '../hooks/usePortfolioContent';

export default function ProductsPage() {
  const { content } = usePortfolioContent();

  useSEO({
    title: 'Products — Tazkir, GitHub Reader AI & Invoice Maker | Muhammad Abdullah',
    description:
      'Products built by Muhammad Abdullah: Tazkir (free on Google Play), GitHub Reader AI (AI codebase assistant, $9/month), and Invoice Maker (free online invoicing).',
    keywords:
      'Tazkir, GitHub Reader AI, Invoice Maker, Islamic app, codebase RAG, free invoicing, digital products',
    ogTitle: 'Products — Tazkir, GitHub Reader AI & Invoice Maker',
    ogDescription:
      'Free and paid products by Muhammad Abdullah: Tazkir on Google Play, GitHub Reader AI, and Invoice Maker.',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length === 0) return;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('revealed');
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => revealObserver.observe(el));

    return () => {
      revealObserver.disconnect();
    };
  }, [content]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <Products products={content.products} />
      </main>
      <Footer />
    </div>
  );
}
