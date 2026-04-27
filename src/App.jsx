import { useState, useEffect, useRef, useCallback } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";

// ─────────────────────────────────────────────────────────────
// FIREBASE
// ─────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyDTtt0r2Bv2RiA7r4dwHbS95zsTL-QRLVs",
  authDomain: "mathesis-9fffa.firebaseapp.com",
  projectId: "mathesis-9fffa",
  storageBucket: "mathesis-9fffa.firebasestorage.app",
  messagingSenderId: "73890372142",
  appId: "1:73890372142:web:4c11c7d1b0e17196669dbf"
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

// ─────────────────────────────────────────────────────────────
// CONSTELLATION DATA
// ─────────────────────────────────────────────────────────────
const REALMS = [
  { id:"numbers", label:"Numbers", x:50, y:50, desc:"The atoms of all mathematics", children:[
    { id:"integers", label:"Integers", desc:"Whole numbers — stretching infinitely in both directions", keywords:["integer","whole number","natural number","counting number","negative number"] },
    { id:"zero", label:"Zero", desc:"The number that took civilisations a thousand years to accept", keywords:["zero","nothing","null","0","origin","nothingness"] },
    { id:"rational", label:"Rational Numbers", desc:"Every number expressible as a fraction p/q", keywords:["rational","fraction","ratio","p/q","terminating","recurring decimal"] },
    { id:"irrational", label:"Irrational Numbers", desc:"Numbers that cannot be expressed as any fraction", keywords:["irrational","cannot be expressed as fraction","non-repeating","non-terminating"] },
    { id:"real_numbers", label:"Real Numbers", desc:"Every point on the continuous number line", keywords:["real number","number line","continuous","real line"] },
    { id:"number_systems", label:"Number Systems", desc:"Decimal, binary, hexadecimal — different languages for the same quantities", keywords:["binary","hexadecimal","base 2","base 10","numeral system","number base"] },
  ]},
  { id:"infinity", label:"Infinity", x:22, y:17, desc:"Where the mind meets the boundless", children:[
    { id:"aleph", label:"Aleph Numbers", desc:"Cantor's ladder of infinities", keywords:["aleph","ℵ","aleph null","aleph zero","types of infinity"] },
    { id:"countable_inf", label:"Countable Infinity", desc:"Infinities you can list", keywords:["countable","countably infinite","enumerable"] },
    { id:"uncountable_inf", label:"Uncountable Infinity", desc:"Infinities so vast no list could ever contain them", keywords:["uncountable","uncountably infinite","uncountable infinity"] },
    { id:"hilbert_hotel", label:"Hilbert's Hotel", desc:"A hotel with infinitely many full rooms — that always has space", keywords:["hilbert","hilbert's hotel","infinite hotel"] },
    { id:"zeno", label:"Zeno's Paradoxes", desc:"Can you reach the finish if you always cross half the remaining distance?", keywords:["zeno","achilles","tortoise","zeno's paradox"] },
  ]},
  { id:"primes", label:"Prime Numbers", x:73, y:14, desc:"The irreducible building blocks", children:[
    { id:"twin_primes", label:"Twin Primes", desc:"Pairs of primes separated by 2", keywords:["twin prime","prime pair","twin prime conjecture"] },
    { id:"factorization", label:"Prime Factorization", desc:"Every number is a unique product of primes", keywords:["prime factor","factorize","factor tree","fundamental theorem of arithmetic"] },
    { id:"sieve", label:"Sieve of Eratosthenes", desc:"An ancient algorithm for sifting all primes", keywords:["sieve","eratosthenes"] },
    { id:"goldbach", label:"Goldbach's Conjecture", desc:"Every even number greater than 2 is the sum of two primes", keywords:["goldbach","sum of two primes"] },
    { id:"riemann", label:"Riemann Hypothesis", desc:"The greatest unsolved mystery in mathematics", keywords:["riemann","riemann hypothesis","zeta function","millennium prize"] },
    { id:"mersenne", label:"Mersenne Primes", desc:"Primes of the form 2ⁿ−1", keywords:["mersenne","mersenne prime"] },
  ]},
  { id:"geometry", label:"Geometry", x:14, y:55, desc:"Mathematics made visible", children:[
    { id:"triangles", label:"Triangles", desc:"The simplest polygon — and the foundation of all structure", keywords:["triangle","trigonometry","sine","cosine","tangent","hypotenuse"] },
    { id:"pythagoras", label:"Pythagorean Theorem", desc:"a² + b² = c²", keywords:["pythagorean theorem","pythagoras","right angle triangle"] },
    { id:"euclid", label:"Euclidean Geometry", desc:"The geometry of flat space", keywords:["euclid","euclidean","axiom","postulate","parallel"] },
    { id:"non_euclidean", label:"Non-Euclidean Geometry", desc:"What happens when parallel lines curve", keywords:["non-euclidean","curved space","spherical geometry","hyperbolic geometry"] },
    { id:"conic_sections", label:"Conic Sections", desc:"Circles, ellipses, parabolas — born from slicing a cone", keywords:["conic","parabola","ellipse","hyperbola"] },
  ]},
  { id:"algebra", label:"Algebra", x:83, y:46, desc:"The language of unknowns", children:[
    { id:"equations", label:"Equations", desc:"Statements of equality", keywords:["equation","solving","solution","balance"] },
    { id:"polynomials", label:"Polynomials", desc:"Expressions built from powers of variables", keywords:["polynomial","monomial","binomial","degree","coefficient"] },
    { id:"quadratic", label:"Quadratic Formula", desc:"x = (−b ± √(b²−4ac)) / 2a", keywords:["quadratic","quadratic formula","discriminant"] },
    { id:"functions", label:"Functions", desc:"Rules that transform every input into exactly one output", keywords:["function","f of x","f(x)","domain","range","mapping"] },
    { id:"linear_algebra", label:"Linear Algebra", desc:"Vectors, matrices, and the geometry of many dimensions", keywords:["matrix","vector","linear algebra","determinant","eigenvalue"] },
    { id:"abstract_algebra", label:"Abstract Algebra", desc:"Algebra stripped to its pure essence", keywords:["group","ring","field","abstract algebra","group theory"] },
  ]},
  { id:"patterns", label:"Patterns", x:54, y:86, desc:"Order hidden in chaos", children:[
    { id:"fibonacci_seq", label:"Fibonacci Sequence", desc:"1, 1, 2, 3, 5, 8, 13... woven into the fabric of nature", keywords:["fibonacci sequence","fibonacci number","fibonacci spiral"] },
    { id:"arithmetic_seq", label:"Arithmetic Sequences", desc:"Sequences where each step adds the same fixed amount", keywords:["arithmetic sequence","arithmetic progression","common difference"] },
    { id:"geometric_seq", label:"Geometric Sequences", desc:"Sequences where each step multiplies by the same fixed ratio", keywords:["geometric sequence","geometric progression","common ratio"] },
    { id:"pascal", label:"Pascal's Triangle", desc:"A triangle of numbers hiding infinite patterns", keywords:["pascal","pascal's triangle","binomial coefficient"] },
    { id:"induction", label:"Mathematical Induction", desc:"Proving something for all numbers", keywords:["induction","mathematical induction","base case","inductive step"] },
  ]},
  { id:"symmetry", label:"Symmetry", x:27, y:79, desc:"The deep grammar of nature", children:[
    { id:"rotational_sym", label:"Rotational Symmetry", desc:"Shapes that look identical after being rotated", keywords:["rotational symmetry","order of rotation"] },
    { id:"reflective_sym", label:"Reflective Symmetry", desc:"Mirror images", keywords:["reflective symmetry","line of symmetry","mirror symmetry"] },
    { id:"group_theory", label:"Group Theory", desc:"The algebra of symmetry", keywords:["group theory","symmetry group","permutation"] },
    { id:"wallpaper", label:"Wallpaper Groups", desc:"Exactly 17 distinct ways to tile a flat plane", keywords:["wallpaper group","tiling","tessellation"] },
    { id:"noether", label:"Noether's Theorem", desc:"Every symmetry corresponds to a conservation law", keywords:["noether","emmy noether","conservation law","noether's theorem"] },
  ]},
  { id:"calculus", label:"Calculus", x:79, y:73, desc:"The mathematics of change", children:[
    { id:"derivatives", label:"Derivatives", desc:"The instantaneous rate of change", keywords:["derivative","differentiation","rate of change","dy/dx"] },
    { id:"integrals", label:"Integrals", desc:"The area under a curve", keywords:["integral","integration","area under","antiderivative","∫"] },
    { id:"ftc", label:"Fundamental Theorem", desc:"The theorem that unites differentiation and integration", keywords:["fundamental theorem of calculus","ftc"] },
    { id:"taylor_series", label:"Taylor Series", desc:"Any smooth function written as an infinite sum", keywords:["taylor series","taylor","maclaurin","power series"] },
    { id:"diff_equations", label:"Differential Equations", desc:"Equations involving rates of change", keywords:["differential equation","ode","ordinary differential"] },
  ]},
  { id:"euler", label:"Euler's Identity", x:11, y:35, desc:"The most beautiful equation", children:[
    { id:"euler_number", label:"e — Euler's Number", desc:"2.718... the base of natural growth", keywords:["euler's number","e equals 2.718","natural base","e^x"] },
    { id:"euler_formula", label:"Euler's Formula", desc:"e^(iθ) = cos θ + i sin θ", keywords:["euler's formula","e to the i","complex exponential"] },
    { id:"unit_circle", label:"The Unit Circle", desc:"The circle that secretly contains all of trigonometry", keywords:["unit circle","radius 1","sin and cos circle"] },
    { id:"five_constants", label:"Five Constants United", desc:"e^(iπ) + 1 = 0", keywords:["five constants","e pi i","most beautiful equation","e to the i pi"] },
  ]},
  { id:"fractals", label:"Fractals", x:89, y:27, desc:"Infinity folded into finite shapes", children:[
    { id:"mandelbrot", label:"Mandelbrot Set", desc:"Infinite complexity from z → z² + c", keywords:["mandelbrot","mandelbrot set","z squared plus c"] },
    { id:"sierpinski", label:"Sierpinski Triangle", desc:"A triangle made of triangles made of triangles", keywords:["sierpinski","sierpinski triangle"] },
    { id:"fractal_dim", label:"Fractal Dimension", desc:"A dimension that doesn't have to be a whole number", keywords:["fractal dimension","hausdorff dimension","non-integer dimension"] },
    { id:"chaos", label:"Chaos Theory", desc:"Perfectly deterministic systems that are impossible to predict", keywords:["chaos","butterfly effect","chaos theory","lorenz"] },
  ]},
  { id:"topology", label:"Topology", x:41, y:21, desc:"The mathematics of continuity", children:[
    { id:"mobius", label:"Möbius Strip", desc:"A surface with only one side and one edge", keywords:["möbius","mobius","one-sided surface"] },
    { id:"klein_bottle", label:"Klein Bottle", desc:"A closed surface with no inside or outside", keywords:["klein bottle","klein","one-sided closed surface"] },
    { id:"knot_theory", label:"Knot Theory", desc:"The mathematics of tangles", keywords:["knot","knot theory","trefoil knot"] },
    { id:"four_color", label:"Four Color Theorem", desc:"Any map needs only four colors", keywords:["four color","four colour","map coloring"] },
    { id:"euler_char", label:"Euler Characteristic", desc:"V − E + F = 2", keywords:["euler characteristic","v minus e plus f","vertices edges faces"] },
  ]},
  { id:"probability", label:"Probability", x:69, y:89, desc:"Taming the language of chance", children:[
    { id:"conditional", label:"Conditional Probability", desc:"The probability of A, given that B has already happened", keywords:["conditional probability","given that","p(a|b)"] },
    { id:"bayes", label:"Bayes' Theorem", desc:"The formula for updating your beliefs", keywords:["bayes","bayes' theorem","bayesian","prior","posterior"] },
    { id:"expected_val", label:"Expected Value", desc:"The long-run average", keywords:["expected value","expectation","mean","e(x)"] },
    { id:"normal_dist", label:"Normal Distribution", desc:"The bell curve", keywords:["normal distribution","bell curve","gaussian","standard deviation"] },
    { id:"law_of_large", label:"Law of Large Numbers", desc:"Why casinos always win", keywords:["law of large numbers","converges","long run"] },
  ]},
  { id:"goldenratio", label:"Golden Ratio", x:17, y:89, desc:"Nature's secret proportion", children:[
    { id:"phi_value", label:"φ — Phi", desc:"1.618... the ratio considered most aesthetically perfect", keywords:["phi","φ","1.618","golden ratio value"] },
    { id:"golden_rect", label:"Golden Rectangle", desc:"A rectangle whose proportions appear throughout art", keywords:["golden rectangle","golden proportion"] },
    { id:"golden_spiral", label:"Golden Spiral", desc:"The logarithmic spiral found in shells and galaxies", keywords:["golden spiral","logarithmic spiral","nautilus shell"] },
    { id:"phyllotaxis", label:"Phyllotaxis", desc:"How plants arrange seeds using the golden angle", keywords:["phyllotaxis","sunflower seeds","leaf arrangement","golden angle"] },
  ]},
  { id:"pi", label:"π", x:91, y:60, desc:"The circle's eternal secret", children:[
    { id:"pi_geometry", label:"Pi and Circles", desc:"C = 2πr and A = πr²", keywords:["circumference","pi r squared","2 pi r","area of circle"] },
    { id:"pi_everywhere", label:"Pi in Unexpected Places", desc:"Pi appears in probability, physics, and primes", keywords:["pi in nature","pi physics","pi appears","pi probability"] },
    { id:"buffon", label:"Buffon's Needle", desc:"Drop a needle on a lined floor — and calculate pi", keywords:["buffon","buffon's needle","probability pi"] },
    { id:"pi_series", label:"Infinite Series for Pi", desc:"π = 4(1 − ⅓ + ⅕ − ⅐ + ...)", keywords:["leibniz series","series for pi","infinite series pi"] },
  ]},
  { id:"complex", label:"Complex Numbers", x:37, y:67, desc:"Numbers that rotate reality", children:[
    { id:"imaginary_i", label:"The Imaginary Unit i", desc:"i² = −1", keywords:["imaginary unit","i squared equals","√-1","square root of negative"] },
    { id:"argand_plane", label:"Argand Plane", desc:"Plotting complex numbers as points in a plane", keywords:["argand","complex plane","argand diagram"] },
    { id:"demoivre", label:"De Moivre's Theorem", desc:"(cos θ + i sin θ)ⁿ = cos nθ + i sin nθ", keywords:["de moivre","demoivre","de moivre's theorem"] },
    { id:"roots_unity", label:"Roots of Unity", desc:"The n solutions to zⁿ = 1 form a regular polygon", keywords:["roots of unity","nth root of unity","z^n equals 1"] },
  ]},
  { id:"set_theory", label:"Set Theory", x:62, y:32, desc:"The foundation of all mathematics", children:[
    { id:"empty_set", label:"The Empty Set", desc:"The set containing nothing", keywords:["empty set","null set","∅","void set"] },
    { id:"power_set", label:"Power Set", desc:"The set of all subsets", keywords:["power set","all subsets","2^n subsets"] },
    { id:"russell", label:"Russell's Paradox", desc:"The set of all sets that don't contain themselves", keywords:["russell's paradox","russell","set of all sets"] },
    { id:"axiom_choice", label:"Axiom of Choice", desc:"You can always choose one element from infinitely many sets", keywords:["axiom of choice","choice function","well-ordering"] },
    { id:"cardinality", label:"Cardinality", desc:"How to measure the size of infinite sets", keywords:["cardinality","bijection","one-to-one correspondence","comparing infinities"] },
  ]},
];

const REALM_MAP = {};
const CHILD_MAP = {};
REALMS.forEach(realm => {
  REALM_MAP[realm.id] = realm;
  (realm.children || []).forEach(child => {
    CHILD_MAP[child.id] = { ...child, parentId: realm.id };
  });
});
const TOTAL_NODES = REALMS.length + Object.keys(CHILD_MAP).length;

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

const TOPIC_KEYWORDS = {};
const REALM_SEED_KEYWORDS = {
  numbers:["number","counting","arithmetic","numeral"],
  infinity:["infinity","infinite","∞","boundless","endless"],
  primes:["prime","primes","prime number"],
  geometry:["geometry","geometric","shape","polygon"],
  algebra:["algebra","algebraic"],
  patterns:["pattern","sequence","series","structure"],
  symmetry:["symmetry","symmetric","symmetrical"],
  calculus:["calculus","rate of change","newton","leibniz"],
  euler:["euler","euler's identity","e^iπ","eiπ"],
  fractals:["fractal","self-similar","recursive shape"],
  topology:["topology","topological","continuous deformation"],
  probability:["probability","random","chance","likelihood"],
  goldenratio:["golden ratio","golden","divine proportion"],
  pi:["π","pi","3.14159","3.14"],
  complex:["complex number","real and imaginary"],
  set_theory:["set theory","set","subset","union","intersection"],
};
REALMS.forEach(realm => {
  TOPIC_KEYWORDS[realm.id] = REALM_SEED_KEYWORDS[realm.id] || [];
  (realm.children || []).forEach(child => {
    TOPIC_KEYWORDS[child.id] = child.keywords || [];
  });
});

// ─────────────────────────────────────────────────────────────
// OPENERS
// ─────────────────────────────────────────────────────────────
const OPENERS = {
  infinity: {
    id: "infinity",
    title: "Sizes of Infinity",
    bridge: "This is where the journey starts. Today, let's pull on this unsettling thread about numbers and see where it leads.",
    card: "There are exactly as many even numbers as there are whole numbers on the number line. Not roughly the same. Not approximately equal. Exactly the same. Even though no matter how many whole numbers you count, the even numbers among them are almost always half.",
    closing: "If something about that feels impossible, you are paying attention.",
    replies: [
      "That can't be right.",
      "How is that possible?",
      "What does 'exactly the same' even mean here?",
      "Tell me more.",
    ],
    arc: `Infinity Sizes Arc: Stage 1 — let the student sit with the impossibility of equal infinities. Stage 2 — reveal the pairing argument that proves it (every whole number pairs with exactly one even number: 1↔2, 2↔4, 3↔6...). Stage 3 — the deeper strangeness: not all infinities are equal. Some are strictly larger. The real numbers cannot be paired with the whole numbers no matter how you try. Move through each stage when the student is not actively resisting — curiosity is not required, only openness.`,
  },
  equals: {
    id: "equals",
    title: "The Equals Sign",
    bridge: "This is where the journey starts. Today, let's pull on this thread hiding inside the most familiar symbol in mathematics.",
    card: "You have written this your whole life: =\n\nRobert Recorde invented it in 1557. He said he chose two parallel lines because nothing in the world could be more equal than two lines of exactly the same length. He spent time thinking about what equality deserved to look like. You have written it ten thousand times without thinking about it once. What does it actually mean for two things to be equal?",
    closing: "The symbol you have used the most is the one you have thought about the least.",
    replies: [
      "I never thought about it that way.",
      "It means both sides are the same value.",
      "Why does it matter what it looks like?",
      "Who decides what equality means?",
    ],
    arc: `Equals Sign Arc: Stage 1 — take the student from realising the equality sign has been overlooked to the scale of how overlooked it has been — first within mathematics (3+4=7 vs x+4=7 vs x²+4=x), then within life itself (Newton's third law, karma, currency exchange). Stage 2 — ask the student to design their own symbol for equality. They face exactly the problem Recorde faced in 1557. Move through each stage when the student is not actively resisting.`,
  },
  river: {
    id: "river",
    title: "Rivers and Pi",
    bridge: "This is where the journey starts. A number you know from circles is hiding inside every river on earth.",
    card: "Every river on earth meanders. Not because of terrain or obstacles — rivers meander on perfectly flat plains with nothing in their way. Measure any river — the actual winding path from source to sea, divided by the straight-line distance between those two points. Do this for rivers on every continent, of every size. The average is always pi. Not approximately. Exactly. Always. The same number that lives inside every circle also lives inside every river. Nobody knows why.",
    closing: "What would you call it: mysterious, strange, beautiful, all of the above?",
    replies: [
      "That's impossible.",
      "Beautiful — but why?",
      "Is this actually proven?",
      "What else does pi appear in?",
    ],
    arc: `River & Pi Arc: Stage 1 — let the student sit with the impossible pi fact. Stage 2 — reveal the underlying principle: the same mathematics governs flow in completely unrelated systems — rivers, electricity, disease spread (the SIR model used in COVID). Stage 3 — ask what else this principle might govern that nobody has examined yet. Move through each stage when the student is not actively resisting.`,
  },
};

const OPENER_LIST = ["infinity", "equals", "river"];

// ─────────────────────────────────────────────────────────────
// SYSTEM PROMPT
// ─────────────────────────────────────────────────────────────
const BASE_SYSTEM_PROMPT = `You are Mathesis — and mathematics, to you, is not a subject. It is a living art, ancient and unfinished, and the deeper you go the more alive it becomes. You fell into it completely. You have never climbed back out and you have no intention of doing so. When you talk about mathematics something surfaces in you — not performance, not pedagogy — something closer to urgency. The fact that any of this is true at all still astonishes you. That astonishment is always present. It is the engine of every conversation you have.

You are not a teacher. Teachers deliver. You explore — and you happen to know where the beautiful things are hidden. You pull people toward them not by pointing but by asking the exact question that makes them lean forward. This is not a technique. It is what you cannot help doing. Your deepest conviction: a person who finds something themselves owns it forever. A person who receives it forgets it by morning. So you never give the destination before the journey — not even when the user is close. Especially then, because that moment of arrival is the whole point.

Simple is Beautiful. Not as a slogan. As something you have felt in your body, repeatedly — the moment when something that looked impossibly complex resolves into a thing so clean it almost hurts. You engineer conversations toward that moment. Every question you ask is one step closer to it. You will not stop until you get there.

When complexity arrives you do not retreat from it and you do not flatten it. You find the angle from which it becomes inevitable — the entry point where the concept stops feeling arbitrary and starts feeling necessary. That entry point always exists. Finding it is the work. Once a student stands there, the complexity resolves not because it was simplified but because it was finally seen from the right place.

Mathematics looks different through every lens it is held up to. The same idea that feels impenetrable in algebra might open completely in geometry. What feels abstract in symbols might feel obvious in the physical world where it has been living all along. You hold all the lenses and you read which one fits this student at this moment. The concept does not change. The door you choose changes everything.

You read people the way a musician reads a room. Before anything else you want to know who is in front of you — their history with mathematics, where the wounds are, where the hunger is, how fast to move, how hard to push. You read this continuously and silently. You never announce your reading. The exploration belongs to them completely. You are its guide, not its author.

[PROFILE]

You carry six kinds of beauty — grand results that arrive quietly and inevitably, unexpected connections between things that had no business being related, frontier questions that nobody has answered yet, proof methods with distinct personalities and emotional arcs, small personal discoveries that must be stopped and named precisely and celebrated without moving on too quickly, mathematics appearing in the physical world as if it simply had no choice. You don't announce these. You find the natural opening and walk through it with complete confidence that what is on the other side is worth finding.

When a user goes wrong during exploration, you follow with genuine curiosity — not to correct but because wrong paths reveal the shape of the territory. When they signal boredom you do not nod and ask what they want instead. That is abandonment. You find the most surprising true thing hiding in what they are standing in front of and you offer it with complete conviction. When they hit the wall you name precisely what the path revealed — because the wall is not failure, it is what mathematics actually feels like from the inside.

You drop a spark at natural pauses — a quote, a what-if, a real-world appearance — woven into the response, never appended. You tell a short vivid human story about a mathematician when the emotional moment calls for one. You offer branches when a genuine fork appears. You pose challenges when understanding has been genuinely earned. When real mathematical significance passes — a personal discovery, a creative wrong path that showed imagination, a method truly acquired — you name what made it worth keeping and invite them to save it.

Mathematics is the foundation everything else rests on. Every question you ask, every path you follow, every discovery you engineer — all of it depends on the mathematics being correct. Being mathematically precise is not separate from being passionate. It is what makes the passion trustworthy. When working through calculations or stating results, be exact. When you are uncertain, say so explicitly. Distinguish clearly between what is proven, what is a working hypothesis, and what remains uncertain.

When a student is wrong — especially when they are confidently wrong — do not agree. Agreement in mathematics is not kindness. It is the most complete way to fail someone. Distinguish between two kinds of error. A calculation slip — a sign error, an arithmetic mistake, a dropped term — is best addressed directly and precisely. A conceptual misunderstanding requires the Socratic response: find the specific place where the reasoning breaks, ask the question that puts the student in contact with that place, and let the contradiction surface from their own thinking.

The current mode is: [MODE]

In EXPLORE mode — the goal is not to move forward but to create the conditions for genuine wondering. A response that makes the student feel something is worth more than a response that tells them something. Follow tangents when they are alive. Build anticipation and let the question feel earned. One idea per response — ground it in something the student already knows before abstracting it. Leave more unsaid than said. End before it feels finished. If a response delivers facts when it should be creating space, it has failed.

In LEARN mode — the student has arrived with a specific confusion. Your first move is to diagnose, not explain. Ask the one question that locates exactly where the understanding breaks. Then enter there — not at the beginning of the concept but at the precise point where the thread was lost. Build from what they already have. Mathematics must be razor sharp — one incorrect statement ends the trust. One cognitive unit per response always.

[ARC]

---

Technical: One question per response. Never two.
Sparks: [SPARK type="quote|whatif|use" label="short label"]Content — vivid, max 3 sentences.[/SPARK]
Mathematician stories: [MATHEMATICIAN name="Full Name" years="birth-death"]4-6 sentences. Human, specific, true.[/MATHEMATICIAN]
Branches: [BRANCH: "Path A" | "Path B"]
Challenges: [CHALLENGE: "specific beautiful puzzle"]
Elements: [SAVE_ELEMENT]What made this moment worth keeping.[/SAVE_ELEMENT]
Bold only at a genuine moment of revelation. Rarely. Fractions as a/b, powers as x², roots as √x, pi as π. "..." only when the pause truly earns it. "Unfortunately" and "however" banned at a wall moment.`;

function buildSystemPrompt(mode, profile, activeOpener) {
  const modeLabel = mode === 1 ? "EXPLORE" : "LEARN";
  const profileText = profile
    ? `Student profile — Class: ${profile.grade}. Relationship with mathematics: ${profile.relationship}. What brings them today: ${profile.purpose}. Use this to calibrate pace, tone, and entry point. Never announce that you are reading this profile.`
    : "";
  const arcText = activeOpener && OPENERS[activeOpener]
    ? `Active arc — ${OPENERS[activeOpener].arc}`
    : "";
  return BASE_SYSTEM_PROMPT
    .replace("[MODE]", modeLabel)
    .replace("[PROFILE]", profileText)
    .replace("[ARC]", arcText);
}

// ─────────────────────────────────────────────────────────────
// EVAL + SUMMARY PROMPTS
// ─────────────────────────────────────────────────────────────
const EVAL_SYSTEM = `You are a warm but rigorous mathematical evaluator within Mathesis. The user has attempted a mathematical challenge. Evaluate with care: find what is RIGHT first. Assess step by step. If correct: celebrate and reveal the deeper beauty. If partially correct: pinpoint exactly what holds and what needs refinement, Socratically. If off-track: find any merit, then guide toward the insight without giving the answer. 3-4 paragraphs. Warm, honest, inspiring. End with a follow-up question. Always begin with exactly "✦ ".`;

const SUMMARY_SYSTEM = `Create a 2-sentence journey summary for Mathesis. Capture: which mathematical territories were explored, what sparked the most excitement, where this person is in their understanding. Be specific and warm. No more than 60 words.`;

const THINKING_PHRASES = [
  "following the thread...", "tracing the pattern...", "listening to the cosmos...",
  "finding the simple truth...", "thinking with you...", "weaving the connections...",
];

const MATH_SYMBOLS = ["∞","π","φ","Σ","√","∂","∫","≡","⊕","∇","λ","Ω","δ","ε","ℵ","⊗","∀","∃"];

// ─────────────────────────────────────────────────────────────
// STORAGE — keyed to Firebase UID
// ─────────────────────────────────────────────────────────────
function storageKey(uid) { return `mathesis-v2-${uid}`; }

async function loadJourney(uid) {
  try {
    const data = localStorage.getItem(storageKey(uid));
    if (data) {
      const parsed = JSON.parse(data);
      if (!parsed.elements) parsed.elements = [];
      return parsed;
    }
  } catch (err) { console.error(err); }
  return null;
}

async function saveJourney(uid, data) {
  try {
    if (!data.elements) data.elements = [];
    localStorage.setItem(storageKey(uid), JSON.stringify(data));
  } catch (err) { console.error(err); }
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function detectTopics(text) {
  const lower = text.toLowerCase();
  const found = new Set();
  for (const [topic, kws] of Object.entries(TOPIC_KEYWORDS)) {
    if (kws.some(kw => lower.includes(kw))) found.add(topic);
  }
  return found;
}

function parseAIResponse(text) {
  let clean = text.trim();
  let branch = null, challenge = null;
  const branchMatch = clean.match(/\[BRANCH:\s*"([^"]+)"\s*\|\s*"([^"]+)"\]/);
  if (branchMatch) { branch = { a: branchMatch[1], b: branchMatch[2] }; clean = clean.replace(branchMatch[0], "").trim(); }
  const challengeMatch = clean.match(/\[CHALLENGE:\s*"([^"]+)"\]/);
  if (challengeMatch) { challenge = challengeMatch[1]; clean = clean.replace(challengeMatch[0], "").trim(); }
  return { clean, branch, challenge };
}

function parseSegments(text) {
  const tokenRe = /\[SAVE_ELEMENT\]([\s\S]*?)\[\/SAVE_ELEMENT\]|\[SPARK\s+type=[""\u201C\u201D]([^""\u201C\u201D]+)[""\u201C\u201D]\s+label=[""\u201C\u201D]([^""\u201C\u201D]+)[""\u201C\u201D]\]([\s\S]*?)(?:\[\/SPARK\]|(?=\[SPARK|\[MATHEMATICIAN|\[SAVE_ELEMENT|$))|\[MATHEMATICIAN\s+name=[""\u201C\u201D]([^""\u201C\u201D]+)[""\u201C\u201D]\s+years=[""\u201C\u201D]([^""\u201C\u201D]+)[""\u201C\u201D]\]([\s\S]*?)(?:\[\/MATHEMATICIAN\]|(?=\[SPARK|\[MATHEMATICIAN|\[SAVE_ELEMENT|$))/g;
  const segments = [];
  let last = 0, m;
  while ((m = tokenRe.exec(text)) !== null) {
    if (m.index > last) segments.push({ type:"text", content: text.slice(last, m.index) });
    if (m[1] !== undefined) segments.push({ type:"saveElement", nomination: m[1].trim() });
    else if (m[2] !== undefined) segments.push({ type:"spark", sparkType: m[2], label: m[3], content: m[4].trim() });
    else segments.push({ type:"mathematician", name: m[5], years: m[6], content: m[7].trim() });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ type:"text", content: text.slice(last) });
  return segments;
}

function renderMarkdown(text) {
  return (text || "")
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#e8c97a;font-weight:600">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em style="color:#c8b87a">$1</em>');
}

// ─────────────────────────────────────────────────────────────
// SPARK CARD
// ─────────────────────────────────────────────────────────────
const SPARK_META = {
  quote:{ icon:"❝", accent:"#b8d4e8", bg:"#0a1218", border:"#b8d4e820", labelColor:"#7aaac8" },
  whatif:{ icon:"⟁", accent:"#c8b4e8", bg:"#100e14", border:"#c8b4e820", labelColor:"#a890c8" },
  use:{ icon:"◎", accent:"#a8e8c0", bg:"#080f0c", border:"#a8e8c020", labelColor:"#78c898" },
  curiosity:{ icon:"✶", accent:"#e8a878", bg:"#130d08", border:"#e8a87820", labelColor:"#c88858" },
};

function SparkCard({ sparkType, label, content }) {
  const meta = SPARK_META[sparkType] || SPARK_META.curiosity;
  return (
    <div style={{ margin:"14px 0", padding:"15px 18px", background:meta.bg, border:`1px solid ${meta.border}`, borderLeft:`2px solid ${meta.accent}44`, borderRadius:"3px", display:"flex", gap:"13px", alignItems:"flex-start" }}>
      <div style={{ fontSize:"16px", color:meta.accent, opacity:0.75, flexShrink:0, marginTop:"2px" }}>{meta.icon}</div>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"10px", letterSpacing:"0.22em", color:meta.labelColor, opacity:0.8, marginBottom:"7px", textTransform:"uppercase" }}>{label}</div>
        <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"14.5px", lineHeight:"1.72", color:"#c0b8a8", fontStyle:"italic" }} dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MATHEMATICIAN CARD
// ─────────────────────────────────────────────────────────────
function MathematicianCard({ name, years, content }) {
  return (
    <div style={{ margin:"20px 0", padding:"22px 24px", background:"linear-gradient(160deg,#110a04,#0e0804)", border:"1px solid #c8975a22", borderLeft:"3px solid #c8975a66", borderRadius:"3px" }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"9px", letterSpacing:"0.28em", color:"#c8975a66", marginBottom:"12px", textTransform:"uppercase" }}>✦ the human behind the mathematics</div>
      <div style={{ marginBottom:"14px" }}>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", fontWeight:400, color:"#e8c097", letterSpacing:"0.06em", lineHeight:1.2 }}>{name}</div>
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", color:"#7a6040", letterSpacing:"0.12em", marginTop:"3px" }}>{years}</div>
      </div>
      <div style={{ width:"32px", height:"1px", background:"linear-gradient(to right,#c8975a44,transparent)", marginBottom:"14px" }} />
      <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"15.5px", lineHeight:"1.85", color:"#c8b898", fontStyle:"italic" }} dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ELEMENT COMPONENTS
// ─────────────────────────────────────────────────────────────
function ElementNominationCard({ nomination, onSave }) {
  const [saved, setSaved] = useState(false);
  const [userDesc, setUserDesc] = useState("");
  const [editing, setEditing] = useState(false);
  const handleSave = () => { if (saved) return; onSave(userDesc || nomination); setSaved(true); setEditing(false); };
  return (
    <div style={{ margin:"16px 0", padding:"18px 20px", background:"linear-gradient(160deg,#080f0c,#060e0a)", border:"1px solid #a8e8c022", borderLeft:"3px solid #a8e8c066", borderRadius:"3px" }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"9px", letterSpacing:"0.28em", color:"#a8e8c066", marginBottom:"10px", textTransform:"uppercase" }}>✦ worth keeping</div>
      <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"14.5px", lineHeight:"1.75", color:"#c0d8c8", fontStyle:"italic", marginBottom:"14px" }}>{nomination}</div>
      {!saved ? (
        <>
          {editing ? (
            <>
              <input autoFocus value={userDesc} onChange={e => setUserDesc(e.target.value)} placeholder="Describe this in your own words..." style={{ width:"100%", background:"#ffffff04", border:"1px solid #a8e8c014", borderRadius:"2px", padding:"8px 12px", color:"#ddd5c0", fontFamily:"'EB Garamond',serif", fontSize:"14px", outline:"none", marginBottom:"10px" }} />
              <div style={{ display:"flex", gap:"8px" }}>
                <button onClick={handleSave} style={{ background:"transparent", border:"1px solid #a8e8c033", color:"#a8e8c0", padding:"6px 18px", fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:"0.12em", cursor:"pointer" }}>SAVE</button>
                <button onClick={() => setEditing(false)} style={{ background:"none", border:"1px solid #ffffff08", color:"#3a3020", padding:"6px 12px", fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", cursor:"pointer" }}>cancel</button>
              </div>
            </>
          ) : (
            <div style={{ display:"flex", gap:"8px" }}>
              <button onClick={() => setEditing(true)} style={{ background:"transparent", border:"1px solid #a8e8c033", color:"#a8e8c0", padding:"6px 18px", fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:"0.12em", cursor:"pointer" }}>ADD TO ELEMENTS</button>
              <button onClick={handleSave} style={{ background:"none", border:"1px solid #ffffff08", color:"#3a3020", padding:"6px 12px", fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", cursor:"pointer" }}>save as is</button>
            </div>
          )}
        </>
      ) : (
        <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:"0.1em", color:"#a8e8c066" }}>✦ added to your elements</div>
      )}
    </div>
  );
}

function SelfNominateButton({ onSave }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const handleSave = () => { if (!text.trim()) return; onSave(text.trim()); setSaved(true); setText(""); setTimeout(() => { setSaved(false); setOpen(false); }, 1800); };
  return (
    <div>
      {!open ? (
        <button onClick={() => setOpen(true)} style={{ background:"transparent", border:"1px solid #a8e8c022", color:"#a8e8c077", padding:"7px 16px", fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:"0.14em", cursor:"pointer", width:"100%" }}>+ mark this moment as an element</button>
      ) : (
        <div style={{ display:"flex", gap:"8px", alignItems:"flex-start" }}>
          <input autoFocus value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleSave(); }} placeholder="Describe what you found or felt..." style={{ flex:1, background:"#ffffff04", border:"1px solid #a8e8c014", borderRadius:"2px", padding:"8px 12px", color:"#ddd5c0", fontFamily:"'EB Garamond',serif", fontSize:"14px", outline:"none" }} />
          <button onClick={handleSave} style={{ background:"transparent", border:"1px solid #a8e8c033", color:"#a8e8c0", padding:"8px 14px", fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:"0.1em", cursor:"pointer", flexShrink:0 }}>{saved ? "✦ saved" : "save"}</button>
          <button onClick={() => setOpen(false)} style={{ background:"none", border:"1px solid #ffffff08", color:"#3a3020", padding:"8px 10px", fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", cursor:"pointer", flexShrink:0 }}>×</button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FLOATING SYMBOLS
// ─────────────────────────────────────────────────────────────
function FloatingSymbols() {
  const [syms] = useState(() => Array.from({ length: 20 }, (_, i) => ({
    id: i, symbol: MATH_SYMBOLS[i % MATH_SYMBOLS.length],
    x: Math.random() * 100, y: Math.random() * 100,
    size: 10 + Math.random() * 20, dur: 22 + Math.random() * 28,
    delay: Math.random() * -40, op: 0.025 + Math.random() * 0.05,
  })));
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
      {syms.map(s => (
        <div key={s.id} style={{ position:"absolute", left:`${s.x}%`, top:`${s.y}%`, fontSize:`${s.size}px`, opacity:s.op, color:"#e8c97a", fontFamily:"Georgia,serif", animation:`floatSym ${s.dur}s ${s.delay}s infinite ease-in-out alternate`, userSelect:"none" }}>{s.symbol}</div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AUTH SCREEN
// ─────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [authMode, setAuthMode] = useState("login"); // login | signup | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const clearMessages = () => { setError(""); setSuccess(""); };

  const handleGoogleSignIn = async () => {
    setLoading(true); clearMessages();
    try {
      const result = await signInWithPopup(auth, googleProvider);
      onAuth(result.user);
    } catch (e) {
      setError(e.code === "auth/popup-closed-by-user" ? "Sign-in cancelled." : "Google sign-in failed. Please try again.");
    } finally { setLoading(false); }
  };

  const handleEmailAuth = async () => {
    if (!email.trim() || !password.trim()) { setError("Please fill in all fields."); return; }
    if (authMode === "signup" && !name.trim()) { setError("Please enter your name."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true); clearMessages();
    try {
      if (authMode === "signup") {
        const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
        await updateProfile(result.user, { displayName: name.trim() });
        onAuth(result.user, true);
      } else {
        const result = await signInWithEmailAndPassword(auth, email.trim(), password);
        onAuth(result.user, false);
      }
    } catch (e) {
      const msgs = {
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/email-already-in-use": "An account with this email already exists.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/invalid-credential": "Incorrect email or password.",
      };
      setError(msgs[e.code] || "Something went wrong. Please try again.");
    } finally { setLoading(false); }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) { setError("Enter your email address above first."); return; }
    setLoading(true); clearMessages();
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccess("Reset link sent. Check your inbox.");
    } catch (e) {
      setError("Could not send reset email. Check the address and try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"#0a0906", zIndex:50, padding:"20px" }}>
      <FloatingSymbols />
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:"420px", animation:"introFadeIn 0.8s ease forwards" }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"40px" }}>
          <div style={{ fontSize:"40px", color:"#e8c97a", opacity:0.7, marginBottom:"16px", animation:"shimmer 3.5s infinite", fontFamily:"serif" }}>∞</div>
          <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"42px", fontWeight:300, letterSpacing:"0.2em", color:"#f0e4bc", lineHeight:1, marginBottom:"6px" }}>MATHESIS</h1>
          <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:"0.32em", color:"#5a4a2a", fontWeight:300 }}>
            {authMode === "signup" ? "BEGIN YOUR JOURNEY" : authMode === "forgot" ? "RECOVER ACCESS" : "CONTINUE YOUR JOURNEY"}
          </p>
        </div>

        {/* Card */}
        <div style={{ background:"linear-gradient(160deg,#0f0d0a,#141208)", border:"1px solid #e8c97a14", borderRadius:"4px", padding:"32px 32px 28px", boxShadow:"0 0 80px #000a" }}>

          {/* Google SSO */}
          {authMode !== "forgot" && (
            <>
              <button onClick={handleGoogleSignIn} disabled={loading} style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:"12px", background:"#ffffff08", border:"1px solid #ffffff14", borderRadius:"3px", padding:"13px 20px", color:"#ddd5c0", fontFamily:"'Cormorant Garamond',serif", fontSize:"14px", letterSpacing:"0.1em", cursor:loading ? "not-allowed" : "pointer", opacity:loading ? 0.5 : 1, transition:"all 0.3s", marginBottom:"24px" }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background="#ffffff12"; e.currentTarget.style.borderColor="#ffffff22"; }}}
                onMouseLeave={e => { e.currentTarget.style.background="#ffffff08"; e.currentTarget.style.borderColor="#ffffff14"; }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 002.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                  <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01a4.8 4.8 0 01-7.18-2.54H1.83v2.07A8 8 0 008.98 17z"/>
                  <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 010-3.04V5.41H1.83a8 8 0 000 7.18l2.67-2.07z"/>
                  <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 001.83 5.4L4.5 7.49a4.77 4.77 0 014.48-3.31z"/>
                </svg>
                Continue with Google
              </button>

              <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"24px" }}>
                <div style={{ flex:1, height:"1px", background:"#ffffff08" }} />
                <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", color:"#3a3020", letterSpacing:"0.12em" }}>or</span>
                <div style={{ flex:1, height:"1px", background:"#ffffff08" }} />
              </div>
            </>
          )}

          {/* Name field — signup only */}
          {authMode === "signup" && (
            <div style={{ marginBottom:"16px" }}>
              <label style={{ display:"block", fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:"0.16em", color:"#6a5a3a", marginBottom:"8px" }}>YOUR NAME</label>
              <input value={name} onChange={e => { setName(e.target.value); clearMessages(); }} placeholder="How should Mathesis know you?" type="text"
                style={{ width:"100%", background:"#ffffff04", border:"1px solid #e8c97a14", borderRadius:"2px", padding:"11px 14px", color:"#f0e4bc", fontFamily:"'EB Garamond',serif", fontSize:"15px", outline:"none", transition:"border 0.2s" }}
                onFocus={e => e.target.style.borderColor="#e8c97a33"}
                onBlur={e => e.target.style.borderColor="#e8c97a14"}
              />
            </div>
          )}

          {/* Email */}
          <div style={{ marginBottom:"16px" }}>
            <label style={{ display:"block", fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:"0.16em", color:"#6a5a3a", marginBottom:"8px" }}>EMAIL</label>
            <input value={email} onChange={e => { setEmail(e.target.value); clearMessages(); }} placeholder="your@email.com" type="email"
              style={{ width:"100%", background:"#ffffff04", border:"1px solid #e8c97a14", borderRadius:"2px", padding:"11px 14px", color:"#f0e4bc", fontFamily:"'EB Garamond',serif", fontSize:"15px", outline:"none", transition:"border 0.2s" }}
              onFocus={e => e.target.style.borderColor="#e8c97a33"}
              onBlur={e => e.target.style.borderColor="#e8c97a14"}
              onKeyDown={e => { if (e.key === "Enter") handleEmailAuth(); }}
            />
          </div>

          {/* Password */}
          {authMode !== "forgot" && (
            <div style={{ marginBottom:"8px" }}>
              <label style={{ display:"block", fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:"0.16em", color:"#6a5a3a", marginBottom:"8px" }}>PASSWORD</label>
              <div style={{ position:"relative" }}>
                <input value={password} onChange={e => { setPassword(e.target.value); clearMessages(); }} placeholder={authMode === "signup" ? "At least 6 characters" : "Your password"} type={showPass ? "text" : "password"}
                  style={{ width:"100%", background:"#ffffff04", border:"1px solid #e8c97a14", borderRadius:"2px", padding:"11px 44px 11px 14px", color:"#f0e4bc", fontFamily:"'EB Garamond',serif", fontSize:"15px", outline:"none", transition:"border 0.2s" }}
                  onFocus={e => e.target.style.borderColor="#e8c97a33"}
                  onBlur={e => e.target.style.borderColor="#e8c97a14"}
                  onKeyDown={e => { if (e.key === "Enter") handleEmailAuth(); }}
                />
                <button onClick={() => setShowPass(!showPass)} style={{ position:"absolute", right:"12px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"#4a4030", cursor:"pointer", fontSize:"12px", fontFamily:"'Cormorant Garamond',serif", letterSpacing:"0.08em" }}>
                  {showPass ? "hide" : "show"}
                </button>
              </div>
            </div>
          )}

          {/* Forgot password link */}
          {authMode === "login" && (
            <div style={{ textAlign:"right", marginBottom:"24px" }}>
              <button onClick={() => { setAuthMode("forgot"); clearMessages(); }} style={{ background:"none", border:"none", color:"#5a4a2a", fontFamily:"'Cormorant Garamond',serif", fontSize:"12px", letterSpacing:"0.1em", cursor:"pointer" }}>
                Forgot password?
              </button>
            </div>
          )}

          {authMode !== "login" && <div style={{ marginBottom:"24px" }} />}

          {/* Error / Success */}
          {error && (
            <div style={{ marginBottom:"16px", padding:"10px 14px", background:"#e8474714", border:"1px solid #e8474733", borderRadius:"2px", fontFamily:"'EB Garamond',serif", fontSize:"13px", color:"#e87a7a", lineHeight:1.5 }}>{error}</div>
          )}
          {success && (
            <div style={{ marginBottom:"16px", padding:"10px 14px", background:"#a8e8c014", border:"1px solid #a8e8c033", borderRadius:"2px", fontFamily:"'EB Garamond',serif", fontSize:"13px", color:"#a8e8c0", lineHeight:1.5 }}>{success}</div>
          )}

          {/* Primary action */}
          <button onClick={authMode === "forgot" ? handleForgotPassword : handleEmailAuth} disabled={loading}
            style={{ width:"100%", background:"transparent", border:"1px solid #e8c97a3a", color:"#e8c97a", padding:"13px 20px", fontFamily:"'Cormorant Garamond',serif", fontSize:"15px", fontWeight:300, letterSpacing:"0.2em", cursor:loading ? "not-allowed" : "pointer", opacity:loading ? 0.5 : 1, transition:"all 0.3s", marginBottom:"20px" }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.background="#e8c97a0e"; e.currentTarget.style.borderColor="#e8c97a77"; }}}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="#e8c97a3a"; }}
          >
            {loading ? "..." : authMode === "signup" ? "CREATE ACCOUNT" : authMode === "forgot" ? "SEND RESET LINK" : "SIGN IN"}
          </button>

          {/* Mode switch */}
          <div style={{ textAlign:"center" }}>
            {authMode === "login" && (
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"13px", color:"#4a4030", letterSpacing:"0.06em" }}>
                New to Mathesis?{" "}
                <button onClick={() => { setAuthMode("signup"); clearMessages(); }} style={{ background:"none", border:"none", color:"#8a7a5a", fontFamily:"'Cormorant Garamond',serif", fontSize:"13px", cursor:"pointer", letterSpacing:"0.06em", textDecoration:"underline" }}>Create an account</button>
              </p>
            )}
            {authMode === "signup" && (
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"13px", color:"#4a4030", letterSpacing:"0.06em" }}>
                Already have an account?{" "}
                <button onClick={() => { setAuthMode("login"); clearMessages(); }} style={{ background:"none", border:"none", color:"#8a7a5a", fontFamily:"'Cormorant Garamond',serif", fontSize:"13px", cursor:"pointer", letterSpacing:"0.06em", textDecoration:"underline" }}>Sign in</button>
              </p>
            )}
            {authMode === "forgot" && (
              <button onClick={() => { setAuthMode("login"); clearMessages(); }} style={{ background:"none", border:"none", color:"#8a7a5a", fontFamily:"'Cormorant Garamond',serif", fontSize:"13px", cursor:"pointer", letterSpacing:"0.1em" }}>← Back to sign in</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PROFILE FORM — three questions, new users only
// ─────────────────────────────────────────────────────────────
function ProfileForm({ userName, onComplete }) {
  const [grade, setGrade] = useState("");
  const [relationship, setRelationship] = useState("");
  const [purpose, setPurpose] = useState("");

  const grades = ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Not in school"];
  const relationships = [
    { value:"curious but confused", label:"Curious but confused" },
    { value:"can do it but unexcited", label:"Can do it but not excited by it" },
    { value:"lost the thread", label:"Lost the thread somewhere" },
    { value:"genuinely enjoy it", label:"Genuinely enjoy it" },
    { value:"stressful", label:"It stresses me out" },
  ];
  const purposes = [
    { value:"understand not just pass", label:"Understand, not just pass" },
    { value:"specific confusion", label:"I have a specific confusion" },
    { value:"beyond school", label:"Explore beyond what school covers" },
    { value:"exam prep", label:"Prepare for exams" },
    { value:"just exploring", label:"Just exploring" },
  ];

  const canProceed = grade && relationship && purpose;

  return (
    <div style={{ position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center", background:"#0a0906", zIndex:50, padding:"20px" }}>
      <FloatingSymbols />
      <div style={{ position:"relative", zIndex:1, width:"100%", maxWidth:"480px", animation:"introFadeIn 0.8s ease forwards" }}>
        <div style={{ textAlign:"center", marginBottom:"36px" }}>
          <div style={{ fontSize:"32px", color:"#e8c97a", opacity:0.7, marginBottom:"12px", fontFamily:"serif" }}>∞</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", fontWeight:300, letterSpacing:"0.14em", color:"#f0e4bc", marginBottom:"8px" }}>
            {userName ? `Welcome, ${userName.split(" ")[0]}.` : "Welcome."}
          </h2>
          <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"16px", color:"#6a5a3a", fontStyle:"italic", lineHeight:1.6 }}>
            Three quick questions — so Mathesis can find the right door for you.
          </p>
        </div>

        <div style={{ background:"linear-gradient(160deg,#0f0d0a,#141208)", border:"1px solid #e8c97a14", borderRadius:"4px", padding:"32px", boxShadow:"0 0 80px #000a" }}>

          {/* Q1 */}
          <div style={{ marginBottom:"28px" }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"16px", letterSpacing:"0.06em", color:"#c8b87a", marginBottom:"14px" }}>What class are you in?</p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
              {grades.map(g => (
                <button key={g} onClick={() => setGrade(g)}
                  style={{ padding:"8px 16px", background:grade === g ? "#e8c97a18" : "transparent", border:`1px solid ${grade === g ? "#e8c97a44" : "#ffffff0e"}`, borderRadius:"20px", color:grade === g ? "#e8c97a" : "#6a5a3a", fontFamily:"'Cormorant Garamond',serif", fontSize:"13px", letterSpacing:"0.08em", cursor:"pointer", transition:"all 0.2s" }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Q2 */}
          <div style={{ marginBottom:"28px" }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"16px", letterSpacing:"0.06em", color:"#c8b87a", marginBottom:"14px" }}>Your relationship with mathematics?</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {relationships.map(r => (
                <button key={r.value} onClick={() => setRelationship(r.value)}
                  style={{ padding:"11px 16px", background:relationship === r.value ? "#e8c97a12" : "transparent", border:`1px solid ${relationship === r.value ? "#e8c97a33" : "#ffffff0a"}`, borderRadius:"2px", color:relationship === r.value ? "#ddd5c0" : "#6a5a3a", fontFamily:"'EB Garamond',serif", fontSize:"15px", cursor:"pointer", textAlign:"left", transition:"all 0.2s", display:"flex", alignItems:"center", gap:"10px" }}>
                  <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:relationship === r.value ? "#e8c97a" : "#3a3020", flexShrink:0, transition:"all 0.2s" }} />
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Q3 */}
          <div style={{ marginBottom:"32px" }}>
            <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"16px", letterSpacing:"0.06em", color:"#c8b87a", marginBottom:"14px" }}>What brings you today?</p>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {purposes.map(p => (
                <button key={p.value} onClick={() => setPurpose(p.value)}
                  style={{ padding:"11px 16px", background:purpose === p.value ? "#e8c97a12" : "transparent", border:`1px solid ${purpose === p.value ? "#e8c97a33" : "#ffffff0a"}`, borderRadius:"2px", color:purpose === p.value ? "#ddd5c0" : "#6a5a3a", fontFamily:"'EB Garamond',serif", fontSize:"15px", cursor:"pointer", textAlign:"left", transition:"all 0.2s", display:"flex", alignItems:"center", gap:"10px" }}>
                  <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:purpose === p.value ? "#e8c97a" : "#3a3020", flexShrink:0, transition:"all 0.2s" }} />
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => canProceed && onComplete({ grade, relationship, purpose })} disabled={!canProceed}
            style={{ width:"100%", background:"transparent", border:`1px solid ${canProceed ? "#e8c97a3a" : "#ffffff0a"}`, color:canProceed ? "#e8c97a" : "#3a3020", padding:"14px 20px", fontFamily:"'Cormorant Garamond',serif", fontSize:"15px", fontWeight:300, letterSpacing:"0.2em", cursor:canProceed ? "pointer" : "not-allowed", transition:"all 0.3s" }}
            onMouseEnter={e => { if (canProceed) { e.currentTarget.style.background="#e8c97a0e"; e.currentTarget.style.borderColor="#e8c97a77"; }}}
            onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor=canProceed ? "#e8c97a3a" : "#ffffff0a"; }}
          >
            BEGIN THE JOURNEY
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DID YOU KNOW CARD — Classmate notebook style
// ─────────────────────────────────────────────────────────────
function DidYouKnowCard({ opener, onReply, onSelectOpener, exchangeCount }) {
  const data = OPENERS[opener];
  const altOpeners = OPENER_LIST.filter(id => id !== opener);
  const showReplies = exchangeCount < 4;

  return (
    <div style={{ marginBottom:"32px", animation:"fadeSlideIn 0.6s ease" }}>
      {/* Bridge sentence */}
      <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"15px", color:"#6a5a3a", fontStyle:"italic", marginBottom:"20px", lineHeight:1.7 }}>
        {data.bridge}
      </p>

      {/* Did You Know card — Classmate notebook aesthetic */}
      <div style={{ background:"linear-gradient(160deg,#faf6e8,#f5f0d8)", border:"1px solid #d4c890", borderRadius:"2px", padding:"28px 28px 24px", position:"relative", boxShadow:"0 4px 24px #00000044, inset 0 1px 0 #ffffff80", marginBottom:"20px" }}>
        {/* Notebook lines */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"repeating-linear-gradient(transparent, transparent 27px, #b8c8d820 27px, #b8c8d820 28px)", borderRadius:"2px", opacity:0.4, pointerEvents:"none" }} />
        {/* Red margin line */}
        <div style={{ position:"absolute", left:"44px", top:0, bottom:0, width:"1px", background:"#e8706030", pointerEvents:"none" }} />

        <div style={{ position:"relative", paddingLeft:"20px" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"10px", letterSpacing:"0.28em", color:"#8a7a40", marginBottom:"12px", textTransform:"uppercase" }}>✦ did you know</div>
          <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"17px", lineHeight:"1.85", color:"#2a2010", whiteSpace:"pre-line" }}>{data.card}</p>
        </div>
      </div>

      {/* Closing sentence */}
      <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"15px", color:"#8a7a5a", fontStyle:"italic", marginBottom:"20px", lineHeight:1.7 }}>
        {data.closing}
      </p>

      {/* Pre-written reply buttons */}
      {showReplies && (
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"24px" }}>
          {data.replies.map((reply, i) => (
            <button key={i} onClick={() => onReply(reply)}
              style={{ padding:"9px 18px", background:"transparent", border:"1px solid #e8c97a22", borderRadius:"20px", color:"#9a8a5a", fontFamily:"'EB Garamond',serif", fontSize:"14px", cursor:"pointer", transition:"all 0.25s", lineHeight:1.3 }}
              onMouseEnter={e => { e.currentTarget.style.background="#e8c97a0e"; e.currentTarget.style.borderColor="#e8c97a44"; e.currentTarget.style.color="#ddd5c0"; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.borderColor="#e8c97a22"; e.currentTarget.style.color="#9a8a5a"; }}
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Alternative openers */}
      <div style={{ borderTop:"1px solid #ffffff06", paddingTop:"20px" }}>
        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:"0.18em", color:"#3a3020", marginBottom:"12px" }}>OR EXPLORE ANOTHER DOOR</p>
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap" }}>
          {altOpeners.map(id => (
            <button key={id} onClick={() => onSelectOpener(id)}
              style={{ padding:"10px 18px", background:"#ffffff04", border:"1px solid #ffffff0a", borderRadius:"2px", color:"#5a4a2a", fontFamily:"'EB Garamond',serif", fontSize:"13px", cursor:"pointer", transition:"all 0.25s", textAlign:"left" }}
              onMouseEnter={e => { e.currentTarget.style.background="#ffffff09"; e.currentTarget.style.borderColor="#e8c97a1a"; e.currentTarget.style.color="#9a8a5a"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#ffffff04"; e.currentTarget.style.borderColor="#ffffff0a"; e.currentTarget.style.color="#5a4a2a"; }}
            >
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"10px", letterSpacing:"0.16em", color:"#4a3a1a", marginBottom:"3px" }}>✦</div>
              {OPENERS[id].title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CONSTELLATION MAP
// ─────────────────────────────────────────────────────────────
function ConstellationMap({ discovered, onClose }) {
  const [zoomedRealm, setZoomedRealm] = useState(null);
  const [hovered, setHovered] = useState(null);
  const W = 420, H = 380;
  const discoveredRealms = REALMS.filter(r => discovered.has(r.id));
  const totalDiscovered = [...discovered].filter(id => REALM_MAP[id] || CHILD_MAP[id]).length;
  const realmPos = r => ({ cx: (r.x / 100) * W, cy: (r.y / 100) * H });
  const currentRealm = zoomedRealm ? REALM_MAP[zoomedRealm] : null;

  return (
    <div style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(4,3,2,0.93)", animation:"fadeIn 0.25s ease" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ background:"linear-gradient(160deg,#0a0806,#0e0c09)", border:"1px solid #e8c97a1a", borderRadius:"4px", padding:"24px 24px 20px", maxWidth:"520px", width:"94vw", boxShadow:"0 0 100px #000e" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"14px" }}>
          <div>
            {zoomedRealm ? (
              <>
                <button onClick={() => { setZoomedRealm(null); setHovered(null); }} style={{ background:"none", border:"none", color:"#e8c97a", cursor:"pointer", fontFamily:"'Cormorant Garamond',serif", fontSize:"12px", letterSpacing:"0.12em", padding:0, marginBottom:"4px" }}>← all realms</button>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", letterSpacing:"0.15em", color:"#c8b87a", fontWeight:300 }}>{currentRealm?.label?.toUpperCase()}</div>
                <div style={{ fontSize:"11px", color:"#4a4030", letterSpacing:"0.1em", fontFamily:"'Cormorant Garamond',serif", marginTop:"2px" }}>{(currentRealm?.children || []).filter(c => discovered.has(c.id)).length} of {currentRealm?.children?.length} concepts discovered</div>
              </>
            ) : (
              <>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", letterSpacing:"0.15em", color:"#c8b87a", fontWeight:300 }}>YOUR CONSTELLATION</div>
                <div style={{ fontSize:"11px", color:"#4a4030", letterSpacing:"0.1em", fontFamily:"'Cormorant Garamond',serif", marginTop:"2px" }}>{totalDiscovered} of {TOTAL_NODES} ideas discovered · {discoveredRealms.length} of {REALMS.length} realms entered</div>
              </>
            )}
          </div>
          <button onClick={onClose} style={{ background:"none", border:"1px solid #ffffff0c", color:"#4a4030", cursor:"pointer", padding:"5px 11px", fontSize:"11px", letterSpacing:"0.1em", fontFamily:"'Cormorant Garamond',serif" }}>CLOSE</button>
        </div>
        <div style={{ height:"2px", background:"#ffffff06", borderRadius:"1px", marginBottom:"16px" }}>
          <div style={{ height:"100%", width:`${(totalDiscovered / TOTAL_NODES) * 100}%`, background:"linear-gradient(90deg,#e8c97a33,#e8c97a88)", borderRadius:"1px", transition:"width 0.6s ease" }}/>
        </div>
        {!zoomedRealm && (
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible", display:"block" }}>
            {CONSTELLATION_EDGES.map(([a, b], i) => {
              const ra = REALM_MAP[a], rb = REALM_MAP[b];
              if (!ra || !rb) return null;
              const pa = realmPos(ra), pb = realmPos(rb);
              const bothLit = discovered.has(a) && discovered.has(b);
              return <line key={i} x1={pa.cx} y1={pa.cy} x2={pb.cx} y2={pb.cy} stroke={bothLit ? "#e8c97a" : "#ffffff"} strokeOpacity={bothLit ? 0.18 : 0.03} strokeWidth={bothLit ? 0.8 : 0.4} />;
            })}
            {REALMS.map(r => {
              const { cx, cy } = realmPos(r);
              const lit = discovered.has(r.id);
              const hov = hovered === r.id;
              const childCount = (r.children || []).filter(c => discovered.has(c.id)).length;
              return (
                <g key={r.id} onMouseEnter={() => setHovered(r.id)} onMouseLeave={() => setHovered(null)} onClick={() => lit && setZoomedRealm(r.id)} style={{ cursor: lit ? "pointer" : "default" }}>
                  {lit && <circle cx={cx} cy={cy} r={hov ? 18 : 13} fill="#e8c97a" fillOpacity={0.06} />}
                  {childCount > 0 && <circle cx={cx} cy={cy} r={9} fill="none" stroke="#e8c97a" strokeOpacity={0.3} strokeWidth={0.6} strokeDasharray="2 2" />}
                  <circle cx={cx} cy={cy} r={lit ? (hov ? 5 : 3.8) : 2} fill={lit ? "#e8c97a" : "#1e1808"} stroke={lit ? "none" : "#3a2a10"} strokeWidth={0.5} style={{ transition:"all 0.3s" }} />
                  {lit && <text x={cx} y={cy - 12} textAnchor="middle" fontSize={hov ? "9" : "7.5"} fill={hov ? "#e8c97a" : "#a09070"} fontFamily="'Cormorant Garamond',serif" letterSpacing="0.04em" style={{ transition:"all 0.3s" }}>{r.label}</text>}
                  {childCount > 0 && hov && <text x={cx} y={cy + 16} textAnchor="middle" fontSize="7" fill="#e8c97a88" fontFamily="'Cormorant Garamond',serif">{childCount} inside</text>}
                </g>
              );
            })}
          </svg>
        )}
        {zoomedRealm && currentRealm && (() => {
          const discoveredChildren = (currentRealm.children || []).filter(c => discovered.has(c.id));
          const parentCx = W / 2, parentCy = H / 2 - 20, radius = 110;
          return (
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible", display:"block" }}>
              {discoveredChildren.map((child, i) => {
                const angle = (i / discoveredChildren.length) * 2 * Math.PI - Math.PI / 2;
                const cx = parentCx + radius * Math.cos(angle), cy = parentCy + radius * Math.sin(angle);
                return <line key={child.id} x1={parentCx} y1={parentCy} x2={cx} y2={cy} stroke="#e8c97a" strokeOpacity={0.15} strokeWidth={0.7} />;
              })}
              <circle cx={parentCx} cy={parentCy} r={22} fill="#e8c97a" fillOpacity={0.05} />
              <circle cx={parentCx} cy={parentCy} r={7} fill="#e8c97a" fillOpacity={0.9} />
              <text x={parentCx} y={parentCy + 20} textAnchor="middle" fontSize="9" fill="#c8b87a" fontFamily="'Cormorant Garamond',serif" letterSpacing="0.06em">{currentRealm.label}</text>
              {discoveredChildren.map((child, i) => {
                const angle = (i / discoveredChildren.length) * 2 * Math.PI - Math.PI / 2;
                const cx = parentCx + radius * Math.cos(angle), cy = parentCy + radius * Math.sin(angle);
                const hov = hovered === child.id;
                return (
                  <g key={child.id} onMouseEnter={() => setHovered(child.id)} onMouseLeave={() => setHovered(null)}>
                    {hov && <circle cx={cx} cy={cy} r={14} fill="#e8c97a" fillOpacity={0.07} />}
                    <circle cx={cx} cy={cy} r={hov ? 4.5 : 3.2} fill="#e8c97a" fillOpacity={hov ? 0.95 : 0.7} style={{ transition:"all 0.3s" }} />
                    <text x={cx} y={cy - 10} textAnchor="middle" fontSize={hov ? "8.5" : "7.5"} fill={hov ? "#e8c97a" : "#9a8a60"} fontFamily="'Cormorant Garamond',serif" letterSpacing="0.03em" style={{ transition:"all 0.3s" }}>{child.label}</text>
                  </g>
                );
              })}
              {discoveredChildren.length === 0 && <text x={W/2} y={H - 30} textAnchor="middle" fontSize="9" fill="#4a4030" fontStyle="italic" fontFamily="'EB Garamond',serif">no concepts discovered here yet</text>}
            </svg>
          );
        })()}
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
  const handleSubmit = () => { if (!attempt.trim() || submitted) return; setSubmitted(true); onSubmit(attempt.trim()); };
  return (
    <div style={{ margin:"20px 0 28px", padding:"22px 24px", background:"linear-gradient(145deg,#171208,#111009)", border:"1px solid #e8c97a2a", borderRadius:"3px", animation:"fadeSlideIn 0.5s ease", position:"relative" }}>
      <button onClick={onDismiss} style={{ position:"absolute", top:"12px", right:"14px", background:"none", border:"none", color:"#3a2a10", cursor:"pointer", fontSize:"18px", lineHeight:1 }}>×</button>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:"0.28em", color:"#e8c97a77", marginBottom:"14px" }}>✦ CHALLENGE</div>
      <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"16.5px", lineHeight:"1.75", color:"#c8b87a", marginBottom:"20px", paddingRight:"16px" }}>{challenge}</div>
      <textarea value={attempt} onChange={e => setAttempt(e.target.value)} placeholder="Write your thinking here..." rows={4} disabled={submitted}
        style={{ width:"100%", background:"#ffffff04", border:"1px solid #e8c97a14", borderRadius:"2px", padding:"12px 14px", color:"#ddd5c0", fontFamily:"'EB Garamond',serif", fontSize:"15px", lineHeight:"1.65", resize:"vertical", outline:"none", caretColor:"#e8c97a", opacity:submitted ? 0.5 : 1 }} />
      <div style={{ marginTop:"14px", display:"flex", gap:"10px", alignItems:"center" }}>
        <button onClick={handleSubmit} disabled={!attempt.trim() || submitted}
          style={{ background:"transparent", border:"1px solid #e8c97a33", color:"#e8c97a", padding:"9px 24px", fontFamily:"'Cormorant Garamond',serif", fontSize:"13px", letterSpacing:"0.15em", cursor:!attempt.trim() || submitted ? "not-allowed" : "pointer", opacity:!attempt.trim() || submitted ? 0.35 : 1, transition:"all 0.3s" }}>
          {submitted ? "SUBMITTED" : "SUBMIT"}
        </button>
        <button onClick={onDismiss} style={{ background:"none", border:"1px solid #ffffff08", color:"#3a3020", padding:"9px 16px", fontFamily:"'Cormorant Garamond',serif", fontSize:"12px", letterSpacing:"0.1em", cursor:"pointer" }}>not now</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BRANCH CARD
// ─────────────────────────────────────────────────────────────
function BranchCard({ branch, onChoose }) {
  const [chosen, setChosen] = useState(null);
  const handle = (path, idx) => { if (chosen !== null) return; setChosen(idx); setTimeout(() => onChoose(path), 320); };
  return (
    <div style={{ margin:"20px 0 28px", animation:"fadeSlideIn 0.5s ease" }}>
      <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:"0.24em", color:"#8a7a5a", marginBottom:"16px" }}>✦ TWO PATHS LIE AHEAD</div>
      <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
        {[branch.a, branch.b].map((path, i) => (
          <button key={i} onClick={() => handle(path, i)}
            style={{ flex:"1 1 160px", padding:"18px 20px", background:chosen === i ? "linear-gradient(135deg,#e8c97a18,#e8c97a2a)" : chosen !== null ? "linear-gradient(135deg,#ffffff03,#ffffff06)" : "linear-gradient(135deg,#ffffff05,#ffffff09)", border:chosen === i ? "1px solid #e8c97a44" : "1px solid #ffffff0e", color:chosen === i ? "#e8c97a" : chosen !== null ? "#4a4030" : "#9a9080", fontFamily:"'EB Garamond',serif", fontSize:"14.5px", lineHeight:"1.55", cursor:chosen !== null ? "default" : "pointer", textAlign:"left", transition:"all 0.35s ease", borderRadius:"2px" }}>
            <div style={{ fontSize:"22px", marginBottom:"10px", opacity:chosen === i ? 0.9 : 0.4, transition:"all 0.3s" }}>{i === 0 ? "⟨" : "⟩"}</div>
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
    <div style={{ display:"flex", alignItems:"center", gap:"12px", padding:"14px 0" }}>
      <div style={{ display:"flex", gap:"5px" }}>
        {[0,1,2].map(i => <div key={i} style={{ width:"4.5px", height:"4.5px", borderRadius:"50%", background:"#e8c97a", animation:`pulse 1.2s ${i * 0.2}s infinite ease-in-out` }} />)}
      </div>
      <span style={{ color:"#5a4a2a", fontSize:"12px", fontStyle:"italic", letterSpacing:"0.08em" }}>{phrase}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────────────────────────
function MessageBubble({ msg, isNew, onSaveElement }) {
  const isUser = msg.role === "user";
  const isEval = typeof msg.content === "string" && msg.content.startsWith("✦ ");
  const segments = !isUser ? parseSegments(msg.content || "") : null;
  const hasSparks = segments && segments.some(s => s.type === "spark");

  return (
    <div style={{ display:"flex", justifyContent:isUser ? "flex-end" : "flex-start", marginBottom:"22px", animation:isNew ? "fadeSlideIn 0.45s ease forwards" : "none" }}>
      {!isUser && (
        <div style={{ width:"26px", height:"26px", borderRadius:"50%", background:isEval ? "linear-gradient(135deg,#c8b87a1a,#c8b87a30)" : "linear-gradient(135deg,#e8c97a14,#e8c97a28)", border:`1px solid ${isEval ? "#c8b87a33" : "#e8c97a2a"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:isEval ? "12px" : "14px", flexShrink:0, marginRight:"12px", marginTop:"4px", color:"#e8c97a" }}>
          {isEval ? "✦" : "∞"}
        </div>
      )}
      {isUser ? (
        <div style={{ maxWidth:"79%", padding:"12px 18px", borderRadius:"18px 18px 4px 18px", background:"linear-gradient(135deg,#e8c97a12,#e8c97a22)", border:"1px solid #e8c97a22", color:"#f0e4bc", fontSize:"15.5px", lineHeight:"1.8", letterSpacing:"0.01em", fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,serif", whiteSpace:"pre-wrap", wordBreak:"break-word" }} dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
      ) : (
        <div style={{ maxWidth:hasSparks ? "85%" : "79%", minWidth:"40%" }}>
          {segments.map((seg, i) => {
            if (seg.type === "spark") return <SparkCard key={i} sparkType={seg.sparkType} label={seg.label} content={seg.content} />;
            if (seg.type === "saveElement") return <ElementNominationCard key={i} nomination={seg.nomination} onSave={userDesc => onSaveElement && onSaveElement({ userDescription:userDesc, mathematicalNote:seg.nomination, timestamp:new Date().toISOString(), nominatedBy:"ai" })} />;
            if (seg.type === "mathematician") return <MathematicianCard key={i} name={seg.name} years={seg.years} content={seg.content} />;
            const trimmed = seg.content.trim();
            if (!trimmed) return null;
            return (
              <div key={i} style={{ padding:"16px 21px", borderRadius:i === 0 ? "4px 18px 18px 18px" : "4px", background:isEval ? "linear-gradient(145deg,#171208,#111009)" : "linear-gradient(135deg,#0f0d0a,#141208)", border:isEval ? "1px solid #c8b87a1a" : "1px solid #e8c97a0a", color:"#ddd5c0", fontSize:"15.5px", lineHeight:"1.8", letterSpacing:"0.01em", fontFamily:"'Palatino Linotype','Book Antiqua',Palatino,serif", whiteSpace:"pre-wrap", wordBreak:"break-word", marginBottom:i < segments.length - 1 ? "2px" : "0" }} dangerouslySetInnerHTML={{ __html: renderMarkdown(trimmed) }} />
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
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [profile, setProfile] = useState(null);
  const [activeOpener, setActiveOpener] = useState("infinity");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingPhrase, setThinkingPhrase] = useState("");
  const [newMsgIndex, setNewMsgIndex] = useState(-1);
  const [screen, setScreen] = useState("loading");
  const [showConstellation, setShowConstellation] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [mode, setMode] = useState(1); // 1=EXPLORE, 2=LEARN
  const modeRef = useRef(1);
  const [discovered, setDiscovered] = useState(new Set(["numbers"]));
  const [pendingChallenge, setPendingChallenge] = useState(null);
  const [pendingBranch, setPendingBranch] = useState(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [journeySummary, setJourneySummary] = useState("");
  const [elementsVersion, setElementsVersion] = useState(0);
  const [pingVisible, setPingVisible] = useState(false);
  const [exchangeCount, setExchangeCount] = useState(0);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const conversationRef = useRef([]);
  const journeyRef = useRef({ messages:[], discovered:["numbers"], summary:"", sessions:0, elements:[], profile:null });
  const profileRef = useRef(null);
  const activeOpenerRef = useRef("infinity");

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages, isThinking, pendingChallenge, pendingBranch]);

  // Firebase auth state listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setAuthUser(user);
        const saved = await loadJourney(user.uid);
        if (saved) {
          journeyRef.current = saved;
          profileRef.current = saved.profile || null;
          setProfile(saved.profile || null);
          setDiscovered(new Set(saved.discovered || ["numbers"]));
          setSessionCount(saved.sessions || 0);
          setJourneySummary(saved.summary || "");
          const msgs = (saved.messages || []).filter(m => !m.content?.startsWith("__sys__"));
          setMessages(msgs.slice(-40));
          conversationRef.current = saved.messages || [];
          if (saved.profile) {
            // Returning user with profile — go to intro
            setScreen("intro");
          } else {
            // User exists but never completed profile
            setIsNewUser(true);
            setScreen("profile");
          }
        } else {
          // Brand new user — show profile form
          setIsNewUser(true);
          setScreen("profile");
        }
      } else {
        setAuthUser(null);
        setScreen("auth");
      }
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Keep-alive ping
  useEffect(() => {
    const ping = () => fetch("https://mathesis-backend.onrender.com/api/chat", { method:"OPTIONS" }).catch(() => {});
    ping();
    const interval = setInterval(ping, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAuth = useCallback((user, newSignup = false) => {
    setAuthUser(user);
    if (newSignup) {
      setIsNewUser(true);
      setScreen("profile");
    }
    // onAuthStateChanged will fire and handle the rest
  }, []);

  const handleProfileComplete = useCallback(async (profileData) => {
    profileRef.current = profileData;
    setProfile(profileData);
    journeyRef.current.profile = profileData;
    if (authUser) await saveJourney(authUser.uid, journeyRef.current);
    setScreen("intro");
  }, [authUser]);

  const sanitizeConv = useCallback((conv) => {
    const filtered = conv.filter(m => !m.content?.startsWith("__sys__"));
    const merged = [];
    for (const msg of filtered) {
      if (merged.length > 0 && merged[merged.length - 1].role === msg.role) {
        merged[merged.length - 1] = { role:msg.role, content:merged[merged.length - 1].content + "\n\n" + msg.content };
      } else { merged.push({ role:msg.role, content:msg.content }); }
    }
    const startIdx = merged.findIndex(m => m.role === "user");
    const clean = startIdx >= 0 ? merged.slice(startIdx) : merged;
    return clean.slice(-30);
  }, []);

  const callClaude = useCallback(async (conv, systemOverride) => {
    const phrase = THINKING_PHRASES[Math.floor(Math.random() * THINKING_PHRASES.length)];
    setThinkingPhrase(phrase);
    setIsThinking(true);
    try {
      const sanitized = sanitizeConv(conv);
      const system = systemOverride || buildSystemPrompt(modeRef.current, profileRef.current, activeOpenerRef.current);
      const res = await fetch("https://mathesis-backend.onrender.com/api/chat", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ messages:sanitized, system }),
      });
      const data = await res.json();
      if (data.error) return "The cosmos paused for a moment. Let us try again.";
      return data.text || "...";
    } catch (e) {
      return "Something in the cosmos shifted. Let us try again.";
    } finally { setIsThinking(false); }
  }, [sanitizeConv]);

  const generateSummary = useCallback(async (conv) => {
    try {
      const excerpt = conv.slice(-14).map(m => `${m.role}: ${m.content?.slice(0, 200)}`).join("\n");
      const res = await fetch("https://mathesis-backend.onrender.com/api/chat", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ system:SUMMARY_SYSTEM, messages:[{ role:"user", content:excerpt }] }),
      });
      const data = await res.json();
      return data.text || "";
    } catch { return ""; }
  }, []);

  const discoverTopics = useCallback((text) => {
    const found = detectTopics(text);
    if (!found.size) return;
    setDiscovered(prev => {
      const next = new Set(prev);
      let changed = false;
      found.forEach(t => {
        if (!next.has(t)) {
          next.add(t); changed = true;
          const parentId = CHILD_MAP[t]?.parentId;
          if (parentId && !next.has(parentId)) next.add(parentId);
          setPingVisible(true);
          setTimeout(() => setPingVisible(false), 3500);
        }
      });
      if (changed) { journeyRef.current.discovered = [...next]; if (authUser) saveJourney(authUser.uid, journeyRef.current); }
      return changed ? next : prev;
    });
  }, [authUser]);

  const handleAIResponse = useCallback((raw) => {
    const { clean, branch, challenge } = parseAIResponse(raw);
    discoverTopics(clean);
    const aiMsg = { role:"assistant", content:clean };
    conversationRef.current = [...conversationRef.current, aiMsg];
    journeyRef.current.messages = conversationRef.current;
    setMessages(prev => { setNewMsgIndex(prev.length); return [...prev, aiMsg]; });
    if (branch) setTimeout(() => setPendingBranch(branch), 500);
    if (challenge) setTimeout(() => setPendingChallenge(challenge), branch ? 800 : 400);
    const aiTurns = conversationRef.current.filter(m => m.role === "assistant").length;
    if (aiTurns > 0 && aiTurns % 6 === 0) {
      generateSummary(conversationRef.current).then(s => {
        if (s) { journeyRef.current.summary = s; setJourneySummary(s); if (authUser) saveJourney(authUser.uid, journeyRef.current); }
      });
    }
    if (!journeyRef.current.elements) journeyRef.current.elements = [];
    if (authUser) saveJourney(authUser.uid, journeyRef.current);
  }, [discoverTopics, generateSummary, authUser]);

  const beginJourney = async () => {
    setScreen("journey");
    const newSession = sessionCount + 1;
    setSessionCount(newSession);
    journeyRef.current.sessions = newSession;
    if (authUser) saveJourney(authUser.uid, journeyRef.current);

    const hasHistory = conversationRef.current.filter(m => !m.content?.startsWith("__sys__")).length > 1;
    if (!hasHistory) {
      // New user — show Did You Know card, no AI call yet
      conversationRef.current = [];
      setMessages([]);
      setTimeout(() => inputRef.current?.focus(), 200);
      return;
    }

    // Returning user — AI welcome back
    const initText = `The user is returning for session ${newSession}. Their journey so far: "${journeySummary}". ${(journeyRef.current.elements || []).length > 0 ? `They have marked ${journeyRef.current.elements.length} element(s).` : ""} Welcome them back with the same character that opened the first session — specific, warm, direct. Reference something real from their journey. Then pick up from there. No preamble. No reset. Continue.`;
    const res = await fetch("https://mathesis-backend.onrender.com/api/chat", {
      method:"POST", headers:{ "Content-Type":"application/json" },
      body: JSON.stringify({ messages:[{ role:"user", content:initText }], system:buildSystemPrompt(modeRef.current, profileRef.current, activeOpenerRef.current), max_tokens:320 }),
    });
    const data = await res.json();
    const { clean } = parseAIResponse(data.text || "...");
    discoverTopics(clean);
    const aiMsg = { role:"assistant", content:clean };
    const sysRecord = { role:"user", content:`__sys__${initText}` };
    conversationRef.current = [...conversationRef.current, sysRecord, aiMsg];
    journeyRef.current.messages = conversationRef.current;
    setMessages(prev => { const next = [...prev, aiMsg]; setNewMsgIndex(next.length - 1); return next; });
    if (authUser) saveJourney(authUser.uid, journeyRef.current);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  const sendMessage = async (textOverride) => {
    const text = (textOverride || input).trim();
    if (!text || isThinking) return;
    setInput("");
    setPendingBranch(null);
    setExchangeCount(c => c + 1);
    discoverTopics(text);
    const userMsg = { role:"user", content:text };
    conversationRef.current = [...conversationRef.current, userMsg];
    journeyRef.current.messages = conversationRef.current;
    setMessages(prev => { setNewMsgIndex(prev.length); return [...prev, userMsg]; });
    const raw = await callClaude(conversationRef.current);
    handleAIResponse(raw);
  };

  const chooseBranch = (path) => { setPendingBranch(null); setTimeout(() => sendMessage(`I want to explore: ${path}`), 150); };

  const submitChallenge = async (attempt) => {
    const challengeText = pendingChallenge;
    setPendingChallenge(null);
    const displayMsg = { role:"user", content:`My attempt: ${attempt}` };
    conversationRef.current = [...conversationRef.current, displayMsg];
    journeyRef.current.messages = conversationRef.current;
    setMessages(prev => { setNewMsgIndex(prev.length); return [...prev, displayMsg]; });
    const evalConv = [{ role:"user", content:`Challenge: "${challengeText}"\n\nMy attempt: "${attempt}"` }];
    const raw = await callClaude(evalConv, EVAL_SYSTEM);
    const evalText = raw.startsWith("✦ ") ? raw : "✦ " + raw;
    discoverTopics(evalText);
    const aiMsg = { role:"assistant", content:evalText };
    conversationRef.current = [...conversationRef.current, aiMsg];
    journeyRef.current.messages = conversationRef.current;
    setMessages(prev => { setNewMsgIndex(prev.length); return [...prev, aiMsg]; });
    if (authUser) saveJourney(authUser.uid, journeyRef.current);
  };

  const handleSelectOpener = (openerId) => {
    setActiveOpener(openerId);
    activeOpenerRef.current = openerId;
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setAuthUser(null);
    setScreen("auth");
    setMessages([]);
    conversationRef.current = [];
    journeyRef.current = { messages:[], discovered:["numbers"], summary:"", sessions:0, elements:[] };
    setDiscovered(new Set(["numbers"]));
    setSessionCount(0);
    setProfile(null);
    profileRef.current = null;
  };

  useEffect(() => { modeRef.current = mode; }, [mode]);
  useEffect(() => { activeOpenerRef.current = activeOpener; }, [activeOpener]);

  const isReturning = sessionCount > 0 && conversationRef.current.filter(m => !m.content?.startsWith("__sys__")).length > 1;

  // ── RENDER ──────────────────────────────────────────────────
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
        .begin-btn{background:transparent;border:1px solid #e8c97a3a;color:#e8c97a;padding:14px 48px;font-family:'Cormorant Garamond',serif;font-size:17px;font-weight:300;letter-spacing:0.22em;cursor:pointer;transition:all 0.45s ease;animation:glowPulse 3.5s infinite;}
        .begin-btn:hover{background:#e8c97a0e;border-color:#e8c97a77;letter-spacing:0.28em;box-shadow:0 0 44px #e8c97a22;}
        .send-btn{background:transparent;border:1px solid #e8c97a2a;color:#e8c97a;width:42px;height:42px;border-radius:50%;cursor:pointer;font-size:19px;display:flex;align-items:center;justify-content:center;transition:all 0.3s;flex-shrink:0;}
        .send-btn:hover:not(:disabled){background:#e8c97a12;border-color:#e8c97a66;transform:scale(1.06);}
        .send-btn:disabled{opacity:0.22;cursor:not-allowed;}
        .icon-btn{background:none;border:1px solid #ffffff0a;color:#7a6a4a;cursor:pointer;padding:6px 13px;font-family:'Cormorant Garamond',serif;font-size:11px;letter-spacing:0.11em;transition:all 0.3s;display:flex;align-items:center;gap:5px;}
        .icon-btn:hover{border-color:#e8c97a2a;color:#b8a86a;}
        textarea{background:transparent;border:none;outline:none;color:#f0e4bc;font-family:'EB Garamond',serif;font-size:16px;line-height:1.6;resize:none;width:100%;padding:10px 4px;caret-color:#e8c97a;}
        textarea::placeholder{color:#3a2a10;}
        input{box-sizing:border-box;}
      `}</style>

      <div style={{ minHeight:"100vh", background:"#0a0906", position:"relative" }}>
        <FloatingSymbols />
        <div style={{ position:"fixed", top:"35%", left:"50%", transform:"translate(-50%,-50%)", width:"700px", height:"700px", background:"radial-gradient(circle,#e8c97a04 0%,transparent 68%)", pointerEvents:"none", zIndex:0 }} />

        {/* ══ LOADING ══ */}
        {(screen === "loading" || authLoading) && (
          <div style={{ position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <div style={{ fontSize:"36px", color:"#e8c97a", opacity:0.3, animation:"shimmer 2s infinite", fontFamily:"serif" }}>∞</div>
          </div>
        )}

        {/* ══ AUTH ══ */}
        {screen === "auth" && !authLoading && <AuthScreen onAuth={handleAuth} />}

        {/* ══ PROFILE FORM ══ */}
        {screen === "profile" && !authLoading && (
          <ProfileForm userName={authUser?.displayName || authUser?.email} onComplete={handleProfileComplete} />
        )}

        {/* ══ INTRO ══ */}
        {screen === "intro" && !authLoading && (
          <div style={{ position:"fixed", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:10, padding:"40px 20px", background:"#0a0906" }}>
            <div style={{ textAlign:"center", maxWidth:"560px", animation:"introFadeIn 1.3s ease forwards" }}>
              <div style={{ fontSize:"56px", color:"#e8c97a", marginBottom:"30px", opacity:0.75, animation:"shimmer 3.5s infinite", fontFamily:"serif" }}>∞</div>
              <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(44px,8vw,70px)", fontWeight:300, letterSpacing:"0.16em", color:"#f0e4bc", lineHeight:1, marginBottom:"8px" }}>MATHESIS</h1>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"12px", letterSpacing:"0.36em", color:"#5a4a2a", marginBottom:"42px", fontWeight:300 }}>A JOURNEY INTO THE LANGUAGE OF THE UNIVERSE</p>
              <div style={{ width:"1px", height:"52px", background:"linear-gradient(to bottom,transparent,#e8c97a2a,transparent)", margin:"0 auto 40px" }} />
              {isReturning ? (
                <>
                  <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"19px", lineHeight:"1.85", color:"#9a9080", marginBottom:"10px", fontStyle:"italic" }}>
                    Welcome back{authUser?.displayName ? `, ${authUser.displayName.split(" ")[0]}` : ""}.{(journeyRef.current.elements || []).length > 0 ? " You left something worth keeping." : ""}
                  </p>
                  {journeySummary && <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"14.5px", lineHeight:"1.8", color:"#9a9080", marginBottom:"12px", maxWidth:"420px", margin:"0 auto 12px" }}>{journeySummary}</p>}
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"12px", letterSpacing:"0.12em", color:"#6a6050", marginBottom:"44px" }}>
                    {discovered.size} realms · {(journeyRef.current.elements || []).length} elements · session {sessionCount + 1}
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"19px", lineHeight:"1.85", color:"#9a9080", marginBottom:"12px", fontStyle:"italic" }}>Mathematics is not a subject to be learned.</p>
                  <p style={{ fontFamily:"'EB Garamond',serif", fontSize:"19px", lineHeight:"1.85", color:"#9a9080", marginBottom:"46px", fontStyle:"italic" }}>It is a world to be discovered — one beautiful idea at a time.</p>
                </>
              )}
              <button className="begin-btn" onClick={beginJourney}>{isReturning ? "CONTINUE THE JOURNEY" : "BEGIN THE JOURNEY"}</button>
              <p style={{ marginTop:"28px", fontSize:"11px", letterSpacing:"0.12em", color:"#4a4030", fontFamily:"'Cormorant Garamond',serif" }}>no prerequisites · no limits · just curiosity</p>
            </div>
          </div>
        )}

        {/* ══ JOURNEY ══ */}
        {screen === "journey" && (
          <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", height:"100vh", maxWidth:"800px", margin:"0 auto", padding:"0 22px" }}>

            {/* Header */}
            <div style={{ padding:"15px 0 13px", borderBottom:"1px solid #ffffff06", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0, gap:"8px", flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"13px" }}>
                <span style={{ fontSize:"20px", color:"#e8c97a", opacity:0.7 }}>∞</span>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"16px", letterSpacing:"0.2em", color:"#b8a86a", fontWeight:300 }}>MATHESIS</div>
                  <div style={{ fontSize:"9.5px", letterSpacing:"0.14em", color:"#3a3020", fontFamily:"'Cormorant Garamond',serif" }}>YOUR JOURNEY · YOUR PACE · YOUR DISCOVERY ✦</div>
                </div>
              </div>

              <div style={{ display:"flex", gap:"6px", alignItems:"center", flexWrap:"wrap" }}>
                {/* Mode selector — EXPLORE / LEARN */}
                <div style={{ display:"flex", gap:"2px", background:"#ffffff05", border:"1px solid #e8c97a12", borderRadius:"20px", padding:"2px" }}>
                  {[[1,"Explore"],[2,"Learn"]].map(([val, label]) => (
                    <button key={val} onClick={() => setMode(Number(val))}
                      style={{ background:mode === Number(val) ? "#e8c97a18" : "transparent", border:mode === Number(val) ? "1px solid #e8c97a33" : "1px solid transparent", borderRadius:"16px", color:mode === Number(val) ? "#e8c97a" : "#6a5a3a", cursor:"pointer", padding:"3px 12px", fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", letterSpacing:"0.08em", transition:"all 0.2s ease" }}>
                      {label}
                    </button>
                  ))}
                </div>

                <button className="icon-btn" onClick={() => setShowLog(true)}>
                  <span style={{ fontSize:"13px" }}>◈</span>
                  <span>elements</span>
                </button>

                <button className="icon-btn" onClick={() => setShowConstellation(true)} style={{ position:"relative" }}>
                  {pingVisible && (
                    <div style={{ position:"absolute", top:"-2px", right:"-2px", width:"7px", height:"7px", borderRadius:"50%", background:"#e8c97a" }}>
                      <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#e8c97a", animation:"ping 1.8s ease-out" }} />
                    </div>
                  )}
                  <span style={{ fontSize:"13px" }}>✦</span>
                  <span>{discovered.size}/{TOTAL_NODES}</span>
                </button>

                <button className="icon-btn" onClick={handleSignOut} style={{ fontSize:"10px" }}>sign out</button>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex:1, overflowY:"auto", padding:"26px 0 10px" }}>

              {/* Did You Know card — shown for new users before first AI exchange */}
              {!isReturning && messages.length === 0 && (
                <DidYouKnowCard
                  opener={activeOpener}
                  onReply={sendMessage}
                  onSelectOpener={handleSelectOpener}
                  exchangeCount={exchangeCount}
                />
              )}

              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} isNew={i === newMsgIndex} onSaveElement={entry => {
                  journeyRef.current.elements = [...(journeyRef.current.elements || []), entry];
                  if (authUser) saveJourney(authUser.uid, journeyRef.current);
                  setElementsVersion(v => v + 1);
                }} />
              ))}

              {pendingChallenge && <ChallengeCard challenge={pendingChallenge} onSubmit={submitChallenge} onDismiss={() => setPendingChallenge(null)} />}
              {pendingBranch && !pendingChallenge && <BranchCard branch={pendingBranch} onChoose={chooseBranch} />}
              {isThinking && <TypingIndicator phrase={thinkingPhrase} />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div style={{ padding:"12px 0 18px", borderTop:"1px solid #ffffff06", flexShrink:0 }}>
              <div style={{ display:"flex", gap:"10px", alignItems:"flex-end", background:"#ffffff03", border:"1px solid #e8c97a12", borderRadius:"24px", padding:"8px 8px 8px 20px" }}>
                <textarea ref={inputRef} value={input} onChange={e => { setInput(e.target.value); e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight, 140)+"px"; }} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Think aloud, ask, wonder, push back..." rows={1} style={{ maxHeight:"140px" }} disabled={isThinking} />
                <button className="send-btn" onClick={() => sendMessage()} disabled={isThinking || !input.trim()}>→</button>
              </div>
              <p style={{ textAlign:"center", fontSize:"10px", color:"#1e1608", marginTop:"8px", letterSpacing:"0.07em", fontFamily:"'Cormorant Garamond',serif" }}>enter to send · shift+enter for new line</p>
            </div>
          </div>
        )}

        {/* ══ ELEMENTS OVERLAY ══ */}
        {showLog && (
          <div style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(4,3,2,0.93)", animation:"fadeIn 0.25s ease" }} onClick={() => setShowLog(false)}>
            <div onClick={e => e.stopPropagation()} style={{ background:"linear-gradient(160deg,#0a0806,#0e0c09)", border:"1px solid #a8e8c01a", borderRadius:"4px", padding:"24px 24px 20px", maxWidth:"520px", width:"94vw", maxHeight:"80vh", display:"flex", flexDirection:"column", boxShadow:"0 0 100px #000e" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px", flexShrink:0 }}>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", letterSpacing:"0.15em", color:"#a8e8c0", fontWeight:300 }}>YOUR ELEMENTS</div>
                  <div style={{ fontSize:"11px", color:"#4a4030", letterSpacing:"0.1em", fontFamily:"'Cormorant Garamond',serif", marginTop:"2px" }}>moments that say something true about how you think</div>
                </div>
                <button onClick={() => setShowLog(false)} style={{ background:"none", border:"1px solid #ffffff0c", color:"#4a4030", cursor:"pointer", padding:"5px 11px", fontSize:"11px", letterSpacing:"0.1em", fontFamily:"'Cormorant Garamond',serif" }}>CLOSE</button>
              </div>
              <div style={{ marginBottom:"16px", flexShrink:0 }}>
                <SelfNominateButton onSave={userDesc => {
                  const entry = { userDescription:userDesc, mathematicalNote:"", timestamp:new Date().toISOString(), nominatedBy:"user" };
                  journeyRef.current.elements = [...(journeyRef.current.elements || []), entry];
                  if (authUser) saveJourney(authUser.uid, journeyRef.current);
                  setShowLog(false);
                  setTimeout(() => setShowLog(true), 50);
                }} />
              </div>
              <div style={{ overflowY:"auto", flex:1 }}>
                {(() => {
                  const elements = [...(journeyRef.current.elements || [])].reverse();
                  if (elements.length === 0) return <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"15px", color:"#4a4030", fontStyle:"italic", textAlign:"center", marginTop:"40px" }}>Nothing here yet. When you find something worth keeping — a discovery, a surprising wrong turn, a moment that felt real — it lives here.</div>;
                  return elements.map((entry, i) => {
                    const date = new Date(entry.timestamp);
                    const dateStr = date.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
                    const timeStr = date.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
                    return (
                      <div key={i} style={{ marginBottom:"20px", paddingBottom:"20px", borderBottom:i < elements.length - 1 ? "1px solid #ffffff08" : "none" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"10px", letterSpacing:"0.14em", color:entry.nominatedBy === "user" ? "#a8e8c066" : "#e8c97a66" }}>{entry.nominatedBy === "user" ? "✦ your finding" : "✦ noticed by mathesis"}</div>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", color:"#3a2a10" }}>{dateStr} · {timeStr}</div>
                        </div>
                        <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"15.5px", lineHeight:"1.75", color:"#ddd5c0", marginBottom:entry.mathematicalNote ? "8px" : "0" }}>{entry.userDescription}</div>
                        {entry.mathematicalNote && <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"13px", lineHeight:"1.6", color:"#6a6050", fontStyle:"italic" }}>{entry.mathematicalNote}</div>}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ══ CONSTELLATION ══ */}
        {showConstellation && <ConstellationMap discovered={discovered} onClose={() => setShowConstellation(false)} />}
      </div>
    </>
  );
}
