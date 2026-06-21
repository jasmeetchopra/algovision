import './Navbar.css';

const ALGO_OPTIONS = [
  { value: 'bubble', label: 'Bubble' },
  { value: 'insertion', label: 'Insertion' },
  { value: 'selection', label: 'Selection' },
  { value: 'merge', label: 'Merge' },
];

export default function Navbar({
  algorithm,
  setAlgorithm,
  isRunning,
}) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <circle cx="6" cy="15" r="2.2" fill="var(--accent)" />
              <circle cx="15" cy="15" r="2.2" fill="var(--accent)" />
              <circle cx="24" cy="15" r="2.2" fill="var(--accent)" />

              <path
                d="M6 15H24"
                stroke="var(--accent)"
                strokeWidth="1.5"
                opacity="0.5"
              />

              <path
                d="M15 7V11"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M12.5 10L15 7L17.5 10"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <span className="brand-name">
            Algo<span className="brand-accent">Vision</span>
          </span>
        </div>

        <div className="nav-divider" />

        <div className="navbar-links">
          {ALGO_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`nav-link ${
                algorithm === opt.value ? 'active' : ''
              }`}
              onClick={() =>
                !isRunning && setAlgorithm(opt.value)
              }
              disabled={isRunning}
            >
              {algorithm === opt.value && (
                <span className="nav-dot" />
              )}

              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}