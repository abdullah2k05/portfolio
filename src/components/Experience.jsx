export default function Experience({ experience = [] }) {
  return (
    <section id="experience">
      <div className="container">
        <div className="reveal">
          <div className="section-label">06 — Career</div>
          <div className="section-title">Experience <em>&amp; Societies</em></div>
        </div>
        <div className="exp-timeline">
          {experience.map((exp, idx) => (
            <div key={exp.id} className={`exp-item reveal reveal-delay-${(idx % 3) + 1}`}>
              <div className="exp-year">{exp.role}</div>
              <h3>{exp.title.toUpperCase()}</h3>
              <h4>{exp.subtitle || exp.role}</h4>
              <p>{exp.description}</p>
              {exp.linkUrl && exp.linkLabel && (
                <a href={exp.linkUrl} target="_blank" rel="noreferrer" style={{ color: '#c7c7c7', textDecoration: 'underline', fontSize: 13, marginTop: 8, display: 'inline-block' }}>
                  {exp.linkLabel} ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
