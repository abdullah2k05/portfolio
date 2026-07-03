import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Products from '../components/Products';
import Footer from '../components/Footer';
import { usePortfolioContent } from '../hooks/usePortfolioContent';

export default function ProductsPage() {
  const { content } = usePortfolioContent();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
