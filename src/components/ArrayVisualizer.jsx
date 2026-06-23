import './ArrayVisualizer.css';

const STATE_COLORS = {
  comparing: 'var(--bar-comparing)',
  swapping: 'var(--bar-swapping)',
  sorted: 'var(--bar-sorted)',
  pivot: 'var(--bar-pivot)',
  default: 'var(--bar-default)',
  active: 'var(--bar-active)',
};

export default function ArrayVisualizer({ array, highlights }) {
  const hasNegative = array.some(v => v < 0);

  const max = Math.max(...array, 1);
  const maxAbs = Math.max(...array.map(v => Math.abs(v)), 1);

  // ===== NORMAL MODE =====
  if (!hasNegative) {
    return (
      <div className="visualizer-wrapper grid-bg">
        <div className="visualizer-bars">
          {array.map((value, i) => {
            const state = highlights[i] || 'default';
            const color =
              STATE_COLORS[state] || STATE_COLORS.default;

            const heightPct = (value / max) * 100;
            const isActive = state !== 'default';
            const showLabel = array.length <= 40;

            return (
              <div key={i} className="bar-column">
                {showLabel && isActive && (
                  <span className="bar-value">
                    {value}
                  </span>
                )}

                <div
                  className={`bar ${state}`}
                  style={{
                    height: `${heightPct}%`,
                    background: color,
                    boxShadow: isActive
                      ? `0 0 10px ${color}60, 0 0 2px ${color}`
                      : 'none',
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="visualizer-baseline-bottom" />
      </div>
    );
  }

  // ===== NEGATIVE MODE =====
  return (
    <div className="visualizer-wrapper grid-bg">
      <div className="visualizer-bars-negative">
        {array.map((value, i) => {
          const state = highlights[i] || 'default';
          const color =
            STATE_COLORS[state] || STATE_COLORS.default;

          const heightPct =
            (Math.abs(value) / maxAbs) * 50;

          const isNegative = value < 0;
          const isActive = state !== 'default';
          const showLabel = array.length <= 40;

          return (
            <div
              key={i}
              className="bar-column-negative"
            >
              {showLabel && isActive && (
                <span
                  className="bar-value"
                  style={
                    isNegative
                      ? {
                          top: `calc(50% + ${heightPct}% + 6px)`,
                        }
                      : {
                          bottom: `calc(50% + ${heightPct}% + 6px)`,
                        }
                  }
                >
                  {value}
                </span>
              )}

              <div
                className={`bar-negative ${
                  isNegative
                    ? 'negative'
                    : 'positive'
                } ${state}`}
                style={{
                  height: `${heightPct}%`,
                  background: color,
                  boxShadow: isActive
                    ? `0 0 10px ${color}60, 0 0 2px ${color}`
                    : 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      <div className="visualizer-baseline-middle" />
    </div>
  );
}