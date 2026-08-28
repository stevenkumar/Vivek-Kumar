import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Mail,
  MapPin,
  Send,
  ArrowLeft,
  User,
  Phone,
  MessageSquare,
  Clock,
  Copy,
  Check,
} from 'lucide-react'
import ThankYouModal from '../ui/ThankYouModal'
import SocialTerminal from '../ui/SocialTerminal'
import { useSettings } from '../../context/SettingsContext'

const ContactPage = ({ onNavigateHome }) => {
  const { profile, socials } = useSettings()
  const [formData, setFormData] = useState({ name: '', email: '', number: '', message: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [thankYouOpen, setThankYouOpen] = useState(false)
  const [emailCopied, setEmailCopied] = useState(false)

  const directEmail = socials?.email || 'vkvseri@gmail.com'

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directEmail)
    setEmailCopied(true)
    setTimeout(() => setEmailCopied(false), 2000)
  }

  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const nameRegex = /^[a-zA-Z\s]*$/

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    else if (!nameRegex.test(formData.name)) newErrors.name = 'Names cannot contain numbers or special symbols'

    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!emailRegex.test(formData.email.trim())) newErrors.email = 'Please enter a valid email address'

    if (formData.number && formData.number.trim().length !== 10) {
      newErrors.number = 'Phone number must be exactly 10 digits'
    }

    const wordCount = formData.message.trim().split(/\s+/).filter(Boolean).length
    if (wordCount < 1) newErrors.message = 'Message cannot be empty'
    else if (wordCount > 1000) newErrors.message = 'Message limit is 1000 words'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data?.message || `Unable to send message (HTTP ${response.status})`)
      }

      const data = await response.json()
      setSuccessMessage(data.message)
      setThankYouOpen(true)
      setFormData({ name: '', email: '', number: '', message: '' })
      setErrors({})
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  return (
    <section className="py-28 bg-theme-canvas text-theme-base min-h-screen relative overflow-hidden px-4">
      <ThankYouModal
        isOpen={thankYouOpen}
        onClose={() => setThankYouOpen(false)}
        message={successMessage || "Got it! Your message is in my inbox. I'll get back to you faster than a Mumbai local reaches Dadar! 🚉"}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-4 mb-8">
          {onNavigateHome && (
            <motion.button
              onClick={onNavigateHome}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-theme-muted hover:text-theme-base transition-colors group cursor-pointer w-fit"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1.5 transition-transform" />
              <span className="font-semibold text-sm">Back to Home</span>
            </motion.button>
          )}

          <div className="flex items-center gap-2 text-xs font-mono text-theme-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{profile?.openToWork ? 'Available for Hire' : 'Engaged on projects'}</span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-theme-primary text-xs sm:text-sm font-bold tracking-widest uppercase mb-3 font-mono"
          >
            — Get In Touch —
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-4 gradient-primary-text"
          >
            Let's Build Together
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-theme-muted text-base sm:text-lg leading-relaxed"
          >
            Have a project in mind, an opportunity to discuss, or just want to connect? Send a message or use the interactive developer terminal below.
          </motion.p>
        </div>

        {/* Main Grid: Left Column (Quick Info + Terminal) & Right Column (Contact Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 5 Cols */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Quick Contact Cards Box */}
            <div className="bg-theme-card rounded-[22px] p-6 sm:p-7 border border-theme shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-theme">
                <span className="text-xs font-mono uppercase tracking-widest text-theme-muted font-bold">Contact Channels</span>
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <Clock size={12} /> Response &lt; 24h
                </span>
              </div>

              {/* Direct Email Item with Copy */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-theme-canvas/60 border border-theme hover:border-theme-primary transition-all group">
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-theme-primary/10 text-theme-primary border border-theme">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Direct Inbox</p>
                    <p className="text-sm font-bold text-theme-base group-hover:text-theme-primary transition-colors">{directEmail}</p>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-theme-card hover:bg-zinc-800 text-theme-muted hover:text-theme-base text-xs transition-colors cursor-pointer border border-theme"
                  title="Copy email address"
                >
                  {emailCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>

              {/* Location Item */}
              <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-theme-canvas/60 border border-theme">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">Location & Zone</p>
                  <p className="text-sm font-bold text-theme-base">
                    {profile?.location || 'Mumbai, India'} <span className="text-xs font-normal text-theme-muted">(IST / UTC+5:30)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Developer Social Terminal */}
            <SocialTerminal />
          </div>

          {/* Right Column: 7 Cols (Contact Form) */}
          <div className="lg:col-span-7">
            <div className="bg-theme-card rounded-[22px] p-8 sm:p-10 md:p-12 border border-theme hover:border-theme-primary transition-all duration-500 shadow-2xl relative overflow-hidden">
              {/* Subtle background gradient glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-2 w-2 rounded-full bg-theme-primary" />
                  <h3 className="text-xl sm:text-2xl font-bold text-theme-base tracking-tight">Send a Direct Message</h3>
                </div>
                <p className="text-sm text-theme-muted mb-8">
                  Your message will be sent straight to my inbox via Nodemailer.
                </p>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Name Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-theme-muted uppercase tracking-wider flex items-center gap-1.5">
                        <User size={13} className="text-theme-primary" />
                        <span>Your Name *</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full bg-theme-canvas/80 border ${
                          errors.name ? 'border-red-500 focus:ring-red-500' : 'border-theme focus:border-theme-primary'
                        } rounded-xl px-4 py-3 text-sm text-theme-base placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
                      />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Email Input */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono text-theme-muted uppercase tracking-wider flex items-center gap-1.5">
                        <Mail size={13} className="text-theme-secondary" />
                        <span>Your Email *</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`w-full bg-theme-canvas/80 border ${
                          errors.email ? 'border-red-500 focus:ring-red-500' : 'border-theme focus:border-theme-primary'
                        } rounded-xl px-4 py-3 text-sm text-theme-base placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
                      />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Phone Number Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-theme-muted uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Phone size={13} className="text-purple-400" />
                        <span>Phone Number</span>
                      </span>
                      <span className="text-[10px] text-zinc-500 lowercase">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="number"
                      value={formData.number}
                      onChange={handleChange}
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      className={`w-full bg-theme-canvas/80 border ${
                        errors.number ? 'border-red-500 focus:ring-red-500' : 'border-theme focus:border-theme-primary'
                      } rounded-xl px-4 py-3 text-sm text-theme-base placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all`}
                    />
                    {errors.number && <p className="text-red-400 text-xs mt-1">{errors.number}</p>}
                  </div>

                  {/* Message Input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono text-theme-muted uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare size={13} className="text-emerald-400" />
                        <span>Your Message *</span>
                      </label>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {formData.message.trim().split(/\s+/).filter(Boolean).length}/1000 words
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project, ideas, or timeline..."
                      className={`w-full bg-theme-canvas/80 border ${
                        errors.message ? 'border-red-500 focus:ring-red-500' : 'border-theme focus:border-theme-primary'
                      } rounded-xl px-4 py-3 text-sm text-theme-base placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all resize-none`}
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  </div>

                  {submitError && (
                    <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                      {submitError}
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="w-full gradient-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:cursor-not-allowed disabled:opacity-60 transition-all text-sm sm:text-base cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Sending message...</span>
                      </span>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Message</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactPage
