import { experience } from '../data/experience';

export default function Experience() {
  return (
    <section id="experience">
      <div className="container">
        <div className="reveal">
          <div className="section-label">05 — Career</div>
          <div className="section-title">Experience <em>&amp; Societies</em></div>
        </div>
        <div className="exp-timeline">
          {experience.map((exp, idx) => (
            <div key={exp.id} className={`exp-item reveal reveal-delay-${(idx % 3) + 1}`}>
              <div className="exp-year">{exp.role}</div>
              <h3>{exp.title.toUpperCase()}</h3>
              <h4>{exp.subtitle || exp.role}</h4>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
