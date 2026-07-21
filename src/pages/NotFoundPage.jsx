import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useSEO from '../hooks/useSEO';

export default function NotFoundPage() {
  useSEO({
    title: '404 — Page Not Found | Muhammad Abdullah',
    robots: 'noindex',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ textAlign: 'center', paddingTop: 80, paddingBottom: 80 }}>
          <div className="error-code">404</div>
          <h1 className="error-title">Page Not Found</h1>
          <p className="error-desc">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn-primary"><span>Back to Home</span></Link>
            <Link to="/articles" className="btn-outline">Browse Case Studies</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
