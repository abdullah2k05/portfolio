import { skills } from '../data/skills';

export default function Expertise() {
  return (
    <section id="expertise">
      <div className="container">
        <div className="reveal">
          <div className="section-label">02 — Core Skills</div>
          <div className="section-title">My <em>Expertise</em></div>
        </div>
        <div className="skills-grid">
          {skills.map((skill, idx) => (
            <div
              key={skill.id}
              className={`skill-card reveal reveal-delay-${(idx % 3) + 1}`}
              data-tilt=""
            >
              <div className="skill-card-num">{String(idx + 1).padStart(2, '0')}</div>
              <div className="skill-card-icon">{skill.icon}</div>
              <h3>{skill.title}</h3>
              <div className="skill-tags">
                {skill.tags.map(tag => (
                  <span key={tag} className="skill-tag">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
