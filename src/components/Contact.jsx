import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const formRef = useRef(null);
  const [status, setStatus] = useState('idle');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');

    const SERVICE_ID = 'YOUR_EMAILJS_SERVICE_ID';
    const TEMPLATE_ID = 'YOUR_EMAILJS_TEMPLATE_ID';
    const PUBLIC_KEY = 'YOUR_EMAILJS_PUBLIC_KEY';

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
        setStatus('sent');
        formRef.current.reset();
        setTimeout(() => setStatus('idle'), 4000);
      })
      .catch(() => {
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      });
  };

  const btnLabel = {
    idle: 'Send Message →',
    sending: 'Sending...',
    sent: 'Sent ✓',
    error: 'Failed — try again',
  };

  return (
    <section id="contact">
      <div className="container">
        <div className="reveal">
          <div className="section-label">07 — Reach Out</div>
          <div className="section-title">Let's <em>Connect</em></div>
        </div>
        <div className="contact-layout">
          <div className="contact-info reveal">
            <a href="mailto:chribalc64@gmail.com" className="contact-link-item">
              <div className="contact-link-icon">✉</div>
              <div className="contact-link-text">
                <div className="contact-link-label">Email</div>
                <div className="contact-link-value">chribalc64@gmail.com</div>
              </div>
            </a>
            <a href="https://linkedin.com/in/abdullah2k05" target="_blank" rel="noreferrer" className="contact-link-item">
              <div className="contact-link-icon">in</div>
              <div className="contact-link-text">
                <div className="contact-link-label">LinkedIn</div>
                <div className="contact-link-value">linkedin.com/in/abdullah2k05</div>
              </div>
            </a>
            <a href="https://smmrival.com" target="_blank" rel="noreferrer" className="contact-link-item">
              <div className="contact-link-icon">🌐</div>
              <div className="contact-link-text">
                <div className="contact-link-label">Agency</div>
                <div className="contact-link-value">smmrival.com</div>
              </div>
            </a>
            <a href="https://github.com/Abdullah2k05" target="_blank" rel="noreferrer" className="contact-link-item">
              <div className="contact-link-icon">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </div>
              <div className="contact-link-text">
                <div className="contact-link-label">GitHub</div>
                <div className="contact-link-value">github.com/Abdullah2k05</div>
              </div>
            </a>
          </div>

          <form ref={formRef} onSubmit={handleSubmit} className="contact-form reveal reveal-delay-2">
            <div className="form-group">
              <input type="text" name="user_name" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" name="user_email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <input type="text" name="subject" placeholder="Subject" />
            </div>
            <div className="form-group">
              <textarea name="message" placeholder="Your message..."></textarea>
            </div>
            <button type="submit" className="form-submit" disabled={status === 'sending'}>
              {btnLabel[status]}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
