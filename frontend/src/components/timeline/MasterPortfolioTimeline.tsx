import { User, Briefcase, Code, Cpu, Layout, Layers } from 'lucide-react'
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline'

const portfolioData = [
  {
    id: 1,
    title: 'About Me',
    date: 'Vivek Kumar',
    content:
      'I am a creative designer and developer passionate about building seamless web experiences. I love turning complex code into clean, beautiful interfaces.',
    category: 'About',
    icon: User,
    relatedIds: [2, 4, 6],
    status: 'completed' as const,
    energy: 100,
  },
  {
    id: 2,
    title: 'Senior Frontend Developer',
    date: '2024 - Present',
    content:
      'Tech Solutions Inc. - Built scalable UI components and optimized performance by 40%. Leading frontend architecture and mentoring junior developers.',
    category: 'Experience',
    icon: Briefcase,
    relatedIds: [1, 3],
    status: 'in-progress' as const,
    energy: 95,
  },
  {
    id: 3,
    title: 'Full Stack Developer',
    date: '2022 - 2024',
    content:
      'Creative Agency - Developed custom web applications using MERN stack. Specialized in building highly interactive and responsive user interfaces.',
    category: 'Experience',
    icon: Code,
    relatedIds: [2],
    status: 'completed' as const,
    energy: 85,
  },
  {
    id: 4,
    title: 'UI/UX & Website Design',
    date: 'Services',
    content:
      'Specializing in Mobile App design, User Research, Prototyping, and E-commerce landing pages with a focus on modern aesthetics.',
    category: 'Services',
    icon: Layout,
    relatedIds: [1, 5],
    status: 'completed' as const,
    energy: 90,
  },
  {
    id: 5,
    title: 'Application Design',
    date: 'Services',
    content:
      'Building Cross-Platform PWAs, Design Systems, and Custom Themes. Focus on Style Guides, Components, and Design Tokens.',
    category: 'Services',
    icon: Layers,
    relatedIds: [4],
    status: 'completed' as const,
    energy: 80,
  },
  {
    id: 6,
    title: 'Skills & Tech',
    date: 'Stack',
    content:
      'Expertise in: React, JavaScript, Tailwind CSS, Node.js, Framer Motion, TypeScript, and MongoDB.',
    category: 'Skills',
    icon: Cpu,
    relatedIds: [1],
    status: 'completed' as const,
    energy: 90,
  },
]

export function MasterPortfolioTimeline() {
  return (
    <section className="bg-theme-canvas py-12 md:py-20 relative overflow-hidden text-theme-base">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-theme-base mb-4 tracking-tighter">
            My Journey <span className="text-theme-primary">&</span> Expertise
          </h2>
          <p className="text-theme-muted text-sm md:text-base max-w-2xl mx-auto px-4">
            Interactive orbital map of my professional career, core skills, and specialized services. Click any node to explore.
          </p>
        </div>
        <div className="h-[500px] md:h-[800px] w-full rounded-2xl md:rounded-3xl border border-theme overflow-hidden relative shadow-2xl bg-theme-card">
          <RadialOrbitalTimeline timelineData={portfolioData} />
        </div>
      </div>
    </section>
  )
}

export default MasterPortfolioTimeline
