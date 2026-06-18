export default function ControlPanel({
  algorithm,
  setAlgorithm,
  arraySize,
  speed,
  onGenerate,
  onStart,
  isRunning,
  customInput,
  setCustomInput,
  onLoadCustomArray,
}) {
  return (
    <div>
      <label>Algorithm</label>

      <select
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
      >
        <option value="bubble">Bubble Sort</option>
        <option value="selection">Selection Sort</option>
        <option value="insertion">Insertion Sort</option>
      </select>

      <p>Array Size: {arraySize}</p>

      <p>Speed: {speed}</p>

      <button onClick={onGenerate}>
        Generate Array
      </button>

      <textarea
        value={customInput}
        onChange={(e) =>
            setCustomInput(e.target.value)
        }
        placeholder="10, 5, 7, 2, 9"
        />

        <button
        onClick={onLoadCustomArray}
        disabled={isRunning}
        >
        Load Custom Array
        </button>

      <button
        onClick={onStart}
        disabled={isRunning}
      >
        Start Sorting
      </button>
    </div>
  );
}