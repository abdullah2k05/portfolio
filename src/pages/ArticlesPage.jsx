import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import useSEO from '../hooks/useSEO';
import { caseStudies } from '../data/caseStudies';

export default function ArticlesPage() {
  useSEO({
    title: 'Case Studies — Technical Deep Dives | Muhammad Abdullah',
    description:
      'In-depth technical case studies covering architecture, challenges, and solutions from real-world projects — AI systems, full-stack apps, mobile development, and more.',
    keywords:
      'case studies, technical deep dives, software architecture, AI systems, full-stack development, React, Next.js, Python, mobile apps',
    ogTitle: 'Case Studies — Technical Deep Dives | Muhammad Abdullah',
    ogDescription:
      'In-depth technical case studies covering architecture, challenges, and solutions from real-world projects.',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1 }}>
        <section id="articles-page" style={{ paddingTop: 140, paddingBottom: 80 }}>
          <div className="container">
            <div className="reveal revealed">
              <div className="section-label">Case Studies</div>
              <h1 className="section-title">Technical <em>Deep Dives</em></h1>
              <p style={{
                fontSize: 15, color: 'var(--gray-light)', lineHeight: 1.8,
                maxWidth: 600, marginBottom: 60
              }}>
                Every project has a story. Here I walk through the problems, architectural decisions, 
                challenges, and lessons learned from building real-world software.
              </p>
            </div>

            <div className="articles-grid">
              {caseStudies.map((cs, idx) => (
                <Link
                  key={cs.slug}
                  to={`/${cs.slug}`}
                  className={`article-card reveal revealed reveal-delay-${(idx % 3) + 1}`}
                >
                  <div className="article-card-meta">
                    <span className="article-card-num">{cs.projectNumber}</span>
                    <span className="article-card-date">{cs.date}</span>
                  </div>
                  <h3>{cs.title}</h3>
                  <p>{cs.subtitle}</p>
                  <div className="article-card-tech">
                    {cs.technologies.slice(0, 4).map((t) => (
                      <span key={t} className="tech-badge">{t}</span>
                    ))}
                    {cs.technologies.length > 4 && (
                      <span className="tech-badge">+{cs.technologies.length - 4}</span>
                    )}
                  </div>
                  <ul className="article-card-highlights">
                    {cs.challenges.slice(0, 2).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                  <span className="article-card-cta">
                    Read Case Study
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" width="14" height="14">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
