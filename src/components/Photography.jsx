import { useState, useEffect, useRef, useCallback } from "react";

const slides = [
  {
    label: "PUCon '24 — Event Photography",
    image: "/images/one.jpg",
  },
  {
    label: "FCIT Media Society — Production",
    image: "/images/two.jpg",
  },
  {
    label: "TechnoVerse CUI — Campus Event",
    image: "/images/three.jpg",
  },
];

const events = [
  {
    year: "24",
    title: "PUCon '24",
    org: "University of the Punjab",
    role:
      "Media Team Member — Covered the flagship tech conference with photography and digital media content.",
  },
  {
    year: "24",
    title: "FCIT Media & Information Society",
    org: "PUCIT",
    role:
      "Head of Production — Led the production team for events, video shoots, and media campaigns.",
  },
  {
    year: "24",
    title: "TechnoVerse CUI Lahore",
    org: "COMSATS University",
    role:
      "Campus Ambassador — Represented and promoted the TechnoVerse tech festival across campus networks.",
  },
  {
    year: "24",
    title: "FCIT NC Sports",
    org: "PUCIT",
    role:
      "Event Manager — Organized and managed the National College Sports competitions at faculty level.",
  },
];

export default function Photography() {
  const [current, setCurrent] = useState(0);
  const total = slides.length;
  const intervalRef = useRef(null);

  const goTo = useCallback(
    (idx) => {
      setCurrent(((idx % total) + total) % total);
    },
    [total]
  );

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [total]);

  return (
    <section id="photography">
      <div className="container">
        <div className="reveal">
          <div className="section-label">04 — Media</div>
          <div className="section-title">
            Photography <em>&amp; Events</em>
          </div>
        </div>

        {/* Carousel */}
        <div className="photo-carousel reveal">
          <div
            className="photo-track"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div key={i} className="photo-slide">
                <img
                  src={slide.image}
                  alt={slide.label}
                  className="photo-image"
                />
                <div className="photo-caption">
                  {slide.label}
                </div>
              </div>
            ))}
          </div>

          <div className="photo-nav">
            <button
              className="photo-btn"
              onClick={() => goTo(current - 1)}
            >
              &#8592;
            </button>
            <button
              className="photo-btn"
              onClick={() => goTo(current + 1)}
            >
              &#8594;
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="photo-dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`photo-dot${i === current ? " active" : ""}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>

        {/* Events */}
        <div style={{ marginTop: "60px" }}>
          <div className="events-grid">
            {events.map((ev, i) => (
              <div
                key={i}
                className={`event-card reveal reveal-delay-${(i % 4) + 1}`}
              >
                <div className="event-year">{ev.year}</div>
                <div className="event-info">
                  <h4>{ev.title}</h4>
                  <p>{ev.org}</p>
                  <div className="event-role">{ev.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}