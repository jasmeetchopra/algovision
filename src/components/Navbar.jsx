import './Navbar.css';

const ALGO_OPTIONS = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'selection', label: 'Selection Sort' },
  { value: 'merge', label: 'Merge Sort' },
];

export default function Navbar({
  algorithm,
  setAlgorithm,
  isRunning,
}) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="1" y="12" width="3" height="7" rx="1" fill="var(--accent)" opacity="0.45"/>
            <rect x="6" y="8" width="3" height="11" rx="1" fill="var(--accent)" opacity="0.6"/>
            <rect x="11" y="4" width="3" height="15" rx="1" fill="var(--accent)" opacity="0.8"/>
            <rect x="16" y="1" width="3" height="18" rx="1" fill="var(--accent)"/>
          </svg>
        </div>

        <span className="brand-name">
          Algo<span className="brand-accent">Vision</span>
        </span>
      </div>

      <div className="navbar-links">
        {ALGO_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            className={`nav-link ${
              algorithm === opt.value ? 'active' : ''
            }`}
            onClick={() => !isRunning && setAlgorithm(opt.value)}
            disabled={isRunning}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </nav>
  );
}