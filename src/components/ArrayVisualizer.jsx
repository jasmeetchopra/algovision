import "./ArrayVisualizer.css";

const STATE_COLORS = {
  default: "#3b82f6",
  comparing: "#f59e0b",
  swapping: "#ef4444",
  sorted: "#22c55e",
};

export default function ArrayVisualizer({
  array,
  highlights = {},
}) {
  const showLabels = array.length <= 40;

  const barWidth =
    array.length <= 20
      ? 30
      : array.length <= 40
      ? 20
      : 12;

  return (
    <div className="array-container">
      {array.map((value, index) => {
        const state =
          highlights[index] || "default";

        return (
          <div
            key={index}
            className="array-item"
          >
            <div
              className="array-bar"
              style={{
                height: `${value * 4}px`,
                width: `${barWidth}px`,
                backgroundColor:
                  STATE_COLORS[state],
              }}
            />

            {showLabels && (
              <span className="array-label">
                {value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}