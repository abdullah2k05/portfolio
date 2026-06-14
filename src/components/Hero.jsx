const ProfilePhoto = "/images/me.jpg";

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-grid"></div>
      <div className="hero-bg-text" id="heroBgText">
        PRODUCT ENGINEER
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-tag">Let's Collaborate</div>
          <h1 className="hero-name">
            MUHAMMAD<span>ABDULLAH</span>
          </h1>
          <h2 className="hero-role">Full-Stack Product Engineer</h2>
          <p className="hero-desc">
            I build scalable, multi-surface ecosystems and AI-powered platforms
            at the intersection of entrepreneurship and innovation.
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn-primary">
              <span>View Projects</span>
            </a>
            <a href="#contact" className="btn-outline">
              Get in Touch
            </a>
            <a
              href="/Muhammad-Abdullah-CV.pdf"
              className="btn-outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View CV
            </a>
          </div>
        </div>

        <div className="hero-image-wrap">
          <div className="hero-image-frame">
            <picture>
              <source srcSet="/images/me.webp" type="image/webp" />
              <img
                src={ProfilePhoto}
                alt="Muhammad Abdullah"
                className="hero-photo"
                width={1200}
                height={675}
                loading="eager"
                fetchPriority="high"
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </picture>
            <div className="image-corner tl"></div>
            <div className="image-corner tr"></div>
            <div className="image-corner bl"></div>
            <div className="image-corner br"></div>
          </div>
          <div className="hero-image-label">Muhammad Abdullah — Lahore, PK</div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-line"></div>
        <div className="scroll-text">Scroll</div>
      </div>
    </section>
  );
}
