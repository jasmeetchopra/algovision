export default function ControlPanel({
  arraySize,
  speed,
  onGenerate,
}) {
  return (
    <div>
      <p>Array Size: {arraySize}</p>
      <p>Speed: {speed}</p>

      <button onClick={onGenerate}>
        Generate Array
      </button>
    </div>
  );
}