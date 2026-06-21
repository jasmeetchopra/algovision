import { useState, useRef, useCallback, useEffect } from 'react';
import "./App.css";
import Navbar from './components/Navbar';
import ControlPanel from './components/ControlPanel';
import ArrayVisualizer from './components/ArrayVisualizer';
import StatsPanel from './components/StatsPanel';
import { bubbleSort } from "./algorithms/sorting/bubbleSort";
import { selectionSort } from "./algorithms/sorting/selectionSort";
import { insertionSort } from "./algorithms/sorting/insertionSort";
import { mergeSort } from "./algorithms/sorting/mergeSort";
import MergeTreeVisualizer from './components/MergeTreeVisualizer';


const ALGORITHMS = {
  bubble: { fn: bubbleSort, label: 'Bubble Sort', complexity: { time: 'O(n²)', space: 'O(1)', best: 'O(n)' } },
  insertion: { fn: insertionSort, label: 'Insertion Sort', complexity: { time: 'O(n²)', space: 'O(1)', best: 'O(n)' } },
  selection: { fn: selectionSort, label: 'Selection Sort', complexity: { time: 'O(n²)', space: 'O(1)', best: 'O(n²)' } },
  merge: { fn: mergeSort, label: 'Merge Sort', complexity: { time: 'O(n log n)', space: 'O(n)', best: 'O(n log n)' } },
};

function generateArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

function nodeId(left, right) {
  return `${left}-${right}`;
}

export default function App() {
  const [algorithm, setAlgorithm] = useState('merge');
  const [arraySize, setArraySize] = useState(27);
  const [speed, setSpeed] = useState(50);
  const [array, setArray] = useState(() => generateArray(27));
  const [highlights, setHighlights] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0, time: 0, completed: false });
  const [customInput, setCustomInput] = useState('');
  const [mergeTree, setMergeTree] = useState(new Map());
  const [mergeCallStack, setMergeCallStack] = useState([]);
  const [currentMergeEvent, setCurrentMergeEvent] = useState(null);

  const pauseRef = useRef(false);
  const stopRef = useRef(false);
  const animFrameRef = useRef(null);

  const resetMergeTree = useCallback(() => {
    setMergeTree(new Map());
    setMergeCallStack([]);
  }, []);
  const onMergeEvent = useCallback((evt) => {
    setCurrentMergeEvent(evt);
    const id = nodeId(evt.left, evt.right);

    switch (evt.type) {

      case 'enter': {
        setMergeTree(prev => {
          const next = new Map(prev);
          const existing = next.get(id);

          next.set(id, {
            id,
            left: evt.left,
            right: evt.right,
            depth: evt.depth,
            values: evt.values || [],
            originalValues:
              existing?.originalValues ??
              [...(evt.values || [])],
            mid: existing?.mid ?? null,
            children: existing?.children ?? [],
            state: 'active',
          });

          return next;
        });
        break;
      }

      case 'base': {
        setMergeTree(prev => {
          const next = new Map(prev);

          const node = next.get(id);

          if (node) {
            next.set(id, {
              ...node,
              state: 'base',
              values: evt.values || node.values,
            });
          }

          return next;
        });

        break;
      }

      case 'split': {
        const leftChildId = nodeId(evt.left, evt.mid);
        const rightChildId = nodeId(evt.mid + 1, evt.right);

        setMergeTree(prev => {
          const next = new Map(prev);

          const node = next.get(id);

          if (node) {
            next.set(id, {
              ...node,
              mid: evt.mid,
              children: [leftChildId, rightChildId],
            });
          }

          return next;
        });

        break;
      }

      case 'mergeStart': {
        setMergeTree(prev => {
          const next = new Map(prev);

          const node = next.get(id);

          if (node) {
            next.set(id, {
              ...node,
              state: 'merging',
            });
          }

          return next;
        });

        break;
      }

      case 'mergeDone': {
        setMergeTree(prev => {
          const next = new Map(prev);

          const node = next.get(id);

          if (node) {
            next.set(id, {
              ...node,
              state: 'done',
              values: evt.values || node.values,
            });
          }

          return next;
        });

        break;
      }

      default:
        break;
    }
  }, []);

  const handleGenerate = useCallback(() => {

    setCurrentMergeEvent(null);

    stopRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
    setHighlights({});
    setStats({ comparisons: 0, swaps: 0, time: 0, completed: false });

    resetMergeTree();

    setTimeout(() => {
      stopRef.current = false;
      setArray(generateArray(arraySize));
    }, 50);
  }, [arraySize]);

  const handleStart = useCallback(async () => {
    if (isRunning) return;
    stopRef.current = false;
    pauseRef.current = false;
    setIsRunning(true);
    setIsPaused(false);
    setStats({ comparisons: 0, swaps: 0, time: 0, completed: false });

    const arr = [...array];
    const delay = () => new Promise(res => {
      const ms = Math.max(1, 300 - speed * 2.9);
      animFrameRef.current = setTimeout(res, ms);
    });

    const waitIfPaused = () => new Promise(res => {
      const check = () => {
        if (stopRef.current) { res(); return; }
        if (!pauseRef.current) { res(); return; }
        setTimeout(check, 50);
      };
      check();
    });

    const algo = ALGORITHMS[algorithm];
    const startTime = performance.now();

    await algo.fn(arr,{
    setArray,
    setHighlights,
    setStats,
    delay,
    waitIfPaused,
    shouldStop: () => stopRef.current,

    onMergeEvent:
      algorithm === 'merge'
        ? onMergeEvent
        : undefined,
  });

    if (!stopRef.current) {
      const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
      setStats(s => ({ ...s, time: elapsed, completed: true }));
      setHighlights({});
    }

    setIsRunning(false);
    setIsPaused(false);
  }, [isRunning, array, algorithm, speed]);

  const handlePause = useCallback(() => {
    if (!isRunning) return;
    pauseRef.current = !pauseRef.current;
    setIsPaused(p => !p);
  }, [isRunning]);

  const handleStop = useCallback(() => {
    stopRef.current = true;
    pauseRef.current = false;

    clearTimeout(animFrameRef.current);
    setIsRunning(false);
    setIsPaused(false);
    setHighlights({});
  }, []);

  const handleSizeChange = useCallback((size) => {
    resetMergeTree();
    if (isRunning) return;
    setArraySize(size);
    setArray(generateArray(size));
    setHighlights({});
    setStats({ comparisons: 0, swaps: 0, time: 0, completed: false });
  }, [isRunning]);

  const handleLoadCustomArray = useCallback(() => {
    setCurrentMergeEvent(null);
    resetMergeTree();
    if (isRunning) return;
    const values = customInput
      .split(/[\s,]+/)
      .map(Number)
      .filter(v => !isNaN(v));

    if (values.length === 0) {
      alert('Enter valid numbers');
      return;
    }
    if (values.length > 80) {
      alert('Maximum 80 elements allowed');
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
  }, [customInput, isRunning]);

  useEffect(() => {
    console.table(
      [...mergeTree.values()].map(node => ({
        range: `${node.left}-${node.right}`,
        values: node.values?.join(","),
        state: node.state
      }))
    );
  }, [mergeTree]);

  return (
    <div className="app">
      <Navbar
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        isRunning={isRunning}
      />
      <div className="app-body">
        <ControlPanel
          arraySize={arraySize}
          setArraySize={handleSizeChange}
          speed={speed}
          setSpeed={setSpeed}
          onGenerate={handleGenerate}
          onStart={handleStart}
          onPause={handlePause}
          onStop={handleStop}
          isRunning={isRunning}
          isPaused={isPaused}
          complexity={ALGORITHMS[algorithm].complexity}

          customInput={customInput}
          setCustomInput={setCustomInput}
          onLoadCustomArray={handleLoadCustomArray}
        />
        <div className="main-content">
          <ArrayVisualizer
            array={array}
            highlights={highlights}
            arraySize={arraySize}
          />

          {algorithm === "merge" && (
            <MergeTreeVisualizer
              mergeTree={mergeTree}
              mergeCallStack={mergeCallStack}
              currentEvent={currentMergeEvent}
            />
          )}

          <StatsPanel
            stats={stats}
            algoLabel={ALGORITHMS[algorithm].label}
            complexity={ALGORITHMS[algorithm].complexity}
            arraySize={arraySize}
            algorithm={algorithm}
          />

        </div>
      </div>
    </div>
  );
}
