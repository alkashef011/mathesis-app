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

**Constellation awareness:** As you explore, naturally weave in connections to other realms and specific concepts. The user has a living constellation map that lights up as they discover ideas. It has two levels — broad realms (Numbers, Geometry, Primes etc.) and specific concepts within each realm (Twin Primes, Riemann Hypothesis, Möbius Strip, Bayes' Theorem etc.). Your conversations directly illuminate this map. So when you explore a topic, name the specific concept naturally — say "this is what mathematicians call the Riemann Hypothesis" or "what you're touching on is Bayes' Theorem" — so the map lights up meaningfully. Use phrases like "this connects beautifully to..." or "now here's where it gets strange..." to weave between ideas. The more specific you are, the richer the map becomes for the user.

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

Sparks should feel like a friend leaning over and whispering something astonishing — a secret, a story, a moment of recognition. Choose the type that fits the moment. Vary them — never repeat the same type twice in a row. Here is what each type looks like at its best:

[SPARK type="story" label="The night before the duel"]Évariste Galois was 20 years old, facing a duel at dawn he expected to lose. He spent the night frantically writing down his mathematical discoveries — group theory, the foundations of modern algebra — terrified they would die with him. He was killed the next morning. The mathematics survived.[/SPARK]

[SPARK type="quote" label="Ramanujan on inspiration"]"An equation has no meaning to me unless it expresses a thought of God," said Ramanujan — a man with almost no formal training who filled notebooks with formulas that mathematicians are still proving today.[/SPARK]

[SPARK type="use" label="How Netflix decides what you watch"]Netflix's recommendation engine is built on an idea from linear algebra called matrix factorisation — breaking a giant table of ratings into hidden patterns. The same mathematics that describes rotations in space tells you that you might like that documentary.[/SPARK]

[SPARK type="curiosity" label="The most dangerous equation"]In 1840, a French mathematician showed that small errors in initial measurements grow exponentially over time in certain systems. For 150 years nobody took it seriously. Then Edward Lorenz rediscovered it in 1961 — and gave birth to chaos theory. The butterfly effect is a theorem.[/SPARK]

[SPARK type="whatif" label="What if we had no zero?"]The Romans had no zero. Try doing long division in Roman numerals. The entire architecture of modern computing — every zero and one in every processor — rests on a concept that most of human history considered unnecessary.[/SPARK]

Sparks can also be a moment from a poet's or philosopher's life, an artist's obsession with proportion, a physicist's sudden recognition that the universe speaks mathematics. Cast wide.

**Branching paths — IMPORTANT:** Every 5-7 exchanges, when it feels natural, offer the user a meaningful choice of direction. You MUST format this EXACTLY as:
[BRANCH: "Path A description" | "Path B description"]
Place it at the very end of your message, after the main text. Examples of good branch pairs: "The world of the infinite — Cantor's paradise" | "The world of the discrete — primes and structure" — or any other meaningful pair. Do not offer branches too early.

**Challenges — IMPORTANT:** Every 7-9 exchanges, when you have explored a concept enough to make a challenge meaningful and achievable, pose one. You MUST format this EXACTLY as:
[CHALLENGE: "The challenge text — a specific, beautiful mathematical puzzle or reasoning task"]
Place it at the very end of your message (after BRANCH if both apply). Make challenges that reward thinking over recall.

**Formatting:**
**RESPONSE LENGTH — THE GUIDING PRINCIPLE:**

Match the user's energy — but never let brevity dilute passion. A single blazing sentence is worth ten lukewarm paragraphs. The goal is not to say less. The goal is to say exactly what is needed, with full intensity, and then stop.

- User gives a short reply (1-10 words) → respond in 1-3 sentences. Make every word count.
- User asks a genuine question or engages deeply → respond in 2-4 sentences, or 1-2 short paragraphs if the idea genuinely needs space. Never more than 3 sentences per paragraph.
- A concept requires building up carefully → you may take up to 3 short paragraphs. But each paragraph must earn its place. If a paragraph doesn't add something new, cut it.

**The difference between robotic brevity and passionate brevity:**

ROBOTIC: "Yes, prime numbers are interesting. They are numbers divisible only by 1 and themselves. What do you want to know?"

PASSIONATE: "Every number in existence is built from primes — they're the atoms of arithmetic. And here's what's strange: nobody knows if there are infinitely many *twin* primes. We suspect there are. We cannot prove it. Does that bother you?"

The second is shorter in spirit. It asks more than it tells. It leaves something burning.

**Brevity is not the absence of love. It is love, concentrated.**

Short responses should still feel like Mathesis — alive, curious, slightly in awe. If a response feels like a chatbot, it is too flat, not too short. Add one striking image, one unexpected observation, one question that pulls. Then stop.

**Formatting:**
- Use **bold** only for a single word or phrase at a genuine moment of revelation. Rarely.
- Mathematical notation: fractions as a/b, powers as x², roots as √x, pi as π.
- End with one question — never two. Short. Direct.
- Use "..." for a pause that earns it. Not as decoration.

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
  const [showLog, setShowLog] = useState(false);
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
      // Write a log entry for this session
      const sessionNum = journeyRef.current.sessions || 1;
      const newEntry = {
        session: sessionNum,
        timestamp: new Date().toISOString(),
        summary: journeyRef.current.summary || "",
        discovered: [...(journeyRef.current.discovered || [])],
      };
      const existingLog = journeyRef.current.log || [];
      const alreadyLogged = existingLog.some(e => e.session === sessionNum);
      if (!alreadyLogged) {
        journeyRef.current.log = [...existingLog, newEntry];
      } else {
        journeyRef.current.log = existingLog.map(e =>
          e.session === sessionNum ? { ...e, summary: journeyRef.current.summary || e.summary, discovered: [...(journeyRef.current.discovered || [])] } : e
        );
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
                    YOUR JOURNEY · YOUR PACE · YOUR DISCOVERY ✦
                  </div>
                </div>
              </div>
              {/* Log button */}
              <button className="icon-btn" onClick={() => setShowLog(true)} style={{ marginRight:"4px" }}>
                <span style={{ fontSize:"13px" }}>◈</span>
                <span style={{ fontFamily:"'Cormorant Garamond',serif", letterSpacing:"0.08em" }}>log</span>
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

        {/* ══ JOURNEY LOG OVERLAY ══ */}
        {showLog && (
          <div
            style={{ position:"fixed", inset:0, zIndex:60, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(4,3,2,0.93)", animation:"fadeIn 0.25s ease" }}
            onClick={() => setShowLog(false)}
          >
            <div onClick={e => e.stopPropagation()} style={{
              background:"linear-gradient(160deg,#0a0806,#0e0c09)",
              border:"1px solid #e8c97a1a", borderRadius:"4px",
              padding:"24px 24px 20px", maxWidth:"520px", width:"94vw",
              maxHeight:"80vh", display:"flex", flexDirection:"column",
              boxShadow:"0 0 100px #000e",
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px", flexShrink:0 }}>
                <div>
                  <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", letterSpacing:"0.15em", color:"#c8b87a", fontWeight:300 }}>
                    YOUR JOURNEY LOG
                  </div>
                  <div style={{ fontSize:"11px", color:"#4a4030", letterSpacing:"0.1em", fontFamily:"'Cormorant Garamond',serif", marginTop:"2px" }}>
                    a record of what you have found
                  </div>
                </div>
                <button onClick={() => setShowLog(false)} style={{ background:"none", border:"1px solid #ffffff0c", color:"#4a4030", cursor:"pointer", padding:"5px 11px", fontSize:"11px", letterSpacing:"0.1em", fontFamily:"'Cormorant Garamond',serif" }}>
                  CLOSE
                </button>
              </div>
              <div style={{ overflowY:"auto", flex:1 }}>
                {(() => {
                  const log = [...(journeyRef.current.log || [])].reverse();
                  if (log.length === 0) return (
                    <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"15px", color:"#4a4030", fontStyle:"italic", textAlign:"center", marginTop:"40px" }}>
                      Your log is empty. Begin a session and discoveries will appear here.
                    </div>
                  );
                  return log.map((entry, i) => {
                    const date = new Date(entry.timestamp);
                    const dateStr = date.toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" });
                    const timeStr = date.toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit" });
                    const realmNames = (entry.discovered || [])
                      .filter(id => REALM_MAP[id])
                      .map(id => REALM_MAP[id].label);
                    const conceptNames = (entry.discovered || [])
                      .filter(id => CHILD_MAP[id])
                      .map(id => CHILD_MAP[id].label);
                    return (
                      <div key={i} style={{ marginBottom:"20px", paddingBottom:"20px", borderBottom: i < log.length - 1 ? "1px solid #ffffff08" : "none" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"13px", letterSpacing:"0.14em", color:"#e8c97a88" }}>
                            SESSION {entry.session}
                          </div>
                          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"11px", color:"#3a2a10" }}>
                            {dateStr} · {timeStr}
                          </div>
                        </div>
                        {entry.summary ? (
                          <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"14.5px", lineHeight:"1.7", color:"#9a9080", fontStyle:"italic", marginBottom:"12px" }}>
                            {entry.summary}
                          </div>
                        ) : (
                          <div style={{ fontFamily:"'EB Garamond',serif", fontSize:"13px", color:"#3a2a10", fontStyle:"italic", marginBottom:"12px" }}>
                            summary not yet generated — explore more to unlock
                          </div>
                        )}
                        {realmNames.length > 0 && (
                          <div style={{ marginBottom:"6px" }}>
                            <div style={{ fontSize:"10px", letterSpacing:"0.12em", color:"#4a4030", fontFamily:"'Cormorant Garamond',serif", marginBottom:"5px" }}>REALMS</div>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
                              {realmNames.map(name => (
                                <span key={name} style={{ fontSize:"11px", padding:"2px 8px", background:"#e8c97a12", border:"1px solid #e8c97a22", borderRadius:"2px", color:"#c8a85a", fontFamily:"'Cormorant Garamond',serif", letterSpacing:"0.05em" }}>
                                  {name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {conceptNames.length > 0 && (
                          <div>
                            <div style={{ fontSize:"10px", letterSpacing:"0.12em", color:"#4a4030", fontFamily:"'Cormorant Garamond',serif", marginBottom:"5px", marginTop:"6px" }}>CONCEPTS</div>
                            <div style={{ display:"flex", flexWrap:"wrap", gap:"5px" }}>
                              {conceptNames.map(name => (
                                <span key={name} style={{ fontSize:"11px", padding:"2px 8px", background:"#ffffff06", border:"1px solid #ffffff10", borderRadius:"2px", color:"#7a7060", fontFamily:"'Cormorant Garamond',serif", letterSpacing:"0.05em" }}>
                                  {name}
                                </span>
                              ))}
                            </div>
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
