export type Project = {
  id: number;
  name: string;
  category: string;
  year: string;
  image: string;
  overview: string;
  problem: string;
  solution: string;
  stack: string[];
  achievements: string[];
  github: string;
  demo: string | null;
};

export const projects: Project[] = [
  {
    id: 1,
    name: "Fraud Detection in UPI Transactions",
    category: "Machine Learning · Financial Intelligence",
    year: "2025",
    image: "/fraud.png",
    overview: "A real-time fraud detection pipeline for UPI transactions using supervised machine learning trained on 10,000+ financial records.",
    problem: "UPI transaction fraud is rising rapidly with attackers exploiting transaction patterns. Existing rule-based systems fail to catch sophisticated fraud in real-time.",
    solution: "Built a CNN and ensemble ML pipeline that analyzes transaction attributes, location data, and behavioral patterns to classify fraud with high accuracy, deployed as a Flask REST API.",
    stack: ["Python", "Scikit-learn", "Pandas", "XGBoost", "Flask", "REST API"],
    achievements: [
      "Trained on 10,000+ real UPI transaction records with feature engineering",
      "Deployed as Flask REST API enabling real-time fraud prediction",
      "Ensemble CNN approach achieving high-accuracy fraud classification"
    ],
    github: "https://github.com/Kishan-S",
    demo: null
  },
  {
    id: 2,
    name: "Criminal Face Detection",
    category: "Computer Vision · Biometric Intelligence",
    year: "2024",
    image: "/criminal.jpeg",
    overview: "AI-powered facial recognition system for criminal identification using deep face embeddings, OpenCV preprocessing, and tactical HUD-style overlays.",
    problem: "Manual criminal identification from surveillance footage is slow, error-prone, and scales poorly across large databases of suspect profiles.",
    solution: "Implemented a deep learning facial recognition pipeline using InsightFace embeddings and OpenCV, with tactical HUD overlays for real-time identification and confidence scoring.",
    stack: ["Python", "OpenCV", "TensorFlow", "CNN", "InsightFace"],
    achievements: [
      "Deep face embedding pipeline for high-accuracy criminal identification",
      "Real-time OpenCV processing with tactical HUD-style visual overlays",
      "Multi-face detection with individual confidence scoring per frame"
    ],
    github: "https://github.com/Kishan-S",
    demo: null
  },
  {
    id: 3,
    name: "Real-Time Face Animation",
    category: "Computer Vision · Motion Capture AI",
    year: "2026",
    image: "/face-animation.jpeg",
    overview: "Real-time facial mesh tracking system using MediaPipe and OpenCV for live face animation with holographic rendering pipelines.",
    problem: "Creating smooth real-time facial animation on standard hardware requires an optimized pipeline that balances accuracy with processing speed.",
    solution: "Built a MediaPipe-based facial landmark detection pipeline achieving 30+ FPS face animation with holographic mesh overlays and motion capture precision.",
    stack: ["Python", "OpenCV", "MediaPipe", "Deep Learning"],
    achievements: [
      "Real-time facial landmark detection running at 30+ FPS on standard hardware",
      "Motion capture pipeline for smooth animated face overlays",
      "Holographic mesh rendering on live video feed with minimal latency"
    ],
    github: "https://github.com/Kishan-S",
    demo: null
  },
  {
    id: 4,
    name: "Face Swap Detection",
    category: "Deepfake Analysis · Identity Defense",
    year: "2025",
    image: "/face-swap.jpeg",
    overview: "Multi-stage deep learning pipeline for detecting and generating realistic face swaps using InsightFace and TensorFlow with neural blending.",
    problem: "Deepfake face swaps are increasingly indistinguishable from real footage, creating serious identity fraud and misinformation risks.",
    solution: "Implemented a multi-stage pipeline covering facial landmark detection, alignment, and neural blending to produce and detect realistic face replacements.",
    stack: ["Python", "InsightFace", "OpenCV", "TensorFlow", "CNN"],
    achievements: [
      "Multi-stage pipeline: facial detection, alignment, and neural blending",
      "Facial landmark detection for pixel-precise face alignment",
      "Batch face swapping with improved detection across varied facial images"
    ],
    github: "https://github.com/Kishan-S",
    demo: null
  },
  {
    id: 5,
    name: "Online Birth Certificate Database System",
    category: "Full Stack · Digital Identity",
    year: "2023",
    image: "/birth.jpeg",
    overview: "Government-grade birth certificate platform with secure document uploads, verification workflows, and a full-stack web interface.",
    problem: "Traditional birth certificate systems rely on manual paper processes that are slow, error-prone, and inaccessible to citizens remotely.",
    solution: "Built a full-stack React + Node.js platform with MongoDB for secure document storage, digital verification workflows, and government-grade data management.",
    stack: ["React", "Next.js", "Node.js", "MongoDB", "REST API"],
    achievements: [
      "Secure document upload and digital verification system",
      "Full-stack React + Node.js architecture with REST API",
      "Government-grade MongoDB database with structured record management"
    ],
    github: "https://github.com/Kishan-S",
    demo: null
  },
  {
    id: 6,
    name: "FinTech API Automation",
    category: "API Automation · Cyber FinTech",
    year: "2026",
    image: "/fintech.jpeg",
    overview: "End-to-end FinTech API automation framework with real-time data flow monitoring, test orchestration, and CI-ready dashboards.",
    problem: "FinTech APIs require rigorous testing across multiple endpoints with complex data flows that are difficult to validate manually at scale.",
    solution: "Built a Python-based API automation framework using Pytest with structured test orchestration, real-time reporting, and GitHub Actions CI integration.",
    stack: ["Python", "REST API", "Pytest", "Automation", "CI/CD", "GitHub Actions"],
    achievements: [
      "Complete API test automation framework built from scratch in Python",
      "CI/CD ready pipeline integrated with GitHub Actions",
      "Real-time data flow monitoring with automated reporting dashboards"
    ],
    github: "https://github.com/Kishan-S",
    demo: null
  }
];

export const PROJECTS = projects;
