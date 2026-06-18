import "./ArrayVisualizer.css";

export default function ArrayVisualizer({ array }) {
  const showLabels = array.length <= 40;

  return (
    <div className="array-container">
      {array.map((value, index) => (
        <div
          key={index}
          className="array-item"
        >
          <div
            className="array-bar"
            style={{
              height: `${value * 4}px`,
            }}
          />

          {showLabels && (
            <span className="array-label">
              {value}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}