export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Internship", href: "#internships" },
  { label: "Contact", href: "#contact" },
] as const;

export const HERO_TAGLINE =
  "Software Engineer · AI/ML Developer · Full Stack Developer";

export type ProjectTheme =
  | "fraud"
  | "criminal-face"
  | "face-animation"
  | "face-swap"
  | "birth-cert"
  | "fintech";

export const PROJECTS = [
  {
    id: "mission-01",
    title: "Fraud Detection in UPI Transactions",
    year: "2025",
    mission: "Real-time fraud detection across high-volume UPI payment streams.",
    tech: ["Python", "Scikit-learn", "Pandas", "XGBoost"],
    theme: "fraud" as ProjectTheme,
    gradient: "from-emerald-950 via-cyan-950 to-black",
    image: "/fraud.png",
    problem:
      "Traditional fraud filters miss evolving patterns in high-volume UPI traffic.",
    solution:
      "Built a CNN + ensemble ML pipeline with anomaly signals and real-time scoring.",
    architecture:
      "Ingestion → feature engineering → model inference → risk decision layer → alerts dashboard.",
    implementation:
      "Optimized preprocessing, model serving, and rule fusion for low-latency fraud defense.",
    achievements: [
      "Processed 10,000+ transaction records with real-time model scoring.",
      "Improved suspicious transaction detection confidence for edge cases.",
    ],
    github: "https://github.com/kishus22",
    demo: "",
  },
  {
    id: "mission-02",
    title: "Criminal Face Detection",
    year: "2024",
    mission: "Biometric identification with tactical vision overlays for surveillance.",
    tech: ["Python", "OpenCV", "TensorFlow", "CNN"],
    theme: "criminal-face" as ProjectTheme,
    gradient: "from-slate-950 via-purple-950 to-black",
    image: "/criminal.jpeg",
    problem:
      "Manual identification in surveillance streams is slow and error-prone.",
    solution:
      "Implemented deep face embeddings with OpenCV-assisted tactical visualization.",
    architecture:
      "Camera feed → detection → embedding extraction → similarity search → alert output.",
    implementation:
      "Integrated fast face alignment and identity scoring with overlay rendering.",
    achievements: [
      "Reduced recognition latency for real-time camera streams.",
      "Delivered clearer operator visibility through HUD-style overlays.",
    ],
    github: "https://github.com/kishus22",
    demo: "",
  },
  {
    id: "mission-03",
    title: "Real-Time Face Animation",
    year: "2026",
    mission: "Low-latency facial mesh animation with motion capture precision.",
    tech: ["Python", "OpenCV", "MediaPipe", "Deep Learning"],
    theme: "face-animation" as ProjectTheme,
    gradient: "from-indigo-950 via-cyan-950 to-black",
    image: "/face-animation.jpeg",
    problem:
      "Facial animation systems often struggle with speed and landmark stability.",
    solution:
      "Built MediaPipe + OpenCV real-time tracking tuned for smooth cinematic motion.",
    architecture:
      "Live input → landmark extraction → temporal smoothing → mesh rendering layer.",
    implementation:
      "Focused on frame consistency, lightweight inference, and robust motion handling.",
    achievements: [
      "Achieved stable live facial mesh under motion-heavy scenarios.",
      "Improved animation continuity for expressive facial states.",
    ],
    github: "https://github.com/kishus22",
    demo: "",
  },
  {
    id: "mission-04",
    title: "Face Swap Detection",
    year: "2025",
    mission: "Multi-stage deepfake detection for synthetic identity defense.",
    tech: ["Python", "Deep Learning", "TensorFlow", "CNN"],
    theme: "face-swap" as ProjectTheme,
    gradient: "from-fuchsia-950 via-purple-950 to-black",
    image: "/face-swap.jpeg",
    problem:
      "Deepfake face swaps are increasingly realistic and hard to detect quickly.",
    solution:
      "Used InsightFace + TensorFlow in a staged verification and anomaly pipeline.",
    architecture:
      "Frame extraction → face analysis → authenticity scoring → verdict aggregation.",
    implementation:
      "Combined representation learning with texture-level artifact inspection.",
    achievements: [
      "Improved synthetic face detection confidence for challenging clips.",
      "Designed explainable scoring outputs for verification workflows.",
    ],
    github: "https://github.com/kishus22",
    demo: "",
  },
  {
    id: "mission-05",
    title: "Online Birth Certificate Database System",
    year: "2023",
    mission: "Secure digital identity records and government-grade verification workflows.",
    tech: ["React", "Next.js", "Node.js", "MongoDB"],
    theme: "birth-cert" as ProjectTheme,
    gradient: "from-teal-950 via-cyan-950 to-black",
    image: "/birth.jpeg",
    problem:
      "Manual certificate workflows are slow, fragmented, and insecure.",
    solution:
      "Developed a full-stack verification platform for online certificate lifecycle.",
    architecture:
      "Citizen portal → request pipeline → admin validation → secure record store.",
    implementation:
      "Implemented role-aware flows, auditable updates, and reliable data persistence.",
    achievements: [
      "Streamlined verification flow for applicant and admin users.",
      "Created a cleaner digital process for document issuance and tracking.",
    ],
    github: "https://github.com/kishus22",
    demo: "",
  },
  {
    id: "mission-06",
    title: "FinTech API Automation",
    year: "2026",
    mission: "Automated FinTech API validation with CI-ready test orchestration.",
    tech: ["Python", "REST API", "Pytest", "Automation"],
    theme: "fintech" as ProjectTheme,
    gradient: "from-blue-950 via-cyan-950 to-black",
    image: "/fintech.jpeg",
    problem:
      "FinTech API changes introduce regression risk across interconnected services.",
    solution:
      "Built a Python automation framework for robust CI-ready API testing pipelines.",
    architecture:
      "Test runner → environment setup → endpoint suite → report and quality gates.",
    implementation:
      "Added reusable fixtures, schema assertions, and workflow-ready reporting.",
    achievements: [
      "Reduced manual API validation effort with automated regression coverage.",
      "Improved release confidence through repeatable CI integration.",
    ],
    github: "https://github.com/kishus22",
    demo: "",
  },
] as const;

export const EDUCATION = {
  degree: "Bachelor of Engineering in Computer Science and Engineering",
  university: "VTU University",
  period: "2021 – 2025",
  highlights: [
    "Specialization in AI, Machine Learning & Intelligent Systems",
    "Core focus: Computer Vision, Deep Learning & Cybersecurity",
    "Built production-style ML & full-stack capstone projects",
  ],
} as const;

export const INTERNSHIPS = [
  {
    company: "Contriver",
    role: "AI/ML Intern",
    period: "2025",
    description:
      "Deployed machine learning pipelines, data preprocessing workflows, and intelligent automation in a professional R&D environment.",
    skills: ["Python", "ML Pipelines", "Data Analysis", "Model Training"],
    accent: "cyan",
  },
  {
    company: "IBM SkillsBuild",
    role: "Cybersecurity & Steganography",
    period: "2023",
    description:
      "IBM SkillsBuild internship — cybersecurity fundamentals, steganography techniques, and secure communication protocols.",
    skills: ["Cybersecurity", "Steganography", "Encryption", "IBM Cloud"],
    accent: "purple",
  },
] as const;

export const SOCIAL_LINKS = {
  github: "https://github.com/kishus22",
  linkedin: "https://www.linkedin.com/in/kishan-s-3128222a1",
  email: "mailto:kishan.s.220803@gmail.com",
  resume: "/resume.pdf",
} as const;
