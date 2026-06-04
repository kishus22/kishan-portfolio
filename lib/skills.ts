export type SkillCategory = {
  category: string;
  skills: string[];
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["Python", "JavaScript", "SQL"],
  },
  {
    category: "Frontend",
    skills: ["React.js", "HTML5", "CSS3", "Tailwind CSS"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Flask", "FastAPI", "Django", "REST APIs"],
  },
  {
    category: "Automation & Testing",
    skills: ["Pytest", "Postman", "API Testing", "Unit Testing", "Regression Testing"],
  },
  {
    category: "Machine Learning & AI",
    skills: ["TensorFlow", "Scikit-learn", "OpenCV", "Computer Vision", "Pandas", "NumPy"],
  },
  {
    category: "Databases",
    skills: ["MySQL", "PostgreSQL", "MongoDB"],
  },
  {
    category: "DevOps & Tools",
    skills: ["Git", "Docker", "GitHub Actions", "CI/CD", "JIRA", "VS Code"],
  },
];
