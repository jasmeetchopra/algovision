export default function ControlPanel({
  algorithm,
  setAlgorithm,
  arraySize,
  speed,
  onGenerate,
}) {
  return (
    <div>

      <label>
        Algorithm
      </label>

      <select
        value={algorithm}
        onChange={(e) =>
          setAlgorithm(e.target.value)
        }
      >
        <option value="bubble">
          Bubble Sort
        </option>

        <option value="selection">
          Selection Sort
        </option>

        <option value="insertion">
          Insertion Sort
        </option>
      </select>

      <p>
        Array Size: {arraySize}
      </p>

      <p>
        Speed: {speed}
      </p>

      <button onClick={onGenerate}>
        Generate Array
      </button>

    </div>
  );
}