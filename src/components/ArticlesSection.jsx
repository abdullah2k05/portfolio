import { Link } from 'react-router-dom';
import { caseStudies } from '../data/caseStudies';

export default function ArticlesSection() {
  return (
    <section id="articles">
      <div className="container">
        <div className="reveal">
          <div className="section-label">04 — Case Studies</div>
          <div className="section-title">Technical <em>Articles</em></div>
        </div>
        <div className="articles-grid">
          {caseStudies.map((cs, idx) => (
            <Link
              key={cs.slug}
              to={`/${cs.slug}`}
              className={`article-card reveal reveal-delay-${(idx % 3) + 1}`}
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
  );
}
