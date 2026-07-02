import { useState, useEffect, useRef, useCallback } from "react";

export default function Photography({ slides = [], events = [] }) {
  const [current, setCurrent] = useState(0);
  const total = slides.length;
  const intervalRef = useRef(null);

  const goTo = useCallback(
    (idx) => {
      setCurrent(((idx % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (!total) return undefined;

    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [total]);

  useEffect(() => {
    if (current >= total) setCurrent(0);
  }, [current, total]);

  return (
    <section id="photography">
      <div className="container">
        <div className="reveal">
          <div className="section-label">05 — Media</div>
          <div className="section-title">
            Photography <em>&amp; Events</em>
          </div>
        </div>

        {/* Carousel */}
        {total ? (
          <div className="photo-carousel reveal">
            <div
              className="photo-track"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {slides.map((slide, i) => (
                <div key={slide.id || i} className="photo-slide">
                  <picture>
                    <img
                      src={slide.image}
                      alt={slide.label}
                      className="photo-image"
                      width={1600}
                      height={400}
                      loading="lazy"
                    />
                  </picture>
                  <div className="photo-caption">{slide.label}</div>
                </div>
              ))}
            </div>

            <div className="photo-nav">
              <button
                className="photo-btn"
                onClick={() => goTo(current - 1)}
                aria-label="Previous photo"
              >
                &#8592;
              </button>
              <button
                className="photo-btn"
                onClick={() => goTo(current + 1)}
                aria-label="Next photo"
              >
                &#8594;
              </button>
            </div>
          </div>
        ) : null}

        {/* Dots */}
        {total ? (
          <div className="photo-dots">
            {slides.map((slide, i) => (
              <button
                key={slide.id || i}
                className={`photo-dot${i === current ? " active" : ""}`}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                title={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        ) : null}

        {/* Events */}
        <div style={{ marginTop: "60px" }}>
          <div className="events-grid">
            {events.map((ev, i) => (
              <div
                key={ev.id || i}
                className={`event-card reveal reveal-delay-${(i % 4) + 1}`}
              >
                <div className="event-year">{ev.year}</div>
                <div className="event-info">
                  <h4>{ev.title}</h4>
                  <p>{ev.org}</p>
                  <div className="event-role">{ev.role}</div>
                  {ev.linkUrl && ev.linkLabel && (
                    <a href={ev.linkUrl} target="_blank" rel="noreferrer" style={{ color: '#c7c7c7', textDecoration: 'underline', fontSize: 13, marginTop: 8, display: 'inline-block' }}>
                      {ev.linkLabel} ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
