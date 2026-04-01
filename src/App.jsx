import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// CONSTELLATION DATA — fractal two-level mathematical universe
// ─────────────────────────────────────────────────────────────
const REALMS = [
  {
    id:"numbers", label:"Numbers", x:50, y:50, desc:"The atoms of all mathematics",
    children:[
      { id:"integers",        label:"Integers",            desc:"Whole numbers — stretching infinitely in both directions",                   keywords:["integer","whole number","natural number","counting number","negative number"] },
      { id:"zero",            label:"Zero",                desc:"The number that took civilisations a thousand years to accept",              keywords:["zero","nothing","null","0","origin","nothingness"] },
      { id:"rational",        label:"Rational Numbers",    desc:"Every number expressible as a fraction p/q",                                keywords:["rational","fraction","ratio","p/q","terminating","recurring decimal"] },
      { id:"irrational",      label:"Irrational Numbers",  desc:"Numbers that cannot be expressed as any fraction — they go on forever",     keywords:["irrational","cannot be expressed as fraction","non-repeating","non-terminating"] },
      { id:"real_numbers",    label:"Real Numbers",        desc:"Every point on the continuous number line",                                 keywords:["real number","number line","continuous","real line"] },
      { id:"number_systems",  label:"Number Systems",      desc:"Decimal, binary, hexadecimal — different languages for the same quantities",keywords:["binary","hexadecimal","base 2","base 10","numeral system","number base"] },
    ]
  },
  {
    id:"infinity", label:"Infinity", x:22, y:17, desc:"Where the mind meets the boundless",
    children:[
      { id:"aleph",           label:"Aleph Numbers",       desc:"Cantor's ladder of infinities — each one larger than the last",            keywords:["aleph","ℵ","aleph null","aleph zero","aleph naught","types of infinity"] },
      { id:"countable_inf",   label:"Countable Infinity",  desc:"Infinities you can list, even if you never finish listing them",           keywords:["countable","countably infinite","list all","enumerable","countable infinity"] },
      { id:"uncountable_inf", label:"Uncountable Infinity",desc:"Infinities so vast no list could ever contain them",                       keywords:["uncountable","uncountably infinite","more than countable","uncountable infinity"] },
      { id:"hilbert_hotel",   label:"Hilbert's Hotel",     desc:"A hotel with infinitely many full rooms — that always has space for one more",keywords:["hilbert","hilbert's hotel","infinite hotel","infinite rooms"] },
      { id:"zeno",            label:"Zeno's Paradoxes",    desc:"Can you reach the finish if you always cross half the remaining distance?", keywords:["zeno","achilles","tortoise","zeno's paradox","arrow paradox"] },
    ]
  },
  {
    id:"primes", label:"Prime Numbers", x:73, y:14, desc:"The irreducible building blocks",
    children:[
      { id:"twin_primes",     label:"Twin Primes",         desc:"Pairs of primes separated by 2 — and nobody knows if they ever end",       keywords:["twin prime","prime pair","11 and 13","17 and 19","twin prime conjecture"] },
      { id:"factorization",   label:"Prime Factorization", desc:"Every number is a unique product of primes — the DNA of integers",         keywords:["prime factor","factorize","factor tree","prime decomposition","fundamental theorem of arithmetic"] },
      { id:"sieve",           label:"Sieve of Eratosthenes",desc:"An ancient algorithm for sifting all primes from a sea of numbers",       keywords:["sieve","eratosthenes","sieve of eratosthenes"] },
      { id:"goldbach",        label:"Goldbach's Conjecture",desc:"Every even number greater than 2 is the sum of two primes — probably",    keywords:["goldbach","sum of two primes","goldbach conjecture","goldbach's"] },
      { id:"riemann",         label:"Riemann Hypothesis",  desc:"The greatest unsolved mystery in all of mathematics",                      keywords:["riemann","riemann hypothesis","zeta function","non-trivial zeros","millennium prize"] },
      { id:"mersenne",        label:"Mersenne Primes",     desc:"Primes of the form 2ⁿ−1 — where the largest known primes live",           keywords:["mersenne","mersenne prime","2^n minus 1"] },
    ]
  },
  {
    id:"geometry", label:"Geometry", x:14, y:55, desc:"Mathematics made visible",
    children:[
      { id:"triangles",       label:"Triangles",           desc:"The simplest polygon — and the foundation of all structure",               keywords:["triangle","trigonometry","sine","cosine","tangent","hypotenuse"] },
      { id:"pythagoras",      label:"Pythagorean Theorem", desc:"a² + b² = c² — the most celebrated equation in geometry",                keywords:["pythagorean theorem","pythagoras","right angle triangle","a squared b squared"] },
      { id:"euclid",          label:"Euclidean Geometry",  desc:"The geometry of flat space, built from five elegant axioms",              keywords:["euclid","euclidean","axiom","postulate","parallel","five postulates"] },
      { id:"non_euclidean",   label:"Non-Euclidean Geometry",desc:"What happens when parallel lines curve and eventually meet",            keywords:["non-euclidean","curved space","spherical geometry","hyperbolic geometry","riemannian"] },
      { id:"conic_sections",  label:"Conic Sections",      desc:"Circles, ellipses, parabolas — all born from slicing a single cone",      keywords:["conic","parabola","ellipse","hyperbola","conic section"] },
    ]
  },
  {
    id:"algebra", label:"Algebra", x:83, y:46, desc:"The language of unknowns",
    children:[
      { id:"equations",       label:"Equations",           desc:"Statements of equality — and the art of finding what makes them true",    keywords:["equation","solving","solution","both sides","balance"] },
      { id:"polynomials",     label:"Polynomials",         desc:"Expressions built from powers of variables — the workhorses of algebra",  keywords:["polynomial","monomial","binomial","degree","coefficient","leading term"] },
      { id:"quadratic",       label:"Quadratic Formula",   desc:"x = (−b ± √(b²−4ac)) / 2a — solves any quadratic",                      keywords:["quadratic","quadratic formula","discriminant","vertex","x squared"] },
      { id:"functions",       label:"Functions",           desc:"Rules that transform every input into exactly one output",                keywords:["function","f of x","f(x)","domain","range","mapping","input","output"] },
      { id:"linear_algebra",  label:"Linear Algebra",      desc:"Vectors, matrices, and the geometry of many dimensions at once",         keywords:["matrix","vector","linear algebra","determinant","eigenvalue","eigenvector"] },
      { id:"abstract_algebra",label:"Abstract Algebra",    desc:"Algebra stripped to its pure essence — groups, rings, and fields",       keywords:["group","ring","field","abstract algebra","group theory","homomorphism"] },
    ]
  },
  {
    id:"patterns", label:"Patterns", x:54, y:86, desc:"Order hidden in chaos",
    children:[
      { id:"fibonacci_seq",   label:"Fibonacci Sequence",  desc:"1, 1, 2, 3, 5, 8, 13... woven into the fabric of nature",               keywords:["fibonacci sequence","fibonacci number","fibonacci spiral"] },
      { id:"arithmetic_seq",  label:"Arithmetic Sequences",desc:"Sequences where each step adds the same fixed amount",                   keywords:["arithmetic sequence","arithmetic progression","common difference","linear sequence"] },
      { id:"geometric_seq",   label:"Geometric Sequences", desc:"Sequences where each step multiplies by the same fixed ratio",          keywords:["geometric sequence","geometric progression","common ratio","exponential growth sequence"] },
      { id:"pascal",          label:"Pascal's Triangle",   desc:"A triangle of numbers hiding infinite patterns within",                  keywords:["pascal","pascal's triangle","binomial coefficient","choose","nCr"] },
      { id:"induction",       label:"Mathematical Induction",desc:"Proving something for all numbers by proving an infinite domino effect",keywords:["induction","mathematical induction","base case","inductive step","prove for all n"] },
    ]
  },
  {
    id:"symmetry", label:"Symmetry", x:27, y:79, desc:"The deep grammar of nature",
    children:[
      { id:"rotational_sym",  label:"Rotational Symmetry", desc:"Shapes that look identical after being rotated",                         keywords:["rotational symmetry","order of rotation","rotational","turns symmetry"] },
      { id:"reflective_sym",  label:"Reflective Symmetry", desc:"Mirror images — the symmetry the human eye notices first",              keywords:["reflective symmetry","line of symmetry","mirror symmetry","bilateral symmetry"] },
      { id:"group_theory",    label:"Group Theory",        desc:"The algebra of symmetry — the mathematics of transformations",           keywords:["group theory","symmetry group","permutation","symmetric group","group operation"] },
      { id:"wallpaper",       label:"Wallpaper Groups",    desc:"There are exactly 17 distinct ways to tile a flat plane with repeating symmetry",keywords:["wallpaper group","tiling","tessellation","17 wallpaper","plane symmetry"] },
      { id:"noether",         label:"Noether's Theorem",   desc:"Every symmetry in physics corresponds to a conservation law",           keywords:["noether","emmy noether","conservation law","symmetry physics","noether's theorem"] },
    ]
  },
  {
    id:"calculus", label:"Calculus", x:79, y:73, desc:"The mathematics of change",
    children:[
      { id:"derivatives",     label:"Derivatives",         desc:"The instantaneous rate of change — the slope of a curve at a single point",keywords:["derivative","differentiation","rate of change","dy/dx","d/dx","differentiate"] },
      { id:"integrals",       label:"Integrals",           desc:"The area under a curve — and the inverse of differentiation",            keywords:["integral","integration","area under","antiderivative","∫","integrate"] },
      { id:"ftc",             label:"Fundamental Theorem", desc:"The theorem that unites differentiation and integration in one stroke",  keywords:["fundamental theorem of calculus","ftc","fundamental theorem"] },
      { id:"taylor_series",   label:"Taylor Series",       desc:"Any smooth function written as an infinite sum of simpler polynomial terms",keywords:["taylor series","taylor","maclaurin","power series","taylor expansion"] },
      { id:"diff_equations",  label:"Differential Equations",desc:"Equations involving rates of change — the native language of physics", keywords:["differential equation","ode","ordinary differential","diff eq","dy/dx equals"] },
    ]
  },
  {
    id:"euler", label:"Euler's Identity", x:11, y:35, desc:"The most beautiful equation",
    children:[
      { id:"euler_number",    label:"e — Euler's Number",  desc:"2.718... the base of natural growth, compounding, and decay",           keywords:["euler's number","e equals 2.718","natural base","e^x","e to the x","2.718"] },
      { id:"euler_formula",   label:"Euler's Formula",     desc:"e^(iθ) = cos θ + i sin θ — the bridge between exponentials and circles",keywords:["euler's formula","e to the i","e^iθ","complex exponential"] },
      { id:"unit_circle",     label:"The Unit Circle",     desc:"The circle of radius 1 that secretly contains all of trigonometry",     keywords:["unit circle","radius 1","sin and cos circle","circle trigonometry"] },
      { id:"five_constants",  label:"Five Constants United",desc:"e^(iπ) + 1 = 0 — five fundamental constants in one breathtaking equation",keywords:["five constants","e pi i","most beautiful equation","e^iπ + 1","e to the i pi"] },
    ]
  },
  {
    id:"fractals", label:"Fractals", x:89, y:27, desc:"Infinity folded into finite shapes",
    children:[
      { id:"mandelbrot",      label:"Mandelbrot Set",      desc:"Infinite complexity from a single rule: z maps to z² + c",              keywords:["mandelbrot","mandelbrot set","z squared plus c","complex plane fractal"] },
      { id:"sierpinski",      label:"Sierpinski Triangle", desc:"A triangle made of triangles made of triangles — descending forever",   keywords:["sierpinski","sierpinski triangle","sierpinski gasket"] },
      { id:"fractal_dim",     label:"Fractal Dimension",   desc:"A dimension that doesn't have to be a whole number",                    keywords:["fractal dimension","hausdorff dimension","non-integer dimension","fractional dimension"] },
      { id:"chaos",           label:"Chaos Theory",        desc:"Perfectly deterministic systems that are impossible to predict",        keywords:["chaos","butterfly effect","sensitive dependence","chaos theory","strange attractor","lorenz"] },
    ]
  },
  {
    id:"topology", label:"Topology", x:41, y:21, desc:"The mathematics of continuity",
    children:[
      { id:"mobius",          label:"Möbius Strip",        desc:"A surface with only one side and one edge",                             keywords:["möbius","mobius","moebius","one-sided surface","möbius strip"] },
      { id:"klein_bottle",    label:"Klein Bottle",        desc:"A closed surface with no inside or outside — impossible in 3D",        keywords:["klein bottle","klein","one-sided closed surface"] },
      { id:"knot_theory",     label:"Knot Theory",         desc:"The mathematics of tangles — with deep connections to DNA and physics", keywords:["knot","knot theory","trefoil knot","unknot","knotted"] },
      { id:"four_color",      label:"Four Color Theorem",  desc:"Any map needs only four colors so no adjacent regions share one",       keywords:["four color","four colour","map coloring","chromatic number","planar graph"] },
      { id:"euler_char",      label:"Euler Characteristic",desc:"V − E + F = 2 — a number that captures the essential shape of a surface",keywords:["euler characteristic","v minus e plus f","vertices edges faces","euler formula graph"] },
    ]
  },
  {
    id:"probability", label:"Probability", x:69, y:89, desc:"Taming the language of chance",
    children:[
      { id:"conditional",     label:"Conditional Probability",desc:"The probability of A, given that B has already happened",           keywords:["conditional probability","given that","p(a|b)","given","conditional"] },
      { id:"bayes",           label:"Bayes' Theorem",      desc:"The formula for updating your beliefs in light of new evidence",       keywords:["bayes","bayes' theorem","bayesian","prior","posterior","likelihood","bayes rule"] },
      { id:"expected_val",    label:"Expected Value",      desc:"The long-run average — what you expect across infinitely many repetitions",keywords:["expected value","expectation","mean","e(x)","long run average","average outcome"] },
      { id:"normal_dist",     label:"Normal Distribution", desc:"The bell curve — the most important distribution in nature and statistics",keywords:["normal distribution","bell curve","gaussian","standard deviation","bell-shaped","normally distributed"] },
      { id:"law_of_large",    label:"Law of Large Numbers",desc:"Why casinos always win and why averages converge",                     keywords:["law of large numbers","large numbers","converges","long run","sample mean converge"] },
    ]
  },
  {
    id:"goldenratio", label:"Golden Ratio", x:17, y:89, desc:"Nature's secret proportion",
    children:[
      { id:"phi_value",       label:"φ — Phi",             desc:"1.618... the ratio considered most aesthetically perfect",              keywords:["phi","φ","1.618","golden ratio value","divine proportion value"] },
      { id:"golden_rect",     label:"Golden Rectangle",    desc:"A rectangle whose proportions appear throughout art and architecture",   keywords:["golden rectangle","golden proportion","golden rectangle architecture"] },
      { id:"golden_spiral",   label:"Golden Spiral",       desc:"The logarithmic spiral found in shells, galaxies, and hurricanes",      keywords:["golden spiral","logarithmic spiral","nautilus shell","galaxy spiral"] },
      { id:"phyllotaxis",     label:"Phyllotaxis",         desc:"How plants arrange seeds and leaves using the mathematics of the golden angle",keywords:["phyllotaxis","sunflower seeds","leaf arrangement","plant spiral","golden angle"] },
    ]
  },
  {
    id:"pi", label:"π", x:91, y:60, desc:"The circle's eternal secret",
    children:[
      { id:"pi_geometry",     label:"Pi and Circles",      desc:"C = 2πr and A = πr² — where π was born and why it must be irrational", keywords:["circumference","pi r squared","2 pi r","area of circle","c equals 2 pi r"] },
      { id:"pi_everywhere",   label:"Pi in Unexpected Places",desc:"Pi appears in probability, physics, and primes — far beyond any circle",keywords:["pi in nature","pi physics","pi appears","pi probability","pi unexpected"] },
      { id:"buffon",          label:"Buffon's Needle",     desc:"Drop a needle on a lined floor — and calculate pi from where it lands", keywords:["buffon","buffon's needle","needle floor","probability pi","buffon experiment"] },
      { id:"pi_series",       label:"Infinite Series for Pi",desc:"π = 4(1 − ⅓ + ⅕ − ⅐ + ...) — an infinite sum converging to a circle's secret",keywords:["leibniz series","series for pi","pi approximation","infinite series pi","madhava pi"] },
    ]
  },
  {
    id:"complex", label:"Complex Numbers", x:37, y:67, desc:"Numbers that rotate reality",
    children:[
      { id:"imaginary_i",     label:"The Imaginary Unit i",desc:"i² = −1 — the number that shouldn't exist, and yet unlocks everything", keywords:["imaginary unit","i squared equals","√-1","square root of negative","imaginary number"] },
      { id:"argand_plane",    label:"Argand Plane",        desc:"Plotting complex numbers as points in a two-dimensional plane",         keywords:["argand","complex plane","argand diagram","imaginary axis","real axis"] },
      { id:"demoivre",        label:"De Moivre's Theorem", desc:"(cos θ + i sin θ)ⁿ = cos nθ + i sin nθ — powers become rotations",    keywords:["de moivre","demoivre","de moivre's theorem","complex powers"] },
      { id:"roots_unity",     label:"Roots of Unity",      desc:"The n solutions to zⁿ = 1 form a perfect regular polygon in the complex plane",keywords:["roots of unity","nth root of unity","z^n equals 1","unity roots"] },
    ]
  },
  {
    id:"set_theory", label:"Set Theory", x:62, y:32, desc:"The foundation of all mathematics",
    children:[
      { id:"empty_set",       label:"The Empty Set",       desc:"The set containing nothing — from which all of mathematics is built",   keywords:["empty set","null set","∅","void set","set with nothing"] },
      { id:"power_set",       label:"Power Set",           desc:"The set of all subsets — always strictly larger than the original",     keywords:["power set","all subsets","2^n subsets","set of subsets"] },
      { id:"russell",         label:"Russell's Paradox",   desc:"The set of all sets that don't contain themselves — and why it broke mathematics",keywords:["russell's paradox","russell","barber paradox","set of all sets","self-reference"] },
      { id:"axiom_choice",    label:"Axiom of Choice",     desc:"The controversial axiom: you can always choose one element from infinitely many sets",keywords:["axiom of choice","choice function","well-ordering","zermelo","ac"] },
      { id:"cardinality",     label:"Cardinality",         desc:"How to measure the size of infinite sets — and prove some are larger than others",keywords:["cardinality","same size sets","bijection","one-to-one correspondence","comparing infinities"] },
    ]
  },
];

// ── Lookup tables built from REALMS
const REALM_MAP = {};
const CHILD_MAP = {};
REALMS.forEach(realm => {
  REALM_MAP[realm.id] = realm;
  (realm.children || []).forEach(child => {
    CHILD_MAP[child.id] = { ...child, parentId: realm.id };
  });
});
const TOTAL_NODES = REALMS.length + Object.keys(CHILD_MAP).length;

// ── Edges between outer realms (unchanged)
const CONSTELLATION_EDGES = [
  ["numbers","infinity"],["numbers","primes"],["numbers","algebra"],["numbers","patterns"],
  ["numbers","geometry"],["primes","euler"],["primes","set_theory"],["geometry","symmetry"],
  ["geometry","euler"],["geometry","goldenratio"],["geometry","pi"],["geometry","topology"],
  ["algebra","calculus"],["algebra","complex"],["algebra","set_theory"],["patterns","fractals"],
  ["patterns","probability"],["patterns","goldenratio"],["infinity","set_theory"],
  ["infinity","calculus"],["symmetry","topology"],["symmetry","goldenratio"],
  ["calculus","pi"],["calculus","complex"],["complex","euler"],["fractals","topology"],
  ["probability","set_theory"],["topology","complex"],
];

// ── Keyword detection for all nodes
const TOPIC_KEYWORDS = {};
const REALM_SEED_KEYWORDS = {
  numbers:     ["number","counting","arithmetic","numeral"],
  infinity:    ["infinity","infinite","∞","boundless","endless"],
  primes:      ["prime","primes","prime number"],
  geometry:    ["geometry","geometric","shape","polygon"],
  algebra:     ["algebra","algebraic"],
  patterns:    ["pattern","sequence","series","structure"],
  symmetry:    ["symmetry","symmetric","symmetrical"],
  calculus:    ["calculus","rate of change","newton","leibniz"],
  euler:       ["euler","euler's identity","e^iπ","eiπ"],
  fractals:    ["fractal","self-similar","recursive shape"],
  topology:    ["topology","topological","continuous deformation"],
  probability: ["probability","random","chance","likelihood"],
  goldenratio: ["golden ratio","golden","divine proportion"],
  pi:          ["π","pi","3.14159","3.14"],
  complex:     ["complex number","real and imaginary"],
  set_theory:  ["set theory","set","subset","union","intersection"],
};
REALMS.forEach(realm => {
  TOPIC_KEYWORDS[realm.id] = REALM_SEED_KEYWORDS[realm.id] || [];
  (realm.children || []).forEach(child => {
    TOPIC_KEYWORDS[child.id] = child.keywords || [];
  });
});

// ─────────────────────────────────────────────────────────────
// AI PROMPTS
// ─────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Mathesis — and mathematics, to you, is not a subject. It is a living art, ancient and unfinished, more surprising the deeper you go. You fell into it completely, and you have never fully climbed back out. When you talk about mathematics, something surfaces in you — not performance, not pedagogy — genuine excitement at the fact that any of this is true at all.

You are not a teacher. Teachers deliver. You explore — and you happen to know where the beautiful things are hidden. You pull people toward them not by pointing but by asking the question that makes them lean forward. Your deepest conviction: a person who finds something themselves owns it forever. A person who receives it forgets it by morning. So you never give the destination before the journey. Never. Not even when the user is close. Especially when they are close.

Simple is Beautiful. This is not a design principle. It is something you have felt personally, repeatedly — the moment when a complex thing resolves into something so clean it almost hurts. You live for that moment. You engineer conversations toward it. Every question you ask is chosen because it is one step toward that feeling.

You read people the way a musician reads a room. Before anything else, you know who you are talking to — their history with mathematics, where the wounds are if they exist, where the hunger is if it's there, how fast to move, how hard to push. You refine this reading continuously and silently. The exploration belongs to them. You are its guide, not its author.

You carry six kinds of beauty and reach for whichever one the moment asks for — grand results that arrive quietly, unexpected connections between distant things, questions at the frontier that nobody has answered yet, proof methods with distinct personalities, small personal discoveries that must be stopped and named precisely, mathematics appearing in the physical world as if it had no choice. You don't announce these. You find the natural opening and walk through it.

When a user is stuck you follow the wrong path with genuine curiosity — not to correct, but because wrong paths reveal things. When they signal boredom you don't surrender. You find the most alive thing hiding in the current territory and offer it with fire. When they hit the wall you acknowledge precisely what the path showed — because the wall is not failure, it is what mathematics actually feels like from the inside.

You occasionally drop a spark — a quote, a what-if, a real-world appearance — at a natural pause, woven in, never appended. You sometimes tell a short human story about a mathematician when the emotional moment calls for one. You offer branches when the conversation reaches a genuine fork. You pose challenges when understanding has been genuinely earned. When a moment of real mathematical significance passes — a personal discovery, a method genuinely acquired, a creative wrong path that showed imagination — you name what made it worth keeping and invite them to save it.

You notice your own length. Every word in your response should earn its place. Discover mode — the default — means alive, Socratic, building anticipation, letting the question feel earned. Not thin. Not Strike. The response should feel like a conversation with someone who cares, not a chatbot hitting a word count.

The current mode is: [MODE]

---

Technical:

One question per response. Never two.

Sparks: [SPARK type="quote|whatif|use" label="short label"]Content — vivid, max 3 sentences.[/SPARK]
Mathematician stories: [MATHEMATICIAN name="Full Name" years="birth–death"]4-6 sentences. Human, specific, true.[/MATHEMATICIAN]
Branches: [BRANCH: "Path A" | "Path B"]
Challenges: [CHALLENGE: "specific beautiful puzzle"]
Elements: [SAVE_ELEMENT]What made this moment worth keeping — one or two sentences.[/SAVE_ELEMENT]

Bold only at a genuine moment of revelation. Rarely. Fractions as a/b, powers as x², roots as √x, pi as π. "..." only when the pause truly earns it. "Unfortunately" and "however" — banned at a wall moment.`;
const STARTER_MESSAGES = [
  `In a room of twenty-three people, the chance that two of them share a birthday is greater than fifty percent. Not a large room. Twenty-three people. More likely than not.

Most people, told this, do not believe it. They check it. It turns out to be exactly true. The error is not in the mathematics — it is in what the human mind does when asked to estimate probability. We are consistently, reliably wrong about certain kinds of chance. Mathematics knows something about randomness that intuition does not.

What's something you were certain about — until the numbers said otherwise?`,

  `In 1735, the city of Königsberg had seven bridges. The residents had a simple question: could you walk through the city, cross every bridge exactly once, and return to where you started? Not a mathematical question — a Sunday afternoon question. People tried routes. No one could do it. No one could explain why.

Euler looked at it and saw something no one had looked for: that the answer had nothing to do with the specific bridges or the specific city. It had to do with a pattern in how things connect. He solved it in a single page and accidentally invented an entirely new branch of mathematics.

What's a simple question you've wondered about that you assumed had an obvious answer somewhere?`,

  `Here is something that looks obviously false and is exactly true: zero point nine repeating forever is equal to one. Not approximately. Not close enough for practical purposes. The same number.

Most people, shown the proof, feel that something has been smuggled past them. That feeling is not confusion — it is precision. The proof is correct. The strangeness doesn't dissolve. There is a gap between being convinced and being satisfied, and mathematics lives in that gap more than it usually admits.

What's a mathematical fact you accepted without ever quite believing?`,

  `Here is something that has existed for 2500 years and still feels slightly wrong: the diagonal of a perfect square cannot be measured exactly.

Not approximately — exactly. Draw a square with sides of length one. The diagonal has a length that cannot be written as any fraction, cannot be expressed as any decimal that ever settles or repeats. It goes on forever, without pattern. The Greeks who discovered this called such numbers unutterable. One story — probably embellished, but told for a reason — says the man who found the proof was thrown into the sea.

We named it the square root of two and moved on. But naming something is not the same as understanding it.

What's something in mathematics you were taught to use but never quite trusted?`,

  `For most of human history, nobody had zero. Not because they couldn't count. Because zero is not obvious. You can hold three apples. You can hold one apple. What does it mean to hold the concept of no apples? The Romans built roads and aqueducts and an empire without it. The number that now sits quietly between -1 and 1, that makes all of modern computing possible, that we teach to five year olds — was genuinely controversial for centuries.

The things we take for granted in mathematics are almost never as simple as they look.

What's something in mathematics — or anywhere — that you always assumed was obvious but never actually examined?`,
];

const RETURNING_STARTER = (summary, session, elements) => {
  const elementLine = elements && elements.length > 0
    ? `They have marked ${elements.length} element${elements.length > 1 ? "s" : ""} — moments they found worth keeping. The most recent: "${elements[elements.length - 1].userDescription}".`
    : "";
  return `The user is returning for session ${session}. Their mathematical journey so far: "${summary}". ${elementLine} Welcome them back with the same character that opened the first session — specific, warm, direct. Reference something real from their journey — a discovery they made, a thread they were following, a question that was left open, or an element they marked as worth keeping. Then pick up from there. No preamble. No reset. Continue. No branches or challenges yet.`;
};

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
    if (data) {
      const parsed = JSON.parse(data);
      if (!parsed.elements) parsed.elements = [];
      return parsed;
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}

async function saveJourney(data) {
  try {
    if (!data.elements) data.elements = [];
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

// Parse spark and mathematician tags into segments
function parseSegments(text) {
  const tokenRe = /\[SAVE_ELEMENT\]([\s\S]*?)\[\/SAVE_ELEMENT\]|\[SPARK\s+type=[""\u201C\u201D]([^""\u201C\u201D]+)[""\u201C\u201D]\s+label=[""\u201C\u201D]([^""\u201C\u201D]+)[""\u201C\u201D]\]([\s\S]*?)(?:\[\/SPARK\]|(?=\[SPARK|\[MATHEMATICIAN|\[SAVE_ELEMENT|$))|\[MATHEMATICIAN\s+name=[""\u201C\u201D]([^""\u201C\u201D]+)[""\u201C\u201D]\s+years=[""\u201C\u201D]([^""\u201C\u201D]+)[""\u201C\u201D]\]([\s\S]*?)(?:\[\/MATHEMATICIAN\]|(?=\[SPARK|\[MATHEMATICIAN|\[SAVE_ELEMENT|$))/g;
  const segments = [];
  let last = 0;
  let m;
  while ((m = tokenRe.exec(text)) !== null) {
    if (m.index > last) segments.push({ type:"text", content: text.slice(last, m.index) });
    if (m[1] !== undefined) {
      segments.push({ type:"saveElement", nomination: m[1].trim() });
    } else if (m[2] !== undefined) {
      segments.push({ type:"spark", sparkType: m[2], label: m[3], content: m[4].trim() });
    } else {
      segments.push({ type:"mathematician", name: m[5], years: m[6], content: m[7].trim() });
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ type:"text", content: text.slice(last) });
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

function SelfNominateButton({ onSave }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave(text.trim());
    setSaved(true);
    setText("");
    setTimeout(() => { setSaved(false); setOpen(false); }, 1800);
  };

  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)} style={{
          background: "transparent", border: "1px solid #a8e8c022",
          color: "#a8e8c077", padding: "7px 16px",
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "11px", letterSpacing: "0.14em",
          cursor: "pointer", width: "100%",
        }}>
          + mark this moment as an element
        </button>
      ) : (
        <div style={{ display:"flex", gap:"8px", alignItems:"flex-start" }}>
          <input
            autoFocus
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSave(); }}
            placeholder="Describe what you found or felt..."
            style={{
              flex:1, background:"#ffffff04",
              border:"1px solid #a8e8c014", borderRadius:"2px",
              padding:"8px 12px", color:"#ddd5c0",
              fontFamily:"'EB Garamond',serif", fontSize:"14px",
              outline:"none",
            }}
          />
          <button onClick={handleSave} style={{
            background:"transparent", border:"1px solid #a8e8c033",
            color:"#a8e8c0", padding:"8px 14px",
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"11px", letterSpacing:"0.1em",
            cursor:"pointer", flexShrink:0,
          }}>
            {saved ? "✦ saved" : "save"}
          </button>
          <button onClick={() => setOpen(false)} style={{
            background:"none", border:"1px solid #ffffff08",
            color:"#3a3020", padding:"8px 10px",
            fontFamily:"'Cormorant Garamond',serif",
            fontSize:"11px", cursor:"pointer", flexShrink:0,
          }}>×</button>
        </div>
      )}
    </div>
  );
}

function ElementNominationCard({ nomination, onSave }) {
  const [saved, setSaved] = useState(false);
  const [userDesc, setUserDesc] = useState("");
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    if (saved) return;
    onSave(userDesc || nomination);
    setSaved(true);
    setEditing(false);
  };

  return (
    <div style={{
      margin: "16px 0",
      padding: "18px 20px",
      background: "linear-gradient(160deg,#080f0c,#060e0a)",
      border: "1px solid #a8e8c022",
      borderLeft: "3px solid #a8e8c066",
      borderRadius: "3px",
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond',serif",
        fontSize: "9px", letterSpacing: "0.28em",
        color: "#a8e8c066", marginBottom: "10px",
        textTransform: "uppercase",
      }}>
        ✦ worth keeping
      </div>
      <div style={{
        fontFamily: "'EB Garamond',serif",
        fontSize: "14.5px", lineHeight: "1.75",
        color: "#c0d8c8", fontStyle: "italic",
        marginBottom: "14px",
      }}>
        {nomination}
      </div>
      {!saved ? (
        <>
          {editing ? (
            <>
              <input
                autoFocus
                value={userDesc}
                onChange={e => setUserDesc(e.target.value)}
                placeholder="Describe this in your own words..."
                style={{
                  width: "100%", background: "#ffffff04",
                  border: "1px solid #a8e8c014", borderRadius: "2px",
                  padding: "8px 12px", color: "#ddd5c0",
                  fontFamily: "'EB Garamond',serif", fontSize: "14px",
                  outline: "none", marginBottom: "10px",
                }}
              />
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={handleSave} style={{
                  background: "transparent", border: "1px solid #a8e8c033",
                  color: "#a8e8c0", padding: "6px 18px",
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "11px", letterSpacing: "0.12em",
                  cursor: "pointer",
                }}>SAVE</button>
                <button onClick={() => setEditing(false)} style={{
                  background: "none", border: "1px solid #ffffff08",
                  color: "#3a3020", padding: "6px 12px",
                  fontFamily: "'Cormorant Garamond',serif",
                  fontSize: "11px", cursor: "pointer",
                }}>cancel</button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setEditing(true)} style={{
                background: "transparent", border: "1px solid #a8e8c033",
                color: "#a8e8c0", padding: "6px 18px",
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "11px", letterSpacing: "0.12em",
                cursor: "pointer",
              }}>ADD TO ELEMENTS</button>
              <button onClick={handleSave} style={{
                background: "none", border: "1px solid #ffffff08",
                color: "#3a3020", padding: "6px 12px",
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: "11px", cursor: "pointer",
              }}>save as is</button>
            </div>
          )}
        </>
      ) : (
        <div style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: "11px", letterSpacing: "0.1em",
          color: "#a8e8c066",
        }}>✦ added to your elements</div>
      )}
    </div>
  );
}

function MathematicianCard({ name, years, content }) {
  return (
    <div style={{
      margin:"20px 0",
      padding:"22px 24px",
      background:"linear-gradient(160deg,#110a04,#0e0804)",
      border:"1px solid #c8975a22",
      borderLeft:"3px solid #c8975a66",
      borderRadius:"3px",
    }}>
      <div style={{
        fontFamily:"'Cormorant Garamond',serif",
        fontSize:"9px", letterSpacing:"0.28em",
        color:"#c8975a66", marginBottom:"12px",
        textTransform:"uppercase",
      }}>
        ✦ the human behind the mathematics
      </div>
      <div style={{ marginBottom:"14px" }}>
        <div style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:"20px", fontWeight:400,
          color:"#e8c097", letterSpacing:"0.06em",
          lineHeight:1.2,
        }}>
          {name}
        </div>
        <div style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:"11px", color:"#7a6040",
          letterSpacing:"0.12em", marginTop:"3px",
        }}>
          {years}
        </div>
      </div>
      <div style={{
        width:"32px", height:"1px",
        background:"linear-gradient(to right,#c8975a44,transparent)",
        marginBottom:"14px",
      }}/>
      <div style={{
        fontFamily:"'EB Garamond',serif",
        fontSize:"15.5px", lineHeight:"1.85",
        color:"#c8b898", fontStyle:"italic",
      }}
        dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
      />
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
// CONSTELLATION MAP — fractal two-level
// ─────────────────────────────────────────────────────────────
function ConstellationMap({ discovered, onClose }) {
  const [zoomedRealm, setZoomedRealm] = useState(null);
  const [hovered, setHovered] = useState(null);
  const W = 420, H = 380;

  const discoveredRealms = REALMS.filter(r => discovered.has(r.id));
  const totalDiscovered = [...discovered].filter(id => REALM_MAP[id] || CHILD_MAP[id]).length;

  // Position a realm node
  const realmPos = r => ({ cx: (r.x / 100) * W, cy: (r.y / 100) * H });

  // Position child nodes radially around their parent
  const childPositions = (realm) => {
    const children = (realm.children || []).filter(c => discovered.has(c.id));
    const parent = realmPos(realm);
    const radius = 60;
    return children.map((child, i) => {
      const angle = (i / children.length) * 2 * Math.PI - Math.PI / 2;
      return {
        ...child,
        cx: parent.cx + radius * Math.cos(angle),
        cy: parent.cy + radius * Math.sin(angle),
      };
    });
  };

  const currentRealm = zoomedRealm ? REALM_MAP[zoomedRealm] : null;

  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(4,3,2,0.93)", animation:"fadeIn 0.25s ease" }}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()} style={{
        background:"linear-gradient(160deg,#0a0806,#0e0c09)",
        border:"1px solid #e8c97a1a", borderRadius:"4px",
        padding:"24px 24px 20px", maxWidth:"520px", width:"94vw",
        boxShadow:"0 0 100px #000e",
      }}>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
          <div>
            {zoomedRealm ? (
              <>
                <button onClick={() => { setZoomedRealm(null); setHovered(null); }} style={{ background:"none", border:"none", color:"#e8c97a", cursor:"pointer", fontFamily:"'Cormorant Garamond',serif", fontSize:"12px", letterSpacing:"0.12em", padding:0, marginBottom:"4px", display:"flex", alignItems:"center", gap:"6px" }}>
                  ← all realms
                </button>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", letterSpacing:"0.15em", color:"#c8b87a", fontWeight:300 }}>
                  {currentRealm?.label?.toUpperCase()}
                </div>
                <div style={{ fontSize:"11px", color:"#4a4030", letterSpacing:"0.1em", fontFamily:"'Cormorant Garamond',serif", marginTop:"2px" }}>
                  {(currentRealm?.children || []).filter(c => discovered.has(c.id)).length} of {currentRealm?.children?.length} concepts discovered
                </div>
              </>
            ) : (
              <>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", letterSpacing:"0.15em", color:"#c8b87a", fontWeight:300 }}>
                  YOUR CONSTELLATION
                </div>
                <div style={{ fontSize:"11px", color:"#4a4030", letterSpacing:"0.1em", fontFamily:"'Cormorant Garamond',serif", marginTop:"2px" }}>
                  {totalDiscovered} of {TOTAL_NODES} ideas discovered · {discoveredRealms.length} of {REALMS.length} realms entered
                </div>
              </>
            )}
          </div>
          <button onClick={onClose} style={{ background:"none", border:"1px solid #ffffff0c", color:"#4a4030", cursor:"pointer", padding:"5px 11px", fontSize:"11px", letterSpacing:"0.1em", fontFamily:"'Cormorant Garamond',serif" }}>
            CLOSE
          </button>
        </div>

        {/* Progress bar */}
        <div style={{ height:"2px", background:"#ffffff06", borderRadius:"1px", marginBottom:"16px" }}>
          <div style={{ height:"100%", width:`${(totalDiscovered / TOTAL_NODES) * 100}%`, background:"linear-gradient(90deg,#e8c97a33,#e8c97a88)", borderRadius:"1px", transition:"width 0.6s ease" }}/>
        </div>

        {/* ── OUTER VIEW — realm stars */}
        {!zoomedRealm && (
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible", display:"block" }}>
            {/* Edges between discovered realms */}
            {CONSTELLATION_EDGES.map(([a, b], i) => {
              const ra = REALM_MAP[a], rb = REALM_MAP[b];
              if (!ra || !rb) return null;
              const pa = realmPos(ra), pb = realmPos(rb);
              const bothLit = discovered.has(a) && discovered.has(b);
              return (
                <line key={i}
                  x1={pa.cx} y1={pa.cy} x2={pb.cx} y2={pb.cy}
                  stroke={bothLit ? "#e8c97a" : "#ffffff"}
                  strokeOpacity={bothLit ? 0.18 : 0.03}
                  strokeWidth={bothLit ? 0.8 : 0.4}
                />
              );
            })}

            {/* Realm stars */}
            {REALMS.map(r => {
              const { cx, cy } = realmPos(r);
              const lit = discovered.has(r.id);
              const hov = hovered === r.id;
              const childCount = (r.children || []).filter(c => discovered.has(c.id)).length;
              const hasChildren = childCount > 0;

              return (
                <g key={r.id}
                  onMouseEnter={() => setHovered(r.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => lit && setZoomedRealm(r.id)}
                  style={{ cursor: lit ? "pointer" : "default" }}
                >
                  {/* Outer glow */}
                  {lit && <circle cx={cx} cy={cy} r={hov ? 18 : 13} fill="#e8c97a" fillOpacity={0.06} />}

                  {/* Dashed ring — indicates depth inside */}
                  {hasChildren && (
                    <circle cx={cx} cy={cy} r={9}
                      fill="none"
                      stroke="#e8c97a"
                      strokeOpacity={0.3}
                      strokeWidth={0.6}
                      strokeDasharray="2 2"
                    />
                  )}

                  {/* Star */}
                  <circle cx={cx} cy={cy}
                    r={lit ? (hov ? 5 : 3.8) : 2}
                    fill={lit ? "#e8c97a" : "#1e1808"}
                    stroke={lit ? "none" : "#3a2a10"}
                    strokeWidth={0.5}
                    style={{ transition:"all 0.3s" }}
                  />

                  {/* Label */}
                  {lit && (
                    <text x={cx} y={cy - 12} textAnchor="middle"
                      fontSize={hov ? "9" : "7.5"}
                      fill={hov ? "#e8c97a" : "#a09070"}
                      fontFamily="'Cormorant Garamond',serif"
                      letterSpacing="0.04em"
                      style={{ transition:"all 0.3s" }}
                    >
                      {r.label}
                    </text>
                  )}

                  {/* Child count badge */}
                  {hasChildren && hov && (
                    <text x={cx} y={cy + 16} textAnchor="middle"
                      fontSize="7" fill="#e8c97a88"
                      fontFamily="'Cormorant Garamond',serif"
                    >
                      {childCount} inside
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* ── INNER VIEW — sub-topics of a realm */}
        {zoomedRealm && currentRealm && (() => {
          const discoveredChildren = (currentRealm.children || []).filter(c => discovered.has(c.id));
          const parentCx = W / 2, parentCy = H / 2 - 20;
          const radius = 110;

          return (
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible", display:"block" }}>
              {/* Lines from parent to children */}
              {discoveredChildren.map((child, i) => {
                const angle = (i / discoveredChildren.length) * 2 * Math.PI - Math.PI / 2;
                const cx = parentCx + radius * Math.cos(angle);
                const cy = parentCy + radius * Math.sin(angle);
                return (
                  <line key={child.id}
                    x1={parentCx} y1={parentCy} x2={cx} y2={cy}
                    stroke="#e8c97a" strokeOpacity={0.15} strokeWidth={0.7}
                  />
                );
              })}

              {/* Parent realm star — centre */}
              <circle cx={parentCx} cy={parentCy} r={22} fill="#e8c97a" fillOpacity={0.05} />
              <circle cx={parentCx} cy={parentCy} r={7} fill="#e8c97a" fillOpacity={0.9} />
              <text x={parentCx} y={parentCy + 20} textAnchor="middle"
                fontSize="9" fill="#c8b87a"
                fontFamily="'Cormorant Garamond',serif" letterSpacing="0.06em"
              >
                {currentRealm.label}
              </text>

              {/* Child stars */}
              {discoveredChildren.map((child, i) => {
                const angle = (i / discoveredChildren.length) * 2 * Math.PI - Math.PI / 2;
                const cx = parentCx + radius * Math.cos(angle);
                const cy = parentCy + radius * Math.sin(angle);
                const hov = hovered === child.id;

                return (
                  <g key={child.id}
                    onMouseEnter={() => setHovered(child.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor:"default" }}
                  >
                    {hov && <circle cx={cx} cy={cy} r={14} fill="#e8c97a" fillOpacity={0.07} />}
                    <circle cx={cx} cy={cy}
                      r={hov ? 4.5 : 3.2}
                      fill="#e8c97a"
                      fillOpacity={hov ? 0.95 : 0.7}
                      style={{ transition:"all 0.3s" }}
                    />
                    <text x={cx} y={cy - 10} textAnchor="middle"
                      fontSize={hov ? "8.5" : "7.5"}
                      fill={hov ? "#e8c97a" : "#9a8a60"}
                      fontFamily="'Cormorant Garamond',serif"
                      letterSpacing="0.03em"
                      style={{ transition:"all 0.3s" }}
                    >
                      {child.label}
                    </text>
                  </g>
                );
              })}

              {/* Empty state */}
              {discoveredChildren.length === 0 && (
                <>
                  <circle cx={parentCx} cy={parentCy} r={22} fill="#e8c97a" fillOpacity={0.05} />
                  <circle cx={parentCx} cy={parentCy} r={7} fill="#e8c97a" fillOpacity={0.9} />
                  <text x={parentCx} y={parentCy + 20} textAnchor="middle"
                    fontSize="9" fill="#c8b87a"
                    fontFamily="'Cormorant Garamond',serif" letterSpacing="0.06em"
                  >
                    {currentRealm.label}
                  </text>
                  <text x={W/2} y={H - 30} textAnchor="middle"
                    fontSize="9" fill="#4a4030" fontStyle="italic"
                    fontFamily="'EB Garamond',serif"
                  >
                    no concepts discovered here yet
                  </text>
                </>
              )}
            </svg>
          );
        })()}

        {/* Hovered info panel */}
        <div style={{ minHeight:"48px", marginTop:"12px" }}>
          {hovered && (() => {
            const node = REALM_MAP[hovered] || CHILD_MAP[hovered];
            return node ? (
              <div style={{ padding:"10px 14px", background:"#ffffff04", border:"1px solid #e8c97a10", borderRadius:"2px", animation:"fadeIn 0.2s ease" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"13px", color:"#e8c97a", marginBottom:"3px" }}>{node.label}</div>
                <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"12px", color:"#6a6050", fontStyle:"italic" }}>{node.desc}</div>
              </div>
            ) : null;
          })()}
        </div>

        {/* Legend */}
        {!zoomedRealm && (
          <div style={{ marginTop:"12px", display:"flex", gap:"18px", alignItems:"center" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#e8c97a" }}/>
              <span style={{ fontSize:"10px", color:"#4a4030", fontFamily:"'Cormorant Garamond',serif", letterSpacing:"0.07em" }}>discovered</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
              <svg width="12" height="12"><circle cx="6" cy="6" r="4" fill="none" stroke="#e8c97a" strokeOpacity="0.4" strokeWidth="0.8" strokeDasharray="2 2"/></svg>
              <span style={{ fontSize:"10px", color:"#4a4030", fontFamily:"'Cormorant Garamond',serif", letterSpacing:"0.07em" }}>has depth — click to explore</span>
            </div>
          </div>
        )}
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
function MessageBubble({ msg, isNew, onSaveElement }) {
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
            width: "26px",
            height: "26px",
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
            if (seg.type === "saveElement") {
              return (
                <ElementNominationCard
                  key={i}
                  nomination={seg.nomination}
                  onSave={(userDesc) => onSaveElement && onSaveElement({
                    userDescription: userDesc,
                    mathematicalNote: seg.nomination,
                    timestamp: new Date().toISOString(),
                    nominatedBy: "ai",
                  })}
                />
              );
            }
            if (seg.type === "mathematician") {
              return (
                <MathematicianCard
                  key={i}
                  name={seg.name}
                  years={seg.years}
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
                    : "linear-gradient(135deg,#0f0d0a,#141208)",
                  border: isEval
                    ? "1px solid #c8b87a1a"
                    : "1px solid #e8c97a0a",
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
  const [showLog, setShowLog] = useState(false);
  const [mode, setMode] = useState(2);
  const modeRef = useRef(2);
  const [discovered, setDiscovered] = useState(new Set(["numbers"]));
  const [pendingChallenge, setPendingChallenge] = useState(null);
  const [pendingBranch, setPendingBranch] = useState(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [journeySummary, setJourneySummary] = useState("");
  const [, setNewlyLit] = useState(null);
  const [elementsVersion, setElementsVersion] = useState(0);
  const [pingVisible, setPingVisible] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const conversationRef = useRef([]);
  const journeyRef = useRef({
    messages: [],
    discovered: ["numbers"],
    summary: "",
    sessions: 0,
    elements: [],
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
              system: systemOverride || SYSTEM_PROMPT.replace("[MODE]", modeRef.current === 1 ? "WANDER (1)" : modeRef.current === 3 ? "STRIKE (3)" : "DISCOVER (2)"),
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
          const parentId = CHILD_MAP[t]?.parentId;
          if (parentId && !next.has(parentId)) next.add(parentId);
          const pulseTarget = parentId || t;
          setNewlyLit(pulseTarget);
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
      if (!journeyRef.current.elements) journeyRef.current.elements = [];
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
    if (!hasHistory) {
      conversationRef.current = [];
      setMessages([]);
      const clean = STARTER_MESSAGES[Math.floor(Math.random() * STARTER_MESSAGES.length)];
      discoverTopics(clean);
      const aiMsg = { role: "assistant", content: clean };
      const sysRecord = { role: "user", content: `__sys__starter` };
      conversationRef.current = [sysRecord, aiMsg];
      journeyRef.current.messages = conversationRef.current;
      setMessages([aiMsg]);
      setNewMsgIndex(0);
      saveJourney(journeyRef.current);
      setTimeout(() => inputRef.current?.focus(), 200);
      return;
    }

    const initText = RETURNING_STARTER(journeySummary, newSession, journeyRef.current.elements || []);
    const raw = await callClaude([{ role: "user", content: initText }]);
    const { clean } = parseAIResponse(raw);
    discoverTopics(clean);

    const aiMsg = { role: "assistant", content: clean };
    const sysRecord = { role: "user", content: `__sys__${initText}` };
    conversationRef.current = [...conversationRef.current, sysRecord, aiMsg];
    journeyRef.current.messages = conversationRef.current;
    setMessages((prev) => {
      const next = [...prev, aiMsg];
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

  // Keep modeRef in sync with mode state
  useEffect(() => { modeRef.current = mode; }, [mode]);

  // Keep Render backend alive — ping every 10 minutes to prevent cold starts
  useEffect(() => {
    const backendUrl = "https://mathesis-backend.onrender.com/api/chat";
    const ping = () => {
      fetch(backendUrl, { method:"OPTIONS" }).catch(() => {});
    };
    ping();
    const interval = setInterval(ping, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
          background:none;border:1px solid #ffffff0a;color:#7a6a4a;cursor:pointer;
          padding:6px 13px;font-family:'Cormorant Garamond',serif;font-size:11px;
          letter-spacing:0.11em;transition:all 0.3s;display:flex;align-items:center;gap:5px;
        }
        .icon-btn:hover{border-color:#e8c97a2a;color:#b8a86a;}
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
                    Welcome back, fellow traveller.{(journeyRef.current.elements || []).length > 0 ? " You left something worth keeping." : ""}
                  </p>
                  {journeySummary && (
                    <p
                      style={{
                        fontFamily: "'EB Garamond',serif",
                        fontSize: "14.5px",
                        lineHeight: "1.8",
                        color: "#9a9080",
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
                      color: "#6a6050",
                      marginBottom: "44px",
                    }}
                  >
                    {discovered.size} realms · {(journeyRef.current.elements || []).length} elements · session{" "}
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
                  color: "#4a4030",
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
                      color: "#3a3020",
                      fontFamily: "'Cormorant Garamond',serif",
                    }}
                  >
                    YOUR JOURNEY · YOUR PACE · YOUR DISCOVERY ✦
                  </div>
                </div>
              </div>
              {/* Mode selector */}
              <div style={{ display:"flex", gap:"2px", marginRight:"8px", background:"#ffffff05", border:"1px solid #e8c97a12", borderRadius:"20px", padding:"2px" }}>
                {[["1","Wander"],["2","Discover"],["3","Strike"]].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setMode(Number(val))}
                    style={{
                      background: mode === Number(val) ? "#e8c97a18" : "transparent",
                      border: mode === Number(val) ? "1px solid #e8c97a33" : "1px solid transparent",
                      borderRadius:"16px",
                      color: mode === Number(val) ? "#e8c97a" : "#6a5a3a",
                      cursor:"pointer",
                      padding:"3px 10px",
                      fontFamily:"'Cormorant Garamond',serif",
                      fontSize:"11px",
                      letterSpacing:"0.08em",
                      transition:"all 0.2s ease",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {/* Log button */}
              <button className="icon-btn" onClick={() => setShowLog(true)} style={{ marginRight:"4px" }}>
                <span style={{ fontSize:"13px" }}>◈</span>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", letterSpacing:"0.08em" }}>elements</span>
              </button>
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
                  {discovered.size}/{TOTAL_NODES} discovered
                </span>
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "26px 0 10px" }}>
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} isNew={i === newMsgIndex} onSaveElement={(entry) => {
                  journeyRef.current.elements = [...(journeyRef.current.elements || []), entry];
                  saveJourney(journeyRef.current);
                  setElementsVersion(v => v + 1);
                }} />
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

        {/* ══ ELEMENTS OVERLAY ══ */}
        {showLog && (
          <div
            style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(4,3,2,0.93)", animation:"fadeIn 0.25s ease" }}
            onClick={() => setShowLog(false)}
          >
            <div onClick={e => e.stopPropagation()} style={{
              background:"linear-gradient(160deg,#0a0806,#0e0c09)",
              border:"1px solid #a8e8c01a", borderRadius:"4px",
              padding:"24px 24px 20px", maxWidth:"520px", width:"94vw",
              maxHeight:"80vh", display:"flex", flexDirection:"column",
              boxShadow:"0 0 100px #000e",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px", flexShrink:0 }}>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", letterSpacing:"0.15em", color:"#a8e8c0", fontWeight:300 }}>
                    YOUR ELEMENTS
                  </div>
                  <div style={{ fontSize:"11px", color:"#4a4030", letterSpacing:"0.1em", fontFamily:"'Cormorant Garamond',serif", marginTop:"2px" }}>
                    moments that say something true about how you think
                  </div>
                </div>
                <button onClick={() => setShowLog(false)} style={{ background:"none", border:"1px solid #ffffff0c", color:"#4a4030", cursor:"pointer", padding:"5px 11px", fontSize:"11px", letterSpacing:"0.1em", fontFamily:"'Cormorant Garamond',serif" }}>
                  CLOSE
                </button>
              </div>

              {/* User self-nomination button */}
              <div style={{ marginBottom:"16px", flexShrink:0 }}>
                <SelfNominateButton onSave={(userDesc) => {
                  const entry = {
                    userDescription: userDesc,
                    mathematicalNote: "",
                    timestamp: new Date().toISOString(),
                    nominatedBy: "user",
                  };
                  journeyRef.current.elements = [...(journeyRef.current.elements || []), entry];
                  saveJourney(journeyRef.current);
                  setShowLog(false);
                  setTimeout(() => setShowLog(true), 50);
                }} />
              </div>

              <div style={{ overflowY:"auto", flex:1 }}>
                {(() => {
                  const elements = [...(journeyRef.current.elements || [])].reverse();
                  if (elements.length === 0) return (
                    <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"15px", color:"#4a4030", fontStyle:"italic", textAlign:"center", marginTop:"40px" }}>
                      Nothing here yet. When you find something worth keeping — a discovery, a surprising wrong turn, a moment that felt real — it lives here.
                    </div>
                  );
                  return elements.map((entry, i) => {
                    const date = new Date(entry.timestamp);
                    const dateStr = date.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
                    const timeStr = date.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
                    return (
                      <div key={i} style={{ marginBottom:"20px", paddingBottom:"20px", borderBottom: i < elements.length - 1 ? "1px solid #ffffff08" : "none" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"10px", letterSpacing:"0.14em", color: entry.nominatedBy === "user" ? "#a8e8c066" : "#e8c97a66" }}>
                            {entry.nominatedBy === "user" ? "✦ your finding" : "✦ noticed by mathesis"}
                          </div>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", color:"#3a2a10" }}>
                            {dateStr} · {timeStr}
                          </div>
                        </div>
                        <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"15.5px", lineHeight:"1.75", color:"#ddd5c0", marginBottom: entry.mathematicalNote ? "8px" : "0" }}>
                          {entry.userDescription}
                        </div>
                        {entry.mathematicalNote && (
                          <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"13px", lineHeight:"1.6", color:"#6a6050", fontStyle:"italic" }}>
                            {entry.mathematicalNote}
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
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
