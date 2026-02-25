
import ProfilePhoto from "../../public/images/me.jpg"; // adjust path according to your folder structure

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-grid"></div>
      <div className="hero-bg-text" id="heroBgText">AI AUTOMATION</div>

      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-tag">Let's Collaborate</div>
          <h1 className="hero-name">MUHAMMAD<span>ABDULLAH</span></h1>
          <p className="hero-role">AI Automation Engineer &amp; Data Science Specialist</p>
          <p className="hero-desc">I design intelligent systems, AI-powered workflows, and scalable backend architectures for global impact.</p>
          <div className="hero-cta">
            <a href="#projects" className="btn-primary"><span>View Projects</span></a>
            <a href="#contact" className="btn-outline">Get in Touch</a>
          </div>
        </div>

        <div className="hero-image-wrap">
          <div className="hero-image-frame">
            <img 
              src={ProfilePhoto} 
              alt="Muhammad Abdullah" 
              className="hero-photo" 
              style={{ width: "100%", height: "auto", objectFit: "cover" }}
            />
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