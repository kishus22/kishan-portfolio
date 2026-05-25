export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Education", href: "#education" },
  { label: "Internship", href: "#internships" },
  { label: "Contact", href: "#contact" },
] as const;

export const HERO_ROLES = [
  "AI Engineer",
  "Machine Learning Developer",
  "Cybersecurity Enthusiast",
  "Building Futuristic AI Systems",
] as const;

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
    chapter: "01",
    codename: "SENTINEL PAY",
    title: "Fraud Detection in UPI Transactions",
    subtitle: "Machine Learning · Financial Intelligence",
    tagline: "Neural surveillance over every transaction pulse.",
    description:
      "Real-time fraud detection pipeline for UPI transactions — supervised ML models, anomaly scoring, and cinematic-grade financial threat intelligence.",
    tech: ["Python", "Scikit-learn", "Pandas", "XGBoost"],
    theme: "fraud" as ProjectTheme,
    gradient: "from-emerald-950 via-cyan-950 to-black",
    image: "/fraud.png",
  },
  {
    id: "mission-02",
    chapter: "02",
    codename: "PHANTOM ID",
    title: "Criminal Face Detection",
    subtitle: "Machine Learning · Biometric Intelligence",
    tagline: "Scan. Match. Neutralize threats in milliseconds.",
    description:
      "AI-powered facial recognition for criminal identification with OpenCV preprocessing, deep embeddings, and tactical HUD-style vision overlays.",
    tech: ["Python", "OpenCV", "TensorFlow", "CNN"],
    theme: "criminal-face" as ProjectTheme,
    gradient: "from-slate-950 via-purple-950 to-black",
    image: "/criminal.jpeg",
  },
  {
    id: "mission-03",
    chapter: "03",
    codename: "MIMIC ENGINE",
    title: "Real-Time Face Animation",
    subtitle: "Computer Vision · Motion Capture AI",
    tagline: "Holographic facial mesh in live cinematic motion.",
    description:
      "Real-time face animation with AI facial mesh tracking, motion capture visuals, and holographic rendering pipelines.",
    tech: ["Python", "OpenCV", "MediaPipe", "Deep Learning"],
    theme: "face-animation" as ProjectTheme,
    gradient: "from-indigo-950 via-cyan-950 to-black",
    image: "/face-animation.jpeg",
  },
  {
    id: "mission-04",
    chapter: "04",
    codename: "DEEP TRUTH",
    title: "Face Swap Detection",
    subtitle: "Deepfake Analysis · Identity Defense",
    tagline: "Expose synthetic faces before they breach reality.",
    description:
      "Deepfake and face-swap detection using neural networks, holographic scan effects, and futuristic identity verification systems.",
    tech: ["Python", "Deep Learning", "TensorFlow", "CNN"],
    theme: "face-swap" as ProjectTheme,
    gradient: "from-fuchsia-950 via-purple-950 to-black",
    image: "/face-swap.jpeg",
  },
  {
    id: "mission-05",
    chapter: "05",
    codename: "GENESIS VAULT",
    title: "Online Birth Certificate Database System",
    subtitle: "Full-Stack · Digital Identity",
    tagline: "Secure holographic records for the next civilization.",
    description:
      "Futuristic government-grade birth certificate platform with secure uploads, verification workflows, and holographic database UI.",
    tech: ["React", "Next.js", "Node.js", "MongoDB"],
    theme: "birth-cert" as ProjectTheme,
    gradient: "from-teal-950 via-cyan-950 to-black",
    image: "/birth.jpeg",
  },
  {
    id: "mission-06",
    chapter: "06",
    codename: "NEXUS FLOW",
    title: "FinTech API Automation",
    subtitle: "API Automation · Cyber FinTech",
    tagline: "Glowing data pipelines powering financial automation.",
    description:
      "End-to-end FinTech API automation framework with real-time data flow visuals, test orchestration, and CI-ready cyber dashboards.",
    tech: ["Python", "REST API", "Pytest", "Automation"],
    theme: "fintech" as ProjectTheme,
    gradient: "from-blue-950 via-cyan-950 to-black",
    image: "/fintech.jpeg",
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
