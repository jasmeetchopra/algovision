import "./MergeTreeVisualizer.css";

export default function MergeTreeVisualizer({
  mergeTree,
}) {
  return (
    <div className="merge-tree">
      <h3>Merge Tree</h3>

      {[...mergeTree.values()].map((node) => (
        <div
        key={node.id}
        className={`tree-node ${node.state}`}
        style={{
            marginLeft:
            `${node.depth * 30}px`,
        }}
        >
        <div className="range">
            {node.left}-{node.right}
        </div>

        <div className="state">
            {node.state}
        </div>
        </div>
      ))}
    </div>
  );
}