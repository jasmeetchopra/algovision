import Navbar from "./components/Navbar";
import ControlPanel from "./components/ControlPanel";
import ArrayVisualizer from "./components/ArrayVisualizer";
import StatsPanel from "./components/StatsPanel";

function App() {
  return (
    <div className="app">
      <Navbar />
      <ControlPanel />
      <ArrayVisualizer />
      <StatsPanel />
    </div>
  );
}

export default App;