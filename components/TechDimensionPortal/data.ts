import { projects } from "@/data/projects";

export interface Dimension {
  id: string;
  label: string;
  color: string;
  pos: [number, number, number];
  icon: string;
  skills: string[];
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "aiml",
    label: "AI / ML",
    color: "#00D4FF",
    pos: [0, 2.5, -2],
    icon: "🧠",
    skills: ["TensorFlow", "Scikit-learn", "OpenCV", "Computer Vision", "Pandas", "NumPy"]
  },
  {
    id: "backend",
    label: "Software Engineering",
    color: "#7B2FFF",
    pos: [3, 0.5, -3],
    icon: "⚙️",
    skills: ["Python", "JavaScript", "SQL", "Node.js", "Flask", "FastAPI", "Django", "REST APIs"]
  },
  {
    id: "fullstack",
    label: "Full Stack",
    color: "#00FF88",
    pos: [2, -2, -2],
    icon: "🌐",
    skills: ["React.js", "HTML5", "CSS3", "Tailwind CSS", "Node.js", "Flask", "REST APIs"]
  },
  {
    id: "databases",
    label: "Databases",
    color: "#FF6B35",
    pos: [-2, -2, -2],
    icon: "💾",
    skills: ["MySQL", "PostgreSQL", "MongoDB"]
  },
  {
    id: "automation",
    label: "Automation & Testing",
    color: "#FFD700",
    pos: [-3, 0.5, -3],
    icon: "⚡",
    skills: ["Pytest", "Postman", "API Testing", "Unit Testing", "Regression Testing"]
  },
  {
    id: "devops",
    label: "Cloud & DevOps",
    color: "#00D4FF",
    pos: [-1, 2.5, -2],
    icon: "☁️",
    skills: ["Git", "Docker", "GitHub Actions", "CI/CD", "JIRA", "VS Code"]
  },
  {
    id: "projects",
    label: "Mission Archive",
    color: "#FF6B35",
    pos: [0, -3, -1],
    icon: "📁",
    skills: projects.map((p) => p.name)
  }
];
