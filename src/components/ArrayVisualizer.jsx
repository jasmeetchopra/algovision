export default function ArrayVisualizer({
  array,
}) {
  return (
    <div className="array-container">
      {array.map((value, index) => (
        <div
          key={index}
          className="array-bar"
          style={{
            height: `${value * 4}px`,
          }}
        />
      ))}
    </div>
  );
}