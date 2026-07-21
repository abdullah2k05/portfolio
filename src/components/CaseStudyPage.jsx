import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { caseStudies } from '../data/caseStudies';
import useSEO from '../hooks/useSEO';

function ListSection({ title, items }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="cs-section">
      <h2>{title}</h2>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function CaseStudyPage({ slug }) {
  const cs = caseStudies.find((c) => c.slug === slug);

  useSEO(
    cs
      ? {
          title: cs.seo.title,
          description: cs.seo.description,
          keywords: cs.seo.keywords,
          ogTitle: `${cs.title} — Case Study | Muhammad Abdullah`,
          ogDescription: cs.seo.description,
          ogType: 'article',
          twitterTitle: `${cs.title} — Case Study`,
          twitterDescription: cs.seo.description,
          structuredData: {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: cs.title,
            description: cs.seo.description,
            author: {
              '@type': 'Person',
              name: 'Muhammad Abdullah',
              url: 'https://mabdullah.top',
            },
            datePublished: cs.date,
            proficiencyLevel: 'Advanced',
            about: cs.subtitle,
            keywords: cs.seo.keywords,
          },
        }
      : {
          title: 'Case Study Not Found | Muhammad Abdullah',
          robots: 'noindex',
        }
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!cs) {
    return (
      <div className="cs-not-found">
        <div className="container" style={{ textAlign: 'center', paddingTop: 160, paddingBottom: 80 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 80, color: 'var(--white-pure)' }}>404</h1>
          <p style={{ color: 'var(--gray-light)', marginBottom: 32 }}>Case study not found.</p>
          <Link to="/" className="btn-outline">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cs-page">
      <nav className="cs-nav">
        <Link to="/" className="cs-back">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Portfolio
        </Link>
      </nav>

      <header className="cs-hero">
        <div className="container">
          <div className="cs-hero-meta">
            <span className="cs-hero-num">Case Study {cs.projectNumber}</span>
            <span className="cs-hero-date">{cs.date}</span>
          </div>
          <h1 className="cs-hero-title">{cs.title}</h1>
          <p className="cs-hero-subtitle">{cs.subtitle}</p>
          <div className="cs-hero-tech">
            {cs.technologies.map((t) => (
              <span key={t} className="tech-badge">{t}</span>
            ))}
          </div>
          <div className="cs-hero-links">
            {cs.liveUrl && (
              <a href={cs.liveUrl} className="btn-primary" target="_blank" rel="noreferrer">
                <span>Live Demo</span>
              </a>
            )}
            {cs.githubUrl && cs.githubUrl !== '#' && (
              <a href={cs.githubUrl} className="btn-outline" target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="section-divider"></div>

      <article className="cs-article">
        <div className="container cs-article-inner">
          <div className="cs-section">
            <h2>The Problem</h2>
            <p>{cs.problem}</p>
          </div>

          <div className="cs-section">
            <h2>The Solution</h2>
            <p>{cs.solution}</p>
          </div>

          <ListSection title="Key Features" items={cs.features} />

          <div className="cs-section">
            <h2>Architecture</h2>
            <p>{cs.architecture}</p>
          </div>

          <div className="cs-section">
            <h2>Project Structure</h2>
            <p>{cs.folderStructure}</p>
          </div>

          <div className="cs-section">
            <h2>Technologies Used</h2>
            <div className="cs-tech-list">
              {cs.technologies.map((t) => (
                <span key={t} className="tech-badge">{t}</span>
              ))}
            </div>
          </div>

          <ListSection title="Challenges" items={cs.challenges} />
          <ListSection title="Lessons Learned" items={cs.lessonsLearned} />
          <ListSection title="Future Improvements" items={cs.futureImprovements} />
        </div>
      </article>

      <div className="section-divider"></div>

      <div className="cs-footer-nav">
        <div className="container">
          <Link to="/" className="btn-outline">
            ← Back to All Projects
          </Link>
        </div>
      </div>
    </div>
  );
}
