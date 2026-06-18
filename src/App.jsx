import { useState, useRef } from "react";
import "./App.css";

import Navbar from "./components/Navbar";
import ControlPanel from "./components/ControlPanel";
import ArrayVisualizer from "./components/ArrayVisualizer";
import StatsPanel from "./components/StatsPanel";

function generateArray(size) {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 90) + 10
  );
}


const ALGORITHMS = {
  bubble: {
    label: "Bubble Sort",
  },
  selection: {
    label: "Selection Sort",
  },
  insertion: {
    label: "Insertion Sort",
  },
};

export default function App() {
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [algorithm, setAlgorithm] = useState("bubble");
  const [highlights, setHighlights] = useState({});
  const [isRunning, setIsRunning] = useState(false);

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

  const handleStart = () => {
    setIsRunning(true);
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
        setArraySize={setArraySize}
        speed={speed}
        setSpeed={setSpeed}
        onGenerate={handleGenerate}
        onStart={handleStart}
        isRunning={isRunning}
      />

      <ArrayVisualizer
        array={array}
        highlights={highlights}
      />

      <StatsPanel
        stats={stats}
        algoLabel={ALGORITHMS[algorithm].label}
        arraySize={arraySize}
      />
    </div>
  );
}