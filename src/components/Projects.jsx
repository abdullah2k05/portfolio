import { projects } from '../data/projects';

export default function Projects() {
  return (
    <section id="projects">
      <div className="container">
        <div className="reveal">
          <div className="section-label">03 — Work</div>
          <div className="section-title">Featured <em>Projects</em></div>
        </div>
        <div className="projects-grid">
          {projects.map((project, idx) => (
            <div key={project.id} className={`project-card reveal reveal-delay-${(idx % 3) + 1}`}>
              <div className="project-num">Project {String(idx + 1).padStart(2, '0')}</div>
              <h3>{project.title.toUpperCase()}</h3>
              <h4>{project.tech.join(' · ')}</h4>
              <p>{project.description}</p>
              <div className="project-tech">
                {project.tech.map(t => (
                  <span key={t} className="tech-badge">{t}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={project.liveUrl} className="project-link">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>
                  Live Demo
                </a>
                <a href={project.githubUrl} className="project-link" target="_blank" rel="noreferrer">
                  <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                  GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="reveal" style={{ marginTop: '48px', textAlign: 'center' }}>
          <a href="https://github.com/Abdullah2k05" target="_blank" rel="noreferrer" className="btn-outline">
            View All on GitHub
          </a>
        </div>

      </div>
    </section>
  );
}
