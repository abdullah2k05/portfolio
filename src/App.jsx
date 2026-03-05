import { useEffect, useState } from 'react';
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
import { fallbackContent, fetchContentEntries, transformEntriesToContent } from './lib/contentRepository';
import { isSupabaseConfigured } from './lib/supabaseClient';

export default function App() {
  const [content, setContent] = useState(fallbackContent);

  useEffect(() => {
    // Re-attach reveal observer when dynamic content changes so newly rendered cards are visible.
    const revealEls = document.querySelectorAll('.reveal');
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
    let active = true;

    const loadContent = async () => {
      if (!isSupabaseConfigured) return;
      const { data, error } = await fetchContentEntries();
      if (!active || error || !data.length) return;
      setContent(transformEntriesToContent(data));
    };

    loadContent();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    /* ── NAVBAR SCROLL ── */
    const navbar = document.getElementById('navbar');
    const onScroll = () => {
      if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll);

    /* ── HERO PARALLAX ── */
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

    /* Deferred setup — wait for React to finish rendering dynamic content */
    const setupTimer = setTimeout(() => {
      /* ── SKILL CARD GLOW ── */
      document.querySelectorAll('.skill-card').forEach((card) => {
        const onCardMove = (e) => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
          const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
          card.style.setProperty('--mx', `${x}%`);
          card.style.setProperty('--my', `${y}%`);
        };
        card.addEventListener('mousemove', onCardMove);
        cleanupFns.push(() => card.removeEventListener('mousemove', onCardMove));
      });

      /* ── CARD TILT ── */
      document.querySelectorAll('[data-tilt]').forEach((el) => {
        const onTiltMove = (e) => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / (rect.width / 2);
          const dy = (e.clientY - cy) / (rect.height / 2);
          el.style.transform = `translateY(-6px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg)`;
        };
        const onTiltLeave = () => {
          el.style.transform = '';
        };
        el.addEventListener('mousemove', onTiltMove);
        el.addEventListener('mouseleave', onTiltLeave);
        cleanupFns.push(() => el.removeEventListener('mousemove', onTiltMove));
        cleanupFns.push(() => el.removeEventListener('mouseleave', onTiltLeave));
      });

      /* ── RIPPLE ── */
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

      /* ── SMOOTH SCROLL NAV ── */
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
