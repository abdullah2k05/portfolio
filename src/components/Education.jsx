export default function Education({ education = [] }) {
  return (
    <section id="education">
      <div className="container">
        <div className="reveal">
          <div className="section-label">06 — Background</div>
          <div className="section-title">Education <em>&amp; Training</em></div>
        </div>
        <div className="edu-timeline">
          {education.map((item, idx) => (
            <div key={item.id} className={`edu-item reveal reveal-delay-${(idx % 3) + 1}`}>
              <div className="edu-year">{item.period}</div>
              <h3>{item.title}</h3>
              <h4>{item.subtitle}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
