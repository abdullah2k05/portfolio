import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Expertise from './components/Expertise';
import Projects from './components/Projects';
import Photography from './components/Photography';
import Experience from './components/Experience';
import Education from './components/Education';
import CTABanner from './components/CTABanner';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ArticlesPage from './pages/ArticlesPage';
import CaseStudyWrapper from './pages/CaseStudyWrapper';
import NotFoundPage from './pages/NotFoundPage';
import useSEO from './hooks/useSEO';
import { usePortfolioContent } from './hooks/usePortfolioContent';

const Admin = lazy(() => import('./pages/Admin'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));

function HomePage() {
  const { content } = usePortfolioContent();

  useSEO({
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Muhammad Abdullah',
        url: 'https://mabdullah.top',
        jobTitle: 'AI Automation Engineer & Data Science Specialist',
        sameAs: [
          'https://github.com/Abdullah2k05',
          'https://linkedin.com/in/abdullah2k05',
        ],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Muhammad Abdullah Portfolio',
        url: 'https://mabdullah.top',
        description:
          'Portfolio showcasing AI workflows, backend development, and data science projects.',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://mabdullah.top/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  });

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

  useEffect(() => {
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll);

    const heroBg = document.getElementById('heroBgText');
    const onHeroScroll = () => {
      if (heroBg) {
        const y = window.scrollY;
        heroBg.style.transform = `translate(-50%, calc(-50% + ${y * 0.3}px))`;
      }
    };
    window.addEventListener('scroll', onHeroScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onHeroScroll);
    };
  }, []);

  useEffect(() => {
    const cleanupFns = [];

    const setupTimer = setTimeout(() => {
      document.querySelectorAll('[data-tilt]').forEach((el) => {
        const onTiltMove = (e) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / (rect.width / 2);
          const dy = (e.clientY - cy) / (rect.height / 2);
          el.style.transform = `translateY(-4px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg)`;
        };
        const onTiltLeave = () => {
          el.style.transform = '';
        };
        el.addEventListener('mousemove', onTiltMove);
        el.addEventListener('mouseleave', onTiltLeave);
        cleanupFns.push(() => el.removeEventListener('mousemove', onTiltMove));
        cleanupFns.push(() => el.removeEventListener('mouseleave', onTiltLeave));
      });

      document.querySelectorAll('.btn-primary, .btn-outline, .btn-glow, .form-submit').forEach((btn) => {
        const onRippleClick = (e) => {
          const r = document.createElement('span');
          r.className = 'ripple';
          const rect = btn.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height) * 2;
          r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px`;
          btn.appendChild(r);
          setTimeout(() => r.remove(), 600);
        };
        btn.addEventListener('click', onRippleClick);
        cleanupFns.push(() => btn.removeEventListener('click', onRippleClick));
      });

      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        const href = a.getAttribute('href') || '';
        if (href.length <= 1) return;

        const onAnchorClick = (e) => {
          const target = document.querySelector(href);
          if (!target) return;
          e.preventDefault();
          const navLinksEl = document.getElementById('navLinks');
          if (navLinksEl) navLinksEl.classList.remove('open');
          target.scrollIntoView({ behavior: 'smooth' });
        };

        a.addEventListener('click', onAnchorClick);
        cleanupFns.push(() => a.removeEventListener('click', onAnchorClick));
      });

      document.querySelectorAll('a[href^="/#"]').forEach((a) => {
        const href = a.getAttribute('href') || '';
        const hash = '#' + href.slice(2);
        if (hash.length <= 1) return;

        const onAnchorClick = (e) => {
          const target = document.querySelector(hash);
          if (!target) return;
          if (window.location.pathname !== '/') return;
          e.preventDefault();
          const navLinksEl = document.getElementById('navLinks');
          if (navLinksEl) navLinksEl.classList.remove('open');
          target.scrollIntoView({ behavior: 'smooth' });
        };

        a.addEventListener('click', onAnchorClick);
        cleanupFns.push(() => a.removeEventListener('click', onAnchorClick));
      });
    }, 100);

    return () => {
      clearTimeout(setupTimer);
      cleanupFns.forEach((fn) => fn());
    };
  }, [content]);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="section-divider"></div>
        <About
          paragraphs={content.aboutParagraphs}
          stats={content.aboutStats}
          highlights={content.aboutHighlights}
        />
        <div className="section-divider"></div>
        <Expertise skills={content.skills} />
        <div className="section-divider"></div>
        <Projects projects={content.projects} />
        <div className="section-divider"></div>
        <Photography slides={content.photoSlides} events={content.events} />
        <div className="section-divider"></div>
        <Experience experience={content.experience} />
        <div className="section-divider"></div>
        <Education education={content.education} />
        <div className="section-divider"></div>
        <CTABanner />
        <div className="section-divider"></div>
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--bg-base)' }} />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/ribal" element={<Admin />} />
        <Route path="/ribal/*" element={<Admin />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<CaseStudyWrapper />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="/:slug" element={<CaseStudyWrapper />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
