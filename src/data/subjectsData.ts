import { Subject, Chapter } from '../types';

export const CBSE_SUBJECTS: Subject[] = [
  {
    id: 'mathematics',
    name: 'Mathematics (Standard / Basic)',
    code: '041 / 241',
    color: 'from-blue-600 to-indigo-700',
    accentColor: '#3b82f6',
    description: 'Master theorem proofs, algebraic logic, quadratic roots, and step-by-step presentation required for CBSE full marks.',
    totalChapters: 14,
    totalMarks: 80
  },
  {
    id: 'science',
    name: 'Science (Physics, Chem, Bio)',
    code: '086',
    color: 'from-emerald-600 to-teal-700',
    accentColor: '#10b981',
    description: 'Balance chemical equations, ray diagrams, circuit calculations, and point-wise biological mechanisms.',
    totalChapters: 13,
    totalMarks: 80
  },
  {
    id: 'social-science',
    name: 'Social Science (Hist, Geog, Pol, Econ)',
    code: '087',
    color: 'from-amber-600 to-orange-700',
    accentColor: '#f59e0b',
    description: 'Structure chronological causes, map skills, institutional functions, and economic indicators without essay bloat.',
    totalChapters: 19,
    totalMarks: 80
  },
  {
    id: 'english',
    name: 'English (Language & Literature)',
    code: '184',
    color: 'from-purple-600 to-pink-700',
    accentColor: '#a855f7',
    description: 'Analytical paragraph structure, formal letter format, extract-based poetic devices, and thematic interpretations.',
    totalChapters: 12,
    totalMarks: 80
  },
  {
    id: 'hindi',
    name: 'Hindi (Course A & B)',
    code: '002 / 085',
    color: 'from-rose-600 to-red-700',
    accentColor: '#f43f5e',
    description: 'Vyakaran (Vakya bhed, Samas, Muhavare), Gadya-Padya bhaav, Anuched-lekhan, and shuddh vartani.',
    totalChapters: 11,
    totalMarks: 80
  }
];

export const INITIAL_CHAPTERS: Chapter[] = [
  // --- MATHEMATICS ---
  {
    id: 'math-real-numbers',
    subjectId: 'mathematics',
    name: 'Real Numbers',
    unit: 'Number Systems',
    order: 1,
    cbseWeightageMarks: 6,
    readiness: {
      conceptUnderstanding: 'strong',
      application: 'strong',
      questionSolving: 'strong',
      answerWriting: 'strong',
      timeSpeed: 'strong',
      revision: 'needs-practice'
    },
    coreConcepts: ['Fundamental Theorem of Arithmetic', 'Irrationality Proofs (√2, √3, √5)', 'HCF & LCM Prime Factorization'],
    cbseWatchouts: ['Stating coprimality contradiction explicitly in irrationality proofs', 'Showing all prime factor trees']
  },
  {
    id: 'math-polynomials',
    subjectId: 'mathematics',
    name: 'Polynomials',
    unit: 'Algebra',
    order: 2,
    cbseWeightageMarks: 4,
    readiness: {
      conceptUnderstanding: 'strong',
      application: 'needs-practice',
      questionSolving: 'needs-practice',
      answerWriting: 'strong',
      timeSpeed: 'needs-practice',
      revision: 'weak'
    },
    coreConcepts: ['Relationship between Zeroes and Coefficients', 'Quadratic polynomial construction from roots'],
    cbseWatchouts: ['Sign error when calculating -b/a vs c/a', 'Not writing the k constant in k(x² - Sx + P)']
  },
  {
    id: 'math-quadratic-equations',
    subjectId: 'mathematics',
    name: 'Quadratic Equations',
    unit: 'Algebra',
    order: 3,
    cbseWeightageMarks: 8,
    readiness: {
      conceptUnderstanding: 'needs-practice',
      application: 'weak',
      questionSolving: 'needs-practice',
      answerWriting: 'weak',
      timeSpeed: 'weak',
      revision: 'weak'
    },
    coreConcepts: ['Nature of Roots (Discriminant D = b² - 4ac)', 'Quadratic Formula', 'Word problems on speed, time & pipes'],
    cbseWatchouts: ['Rejecting negative roots with proper physical justification', 'Writing the general equation in standard form first']
  },
  {
    id: 'math-triangles',
    subjectId: 'mathematics',
    name: 'Triangles',
    unit: 'Geometry',
    order: 4,
    cbseWeightageMarks: 10,
    readiness: {
      conceptUnderstanding: 'needs-practice',
      application: 'weak',
      questionSolving: 'weak',
      answerWriting: 'weak',
      timeSpeed: 'weak',
      revision: 'weak'
    },
    coreConcepts: ['Basic Proportionality Theorem (BPT/Thales)', 'Similarity Criteria (AAA, SSS, SAS)', 'Step-by-step theorem proof writing'],
    cbseWatchouts: ['Must state "Given", "To Prove", "Construction", and "Proof" with reasons in parentheses on every line']
  },
  {
    id: 'math-coordinate-geometry',
    subjectId: 'mathematics',
    name: 'Coordinate Geometry',
    unit: 'Coordinate Geometry',
    order: 5,
    cbseWeightageMarks: 6,
    readiness: {
      conceptUnderstanding: 'strong',
      application: 'needs-practice',
      questionSolving: 'strong',
      answerWriting: 'needs-practice',
      timeSpeed: 'strong',
      revision: 'needs-practice'
    },
    coreConcepts: ['Distance Formula', 'Section Formula (Internal division)', 'Midpoint Formula applications'],
    cbseWatchouts: ['Mentioning (x, y) coordinates clearly; applying m1 x2 + m2 x1 without swapping indices']
  },
  {
    id: 'math-trigonometry',
    subjectId: 'mathematics',
    name: 'Introduction to Trigonometry',
    unit: 'Trigonometry',
    order: 6,
    cbseWeightageMarks: 8,
    readiness: {
      conceptUnderstanding: 'needs-practice',
      application: 'weak',
      questionSolving: 'weak',
      answerWriting: 'needs-practice',
      timeSpeed: 'weak',
      revision: 'weak'
    },
    coreConcepts: ['Trigonometric Ratios & Specific Angles (30°, 45°, 60°)', 'Trigonometric Identities (sin²θ + cos²θ = 1)'],
    cbseWatchouts: ['RHS/LHS identity proof presentation; rationalizing denominators with surds']
  },

  // --- SCIENCE ---
  {
    id: 'sci-chemical-reactions',
    subjectId: 'science',
    name: 'Chemical Reactions and Equations',
    unit: 'Chemical Substances',
    order: 1,
    cbseWeightageMarks: 6,
    readiness: {
      conceptUnderstanding: 'strong',
      application: 'needs-practice',
      questionSolving: 'strong',
      answerWriting: 'needs-practice',
      timeSpeed: 'strong',
      revision: 'needs-practice'
    },
    coreConcepts: ['Types of Reactions (Combination, Decomposition, Displacement, Redox)', 'Balancing Chemical Equations', 'Corrosion & Rancidity'],
    cbseWatchouts: ['Must state physical states (s, l, g, aq) when asked', 'Colour change observations (e.g. FeSO4 green to brown, CuSO4 blue to pale green)']
  },
  {
    id: 'sci-electricity',
    subjectId: 'science',
    name: 'Electricity',
    unit: 'Effects of Current',
    order: 2,
    cbseWeightageMarks: 8,
    readiness: {
      conceptUnderstanding: 'strong',
      application: 'weak',
      questionSolving: 'needs-practice',
      answerWriting: 'needs-practice',
      timeSpeed: 'weak',
      revision: 'weak'
    },
    coreConcepts: ["Ohm's Law & Circuit Diagrams", "Resistance factors (R = ρ l / A)", "Series and Parallel Equivalent Resistance", "Joule's Law of Heating & Electric Power"],
    cbseWatchouts: ['Always include SI units (Ω, A, V, W, J) in numerical answers', 'Show conversion of kW·h to Joules']
  },
  {
    id: 'sci-light',
    subjectId: 'science',
    name: 'Light – Reflection and Refraction',
    unit: 'Natural Phenomena',
    order: 3,
    cbseWeightageMarks: 10,
    readiness: {
      conceptUnderstanding: 'needs-practice',
      application: 'weak',
      questionSolving: 'weak',
      answerWriting: 'weak',
      timeSpeed: 'weak',
      revision: 'weak'
    },
    coreConcepts: ['Mirror Formula & Magnification', 'Lens Formula & Power of Lens', 'Ray Diagrams with Direction Arrows', 'Cartesian Sign Convention'],
    cbseWatchouts: ['Forgetting arrowheads on light rays loses 1 mark instantly', 'Confusing focal length signs (concave = negative, convex = positive)']
  },
  {
    id: 'sci-life-processes',
    subjectId: 'science',
    name: 'Life Processes',
    unit: 'World of Living',
    order: 4,
    cbseWeightageMarks: 9,
    readiness: {
      conceptUnderstanding: 'strong',
      application: 'strong',
      questionSolving: 'needs-practice',
      answerWriting: 'strong',
      timeSpeed: 'strong',
      revision: 'strong'
    },
    coreConcepts: ['Photosynthesis Light/Dark reactions', 'Human Alimentary Canal & Enzymes', 'Double Circulation in Humans', 'Nephron structure and Urine formation'],
    cbseWatchouts: ['Labeling diagrams with straight ruler lines on right side', 'Specifying exact enzyme names (Pepsin vs Trypsin, Amylase)']
  },

  // --- SOCIAL SCIENCE ---
  {
    id: 'sst-nationalism-europe',
    subjectId: 'social-science',
    name: 'The Rise of Nationalism in Europe',
    unit: 'India and the Contemporary World - II',
    order: 1,
    cbseWeightageMarks: 6,
    readiness: {
      conceptUnderstanding: 'strong',
      application: 'needs-practice',
      questionSolving: 'strong',
      answerWriting: 'needs-practice',
      timeSpeed: 'needs-practice',
      revision: 'needs-practice'
    },
    coreConcepts: ['French Revolution & Napoleon Civil Code 1804', 'Liberal Nationalism & Zollverein', 'Unification of Germany & Italy', 'Balkan Crisis'],
    cbseWatchouts: ['Writing point-wise answers with bold sub-headings instead of long narrative paragraphs']
  },
  {
    id: 'sst-power-sharing',
    subjectId: 'social-science',
    name: 'Power Sharing',
    unit: 'Democratic Politics - II',
    order: 2,
    cbseWeightageMarks: 5,
    readiness: {
      conceptUnderstanding: 'strong',
      application: 'strong',
      questionSolving: 'strong',
      answerWriting: 'strong',
      timeSpeed: 'strong',
      revision: 'strong'
    },
    coreConcepts: ['Belgium Accommodation model vs Sri Lanka Majoritarianism', 'Horizontal vs Vertical Power Sharing', 'Prudential vs Moral Reasons'],
    cbseWatchouts: ['Distinguish clearly between Community government in Belgium and Provincial autonomy']
  },
  {
    id: 'sst-sectors-economy',
    subjectId: 'social-science',
    name: 'Sectors of the Indian Economy',
    unit: 'Understanding Economic Development',
    order: 3,
    cbseWeightageMarks: 6,
    readiness: {
      conceptUnderstanding: 'strong',
      application: 'needs-practice',
      questionSolving: 'strong',
      answerWriting: 'needs-practice',
      timeSpeed: 'strong',
      revision: 'needs-practice'
    },
    coreConcepts: ['Primary, Secondary, Tertiary Sectors', 'Disguised Unemployment', 'Organized vs Unorganized Sector', 'MGNREGA 2005'],
    cbseWatchouts: ['Giving statistical context and explaining value-added calculation to prevent double counting']
  },

  // --- ENGLISH ---
  {
    id: 'eng-letter-god',
    subjectId: 'english',
    name: 'A Letter to God & Nelson Mandela',
    unit: 'First Flight',
    order: 1,
    cbseWeightageMarks: 8,
    readiness: {
      conceptUnderstanding: 'strong',
      application: 'needs-practice',
      questionSolving: 'strong',
      answerWriting: 'needs-practice',
      timeSpeed: 'strong',
      revision: 'strong'
    },
    coreConcepts: ['Irony of the post office employees', 'Mandela on Freedom & courage vs absence of fear', 'Value-based extrapolation'],
    cbseWatchouts: ['Answering within CBSE word limit (30-40 words for 2m, 100-120 words for 6m)']
  },
  {
    id: 'eng-analytical-paragraph',
    subjectId: 'english',
    name: 'Writing Skills: Analytical Paragraph',
    unit: 'Section B: Writing',
    order: 2,
    cbseWeightageMarks: 5,
    readiness: {
      conceptUnderstanding: 'strong',
      application: 'weak',
      questionSolving: 'needs-practice',
      answerWriting: 'weak',
      timeSpeed: 'weak',
      revision: 'weak'
    },
    coreConcepts: ['Introductory paraphrase', 'Data comparison & trends (soared, peaked, plateaued)', 'Concluding inference'],
    cbseWatchouts: ['Never include personal opinions; use comparative phrases like "in stark contrast to"']
  },

  // --- HINDI ---
  {
    id: 'hin-netaji-chashma',
    subjectId: 'hindi',
    name: 'नेताजी का चश्मा (Netaji Ka Chashma)',
    unit: 'क्षितिज भाग-2 (गद्य खंड)',
    order: 1,
    cbseWeightageMarks: 5,
    readiness: {
      conceptUnderstanding: 'strong',
      application: 'strong',
      questionSolving: 'strong',
      answerWriting: 'needs-practice',
      timeSpeed: 'strong',
      revision: 'needs-practice'
    },
    coreConcepts: ['कैप्टन चश्मेवाले की देशभक्ति', 'हालदार साहब का दृष्टिकोण', 'पानवाले का व्यंग्य'],
    cbseWatchouts: ['शुद्ध वर्तनी एवं स्पष्ट भाव प्रकटीकरण; 25-30 शब्दों की सीमा का पालन']
  },
  {
    id: 'hin-vakya-bhed',
    subjectId: 'hindi',
    name: 'रचना के आधार पर वाक्य भेद (Vakya Bhed)',
    unit: 'व्याकरण (Grammar)',
    order: 2,
    cbseWeightageMarks: 4,
    readiness: {
      conceptUnderstanding: 'needs-practice',
      application: 'weak',
      questionSolving: 'needs-practice',
      answerWriting: 'strong',
      timeSpeed: 'needs-practice',
      revision: 'weak'
    },
    coreConcepts: ['सरल वाक्य, संयुक्त वाक्य, मिश्र वाक्य', 'वाक्य रूपांतरण (Sentence Transformation)', 'प्रधान व आश्रित उपवाक्य'],
    cbseWatchouts: ['समुच्चयबोधक अव्यय (योजक शब्द: और, लेकिन, क्योंकि, जो) की सही पहचान']
  }
];
