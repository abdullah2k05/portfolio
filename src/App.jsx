import { useEffect } from 'react';
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

export default function App() {
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

    /* Deferred setup — wait for React to finish rendering all components */
    let revealObserver;
    const setupTimer = setTimeout(() => {
      /* ── SCROLL REVEAL ── */
      const revealEls = document.querySelectorAll('.reveal');
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
      revealEls.forEach(el => revealObserver.observe(el));

      /* ── SKILL CARD GLOW ── */
      document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('mousemove', e => {
          const rect = card.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
          const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
          card.style.setProperty('--mx', x + '%');
          card.style.setProperty('--my', y + '%');
        });
      });

      /* ── CARD TILT ── */
      document.querySelectorAll('[data-tilt]').forEach(el => {
        el.addEventListener('mousemove', e => {
          const rect = el.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const dx = (e.clientX - cx) / (rect.width / 2);
          const dy = (e.clientY - cy) / (rect.height / 2);
          el.style.transform = `translateY(-6px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
      });

      /* ── RIPPLE ── */
      document.querySelectorAll('.btn-primary, .btn-outline, .btn-glow, .form-submit').forEach(btn => {
        btn.addEventListener('click', function(e) {
          const r = document.createElement('span');
          r.className = 'ripple';
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height) * 2;
          r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px`;
          this.appendChild(r);
          setTimeout(() => r.remove(), 600);
        });
      });

      /* ── SMOOTH SCROLL NAV ── */
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
          e.preventDefault();
          const target = document.querySelector(a.getAttribute('href'));
          if (target) {
            const navLinksEl = document.getElementById('navLinks');
            if (navLinksEl) navLinksEl.classList.remove('open');
            target.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });
    }, 100);

    return () => {
      clearTimeout(setupTimer);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('scroll', onHeroScroll);
      if (revealObserver) revealObserver.disconnect();
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="section-divider"></div>
        <About />
        <div className="section-divider"></div>
        <Expertise />
        <div className="section-divider"></div>
        <Projects />
        <div className="section-divider"></div>
        <Photography />
        <div className="section-divider"></div>
        <Experience />
        <div className="section-divider"></div>
        <Education />
        <div className="section-divider"></div>
        <CTABanner />
        <div className="section-divider"></div>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
