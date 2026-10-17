export interface Project {
  id: number | string
  title: string
  description: string
  techStack: string[]
  technologies?: string[]
  liveUrl?: string
  link?: string
  githubUrl?: string
  image?: string
  category: string
  featured?: boolean
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'ShadiCard Studio — Vector Design & 300-DPI Print Engine',
    description:
      'A customizable multi-page foldable card studio built with Next.js and Fabric.js featuring phonetic typing transliteration and a custom Node.js backend route for 300-DPI vector PDF generation.',
    techStack: ['Next.js', 'TypeScript', 'Fabric.js', 'Node.js', 'Tailwind CSS'],
    technologies: ['Next.js', 'TypeScript', 'Fabric.js', 'Node.js', 'Tailwind CSS'],
    liveUrl: '',
    githubUrl: 'https://github.com/stevenkumar',
    image: '',
    category: 'Fullstack',
    featured: true,
  },
  {
    id: 2,
    title: 'The Tek Doctor',
    description:
      'A full-stack device repair management platform featuring online repair bookings, real-time tracking, technician coordination, and digital invoicing.',
    techStack: ['React', 'Node.js', 'MySQL', 'Tailwind CSS', 'Framer Motion'],
    technologies: ['React', 'Node.js', 'MySQL', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://thetekdoctor.com',
    githubUrl: 'https://github.com/stevenkumar',
    image: '/tekdoctor.png',
    category: 'Fullstack',
    featured: true,
  },
  {
    id: 3,
    title: 'TekUnik — Digital Solutions Agency',
    description:
      'A modern corporate website for TekUnik, a Mumbai-based digital agency delivering web development, mobile apps, UI/UX design, SEO, and complete digital marketing services. Features a full service showcase, strategic partnership wall, and a fast, fully responsive interface built to convert visitors into clients.',
    techStack: ['React', 'Vite', 'Tailwind CSS', 'JavaScript'],
    technologies: ['React', 'Vite', 'Tailwind CSS', 'JavaScript'],
    liveUrl: 'https://www.tekunik.in/',
    githubUrl: 'https://github.com/stevenkumar',
    image: '/home/tekunik.png',
    category: 'Fullstack',
    featured: true,
  },
  {
    id: 4,
    title: 'BookHaven',
    description:
      'An interactive e-commerce bookstore interface featuring responsive catalog grids, dynamic category filtering, and a clean user journey.',
    techStack: ['HTML', 'CSS', 'JavaScript'],
    technologies: ['HTML', 'CSS', 'JavaScript'],
    liveUrl: 'https://frontend-ten-kappa-52l8qf8r3e.vercel.app/',
    githubUrl: 'https://github.com/stevenkumar',
    image: '/home/bookhaven.png',
    category: 'Frontend',
    featured: false,
  },
]
