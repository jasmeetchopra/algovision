export default function StatsPanel({
  stats,
}) {
  return (
    <div>
      <p>
        Comparisons:
        {" "}
        {stats.comparisons}
      </p>

      <p>
        Swaps:
        {" "}
        {stats.swaps}
      </p>

      <p>
        Time:
        {" "}
        {stats.time}s
      </p>
    </div>
  );
}