export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">MA.</div>
      <div className="footer-copy">© {new Date().getFullYear()} Muhammad Abdullah. All rights reserved.</div>
      <div className="footer-links">
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <a href="https://smmrival.com" target="_blank" rel="noreferrer">SMM Rival</a>
        <a href="https://github.com/Abdullah2k05" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://linkedin.com/in/abdullah2k05" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </footer>
  );
}
