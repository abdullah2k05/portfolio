export default function Expertise({ skills = [] }) {
  const bentoLayout = [
    { span: 'bento-span-2' },
    {},
    {},
    { span: 'bento-span-2' },
    { span: 'bento-span-2 bento-span-2-row' },
    {},
    {},
    { span: 'bento-span-2' },
    {},
    { span: 'bento-span-2' },
    {},
    {},
  ];

  return (
    <section id="expertise">
      <div className="container">
        <div className="reveal">
          <div className="section-label">02 — Core Skills</div>
          <div className="section-title">My <em>Expertise</em></div>
        </div>
        <div className="bento-grid">
          {skills.map((skill, idx) => {
            const layout = bentoLayout[idx % bentoLayout.length];
            return (
              <div
                key={skill.id}
                className={`bento-card reveal reveal-delay-${(idx % 4) + 1} ${layout?.span || ''}`}
                data-tilt=""
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
                  const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
                  e.currentTarget.style.setProperty('--mx', `${x}%`);
                  e.currentTarget.style.setProperty('--my', `${y}%`);
                }}
              >
                <div className="bento-card-icon">{skill.icon}</div>
                <h3>{skill.title}</h3>
                <div className="bento-tags">
                  {skill.tags.map(tag => (
                    <span key={tag} className="bento-tag">{tag}</span>
                  ))}
                </div>
                {skill.linkUrl && skill.linkLabel && (
                  <a href={skill.linkUrl} target="_blank" rel="noreferrer" style={{
                    color: 'var(--accent)', fontSize: 12, marginTop: 12,
                    fontFamily: 'var(--font-mono)', textDecoration: 'none',
                    display: 'inline-flex', alignItems: 'center', gap: 4, opacity: 0.7,
                    transition: 'opacity 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                  >
                    {skill.linkLabel} ↗
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
