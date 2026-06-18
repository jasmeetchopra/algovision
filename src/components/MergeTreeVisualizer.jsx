import "./MergeTreeVisualizer.css";

export default function MergeTreeVisualizer({
  mergeTree,
}) {
  return (
    <div className="merge-tree">
      <h3>Merge Tree</h3>

      {[...mergeTree.values()].map((node) => (
        <div key={node.id}>
          Range: {node.left}-{node.right}
          {" | "}
          {node.state}
        </div>
      ))}
    </div>
  );
}