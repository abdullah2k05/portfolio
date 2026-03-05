export default function About({ paragraphs = [], stats = [], highlights = [] }) {
  return (
    <section id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-text reveal">
            <div className="section-label">01 — Introduction</div>
            <div className="section-title">About <em>Me</em></div>
            {paragraphs.map((item) => (
              <p key={item.id}>{item.text}</p>
            ))}
            <div className="about-stats reveal reveal-delay-2">
              {stats.map((item) => (
                <div key={item.id} className="stat-box">
                  <div className="stat-num">{item.value}</div>
                  <div className="stat-label">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="highlight-cards reveal reveal-delay-2">
            {highlights.map((item) => (
              <div key={item.id} className="highlight-card">
                <div className="highlight-card-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>
                  {item.text}
                  {item.linkUrl ? (
                    <>
                      {' '}
                      <a href={item.linkUrl} target="_blank" rel="noreferrer">
                        {item.linkLabel || item.linkUrl}
                      </a>
                    </>
                  ) : null}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
