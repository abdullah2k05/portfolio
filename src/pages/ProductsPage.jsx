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
    <>
      <Navbar />
      <main>
        <Products products={content.products} />
      </main>
      <Footer />
    </>
  );
}
