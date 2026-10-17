import React from 'react'
import { User, Briefcase, Code, Cpu, Layout, Layers, type LucideIcon } from 'lucide-react'
import RadialOrbitalTimeline from '../ui/radial-orbital-timeline'
import Typography from '../ui/Typography'

export interface TimelineItem {
  id: number
  title: string
  date: string
  content: string
  category: string
  icon: LucideIcon
  relatedIds: number[]
  status: 'completed' | 'in-progress' | 'pending'
  energy: number
}

const portfolioData: TimelineItem[] = [
  {
    id: 1,
    title: 'About Me',
    date: 'Vivek Kumar',
    content:
      'Frontend & Full-Stack Engineer passionate about building fast, scalable, and visually engaging web products using React, Next.js, TypeScript, and Node.js.',
    category: 'About',
    icon: User,
    relatedIds: [2, 4, 6],
    status: 'completed',
    energy: 100,
  },
  {
    id: 2,
    title: 'Frontend Developer @ TekUnik',
    date: '2024 - Present',
    content:
      'TekUnik Digital Solutions — Delivering high-conversion corporate web platforms, responsive UI architectures, and production deployments.',
    category: 'Experience',
    icon: Briefcase,
    relatedIds: [1, 3],
    status: 'in-progress',
    energy: 95,
  },
  {
    id: 3,
    title: 'The Tek Doctor Platform',
    date: '2025 - Present',
    content:
      'Architecting a full-stack device repair management platform featuring multi-role dashboards, real-time tracking, technician workflows, and digital invoicing.',
    category: 'Experience',
    icon: Code,
    relatedIds: [2, 4],
    status: 'in-progress',
    energy: 90,
  },
  {
    id: 4,
    title: 'ShadiCard Studio Engine',
    date: '2025',
    content:
      'Engineered a multi-page foldable card studio using Next.js, TypeScript, and Fabric.js with a custom Node.js backend route for 300-DPI print-ready PDF generation.',
    category: 'Engineering',
    icon: Layout,
    relatedIds: [1, 5],
    status: 'completed',
    energy: 95,
  },
  {
    id: 5,
    title: 'UI/UX & Product Engineering',
    date: 'Expertise',
    content:
      'Bridging clean frontend architecture with human-centric design systems, interactive canvas tools, and smooth Framer Motion micro-interactions.',
    category: 'Expertise',
    icon: Layers,
    relatedIds: [4, 6],
    status: 'completed',
    energy: 85,
  },
  {
    id: 6,
    title: 'Core Tech Arsenal',
    date: 'Stack',
    content:
      'React 19, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, Framer Motion, Fabric.js, Node.js, MySQL, and REST APIs.',
    category: 'Skills',
    icon: Cpu,
    relatedIds: [1, 5],
    status: 'completed',
    energy: 90,
  },
]

export const MasterPortfolioTimeline: React.FC = () => {
  return (
    <section className="bg-theme-canvas py-12 md:py-20 relative overflow-hidden text-theme-base">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12">
          <Typography variant="h2" className="mb-4 tracking-tighter">
            My Journey <span className="text-theme-primary">&</span> Expertise
          </Typography>
          <Typography variant="body" className="max-w-2xl mx-auto px-4">
            Interactive orbital map of my professional career, core skills, and specialized engineering projects. Click any node to explore.
          </Typography>
        </div>
        <div className="h-[500px] md:h-[800px] w-full rounded-2xl md:rounded-3xl border border-theme overflow-hidden relative shadow-2xl bg-theme-card">
          <RadialOrbitalTimeline timelineData={portfolioData} />
        </div>
      </div>
    </section>
  )
}

export default MasterPortfolioTimeline
