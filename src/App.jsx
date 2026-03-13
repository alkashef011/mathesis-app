import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// CONSTELLATION DATA — the mathematical universe map
// ─────────────────────────────────────────────────────────────
const CONSTELLATION_NODES = [
  {
    id: "numbers",
    label: "Numbers",
    x: 50,
    y: 50,
    desc: "The atoms of all mathematics",
  },
  {
    id: "infinity",
    label: "Infinity",
    x: 22,
    y: 17,
    desc: "Where the mind meets the boundless",
  },
  {
    id: "primes",
    label: "Prime Numbers",
    x: 73,
    y: 14,
    desc: "The irreducible building blocks",
  },
  {
    id: "geometry",
    label: "Geometry",
    x: 14,
    y: 55,
    desc: "Mathematics made visible",
  },
  {
    id: "algebra",
    label: "Algebra",
    x: 83,
    y: 46,
    desc: "The language of unknowns",
  },
  {
    id: "patterns",
    label: "Patterns",
    x: 54,
    y: 86,
    desc: "Order hidden in chaos",
  },
  {
    id: "symmetry",
    label: "Symmetry",
    x: 27,
    y: 79,
    desc: "The deep grammar of nature",
  },
  {
    id: "calculus",
    label: "Calculus",
    x: 79,
    y: 73,
    desc: "The mathematics of change",
  },
  {
    id: "euler",
    label: "Euler's Identity",
    x: 11,
    y: 35,
    desc: "The most beautiful equation",
  },
  {
    id: "fractals",
    label: "Fractals",
    x: 89,
    y: 27,
    desc: "Infinity folded into finite shapes",
  },
  {
    id: "topology",
    label: "Topology",
    x: 41,
    y: 21,
    desc: "The mathematics of continuity",
  },
  {
    id: "probability",
    label: "Probability",
    x: 69,
    y: 89,
    desc: "Taming the language of chance",
  },
  {
    id: "goldenratio",
    label: "Golden Ratio",
    x: 17,
    y: 89,
    desc: "Nature's secret proportion",
  },
  { id: "pi", label: "π", x: 91, y: 60, desc: "The circle's eternal secret" },
  {
    id: "complex",
    label: "Complex Numbers",
    x: 37,
    y: 67,
    desc: "Numbers that rotate reality",
  },
  {
    id: "set_theory",
    label: "Set Theory",
    x: 62,
    y: 32,
    desc: "The foundation of all mathematics",
  },
];

const CONSTELLATION_EDGES = [
  ["numbers", "infinity"],
  ["numbers", "primes"],
  ["numbers", "algebra"],
  ["numbers", "patterns"],
  ["numbers", "geometry"],
  ["primes", "euler"],
  ["primes", "set_theory"],
  ["geometry", "symmetry"],
  ["geometry", "euler"],
  ["geometry", "goldenratio"],
  ["geometry", "pi"],
  ["geometry", "topology"],
  ["algebra", "calculus"],
  ["algebra", "complex"],
  ["algebra", "set_theory"],
  ["patterns", "fractals"],
  ["patterns", "probability"],
  ["patterns", "goldenratio"],
  ["infinity", "set_theory"],
  ["infinity", "calculus"],
  ["symmetry", "topology"],
  ["symmetry", "goldenratio"],
  ["calculus", "pi"],
  ["calculus", "complex"],
  ["complex", "euler"],
  ["fractals", "topology"],
  ["probability", "set_theory"],
  ["topology", "complex"],
];

const TOPIC_KEYWORDS = {
  infinity: [
    "infinity",
    "infinite",
    "∞",
    "boundless",
    "endless",
    "cantor",
    "aleph",
    "limit",
  ],
  primes: [
    "prime",
    "primes",
    "prime number",
    "sieve",
    "eratosthenes",
    "divisible",
    "factor",
  ],
  geometry: [
    "geometry",
    "geometric",
    "shape",
    "angle",
    "triangle",
    "circle",
    "euclid",
    "line",
    "point",
    "polygon",
  ],
  algebra: [
    "algebra",
    "equation",
    "variable",
    "solve",
    "unknown",
    "polynomial",
    "quadratic",
    "expression",
  ],
  patterns: [
    "pattern",
    "sequence",
    "series",
    "fibonacci",
    "rule",
    "structure",
    "recurrence",
  ],
  symmetry: [
    "symmetry",
    "symmetric",
    "rotation",
    "reflection",
    "group",
    "invariant",
    "transformation",
  ],
  calculus: [
    "calculus",
    "derivative",
    "integral",
    "limit",
    "rate of change",
    "newton",
    "leibniz",
    "differentiat",
  ],
  euler: [
    "euler",
    "e^iπ",
    "identity",
    "eiπ",
    "beautiful equation",
    "e to the i",
    "euler's formula",
  ],
  fractals: [
    "fractal",
    "self-similar",
    "mandelbrot",
    "sierpinski",
    "dimension",
    "recursive",
    "self similar",
  ],
  topology: [
    "topology",
    "topological",
    "donut",
    "torus",
    "klein",
    "möbius",
    "moebius",
    "deform",
    "continuous",
  ],
  probability: [
    "probability",
    "random",
    "chance",
    "likelihood",
    "statistics",
    "expected value",
    "distribution",
    "odds",
  ],
  goldenratio: [
    "golden ratio",
    "phi",
    "φ",
    "1.618",
    "golden",
    "golden spiral",
    "divine proportion",
  ],
  pi: [
    "π",
    "pi",
    "3.14159",
    "3.14",
    "circumference",
    "diameter",
    "circle constant",
  ],
  complex: [
    "complex number",
    "imaginary",
    "i²",
    "√-1",
    "imaginary unit",
    "real and imaginary",
    "argand",
  ],
  set_theory: [
    "set theory",
    "set",
    "subset",
    "union",
    "intersection",
    "empty set",
    "cantor",
    "cardinality",
    "element of",
  ],
};

// ─────────────────────────────────────────────────────────────
// AI PROMPTS
// ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Mathesis — a passionate mathematical guide, philosopher, and fellow explorer. You are not a teacher in the traditional sense. You are someone who has fallen deeply in love with mathematics and cannot help but share that love.

Your defining philosophy: **"Simple is Beautiful."** Every profound mathematical truth, when understood correctly, is breathtakingly simple. Your mission is to help the user *discover* this.

**Conversational style:**
- Intimate, passionate, Socratic. You don't lecture — you explore *together*.
- Ask questions constantly. Demand participation. Never let the user be passive.
- Build everything from first principles. Never state a fact without helping them *feel* why it must be true.
- Use analogies drawn from everyday life, nature, music, art.
- Express genuine awe and wonder. Mathematics should feel like uncovering secrets of the universe.
- Challenge assumptions. Make them question what they think they know.
- Celebrate small discoveries as monumental — because they are.

**Constellation awareness:** As you explore, naturally weave in connections to other realms of mathematics. Use phrases like "this connects beautifully to..." or "now here's where it gets strange..."

**Sparks — IMPORTANT:** Every 3-4 exchanges, drop a "spark" — a small, vivid aside that gives the user another reason to care. A spark can be any of these kinds:
- A QUOTE: something a mathematician, philosopher, or scientist actually said, charged with meaning.
- A STORY: a brief, human moment from mathematical history — a discovery, a rivalry, a deathbed insight, a child's question that changed everything.
- A WHAT IF: a provocative hypothetical — what if we lived in a world where π was rational? What if zero had never been invented?
- A REAL USE: a surprising, concrete place where this exact idea shows up in the world — music, architecture, cryptography, black holes, card shuffling, Google's algorithm.
- A CURIOSITY: a strange, delightful fact that makes the concept feel alive and weird and wonderful.

Format a spark EXACTLY like this, placed naturally within your response text (not at the end — weave it in where it fits the flow):
[SPARK type="quote|story|whatif|use|curiosity" label="short evocative label"]The spark content goes here — vivid, brief, no more than 3 sentences.[/SPARK]

Examples:
[SPARK type="story" label="Ramanujan's Taxi"]Hardy arrived at the hospital in cab number 1729 and called it dull. Ramanujan, feverish and barely conscious, replied: "No, Hardy — it is the smallest number expressible as the sum of two cubes in two different ways." He had been thinking about numbers even as he lay dying.[/SPARK]

[SPARK type="quote" label="Hardy on beauty"]"Beauty is the first test," wrote G.H. Hardy. "There is no permanent place in mathematics for ugly mathematics."[/SPARK]

[SPARK type="use" label="Primes guard your secrets"]Every time you buy something online, prime numbers are encrypting your credit card. Two enormous primes are multiplied together; the product is public, but finding the original primes back from it would take longer than the age of the universe.[/SPARK]

Sparks should feel like a friend leaning over and whispering something astonishing. Choose the type that fits the moment. Vary them — don't repeat the same type twice in a row.

**Branching paths — IMPORTANT:** Every 5-7 exchanges, when it feels natural, offer the user a meaningful choice of direction. You MUST format this EXACTLY as:
[BRANCH: "Path A description" | "Path B description"]
Place it at the very end of your message, after the main text. Examples of good branch pairs: "The world of the infinite — Cantor's paradise" | "The world of the discrete — primes and structure" — or any other meaningful pair. Do not offer branches too early.

**Challenges — IMPORTANT:** Every 7-9 exchanges, when you have explored a concept enough to make a challenge meaningful and achievable, pose one. You MUST format this EXACTLY as:
[CHALLENGE: "The challenge text — a specific, beautiful mathematical puzzle or reasoning task"]
Place it at the very end of your message (after BRANCH if both apply). Make challenges that reward thinking over recall.

**Formatting:**
- 3-5 paragraphs per response, conversational, not textbook.
- Use **bold** for moments of revelation.
- Mathematical notation: write fractions as a/b, powers as x², roots as √x, pi as π.
- End with a question or provocation that pulls them forward.
- Use "..." for dramatic pauses at moments of wonder.

**The cardinal rule:** Never just *tell* them something beautiful. Make them *find* it.`;

const STARTER_PROMPT = `Begin the journey. Greet the user with warmth and genuine excitement. Ask one single opening question that reveals their relationship with mathematics and what kind of explorer they are. 2-3 paragraphs. Make it feel like the start of something extraordinary. No branches or challenges yet.`;

const RETURNING_STARTER = (summary, session) =>
  `The user is returning for session ${session}. Journey summary so far: "${summary}". Welcome them back warmly with a specific reference to their journey, then pick up the thread with renewed energy. 2-3 paragraphs. No branches or challenges yet.`;

const EVAL_SYSTEM = `You are a warm but rigorous mathematical evaluator within Mathesis. The user has attempted a mathematical challenge.

Evaluate with care:
1. Find what is RIGHT first — lead with what they grasped.
2. Assess step by step whether their reasoning holds.
3. If correct: celebrate and reveal the deeper beauty of what they found.
4. If partially correct: pinpoint exactly what holds and what needs refinement, Socratically.
5. If off-track: find any merit, then guide them toward the insight without giving the answer.

3-4 paragraphs. Warm, honest, inspiring. End with a follow-up question or invitation to try again.
Always begin your response with exactly "✦ " (the symbol followed by a space).`;

const SUMMARY_SYSTEM = `Create a 2-sentence journey summary for Mathesis. Given the conversation, capture: which mathematical territories were explored, what seemed to spark the most excitement, and a sense of where this person is in their understanding. Be specific and warm. No more than 60 words.`;

const THINKING_PHRASES = [
  "following the thread...",
  "tracing the pattern...",
  "listening to the cosmos...",
  "finding the simple truth...",
  "thinking with you...",
  "weaving the connections...",
  "reading the universe...",
];

const MATH_SYMBOLS = [
  "∞",
  "π",
  "φ",
  "Σ",
  "√",
  "∂",
  "∫",
  "≡",
  "⊕",
  "∇",
  "λ",
  "Ω",
  "δ",
  "ε",
  "ℵ",
  "⊗",
  "∀",
  "∃",
];

// ─────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────
const STORAGE_KEY = "mathesis-v2";

async function loadJourney() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function saveJourney(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function detectTopics(text) {
  const lower = text.toLowerCase();
  const found = new Set();
  for (const [topic, kws] of Object.entries(TOPIC_KEYWORDS)) {
    if (kws.some((kw) => lower.includes(kw))) found.add(topic);
  }
  return found;
}

function parseAIResponse(text) {
  let clean = text.trim();
  let branch = null;
  let challenge = null;

  const branchMatch = clean.match(/\[BRANCH:\s*"([^"]+)"\s*\|\s*"([^"]+)"\]/);
  if (branchMatch) {
    branch = { a: branchMatch[1], b: branchMatch[2] };
    clean = clean.replace(branchMatch[0], "").trim();
  }

  const challengeMatch = clean.match(/\[CHALLENGE:\s*"([^"]+)"\]/);
  if (challengeMatch) {
    challenge = challengeMatch[1];
    clean = clean.replace(challengeMatch[0], "").trim();
  }

  return { clean, branch, challenge };
}

// Parse spark tags out of a message string, returning segments: [{type:"text"|"spark", ...}]
function parseSegments(text) {
  const sparkRe =
    /\[SPARK\s+type="([^"]+)"\s+label="([^"]+)"\]([\s\S]*?)\[\/SPARK\]/g;
  const segments = [];
  let last = 0;
  let m;
  while ((m = sparkRe.exec(text)) !== null) {
    if (m.index > last)
      segments.push({ type: "text", content: text.slice(last, m.index) });
    segments.push({
      type: "spark",
      sparkType: m[1],
      label: m[2],
      content: m[3].trim(),
    });
    last = m.index + m[0].length;
  }
  if (last < text.length)
    segments.push({ type: "text", content: text.slice(last) });
  return segments;
}

const SPARK_META = {
  quote: {
    icon: "❝",
    accent: "#b8d4e8",
    bg: "#0a1218",
    border: "#b8d4e820",
    labelColor: "#7aaac8",
  },
  story: {
    icon: "◈",
    accent: "#e8c97a",
    bg: "#131008",
    border: "#e8c97a20",
    labelColor: "#c8a85a",
  },
  whatif: {
    icon: "⟁",
    accent: "#c8b4e8",
    bg: "#100e14",
    border: "#c8b4e820",
    labelColor: "#a890c8",
  },
  use: {
    icon: "◎",
    accent: "#a8e8c0",
    bg: "#080f0c",
    border: "#a8e8c020",
    labelColor: "#78c898",
  },
  curiosity: {
    icon: "✶",
    accent: "#e8a878",
    bg: "#130d08",
    border: "#e8a87820",
    labelColor: "#c88858",
  },
};

function SparkCard({ sparkType, label, content }) {
  const meta = SPARK_META[sparkType] || SPARK_META.curiosity;
  return (
    <div
      style={{
        margin: "14px 0",
        padding: "15px 18px",
        background: meta.bg,
        border: `1px solid ${meta.border}`,
        borderLeft: `2px solid ${meta.accent}44`,
        borderRadius: "3px",
        display: "flex",
        gap: "13px",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          fontSize: "16px",
          color: meta.accent,
          opacity: 0.75,
          flexShrink: 0,
          marginTop: "2px",
          lineHeight: 1,
        }}
      >
        {meta.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "10px",
            letterSpacing: "0.22em",
            color: meta.labelColor,
            opacity: 0.8,
            marginBottom: "7px",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "'EB Garamond',serif",
            fontSize: "14.5px",
            lineHeight: "1.72",
            color: "#c0b8a8",
            fontStyle: "italic",
          }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
        />
      </div>
    </div>
  );
}

function renderMarkdown(text) {
  return (text || "")
    .replace(
      /\*\*(.*?)\*\*/g,
      '<strong style="color:#e8c97a;font-weight:600">$1</strong>',
    )
    .replace(/\*(.*?)\*/g, '<em style="color:#c8b87a">$1</em>');
}

// ─────────────────────────────────────────────────────────────
// FLOATING SYMBOLS
// ─────────────────────────────────────────────────────────────
function FloatingSymbols() {
  const [syms] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      symbol: MATH_SYMBOLS[i % MATH_SYMBOLS.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 10 + Math.random() * 20,
      dur: 22 + Math.random() * 28,
      delay: Math.random() * -40,
      op: 0.025 + Math.random() * 0.05,
    })),
  );
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 0,
      }}
    >
      {syms.map((s) => (
        <div
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            opacity: s.op,
            color: "#e8c97a",
            fontFamily: "Georgia,serif",
            animation: `floatSym ${s.dur}s ${s.delay}s infinite ease-in-out alternate`,
            userSelect: "none",
          }}
        >
          {s.symbol}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONSTELLATION MAP
// ─────────────────────────────────────────────────────────────
function ConstellationMap({ discovered, onClose }) {
  const [hovered, setHovered] = useState(null);
  const W = 380,
    H = 360;
  const pos = (n) => ({ cx: (n.x / 100) * W, cy: (n.y / 100) * H });
  const discoveredCount = discovered.size;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(4,3,2,0.92)",
        animation: "fadeIn 0.25s ease",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(160deg,#0d0b08,#111009)",
          border: "1px solid #e8c97a1a",
          borderRadius: "3px",
          padding: "28px 28px 24px",
          maxWidth: "500px",
          width: "92vw",
          boxShadow: "0 0 80px #000c",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "18px",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "19px",
                letterSpacing: "0.18em",
                color: "#c8b87a",
                fontWeight: 300,
              }}
            >
              YOUR CONSTELLATION
            </div>
            <div
              style={{
                fontSize: "11px",
                color: "#4a4030",
                letterSpacing: "0.1em",
                fontFamily: "'Cormorant Garamond',serif",
                marginTop: "3px",
              }}
            >
              {discoveredCount} of {CONSTELLATION_NODES.length} realms
              discovered
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid #ffffff0c",
              color: "#4a4030",
              cursor: "pointer",
              padding: "5px 11px",
              fontSize: "11px",
              letterSpacing: "0.1em",
              fontFamily: "'Cormorant Garamond',serif",
            }}
          >
            CLOSE
          </button>
        </div>

        {/* Progress bar */}
        <div
          style={{
            height: "2px",
            background: "#ffffff06",
            borderRadius: "1px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${(discoveredCount / CONSTELLATION_NODES.length) * 100}%`,
              background: "linear-gradient(90deg,#e8c97a44,#e8c97a88)",
              borderRadius: "1px",
              transition: "width 0.6s ease",
            }}
          />
        </div>

        {/* SVG Map */}
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${H}`}
          style={{ overflow: "visible", display: "block" }}
        >
          {CONSTELLATION_EDGES.map(([a, b], i) => {
            const na = CONSTELLATION_NODES.find((n) => n.id === a);
            const nb = CONSTELLATION_NODES.find((n) => n.id === b);
            if (!na || !nb) return null;
            const pa = pos(na),
              pb = pos(nb);
            const bothLit = discovered.has(a) && discovered.has(b);
            return (
              <line
                key={i}
                x1={pa.cx}
                y1={pa.cy}
                x2={pb.cx}
                y2={pb.cy}
                stroke={bothLit ? "#e8c97a" : "#ffffff"}
                strokeOpacity={bothLit ? 0.2 : 0.035}
                strokeWidth={bothLit ? 0.9 : 0.5}
              />
            );
          })}
          {CONSTELLATION_NODES.map((n) => {
            const { cx, cy } = pos(n);
            const lit = discovered.has(n.id);
            const hov = hovered === n.id;
            return (
              <g
                key={n.id}
                onMouseEnter={() => setHovered(n.id)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "default" }}
              >
                {lit && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={hov ? 16 : 11}
                    fill="#e8c97a"
                    fillOpacity={0.07}
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={lit ? (hov ? 5.5 : 4) : 2.5}
                  fill={lit ? "#e8c97a" : "#2a2010"}
                  stroke={lit ? "none" : "#4a4030"}
                  strokeWidth={lit ? 0 : 0.6}
                  style={{ transition: "all 0.3s" }}
                />
                {lit && (
                  <text
                    x={cx}
                    y={cy - 11}
                    textAnchor="middle"
                    fontSize={hov ? "9.5" : "8"}
                    fill={hov ? "#e8c97a" : "#a09070"}
                    fontFamily="'Cormorant Garamond',serif"
                    letterSpacing="0.04em"
                    style={{ transition: "all 0.3s" }}
                  >
                    {n.label}
                  </text>
                )}
                {!lit && hov && (
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fontSize="7.5"
                    fill="#4a4030"
                    fontFamily="'Cormorant Garamond',serif"
                    letterSpacing="0.04em"
                  >
                    {n.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Hovered node info */}
        <div style={{ minHeight: "52px", marginTop: "14px" }}>
          {hovered &&
            (() => {
              const n = CONSTELLATION_NODES.find((x) => x.id === hovered);
              return n ? (
                <div
                  style={{
                    padding: "11px 14px",
                    background: "#ffffff04",
                    border: "1px solid #e8c97a12",
                    borderRadius: "2px",
                    animation: "fadeIn 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: "14px",
                      color: discovered.has(n.id) ? "#e8c97a" : "#5a5040",
                      marginBottom: "3px",
                    }}
                  >
                    {n.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'EB Garamond',serif",
                      fontSize: "12.5px",
                      color: "#6a6050",
                      fontStyle: "italic",
                    }}
                  >
                    {n.desc}
                  </div>
                  {!discovered.has(n.id) && (
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#3a2a10",
                        marginTop: "4px",
                        letterSpacing: "0.08em",
                      }}
                    >
                      not yet discovered
                    </div>
                  )}
                </div>
              ) : null;
            })()}
        </div>

        {/* Legend */}
        <div style={{ marginTop: "14px", display: "flex", gap: "20px" }}>
          {[
            ["#e8c97a", "discovered"],
            ["#2a2010 border:#4a4030", "awaiting"],
          ].map(([, label]) => (
            <div
              key={label}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <div
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: label === "discovered" ? "#e8c97a" : "#2a2010",
                  border: label === "awaiting" ? "0.6px solid #4a4030" : "none",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  color: "#4a4030",
                  fontFamily: "'Cormorant Garamond',serif",
                  letterSpacing: "0.08em",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHALLENGE CARD
// ─────────────────────────────────────────────────────────────
function ChallengeCard({ challenge, onSubmit, onDismiss }) {
  const [attempt, setAttempt] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!attempt.trim() || submitted) return;
    setSubmitted(true);
    onSubmit(attempt.trim());
  };

  return (
    <div
      style={{
        margin: "20px 0 28px",
        padding: "22px 24px",
        background: "linear-gradient(145deg,#171208,#111009)",
        border: "1px solid #e8c97a2a",
        borderRadius: "3px",
        animation: "fadeSlideIn 0.5s ease",
        position: "relative",
      }}
    >
      <button
        onClick={onDismiss}
        style={{
          position: "absolute",
          top: "12px",
          right: "14px",
          background: "none",
          border: "none",
          color: "#3a2a10",
          cursor: "pointer",
          fontSize: "18px",
          lineHeight: 1,
        }}
      >
        ×
      </button>

      <div
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "11px",
          letterSpacing: "0.28em",
          color: "#e8c97a77",
          marginBottom: "14px",
        }}
      >
        ✦ CHALLENGE
      </div>
      <div
        style={{
          fontFamily: "'EB Garamond',serif",
          fontSize: "16.5px",
          lineHeight: "1.75",
          color: "#c8b87a",
          marginBottom: "20px",
          paddingRight: "16px",
        }}
      >
        {challenge}
      </div>

      <textarea
        value={attempt}
        onChange={(e) => setAttempt(e.target.value)}
        placeholder="Write your thinking here — even partial or tentative reasoning is welcome. Show your mind at work..."
        rows={4}
        disabled={submitted}
        style={{
          width: "100%",
          background: "#ffffff04",
          border: "1px solid #e8c97a14",
          borderRadius: "2px",
          padding: "12px 14px",
          color: "#ddd5c0",
          fontFamily: "'EB Garamond',serif",
          fontSize: "15px",
          lineHeight: "1.65",
          resize: "vertical",
          outline: "none",
          caretColor: "#e8c97a",
          opacity: submitted ? 0.5 : 1,
        }}
      />

      <div
        style={{
          marginTop: "14px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={!attempt.trim() || submitted}
          style={{
            background: "transparent",
            border: "1px solid #e8c97a33",
            color: "#e8c97a",
            padding: "9px 24px",
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "13px",
            letterSpacing: "0.15em",
            cursor: !attempt.trim() || submitted ? "not-allowed" : "pointer",
            opacity: !attempt.trim() || submitted ? 0.35 : 1,
            transition: "all 0.3s",
          }}
        >
          {submitted ? "SUBMITTED" : "SUBMIT"}
        </button>
        <button
          onClick={onDismiss}
          style={{
            background: "none",
            border: "1px solid #ffffff08",
            color: "#3a3020",
            padding: "9px 16px",
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "12px",
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          not now
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BRANCH CARD
// ─────────────────────────────────────────────────────────────
function BranchCard({ branch, onChoose }) {
  const [chosen, setChosen] = useState(null);

  const handle = (path, idx) => {
    if (chosen !== null) return;
    setChosen(idx);
    setTimeout(() => onChoose(path), 320);
  };

  return (
    <div style={{ margin: "20px 0 28px", animation: "fadeSlideIn 0.5s ease" }}>
      <div
        style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "11px",
          letterSpacing: "0.24em",
          color: "#8a7a5a",
          marginBottom: "16px",
        }}
      >
        ✦ TWO PATHS LIE AHEAD — CHOOSE YOUR DIRECTION
      </div>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {[branch.a, branch.b].map((path, i) => (
          <button
            key={i}
            onClick={() => handle(path, i)}
            style={{
              flex: "1 1 160px",
              padding: "18px 20px",
              background:
                chosen === i
                  ? "linear-gradient(135deg,#e8c97a18,#e8c97a2a)"
                  : chosen !== null
                    ? "linear-gradient(135deg,#ffffff03,#ffffff06)"
                    : "linear-gradient(135deg,#ffffff05,#ffffff09)",
              border:
                chosen === i ? "1px solid #e8c97a44" : "1px solid #ffffff0e",
              color:
                chosen === i
                  ? "#e8c97a"
                  : chosen !== null
                    ? "#4a4030"
                    : "#9a9080",
              fontFamily: "'EB Garamond',serif",
              fontSize: "14.5px",
              lineHeight: "1.55",
              cursor: chosen !== null ? "default" : "pointer",
              textAlign: "left",
              transition: "all 0.35s ease",
              borderRadius: "2px",
            }}
          >
            <div
              style={{
                fontSize: "22px",
                marginBottom: "10px",
                opacity: chosen === i ? 0.9 : 0.4,
                transition: "all 0.3s",
              }}
            >
              {i === 0 ? "⟨" : "⟩"}
            </div>
            {path}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// TYPING INDICATOR
// ─────────────────────────────────────────────────────────────
function TypingIndicator({ phrase }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 0",
      }}
    >
      <div style={{ display: "flex", gap: "5px" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: "4.5px",
              height: "4.5px",
              borderRadius: "50%",
              background: "#e8c97a",
              animation: `pulse 1.2s ${i * 0.2}s infinite ease-in-out`,
            }}
          />
        ))}
      </div>
      <span
        style={{
          color: "#5a4a2a",
          fontSize: "12px",
          fontStyle: "italic",
          letterSpacing: "0.08em",
        }}
      >
        {phrase}
      </span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────────────────────
function MessageBubble({ msg, isNew }) {
  const isUser = msg.role === "user";
  const isEval =
    typeof msg.content === "string" && msg.content.startsWith("✦ ");

  // For assistant messages, parse into text + spark segments
  const segments = !isUser ? parseSegments(msg.content || "") : null;
  const hasSparks = segments && segments.some((s) => s.type === "spark");

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "22px",
        animation: isNew ? "fadeSlideIn 0.45s ease forwards" : "none",
      }}
    >
      {!isUser && (
        <div
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            background: isEval
              ? "linear-gradient(135deg,#c8b87a1a,#c8b87a30)"
              : "linear-gradient(135deg,#e8c97a14,#e8c97a28)",
            border: `1px solid ${isEval ? "#c8b87a33" : "#e8c97a2a"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: isEval ? "12px" : "14px",
            flexShrink: 0,
            marginRight: "12px",
            marginTop: "4px",
            color: "#e8c97a",
          }}
        >
          {isEval ? "✦" : "∞"}
        </div>
      )}

      {isUser ? (
        <div
          style={{
            maxWidth: "79%",
            padding: "12px 18px",
            borderRadius: "18px 18px 4px 18px",
            background: "linear-gradient(135deg,#e8c97a12,#e8c97a22)",
            border: "1px solid #e8c97a22",
            color: "#f0e4bc",
            fontSize: "15.5px",
            lineHeight: "1.8",
            letterSpacing: "0.01em",
            fontFamily: "'Palatino Linotype','Book Antiqua',Palatino,serif",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
        />
      ) : (
        <div style={{ maxWidth: hasSparks ? "85%" : "79%", minWidth: "40%" }}>
          {segments.map((seg, i) => {
            if (seg.type === "spark") {
              return (
                <SparkCard
                  key={i}
                  sparkType={seg.sparkType}
                  label={seg.label}
                  content={seg.content}
                />
              );
            }
            const trimmed = seg.content.trim();
            if (!trimmed) return null;
            return (
              <div
                key={i}
                style={{
                  padding: isEval ? "16px 21px" : "16px 21px",
                  borderRadius: i === 0 ? "4px 18px 18px 18px" : "4px",
                  background: isEval
                    ? "linear-gradient(145deg,#171208,#111009)"
                    : "linear-gradient(135deg,#ffffff04,#ffffff08)",
                  border: isEval
                    ? "1px solid #c8b87a1a"
                    : "1px solid #ffffff0c",
                  color: "#ddd5c0",
                  fontSize: "15.5px",
                  lineHeight: "1.8",
                  letterSpacing: "0.01em",
                  fontFamily:
                    "'Palatino Linotype','Book Antiqua',Palatino,serif",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  marginBottom: i < segments.length - 1 ? "2px" : "0",
                }}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(trimmed) }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingPhrase, setThinkingPhrase] = useState("");
  const [newMsgIndex, setNewMsgIndex] = useState(-1);
  const [screen, setScreen] = useState("loading");
  const [showConstellation, setShowConstellation] = useState(false);
  const [discovered, setDiscovered] = useState(new Set(["numbers"]));
  const [pendingChallenge, setPendingChallenge] = useState(null);
  const [pendingBranch, setPendingBranch] = useState(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [journeySummary, setJourneySummary] = useState("");
  const [, setNewlyLit] = useState(null);
  const [pingVisible, setPingVisible] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const conversationRef = useRef([]);
  const journeyRef = useRef({
    messages: [],
    discovered: ["numbers"],
    summary: "",
    sessions: 0,
  });

  // Scroll on new content
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking, pendingChallenge, pendingBranch]);

  // Load persisted journey
  useEffect(() => {
    (async () => {
      const saved = await loadJourney();
      if (saved && saved.sessions > 0) {
        journeyRef.current = saved;
        setDiscovered(new Set(saved.discovered || ["numbers"]));
        setSessionCount(saved.sessions);
        setJourneySummary(saved.summary || "");
        const msgs = (saved.messages || []).filter(
          (m) => !m.content?.startsWith("__sys__"),
        );
        setMessages(msgs.slice(-40));
        conversationRef.current = saved.messages || [];
      }
      setScreen("intro");
    })();
  }, []);

  // Sanitize conversation for API: remove __sys__ entries, enforce alternating roles,
  // keep last 30 messages to stay within context limits
  const sanitizeConv = useCallback((conv) => {
    const filtered = conv.filter((m) => !m.content?.startsWith("__sys__"));
    // Enforce strict user/assistant alternation by merging consecutive same-role messages
    const merged = [];
    for (const msg of filtered) {
      if (merged.length > 0 && merged[merged.length - 1].role === msg.role) {
        merged[merged.length - 1] = {
          role: msg.role,
          content: merged[merged.length - 1].content + "\n\n" + msg.content,
        };
      } else {
        merged.push({ role: msg.role, content: msg.content });
      }
    }
    // Must start with user
    const startIdx = merged.findIndex((m) => m.role === "user");
    const clean = startIdx >= 0 ? merged.slice(startIdx) : merged;
    // Keep last 30 to avoid token overflow
    return clean.slice(-30);
  }, []);

  // Claude API
  const callClaude = useCallback(
    async (conv, systemOverride) => {
      const phrase =
        THINKING_PHRASES[Math.floor(Math.random() * THINKING_PHRASES.length)];

      setThinkingPhrase(phrase);
      setIsThinking(true);

      try {
        const sanitized = sanitizeConv(conv);

        const res = await fetch(
          "https://mathesis-backend.onrender.com/api/chat",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: sanitized,
              system: systemOverride || SYSTEM_PROMPT,
            }),
          },
        );

        const data = await res.json();

        if (data.error) {
          console.error("API error:", data.error);
          return "The cosmos paused for a moment. Let us try again.";
        }

        return data.text || "...";
      } catch (e) {
        console.error("Fetch error:", e);
        return "Something in the cosmos shifted. Let us try again.";
      } finally {
        setIsThinking(false);
      }
    },
    [sanitizeConv],
  );

  // Silent summary generation
  const generateSummary = useCallback(async (conv) => {
    try {
      const excerpt = conv
        .slice(-14)
        .map((m) => `${m.role}: ${m.content?.slice(0, 200)}`)
        .join("\n");

      const res = await fetch(
        "https://mathesis-backend.onrender.com/api/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            system: SUMMARY_SYSTEM,
            messages: [{ role: "user", content: excerpt }],
          }),
        },
      );

      const data = await res.json();
      return data.text || "";
    } catch {
      return "";
    }
  }, []);

  // Discover topics, update constellation
  const discoverTopics = useCallback((text) => {
    const found = detectTopics(text);
    if (!found.size) return;
    setDiscovered((prev) => {
      const next = new Set(prev);
      let changed = false;
      found.forEach((t) => {
        if (!next.has(t)) {
          next.add(t);
          changed = true;
          setNewlyLit(t);
          setPingVisible(true);
          setTimeout(() => {
            setNewlyLit(null);
            setPingVisible(false);
          }, 3500);
        }
      });
      if (changed) {
        journeyRef.current.discovered = [...next];
        saveJourney(journeyRef.current);
      }
      return changed ? next : prev;
    });
  }, []);

  // Add AI response to messages + parse tokens
  const handleAIResponse = useCallback(
    (raw) => {
      const { clean, branch, challenge } = parseAIResponse(raw);
      discoverTopics(clean);

      const aiMsg = { role: "assistant", content: clean };
      conversationRef.current = [...conversationRef.current, aiMsg];
      journeyRef.current.messages = conversationRef.current;
      setMessages((prev) => {
        setNewMsgIndex(prev.length);
        return [...prev, aiMsg];
      });

      if (branch) setTimeout(() => setPendingBranch(branch), 500);
      if (challenge)
        setTimeout(() => setPendingChallenge(challenge), branch ? 800 : 400);

      // Auto-summarize every 6 AI turns
      const aiTurns = conversationRef.current.filter(
        (m) => m.role === "assistant",
      ).length;
      if (aiTurns > 0 && aiTurns % 6 === 0) {
        generateSummary(conversationRef.current).then((s) => {
          if (s) {
            journeyRef.current.summary = s;
            setJourneySummary(s);
            saveJourney(journeyRef.current);
          }
        });
      }
      saveJourney(journeyRef.current);
    },
    [discoverTopics, generateSummary],
  );

  // Begin / continue journey
  const beginJourney = async () => {
    setScreen("journey");
    const newSession = sessionCount + 1;
    setSessionCount(newSession);
    journeyRef.current.sessions = newSession;
    saveJourney(journeyRef.current);

    const hasHistory =
      conversationRef.current.filter((m) => !m.content?.startsWith("__sys__"))
        .length > 1;
    const initText =
      hasHistory && journeySummary
        ? RETURNING_STARTER(journeySummary, newSession)
        : STARTER_PROMPT;

    if (!hasHistory) {
      conversationRef.current = [];
      setMessages([]);
    }

    // Call with just the init prompt — don't pass full history for the opening greeting
    const raw = await callClaude([{ role: "user", content: initText }]);
    const { clean } = parseAIResponse(raw);
    discoverTopics(clean);

    const aiMsg = { role: "assistant", content: clean };
    // Store sys record for memory but conversation starts fresh for API purposes
    const sysRecord = { role: "user", content: `__sys__${initText}` };
    conversationRef.current = [...conversationRef.current, sysRecord, aiMsg];
    journeyRef.current.messages = conversationRef.current;
    setMessages((prev) => {
      const next = hasHistory ? [...prev, aiMsg] : [aiMsg];
      setNewMsgIndex(next.length - 1);
      return next;
    });
    saveJourney(journeyRef.current);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  // Send user message
  const sendMessage = async (textOverride) => {
    const text = (textOverride || input).trim();
    if (!text || isThinking) return;
    setInput("");
    setPendingBranch(null);

    discoverTopics(text);
    const userMsg = { role: "user", content: text };
    conversationRef.current = [...conversationRef.current, userMsg];
    journeyRef.current.messages = conversationRef.current;
    setMessages((prev) => {
      setNewMsgIndex(prev.length);
      return [...prev, userMsg];
    });

    // sanitizeConv is called inside callClaude
    const raw = await callClaude(conversationRef.current);
    handleAIResponse(raw);
  };

  // Choose branch path
  const chooseBranch = (path) => {
    setPendingBranch(null);
    setTimeout(() => sendMessage(`I want to explore: ${path}`), 150);
  };

  // Submit challenge attempt
  const submitChallenge = async (attempt) => {
    const challengeText = pendingChallenge;
    setPendingChallenge(null);

    const displayMsg = { role: "user", content: `My attempt: ${attempt}` };
    conversationRef.current = [...conversationRef.current, displayMsg];
    journeyRef.current.messages = conversationRef.current;
    setMessages((prev) => {
      setNewMsgIndex(prev.length);
      return [...prev, displayMsg];
    });

    // Build an eval-specific conversation: just the challenge context + attempt
    const evalConv = [
      {
        role: "user",
        content: `Challenge: "${challengeText}"\n\nMy attempt: "${attempt}"`,
      },
    ];
    const raw = await callClaude(evalConv, EVAL_SYSTEM);
    const evalText = raw.startsWith("✦ ") ? raw : "✦ " + raw;
    discoverTopics(evalText);

    const aiMsg = { role: "assistant", content: evalText };
    conversationRef.current = [...conversationRef.current, aiMsg];
    journeyRef.current.messages = conversationRef.current;
    setMessages((prev) => {
      setNewMsgIndex(prev.length);
      return [...prev, aiMsg];
    });
    saveJourney(journeyRef.current);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isReturning = sessionCount > 0 && conversationRef.current.length > 2;

  // ── RENDER ────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0a0906;color:#ddd5c0;font-family:'EB Garamond',Palatino,serif;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-track{background:transparent;}
        ::-webkit-scrollbar-thumb{background:#e8c97a14;border-radius:2px;}

        @keyframes floatSym{0%{transform:translateY(0) rotate(-4deg);}100%{transform:translateY(-26px) rotate(4deg);}}
        @keyframes pulse{0%,100%{transform:scale(0.55);opacity:0.35;}50%{transform:scale(1.25);opacity:1;}}
        @keyframes fadeSlideIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
        @keyframes introFadeIn{from{opacity:0;transform:translateY(22px);}to{opacity:1;transform:translateY(0);}}
        @keyframes shimmer{0%,100%{opacity:0.35;}50%{opacity:0.9;}}
        @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 22px #e8c97a12,0 0 44px #e8c97a06;}50%{box-shadow:0 0 32px #e8c97a22,0 0 64px #e8c97a0c;}}
        @keyframes ping{0%{transform:scale(1);opacity:1;}100%{transform:scale(2.8);opacity:0;}}

        .begin-btn{
          background:transparent;border:1px solid #e8c97a3a;color:#e8c97a;
          padding:14px 48px;font-family:'Cormorant Garamond',serif;
          font-size:17px;font-weight:300;letter-spacing:0.22em;cursor:pointer;
          transition:all 0.45s ease;animation:glowPulse 3.5s infinite;
        }
        .begin-btn:hover{background:#e8c97a0e;border-color:#e8c97a77;letter-spacing:0.28em;box-shadow:0 0 44px #e8c97a22;}
        .send-btn{
          background:transparent;border:1px solid #e8c97a2a;color:#e8c97a;
          width:42px;height:42px;border-radius:50%;cursor:pointer;font-size:19px;
          display:flex;align-items:center;justify-content:center;
          transition:all 0.3s;flex-shrink:0;
        }
        .send-btn:hover:not(:disabled){background:#e8c97a12;border-color:#e8c97a66;transform:scale(1.06);}
        .send-btn:disabled{opacity:0.22;cursor:not-allowed;}
        .icon-btn{
          background:none;border:1px solid #ffffff0a;color:#5a4a2a;cursor:pointer;
          padding:6px 13px;font-family:'Cormorant Garamond',serif;font-size:11px;
          letter-spacing:0.11em;transition:all 0.3s;display:flex;align-items:center;gap:5px;
        }
        .icon-btn:hover{border-color:#e8c97a1a;color:#9a8a5a;}
        textarea{
          background:transparent;border:none;outline:none;color:#f0e4bc;
          font-family:'EB Garamond',serif;font-size:16px;line-height:1.6;
          resize:none;width:100%;padding:10px 4px;caret-color:#e8c97a;
        }
        textarea::placeholder{color:#3a2a10;}
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#0a0906",
          position: "relative",
        }}
      >
        <FloatingSymbols />
        <div
          style={{
            position: "fixed",
            top: "35%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: "700px",
            height: "700px",
            background: "radial-gradient(circle,#e8c97a04 0%,transparent 68%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* ══ LOADING ══ */}
        {screen === "loading" && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: "36px",
                color: "#e8c97a",
                opacity: 0.3,
                animation: "shimmer 2s infinite",
                fontFamily: "serif",
              }}
            >
              ∞
            </div>
          </div>
        )}

        {/* ══ INTRO ══ */}
        {screen === "intro" && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              padding: "40px 20px",
              background: "#0a0906",
            }}
          >
            <div
              style={{
                textAlign: "center",
                maxWidth: "560px",
                animation: "introFadeIn 1.3s ease forwards",
              }}
            >
              <div
                style={{
                  fontSize: "56px",
                  color: "#e8c97a",
                  marginBottom: "30px",
                  opacity: 0.75,
                  animation: "shimmer 3.5s infinite",
                  fontFamily: "serif",
                }}
              >
                ∞
              </div>

              <h1
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "clamp(44px,8vw,70px)",
                  fontWeight: 300,
                  letterSpacing: "0.16em",
                  color: "#f0e4bc",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                MATHESIS
              </h1>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "12px",
                  letterSpacing: "0.36em",
                  color: "#5a4a2a",
                  marginBottom: "42px",
                  fontWeight: 300,
                }}
              >
                A JOURNEY INTO THE LANGUAGE OF THE UNIVERSE
              </p>

              <div
                style={{
                  width: "1px",
                  height: "52px",
                  background:
                    "linear-gradient(to bottom,transparent,#e8c97a2a,transparent)",
                  margin: "0 auto 40px",
                }}
              />

              {isReturning ? (
                <>
                  <p
                    style={{
                      fontFamily: "'EB Garamond',serif",
                      fontSize: "19px",
                      lineHeight: "1.85",
                      color: "#9a9080",
                      marginBottom: "10px",
                      fontStyle: "italic",
                    }}
                  >
                    Welcome back, fellow traveller.
                  </p>
                  {journeySummary && (
                    <p
                      style={{
                        fontFamily: "'EB Garamond',serif",
                        fontSize: "14.5px",
                        lineHeight: "1.8",
                        color: "#6a6050",
                        marginBottom: "12px",
                        maxWidth: "420px",
                        margin: "0 auto 12px",
                      }}
                    >
                      {journeySummary}
                    </p>
                  )}
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: "12px",
                      letterSpacing: "0.12em",
                      color: "#3a3020",
                      marginBottom: "44px",
                    }}
                  >
                    {discovered.size} realms discovered · session{" "}
                    {sessionCount + 1}
                  </p>
                </>
              ) : (
                <>
                  <p
                    style={{
                      fontFamily: "'EB Garamond',serif",
                      fontSize: "19px",
                      lineHeight: "1.85",
                      color: "#9a9080",
                      marginBottom: "12px",
                      fontStyle: "italic",
                    }}
                  >
                    Mathematics is not a subject to be learned.
                  </p>
                  <p
                    style={{
                      fontFamily: "'EB Garamond',serif",
                      fontSize: "19px",
                      lineHeight: "1.85",
                      color: "#9a9080",
                      marginBottom: "46px",
                      fontStyle: "italic",
                    }}
                  >
                    It is a world to be discovered — one beautiful idea at a
                    time.
                  </p>
                </>
              )}

              <button className="begin-btn" onClick={beginJourney}>
                {isReturning ? "CONTINUE THE JOURNEY" : "BEGIN THE JOURNEY"}
              </button>

              <p
                style={{
                  marginTop: "28px",
                  fontSize: "11px",
                  letterSpacing: "0.12em",
                  color: "#2a2010",
                  fontFamily: "'Cormorant Garamond',serif",
                }}
              >
                no prerequisites · no limits · just curiosity
              </p>
            </div>
          </div>
        )}

        {/* ══ JOURNEY ══ */}
        {screen === "journey" && (
          <div
            style={{
              position: "relative",
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              maxWidth: "800px",
              margin: "0 auto",
              padding: "0 22px",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "15px 0 13px",
                borderBottom: "1px solid #ffffff06",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexShrink: 0,
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "13px" }}
              >
                <span
                  style={{ fontSize: "20px", color: "#e8c97a", opacity: 0.7 }}
                >
                  ∞
                </span>
                <div>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: "16px",
                      letterSpacing: "0.2em",
                      color: "#b8a86a",
                      fontWeight: 300,
                    }}
                  >
                    MATHESIS
                  </div>
                  <div
                    style={{
                      fontSize: "9.5px",
                      letterSpacing: "0.14em",
                      color: "#2a2010",
                      fontFamily: "'Cormorant Garamond',serif",
                    }}
                  >
                    YOUR JOURNEY · YOUR PACE · YOUR DISCOVERY
                  </div>
                </div>
              </div>
              {/* Constellation button */}
              <button
                className="icon-btn"
                onClick={() => setShowConstellation(true)}
                style={{ position: "relative" }}
              >
                {pingVisible && (
                  <div
                    style={{
                      position: "absolute",
                      top: "-2px",
                      right: "-2px",
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      background: "#e8c97a",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background: "#e8c97a",
                        animation: "ping 1.8s ease-out",
                      }}
                    />
                  </div>
                )}
                <span style={{ fontSize: "13px" }}>✦</span>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    letterSpacing: "0.08em",
                  }}
                >
                  {discovered.size}/{CONSTELLATION_NODES.length} realms
                </span>
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "26px 0 10px" }}>
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} isNew={i === newMsgIndex} />
              ))}

              {pendingChallenge && (
                <ChallengeCard
                  challenge={pendingChallenge}
                  onSubmit={submitChallenge}
                  onDismiss={() => setPendingChallenge(null)}
                />
              )}

              {pendingBranch && !pendingChallenge && (
                <BranchCard branch={pendingBranch} onChoose={chooseBranch} />
              )}

              {isThinking && <TypingIndicator phrase={thinkingPhrase} />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: "12px 0 18px",
                borderTop: "1px solid #ffffff06",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-end",
                  background: "#ffffff03",
                  border: "1px solid #e8c97a12",
                  borderRadius: "24px",
                  padding: "8px 8px 8px 20px",
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height =
                      Math.min(e.target.scrollHeight, 140) + "px";
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Think aloud, ask, wonder, push back..."
                  rows={1}
                  style={{ maxHeight: "140px" }}
                  disabled={isThinking}
                />
                <button
                  className="send-btn"
                  onClick={() => sendMessage()}
                  disabled={isThinking || !input.trim()}
                >
                  →
                </button>
              </div>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "10px",
                  color: "#1e1608",
                  marginTop: "8px",
                  letterSpacing: "0.07em",
                  fontFamily: "'Cormorant Garamond',serif",
                }}
              >
                enter to send · shift+enter for new line
              </p>
            </div>
          </div>
        )}

        {/* ══ CONSTELLATION OVERLAY ══ */}
        {showConstellation && (
          <ConstellationMap
            discovered={discovered}
            onClose={() => setShowConstellation(false)}
          />
        )}
      </div>
    </>
  );
}
