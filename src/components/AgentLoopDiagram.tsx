/** Agent Loop 动态示意图（清新配色）：模型 → 工具 → 结果 → 回到模型的循环 */
export function AgentLoopDiagram() {
  const nodes = [
    { x: 200, y: 42, label: "LLM 推理", sub: "stream · stopReason" },
    { x: 342, y: 172, label: "工具调用", sub: "五步管道" },
    { x: 200, y: 302, label: "结果回写", sub: "convertToLlm" },
    { x: 58, y: 172, label: "事件通知", sub: "emit 即 await" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <svg viewBox="0 0 400 344" className="w-full" role="img" aria-label="Agent Loop 循环示意图">
        <defs>
          <linearGradient id="loopStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="55%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <filter id="nodeGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feDropShadow dx="0" dy="3" stdDeviation="6" floodColor="#34d399" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* 循环轨道 */}
        <circle
          cx="200"
          cy="172"
          r="118"
          fill="none"
          stroke="rgba(16,185,129,0.15)"
          strokeWidth="1.5"
        />
        <circle
          className="loop-path"
          cx="200"
          cy="172"
          r="118"
          fill="none"
          stroke="url(#loopStroke)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* 方向箭头 */}
        <g fill="#14b8a6" opacity="0.85">
          <path d="M313 96 l10 -2 -4 11 z" transform="rotate(38 313 96)" />
          <path d="M313 248 l10 2 -8 9 z" transform="rotate(-8 313 248)" />
          <path d="M87 248 l-10 2 8 9 z" transform="rotate(8 87 248)" />
          <path d="M87 96 l-10 -2 4 11 z" transform="rotate(-38 87 96)" />
        </g>

        {/* 中心 */}
        <circle cx="200" cy="172" r="34" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" />
        <text x="200" y="168" textAnchor="middle" fill="#059669" fontSize="12" fontFamily="monospace" fontWeight="600">
          AGENT
        </text>
        <text x="200" y="184" textAnchor="middle" fill="#0284c7" fontSize="12" fontFamily="monospace" fontWeight="600">
          LOOP
        </text>

        {/* 节点 */}
        {nodes.map((n) => (
          <g key={n.label} className="loop-node">
            <circle cx={n.x} cy={n.y} r="30" fill="#ffffff" stroke="url(#loopStroke)" strokeWidth="1.5" filter="url(#nodeGlow)" />
            <text x={n.x} y={n.y - 2} textAnchor="middle" fill="#1f2937" fontSize="11" fontWeight="600">
              {n.label}
            </text>
            <text x={n.x} y={n.y + 12} textAnchor="middle" fill="#64748b" fontSize="7.5" fontFamily="monospace">
              {n.sub}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
