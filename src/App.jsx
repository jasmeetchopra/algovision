import { useState } from "react";
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

export default function App() {
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(50);

  const [array, setArray] = useState(() =>
    generateArray(30)
  );

  const handleGenerate = () => {
    setArray(generateArray(arraySize));
  };

  return (
    <div className="app">
      <Navbar />

      <ControlPanel
        arraySize={arraySize}
        speed={speed}
        onGenerate={handleGenerate}
      />

      <ArrayVisualizer array={array} />

      <StatsPanel />
    </div>
  );
}