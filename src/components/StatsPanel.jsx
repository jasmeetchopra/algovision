export default function StatsPanel({
  stats,
  algoLabel,
  complexity,
  arraySize,
}) {
  return (
    <div>
      <h3>{algoLabel}</h3>

      <p>Elements: {arraySize}</p>
      <p>Comparisons: {stats.comparisons}</p>
      <p>Swaps: {stats.swaps}</p>
      <p>Time: {stats.time}s</p>

      <p>
        Status:
        {stats.completed
          ? " Completed"
          : " Running"}
      </p>

      <hr />

      <p>Time Complexity: {complexity.time}</p>
      <p>Space Complexity: {complexity.space}</p>
      <p>Best Case: {complexity.best}</p>
    </div>
  );
}