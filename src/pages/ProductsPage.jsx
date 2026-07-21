import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Products from '../components/Products';
import Footer from '../components/Footer';
import useSEO from '../hooks/useSEO';
import { usePortfolioContent } from '../hooks/usePortfolioContent';

export default function ProductsPage() {
  const { content } = usePortfolioContent();

  useSEO({
    title: 'Products — Digital Tools & Solutions | Muhammad Abdullah',
    description:
      'Browse digital products, tools, and solutions built by Muhammad Abdullah — AI automation tools, paid utilities, and developer resources.',
    keywords:
      'digital products, AI tools, developer tools, automation, paid utilities, software products',
    ogTitle: 'Products & Digital Tools | Muhammad Abdullah',
    ogDescription:
      'Browse AI automation tools, paid utilities, and developer solutions.',
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
