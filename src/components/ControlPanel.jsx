import './ControlPanel.css';

const ALGO_OPTIONS = [
  { value: 'bubble', label: 'Bubble Sort' },
  { value: 'insertion', label: 'Insertion Sort' },
  { value: 'selection', label: 'Selection Sort' },
  { value: 'merge', label: 'Merge Sort' },

];

export default function ControlPanel({
  algorithm,  setAlgorithm,
  arraySize,  setArraySize,
  speed,  setSpeed, onGenerate,
  onStart, onPause,  onStop,  isRunning,
  isPaused,  complexity,

  customInput,
  setCustomInput,
  onLoadCustomArray,
}) {
  return (
    <aside className="control-panel">
      

      <div className="panel-section">
        <label className="field-label">Select a Sorting Algorithm : </label>
        <div className="algo-list">
          {ALGO_OPTIONS.map(opt => (
            <button
              key={opt.value}
              className={`algo-btn ${algorithm === opt.value ? 'active' : ''}`}
              onClick={() => !isRunning && setAlgorithm(opt.value)}
              disabled={isRunning}
            >
              <span className="algo-btn-dot"></span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <label className="field-label">
          Array Size
          <span className="field-value">{arraySize}</span>
        </label>
        <input
          type="range" min="10" max="80" value={arraySize}
          onChange={e => setArraySize(Number(e.target.value))}
          disabled={isRunning}
          className="slider"
        />
        <div className="slider-ticks">
          <span>10</span><span>45</span><span>80</span>
        </div>
      </div>

      <div className="panel-section">
        <label className="field-label">
          Speed
          <span className="field-value">{speed < 34 ? 'slow' : speed < 67 ? 'medium' : 'fast'}</span>
        </label>
        <input
          type="range" min="1" max="100" value={speed}
          onChange={e => setSpeed(Number(e.target.value))}
          className="slider"
        />
        <div className="slider-ticks">
          <span>slow</span><span>fast</span>
        </div>
      </div>

      <div className="panel-section">
        <label className="field-label">
          Custom Array
        </label>

        <textarea
          className="custom-array-input"
          placeholder="5,2,8,1,9,3"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          disabled={isRunning}
        />

        <button
          className="btn btn-ghost custom-load-btn"
          onClick={onLoadCustomArray}
          disabled={isRunning}
        >
          Load Array
        </button>
      </div>

      <div className="panel-section">
        <label className="field-label">Actions</label>
        <div className="action-buttons">
          <button className="btn btn-ghost" onClick={onGenerate} disabled={isRunning}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10 6A4 4 0 1 1 6 2v1l2-2-2-2v1A5 5 0 1 0 11 6h-1z" fill="currentColor"/>
            </svg>
            New Array
          </button>
          {!isRunning ? (
            <button className="btn btn-primary" onClick={onStart}>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <path d="M1 1l8 5-8 5V1z" fill="currentColor"/>
              </svg>
              Start
            </button>
          ) : (
            <>
              <button className={`btn ${isPaused ? 'btn-primary' : 'btn-warning'}`} onClick={onPause}>
                {isPaused ? (
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                    <path d="M1 1l8 5-8 5V1z" fill="currentColor"/>
                  </svg>
                ) : (
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                    <rect x="1" y="1" width="3" height="10" rx="1" fill="currentColor"/>
                    <rect x="6" y="1" width="3" height="10" rx="1" fill="currentColor"/>
                  </svg>
                )}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button className="btn btn-danger" onClick={onStop}>
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="1" y="1" width="8" height="8" rx="1" fill="currentColor"/>
                </svg>
                Stop
              </button>
            </>
          )}
        </div>
      </div>

      <div className="complexity-card">
        <div className="complexity-header">
          <span className="complexity-title">Complexity</span>
        </div>
        <div className="complexity-rows">
          <div className="complexity-row">
            <span className="comp-key">Time (avg)</span>
            <span className="comp-val comp-bad">{complexity.time}</span>
          </div>
          <div className="complexity-row">
            <span className="comp-key">Time (best)</span>
            <span className="comp-val comp-good">{complexity.best}</span>
          </div>
          <div className="complexity-row">
            <span className="comp-key">Space</span>
            <span className="comp-val comp-ok">{complexity.space}</span>
          </div>
        </div>
      </div>

      <div className="legend">
        <div className="legend-title">Legend</div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-dot" style={{background:'var(--bar-default)'}}></div>
            <span>Default</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{background:'var(--bar-comparing)'}}></div>
            <span>Comparing</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{background:'var(--bar-swapping)'}}></div>
            <span>Swapping</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{background:'var(--bar-sorted)'}}></div>
            <span>Sorted</span>
          </div>
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ background: 'var(--bar-active)' }}
            ></div>
            <span>Active Range</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot" style={{background:'var(--bar-pivot)'}}></div>
            <span>Pivot/Min</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
