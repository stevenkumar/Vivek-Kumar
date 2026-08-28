import React, { useState, useRef, useEffect } from 'react'
import {
  Terminal as TerminalIcon,
  Github,
  Linkedin,
  Twitter,
  Mail,
  FileText,
  Trash2,
  CornerDownLeft,
  Check,
  ExternalLink,
} from 'lucide-react'
import { useSettings } from '../../context/SettingsContext'

const SocialTerminal = () => {
  const { socials, profile } = useSettings()

  const activeSocials = {
    github: socials?.github || 'https://github.com/stevenkumar',
    linkedin: socials?.linkedin || 'https://www.linkedin.com/in/vivek-kumar-733552317/',
    twitter: socials?.twitter || 'https://x.com/Vivek9653',
    email: socials?.email || 'vkvseri@gmail.com',
    resume: socials?.resumeUrl || './home/Vivek_ Resume_2026.pdf',
  }

  const initialLogs = [
    { type: 'system', text: `${profile?.name || 'Vivek Kumar'} Developer Shell v2.6.0 (x86_64-portfolio)` },
    { type: 'info', text: 'Type a command or click a quick action below to access socials:' },
    { type: 'hint', text: 'Commands: github, linkedin, twitter, email, resume, skills, clear, help' },
  ]

  const [input, setInput] = useState('')
  const [logs, setLogs] = useState(initialLogs)
  const [copied, setCopied] = useState(false)
  const terminalEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [logs])

  const copyEmail = () => {
    navigator.clipboard.writeText(activeSocials.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase()
    if (!cmd) return

    const newLogs = [...logs, { type: 'command', text: `$ ${cmd}` }]

    switch (cmd) {
      case 'help':
        newLogs.push({
          type: 'output',
          text: `Available Commands:
  • github, gh       -> Open GitHub Profile (${activeSocials.github})
  • linkedin, li     -> Open LinkedIn Profile
  • twitter, x       -> Open X (Twitter) Profile
  • email, mail      -> Copy email address to clipboard (${activeSocials.email})
  • resume, cv       -> Download / View Resume PDF
  • skills           -> View core technical skills & frameworks
  • whoami           -> View quick bio summary
  • sudo hire        -> Unlock instant developer hire protocol
  • clear, cls       -> Clear terminal screen`,
        })
        break

      case 'github':
      case 'gh':
      case '1':
        newLogs.push({ type: 'success', text: `🚀 Opening GitHub: ${activeSocials.github}` })
        window.open(activeSocials.github, '_blank', 'noopener,noreferrer')
        break

      case 'linkedin':
      case 'li':
      case '2':
        newLogs.push({ type: 'success', text: `💼 Opening LinkedIn Profile...` })
        window.open(activeSocials.linkedin, '_blank', 'noopener,noreferrer')
        break

      case 'twitter':
      case 'x':
      case '3':
        newLogs.push({ type: 'success', text: `🐦 Opening X (Twitter): ${activeSocials.twitter}` })
        window.open(activeSocials.twitter, '_blank', 'noopener,noreferrer')
        break

      case 'email':
      case 'mail':
      case '4':
        copyEmail()
        newLogs.push({ type: 'success', text: `📋 Email (${activeSocials.email}) copied to clipboard!` })
        break

      case 'resume':
      case 'cv':
      case '5':
        newLogs.push({ type: 'success', text: `📄 Opening Resume PDF...` })
        window.open(activeSocials.resume, '_blank')
        break

      case 'skills':
        newLogs.push({
          type: 'output',
          text: `⚡ Tech Stack & Expertise:
  Frontend:  React 19, Next.js, TypeScript, JavaScript (ES6+), Vite, Tailwind CSS, Framer Motion
  Backend:   Node.js, Express, REST APIs, Nodemailer
  Tools:     Git, GitHub, VS Code, Postman, Vercel`,
        })
        break

      case 'whoami':
        newLogs.push({
          type: 'output',
          text: `👨‍💻 ${profile?.name || 'Vivek Kumar'} — ${profile?.role || 'Frontend Developer & UI Engineer'} based in ${profile?.location || 'Mumbai, India'}.
${profile?.bio ? profile.bio.split('\n\n')[0] : 'Passionate about fast, animated, accessible web interfaces.'}`,
        })
        break

      case 'sudo hire':
      case 'hire':
        newLogs.push({
          type: 'success',
          text: `🎉 Access Granted! ${profile?.name || 'Vivek'} is currently available for hire (Freelance & Full-time).
Fill out the contact form on the right to start building together!`,
        })
        break

      case 'clear':
      case 'cls':
        setLogs([initialLogs[0]])
        setInput('')
        return

      default:
        newLogs.push({
          type: 'error',
          text: `command not found: "${cmd}". Type "help" or click one of the quick action buttons.`,
        })
        break
    }

    setLogs(newLogs)
    setInput('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    executeCommand(input)
  }

  const handleQuickAction = (cmd) => {
    executeCommand(cmd)
    inputRef.current?.focus()
  }

  return (
    <div className="bg-theme-card rounded-[22px] border border-theme hover:border-theme-primary transition-all duration-500 p-6 sm:p-7 shadow-2xl overflow-hidden flex flex-col justify-between">
      {/* Terminal Window Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-theme">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono text-theme-muted ml-2">bash — {profile?.name ? profile.name.toLowerCase().replace(/\s+/g, '') : 'vivek'}@portfolio: ~/socials</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-theme-primary bg-theme-canvas border border-theme px-2.5 py-0.5 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-theme-primary animate-pulse" />
          <span>LIVE CLI</span>
        </div>
      </div>

      {/* Quick Action Shortcut Buttons */}
      <div className="mb-4">
        <p className="text-[11px] font-mono uppercase tracking-wider text-theme-muted mb-2 font-bold flex items-center gap-1.5">
          <TerminalIcon size={12} className="text-theme-primary" />
          <span>Quick Shortcuts (1-Click Run)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickAction('github')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-canvas hover:bg-theme-card border border-theme hover:border-theme-primary text-theme-muted hover:text-theme-base text-xs font-mono transition-all cursor-pointer group"
          >
            <Github size={13} className="text-theme-primary" />
            <span>[1] GitHub</span>
            <ExternalLink size={10} className="opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => handleQuickAction('linkedin')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-canvas hover:bg-theme-card border border-theme hover:border-theme-primary text-theme-muted hover:text-theme-base text-xs font-mono transition-all cursor-pointer group"
          >
            <Linkedin size={13} className="text-blue-400" />
            <span>[2] LinkedIn</span>
            <ExternalLink size={10} className="opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => handleQuickAction('twitter')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-canvas hover:bg-theme-card border border-theme hover:border-theme-primary text-theme-muted hover:text-theme-base text-xs font-mono transition-all cursor-pointer group"
          >
            <Twitter size={13} className="text-sky-400" />
            <span>[3] X / Twitter</span>
            <ExternalLink size={10} className="opacity-40 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => handleQuickAction('email')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-canvas hover:bg-theme-card border border-theme hover:border-theme-primary text-theme-muted hover:text-theme-base text-xs font-mono transition-all cursor-pointer"
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Mail size={13} className="text-purple-400" />}
            <span>[4] Copy Email</span>
          </button>

          <button
            onClick={() => handleQuickAction('resume')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-canvas hover:bg-theme-card border border-theme hover:border-theme-primary text-theme-muted hover:text-theme-base text-xs font-mono transition-all cursor-pointer"
          >
            <FileText size={13} className="text-amber-400" />
            <span>[5] Resume</span>
          </button>

          <button
            onClick={() => handleQuickAction('clear')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-canvas/60 hover:bg-theme-card border border-theme text-theme-muted hover:text-theme-base text-xs font-mono transition-all cursor-pointer ml-auto"
            title="Clear terminal output"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Terminal Screen / Logs */}
      <div className="bg-theme-canvas rounded-xl border border-theme p-4 h-56 sm:h-64 overflow-y-auto font-mono text-xs text-theme-muted space-y-2 select-text custom-scrollbar">
        {logs.map((log, i) => (
          <div key={i} className="leading-relaxed">
            {log.type === 'system' && <span className="text-zinc-500">{log.text}</span>}
            {log.type === 'info' && <span className="text-theme-primary font-semibold">{log.text}</span>}
            {log.type === 'hint' && <span className="text-zinc-400 italic">{log.text}</span>}
            {log.type === 'command' && <span className="text-emerald-400 font-bold">{log.text}</span>}
            {log.type === 'success' && <span className="text-theme-primary font-semibold">{log.text}</span>}
            {log.type === 'error' && <span className="text-red-400">{log.text}</span>}
            {log.type === 'output' && <pre className="text-theme-base whitespace-pre-wrap font-mono mt-1">{log.text}</pre>}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Command Input Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-4 flex items-center gap-2 bg-theme-canvas border border-theme rounded-xl px-4 py-2.5 focus-within:border-theme-primary transition-colors"
      >
        <span className="text-theme-primary font-mono text-xs font-bold shrink-0">
          {profile?.name ? profile.name.toLowerCase().replace(/\s+/g, '') : 'vivek'}@portfolio:~$
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="type 'github', 'help', 'resume'..."
          className="w-full bg-transparent text-theme-base font-mono text-xs focus:outline-none placeholder:text-zinc-600"
          autoComplete="off"
          spellCheck="false"
        />
        <button
          type="submit"
          aria-label="Run command"
          className="p-1 rounded-lg text-theme-muted hover:text-theme-primary transition-colors cursor-pointer shrink-0"
        >
          <CornerDownLeft size={14} />
        </button>
      </form>
    </div>
  )
}

export default SocialTerminal
