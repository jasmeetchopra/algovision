import React, { useMemo, useRef, useEffect, useState } from "react";
import "./MergeTreeVisualizer.css";

/* ------------------------------------------------------------------ */
/*  Layout: Reingold–Tilford tidy tree                                 */
/* ------------------------------------------------------------------ */

const NODE_W = 140;
const NODE_H = 70;
const H_GAP = 24;
const V_GAP = 90;

function layoutTree(root) {
  if (!root) return { positioned: [], width: 0, height: 0 };

  function measure(node) {
    if (!node.children || node.children.length === 0) {
      node._w = NODE_W;
      return NODE_W;
    }
    let total = 0;
    node.children.forEach((c, i) => {
      total += measure(c);
      if (i > 0) total += H_GAP;
    });
    node._w = Math.max(NODE_W, total);
    return node._w;
  }

  function assign(node, xStart, depth) {
    node._x = xStart + node._w / 2 - NODE_W / 2;
    node._y = depth * (NODE_H + V_GAP);

    if (!node.children) return;
    let cursor = xStart;
    const childrenWidth = node.children.reduce(
      (s, c, i) => s + c._w + (i > 0 ? H_GAP : 0),
      0
    );
    cursor = xStart + (node._w - childrenWidth) / 2;
    node.children.forEach((c) => {
      assign(c, cursor, depth + 1);
      cursor += c._w + H_GAP;
    });
  }

  measure(root);
  assign(root, 0, 0);

  const flat = [];
  function walk(n) {
    flat.push(n);
    n.children?.forEach(walk);
  }
  walk(root);

  const maxX = Math.max(...flat.map((n) => n._x + NODE_W));
  const maxY = Math.max(...flat.map((n) => n._y + NODE_H));
  return { positioned: flat, width: maxX, height: maxY };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function buildRoot(mergeTree) {
  if (!mergeTree || mergeTree.size === 0) return null;
  const nodes = Array.from(mergeTree.values());
  let root = nodes[0];
  for (const n of nodes) {
    if (n.right - n.left > root.right - root.left) root = n;
  }

  function hydrate(node) {
    if (!node) return null;
    const hydrated = {
    ...node,
    originalValues: node.originalValues ?? node.values,
    children: [],
    };
    if (node.children && node.children.length) {
      hydrated.children = node.children
        .map((c) => (typeof c === "string" ? mergeTree.get(c) : c))
        .filter(Boolean)
        .map(hydrate);
    }
    return hydrated;
  }
  return hydrate(root);
}

function classifyPhase(node) {
  if (node.state === "merging") return "merging";
  if (node.state === "done" || node.state === "merged") return "merged";
  if (node.state === "base" || node.left === node.right) return "leaf";
  if (node.state === "active") return "active";
  return "splitting";
}

function formatChips(values, maxShown = 8) {
  if (!values) return [];
  if (values.length <= maxShown) {
    return values.map((v, i) => ({ v, key: i, ellipsis: false }));
  }
  const head = values.slice(0, 3).map((v, i) => ({ v, key: `h${i}`, ellipsis: false }));
  const tail = values.slice(-2).map((v, i) => ({ v, key: `t${i}`, ellipsis: false }));
  return [...head, { v: "…", key: "dots", ellipsis: true }, ...tail];
}

function phaseLabel(phase) {
  switch (phase) {
    case "splitting": return "Splitting";
    case "active":    return "Active";
    case "leaf":      return "Leaf (base case)";
    case "merging":   return "Merging";
    case "merged":    return "Merged";
    default:          return phase;
  }
}

/* ------------------------------------------------------------------ */
/*  Tooltip                                                            */
/* ------------------------------------------------------------------ */

function NodeTooltip({ node, phase }) {
  const original = node.originalValues ?? node.values ?? [];
  const current = node.values ?? [];

  return (
    <div className="mtv-tooltip" role="tooltip">
      <div className="mtv-tt-row">
        <span className="mtv-tt-label">Range:</span>
        <span className="mtv-tt-value">[{node.left}..{node.right}]</span>
      </div>
      <div className="mtv-tt-row">
        <span className="mtv-tt-label">Depth:</span>
        <span className="mtv-tt-value">{node.depth}</span>
      </div>
      <div className="mtv-tt-row">
        <span className="mtv-tt-label">State:</span>
        <span className={`mtv-tt-state mtv-tt-state-${phase}`}>
          {phaseLabel(phase)}
        </span>
      </div>

      <div className="mtv-tt-divider" />

      <div className="mtv-tt-section-title">Original Segment</div>
      <div className="mtv-tt-array">[{original.join(", ")}]</div>

      <div className="mtv-tt-divider" />

      <div className="mtv-tt-section-title">Current Segment</div>
      <div className="mtv-tt-array">[{current.join(", ")}]</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Node component                                                     */
/* ------------------------------------------------------------------ */

function TreeNode({ node, phase }) {
  const chips = formatChips(node.values);
  const [hover, setHover] = useState(false);

  return (
    <div
      className={`mtv-node mtv-${phase}`}
      style={{
        left: node._x,
        top: node._y,
        width: NODE_W,
        height: NODE_H,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="mtv-node-header">
        <span className="mtv-range">
          [{node.left}…{node.right}]
        </span>
        <span className="mtv-depth">d{node.depth}</span>
      </div>
      <div className="mtv-chips">
        {chips.map((c, i) => (
          <span
            key={c.key}
            className={`mtv-chip ${c.ellipsis ? "mtv-chip-dots" : ""}`}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {c.v}
          </span>
        ))}
      </div>
      {phase === "active" && <div className="mtv-pulse-ring" />}
      {phase === "merging" && <div className="mtv-merge-glow" />}

      <div className={`mtv-tooltip-wrap ${hover ? "is-visible" : ""}`}>
        <NodeTooltip node={node} phase={phase} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Edge rendering                                                     */
/* ------------------------------------------------------------------ */

function Edges({ nodes }) {
  const lines = [];
  for (const parent of nodes) {
    if (!parent.children) continue;
    for (const child of parent.children) {
      const x1 = parent._x + NODE_W / 2;
      const y1 = parent._y + NODE_H;
      const x2 = child._x + NODE_W / 2;
      const y2 = child._y;
      const midY = (y1 + y2) / 2;
      const merging = parent.state === "merging";
      const merged = parent.state === "done" || parent.state === "merged";
      const cls = merging
        ? "mtv-edge mtv-edge-merging"
        : merged
        ? "mtv-edge mtv-edge-merged"
        : "mtv-edge";
      lines.push(
        <path
          key={`${parent.id}->${child.id}`}
          className={cls}
          d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
        />
      );

      if (merging) {
        lines.push(
          <g key={`arrow-${parent.id}-${child.id}`} className="mtv-merge-arrow">
            <circle cx={x2} cy={y2 - 6} r="3" fill="#ff9a3c">
              <animate
                attributeName="cy"
                from={y2 - 6}
                to={y1 + 6}
                dur="0.9s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;1;0"
                dur="0.9s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      }
    }
  }
  return <>{lines}</>;
}

/* ------------------------------------------------------------------ */
/*  Operation panel                                                    */
/* ------------------------------------------------------------------ */

function OperationPanel({ event, stats }) {
  if (!event) {
    return (
      <div className="mtv-op-panel mtv-op-idle">
        <div className="mtv-op-title">Idle</div>
        <div className="mtv-op-body">Waiting to start merge sort…</div>
      </div>
    );
  }

  const renderArr = (a) =>
    a && a.length > 10 ? `[${a.slice(0, 4).join(",")}…${a.slice(-2).join(",")}]` : `[${a?.join(",")}]`;

  let title, body, tone;
  switch (event.type) {
    case "enter":
      tone = "active";
      title = "Diving In";
      body = `Examining segment ${renderArr(event.values)} at depth ${event.depth}`;
      break;
    case "split":
      tone = "split";
      title = "Splitting";
      body = `${renderArr(event.leftValues)}  +  ${renderArr(event.rightValues)}`;
      break;
    case "base":
      tone = "leaf";
      title = "Base case";
      body = `Single element ${renderArr(event.values)} — already sorted`;
      break;
    case "mergeStart":
      tone = "merge";
      title = "Merging";
      body = `Combining two sorted halves…`;
      break;
    case "mergeDone":
      tone = "merged";
      title = "Merged";
      body = `Result: ${renderArr(event.values)}`;
      break;
    default:
      tone = "idle";
      title = event.type;
      body = "";
  }

  return (
    <div className={`mtv-op-panel mtv-op-${tone}`}>
      <div className="mtv-op-title">{title}</div>
      <div className="mtv-op-body">{body}</div>
      {stats && (
        <div className="mtv-op-stats">
          <span>splits: {stats.splits}</span>
          <span>merges: {stats.merges}</span>
          <span>depth: {stats.maxDepth}</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Legend                                                             */
/* ------------------------------------------------------------------ */

function Legend() {
  const items = [
    { cls: "splitting", label: "Splitting" },
    { cls: "active", label: "Current call" },
    { cls: "leaf", label: "Leaf (base case)" },
    { cls: "merging", label: "Merging" },
    { cls: "merged", label: "Sorted" },
  ];
  return (
    <div className="mtv-legend">
      <div className="mtv-legend-title">Legend</div>
      {items.map((i) => (
        <div key={i.cls} className="mtv-legend-row">
          <span className={`mtv-legend-swatch mtv-${i.cls}`} />
          <span>{i.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function MergeTreeVisualizer({
  mergeTree,
  currentEvent,
  callStack = [],
}) {
  const root = useMemo(() => buildRoot(mergeTree), [mergeTree]);
  const { positioned, width, height } = useMemo(
    () => layoutTree(root),
    [root, mergeTree]
  );

  const stats = useMemo(() => {
    if (!positioned.length) return null;
    return {
      splits: positioned.filter((n) => n.children?.length).length,
      merges: positioned.filter(
        (n) => n.state === "done" || n.state === "merged"
      ).length,
      maxDepth: Math.max(...positioned.map((n) => n.depth || 0)),
    };
  }, [positioned]);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (!currentEvent || !scrollRef.current) return;
    const target = positioned.find(
      (n) => n.left === currentEvent.left && n.right === currentEvent.right
    );
    if (!target) return;
    const el = scrollRef.current;
    const cx = target._x + NODE_W / 2;
    const cy = target._y + NODE_H / 2;
    el.scrollTo({
      left: cx - el.clientWidth / 2,
      top: cy - el.clientHeight / 2,
      behavior: "smooth",
    });
  }, [currentEvent, positioned]);

  if (!root) {
    return (
      <div className="mtv-empty">
        <div className="mtv-empty-title">Merge Sort Visualizer</div>
        <div className="mtv-empty-sub">
          Press <b>Start</b> to watch the algorithm divide and conquer.
        </div>
      </div>
    );
  }

  return (
    <div className="mtv-wrapper">
      <div className="mtv-phase-banner">
        <div className="mtv-phase-step mtv-phase-divide">DIVIDE ↓</div>
        <div className="mtv-phase-step mtv-phase-conquer">CONQUER ↑</div>
      </div>

      <div className="mtv-scroll" ref={scrollRef}>
        <div
          className="mtv-canvas"
          style={{ width: width + 80, height: height + 40 }}
        >
          <svg
            className="mtv-edge-layer"
            width={width + 80}
            height={height + 40}
          >
            <Edges nodes={positioned} />
          </svg>
          {positioned.map((n) => (
            <TreeNode key={n.id} node={n} phase={classifyPhase(n)} />
          ))}
        </div>
      </div>

      <OperationPanel event={currentEvent} stats={stats} />
      <Legend />
    </div>
  );
}
