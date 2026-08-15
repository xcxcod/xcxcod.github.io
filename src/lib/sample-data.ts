import type { Profile, Project, SkillGroup } from "@/types/portfolio";

export const profile: Profile = {
  name: "Dani Adonai",
  headline: "Information Technology student building across software, cloud and cybersecurity",
  intro:
    "An Information Technology student building practical experience across software development, cybersecurity, cloud computing and backend systems.",
  biography:
    "I am studying Information Technology at RMIT University in Melbourne, Australia, while developing a foundation in software engineering, databases, networking, security, and cloud technologies. This portfolio is designed to grow with my academic and personal projects.",
  currentStudies:
    "Currently studying Information Technology at RMIT University, with coursework and self-directed learning across programming, databases, systems, and security.",
  technicalInterests: ["Software Development", "Cybersecurity", "Cloud Computing", "Backend Development"],
  careerInterests: ["Graduate technology roles", "Software engineering internships", "Security-aware backend development"],
  currentLearning: ["Next.js and TypeScript", "Firebase", "Cloud deployment workflows", "Secure application design"],
  professionalGoals:
    "To keep building practical projects, contribute to professional teams, and develop into a dependable technology practitioner with strong engineering habits.",
  location: "Melbourne, Australia",
  university: "RMIT University",
  study: "Information Technology",
  githubUrl: "YOUR_GITHUB_URL",
  linkedinUrl: "YOUR_LINKEDIN_URL",
  profileImageUrl: "/images/profile-placeholder.svg"
};

export const projects: Project[] = [
  {
    id: "student-portfolio",
    title: "Portfolio Website",
    slug: "portfolio-website",
    shortDescription: "A professional portfolio platform with authenticated admin workflows.",
    fullDescription:
      "A full-stack portfolio website built to present student projects, technical skills, and resume access requests in a professional way. Replace this placeholder with your own project details when ready.",
    imageUrl: "",
    galleryImages: [],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    githubUrl: "YOUR_GITHUB_URL",
    liveUrl: "",
    status: "In Progress",
    type: "Personal Project",
    completionDate: "",
    featured: true,
    published: true,
    order: 1
  },
  {
    id: "academic-system",
    title: "Academic Systems Project",
    slug: "academic-systems-project",
    shortDescription: "Placeholder for a university project involving databases or application development.",
    fullDescription:
      "Use this entry for a genuine academic project once details are available. Avoid adding claims, results, or technologies that were not part of the work.",
    imageUrl: "",
    galleryImages: [],
    technologies: ["Python", "SQL"],
    githubUrl: "",
    liveUrl: "",
    status: "Academic Project",
    type: "Academic Project",
    completionDate: "",
    featured: false,
    published: true,
    order: 2
  }
];

export const skillGroups: SkillGroup[] = [
  { id: "programming", category: "Programming", skills: ["Python", "Java", "JavaScript", "TypeScript", "PHP", "SQL"], order: 1 },
  { id: "web", category: "Web", skills: ["React", "Next.js", "Firebase", "Bootstrap", "Tailwind CSS"], order: 2 },
  { id: "databases", category: "Databases", skills: ["Microsoft SQL Server", "MySQL", "Firestore"], order: 3 },
  { id: "cloud", category: "Cloud and Infrastructure", skills: ["AWS", "Docker", "Linux", "Networking", "Virtualisation"], order: 4 },
  { id: "tools", category: "Tools", skills: ["Git", "GitHub", "Visual Studio Code", "IntelliJ IDEA"], order: 5 }
];
