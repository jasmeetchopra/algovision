import "./Navbar.css";

export default function Navbar({
  algoLabel,
}) {
  return (
    <header className="navbar">
      <h1>AlgoVision</h1>

      <p>
        Selected Algorithm:
        {" "}
        {algoLabel}
      </p>
    </header>
  );
}