import './StatsPanel.css';

export default function StatsPanel({
  stats,
  algoLabel,
  complexity,
  arraySize,
  algorithm,
}){
  const { comparisons, swaps, time, completed } = stats;

  const getComparisonCounts = () => {
  const n = arraySize;

  switch (algorithm) {
    case 'bubble':
      return {
        best: n - 1,
        worst: (n * (n - 1)) / 2,
      };

    case 'insertion':
      return {
        best: n - 1,
        worst: (n * (n - 1)) / 2,
      };

    case 'selection':
      return {
        best: (n * (n - 1)) / 2,
        worst: (n * (n - 1)) / 2,
      };

    default:
      return {
        best: '-',
        worst: '-',
      };
    
    case 'merge':
      return {
        best: Math.round(arraySize * Math.log2(arraySize)),
        worst: Math.round(arraySize * Math.log2(arraySize)),
      };
  }
};

const comparisonCounts = getComparisonCounts();

  return (
    <div className="stats-panel">
      <div className="stats-section">
        <div className="stat-card">
          <span className="stat-label">Comparisons</span>
          <span className="stat-value">{comparisons.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Swaps</span>
          <span className="stat-value">{swaps.toLocaleString()}</span>
        </div>
                <div className="stat-card">
          <span className="stat-label">Best Comp.</span>
          <span className="stat-value">
            {comparisonCounts.best.toLocaleString()}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Worst Comp.</span>
          <span className="stat-value">
            {comparisonCounts.worst.toLocaleString()}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Time</span>
          <span className="stat-value">{time > 0 ? `${time}s` : '—'}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Status</span>
          <span className={`stat-value stat-status ${completed ? 'done' : ''}`}>
            {completed ? '✓ sorted' : 'ready'}
          </span>
        </div>
      </div>

      <div className="stats-info">
        <span className="info-chip">
          <span className="info-key">algo</span>
          <span className="info-val">{algoLabel}</span>
        </span>
        <span className="info-chip">
          <span className="info-key">avg</span>
          <span className="info-val">{complexity.time}</span>
        </span>
        <span className="info-chip">
          <span className="info-key">best</span>
          <span className="info-val">{complexity.best}</span>
        </span>
        <span className="info-chip">
          <span className="info-key">space</span>
          <span className="info-val">{complexity.space}</span>
        </span>
      </div>
    </div>
  );
}
