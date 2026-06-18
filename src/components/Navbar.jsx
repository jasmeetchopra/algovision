import './Navbar.css';

export default function Navbar({ algoLabel }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="12" width="3" height="7" rx="1" fill="var(--accent-cyan)" opacity="0.5"/>
            <rect x="6" y="8" width="3" height="11" rx="1" fill="var(--accent-cyan)" opacity="0.7"/>
            <rect x="11" y="4" width="3" height="15" rx="1" fill="var(--accent-cyan)" opacity="0.9"/>
            <rect x="16" y="1" width="3" height="18" rx="1" fill="var(--accent-cyan)"/>
          </svg>
        </div>
        <span className="brand-name">Algo<span className="brand-accent">Vision</span></span>
      </div>

      <div className="navbar-center">
        <div className="status-badge">
          <span className="status-dot"></span>
          <span className="status-text">LIVE</span>
        </div>
        <span className="nav-algo-label">{algoLabel}</span>
      </div>

      <div className="navbar-links">
        <a href="#" className="nav-link disabled">Sorting</a>
        <a href="#" className="nav-link disabled">Searching</a>
        <a href="#" className="nav-link disabled">Graph</a>
        <a href="#" className="nav-link disabled">Tree</a>
      </div>
    </nav>
  );
}
