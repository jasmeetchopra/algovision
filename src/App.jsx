import { useState, useRef } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import ControlPanel from "./components/ControlPanel";
import ArrayVisualizer from "./components/ArrayVisualizer";
import StatsPanel from "./components/StatsPanel";

import { bubbleSort } from "./algorithms/sorting/bubbleSort";
import { selectionSort } from "./algorithms/sorting/selectionSort";
import { insertionSort } from "./algorithms/sorting/insertionSort";

function generateArray(size) {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 90) + 10
  );
}


const ALGORITHMS = {
  bubble: {
  fn: bubbleSort,
  label: "Bubble Sort",
  complexity: {
    time: "O(n²)",
    space: "O(1)",
    best: "O(n)",
  },
},

selection: {
  fn: selectionSort,
  label: "Selection Sort",
  complexity: {
    time: "O(n²)",
    space: "O(1)",
    best: "O(n²)",
  },
},

insertion: {
  fn: insertionSort,
  label: "Insertion Sort",
  complexity: {
    time: "O(n²)",
    space: "O(1)",
    best: "O(n)",
  },
},
};

export default function App() {
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [highlights, setHighlights] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const [stats, setStats] = useState({
    comparisons: 0,
    swaps: 0,
    time: 0,
    completed: false,
  });

  const stopRef = useRef(false);
  const animFrameRef = useRef(null);

  const [array, setArray] = useState(() =>
    generateArray(30)
  );

  const handleStart = async () => {
  if (isRunning) return;

  stopRef.current = false;
  setIsRunning(true);

  setStats({
    comparisons: 0,
    swaps: 0,
    time: 0,
    completed: false,
  });

  const arr = [...array];

  const delay = () =>
    new Promise((res) => {
      const ms = Math.max(1, 300 - speed * 2.9);
      animFrameRef.current = setTimeout(res, ms);
    });

  const waitIfPaused = () => Promise.resolve();

  const algo = ALGORITHMS[algorithm];
  const startTime = performance.now();

  await algo.fn(arr, {
    setArray,
    setHighlights,
    setStats,
    delay,
    waitIfPaused,
    shouldStop: () => stopRef.current,
  });

  if (!stopRef.current) {
    const elapsed = (
      (performance.now() - startTime) / 1000
    ).toFixed(2);

    setStats((s) => ({
      ...s,
      time: elapsed,
      completed: true,
    }));

    setHighlights({});
  }

  setIsRunning(false);
};

  const handleGenerate = () => {
    stopRef.current = true;

    setIsRunning(false);
    setHighlights({});

    setStats({
      comparisons: 0,
      swaps: 0,
      time: 0,
      completed: false,
    });

    setTimeout(() => {
      stopRef.current = false;
      setArray(generateArray(arraySize));
    }, 50);
  };

  const handleLoadCustomArray = () => {
    const values = customInput
      .split(/[\s,]+/)
      .map(Number)
      .filter((v) => !isNaN(v));

    if (values.length === 0) {
      alert("Enter valid numbers");
      return;
    }

    if (values.length > 80) {
      alert("Maximum 80 elements allowed");
      return;
    }

    setArray(values);
    setArraySize(values.length);

    setHighlights({});

    setStats({
      comparisons: 0,
      swaps: 0,
      time: 0,
      completed: false,
    });
  };

  return (
    <div className="app">
      <Navbar
        algorithm={algorithm}
        algoLabel={ALGORITHMS[algorithm].label}
      />

      <ControlPanel
      algorithm={algorithm}
      setAlgorithm={setAlgorithm}
      arraySize={arraySize}
      speed={speed}
      onGenerate={handleGenerate}
      onStart={handleStart}
      isRunning={isRunning}
      customInput={customInput}
      setCustomInput={setCustomInput}
      onLoadCustomArray={handleLoadCustomArray}
    />

      <ArrayVisualizer
        array={array}
        highlights={highlights}
      />

      <StatsPanel
        stats={stats}
        algoLabel={ALGORITHMS[algorithm].label}
        complexity={ALGORITHMS[algorithm].complexity}
        arraySize={arraySize}
      />
    </div>
  );
}