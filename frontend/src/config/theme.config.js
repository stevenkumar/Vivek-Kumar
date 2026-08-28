/**
 * Centralized Theme Configuration Source of Truth
 * Controls all colors, surfaces, typography, borders, and semantic tokens.
 */

export const DEFAULT_THEME = {
  // Brand / Accents (Home page visual identity)
  primaryColor: '#06b6d4', // Neon Cyan
  secondaryColor: '#3b82f6', // Electric Blue
  accentColor: '#8b5cf6', // Violet Purple

  // Canvas & Surfaces
  bgColor: '#050505', // Deep Black
  cardBgColor: '#09090c', // Dark Card Canvas
  cardHoverBgColor: '#121217', // Hover Card Surface

  // Typography
  textColor: '#ffffff', // Primary Heading / Base Text
  mutedTextColor: '#a1a1aa', // Secondary / Muted Text

  // Borders
  borderColor: 'rgba(255, 255, 255, 0.08)',
  borderHoverColor: 'rgba(6, 182, 212, 0.35)',

  // Semantic Status Tokens (Predefined)
  successColor: '#10b981',
  warningColor: '#f59e0b',
  errorColor: '#ef4444',
  infoColor: '#3b82f6',
}

export const THEME_PRESETS = [
  {
    name: 'Neon Cyan (Default)',
    primaryColor: '#06b6d4',
    secondaryColor: '#3b82f6',
    accentColor: '#8b5cf6',
    bgColor: '#050505',
    cardBgColor: '#09090c',
    cardHoverBgColor: '#121217',
    textColor: '#ffffff',
    mutedTextColor: '#a1a1aa',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderHoverColor: 'rgba(6, 182, 212, 0.35)',
  },
  {
    name: 'Cyber Emerald',
    primaryColor: '#10b981',
    secondaryColor: '#059669',
    accentColor: '#34d399',
    bgColor: '#040d08',
    cardBgColor: '#07170f',
    cardHoverBgColor: '#0b2318',
    textColor: '#ffffff',
    mutedTextColor: '#94a3b8',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderHoverColor: 'rgba(16, 185, 129, 0.35)',
  },
  {
    name: 'Royal Purple',
    primaryColor: '#a855f7',
    secondaryColor: '#6366f1',
    accentColor: '#ec4899',
    bgColor: '#08050e',
    cardBgColor: '#110c1c',
    cardHoverBgColor: '#1a132b',
    textColor: '#ffffff',
    mutedTextColor: '#a1a1aa',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderHoverColor: 'rgba(168, 85, 247, 0.35)',
  },
  {
    name: 'Sunset Orange',
    primaryColor: '#f97316',
    secondaryColor: '#ef4444',
    accentColor: '#eab308',
    bgColor: '#0a0503',
    cardBgColor: '#140c08',
    cardHoverBgColor: '#20130d',
    textColor: '#ffffff',
    mutedTextColor: '#a8a29e',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderHoverColor: 'rgba(249, 115, 22, 0.35)',
  },
  {
    name: 'Midnight Amber',
    primaryColor: '#f59e0b',
    secondaryColor: '#d97706',
    accentColor: '#fbbf24',
    bgColor: '#0a0803',
    cardBgColor: '#141007',
    cardHoverBgColor: '#201a0c',
    textColor: '#ffffff',
    mutedTextColor: '#a1a1aa',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderHoverColor: 'rgba(245, 158, 11, 0.35)',
  },
  {
    name: 'Electric Crimson',
    primaryColor: '#f43f5e',
    secondaryColor: '#8b5cf6',
    accentColor: '#fb7185',
    bgColor: '#0a0406',
    cardBgColor: '#14080d',
    cardHoverBgColor: '#200d15',
    textColor: '#ffffff',
    mutedTextColor: '#a1a1aa',
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderHoverColor: 'rgba(244, 63, 94, 0.35)',
  },
]

export const hexToRgb = (hex, fallback = '6, 182, 212') => {
  if (!hex || typeof hex !== 'string') return fallback
  let c = hex.replace('#', '')
  if (c.length === 3) c = c.split('').map((x) => x + x).join('')
  const num = parseInt(c, 16)
  if (isNaN(num)) return fallback
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`
}

/**
 * Injects theme properties onto the target DOM root (e.g. document.documentElement).
 */
export const applyThemeToRoot = (theme = DEFAULT_THEME, targetElement = null) => {
  if (typeof document === 'undefined') return
  const root = targetElement || document.documentElement

  const primary = theme.primaryColor || DEFAULT_THEME.primaryColor
  const secondary = theme.secondaryColor || DEFAULT_THEME.secondaryColor
  const accent = theme.accentColor || DEFAULT_THEME.accentColor
  const bg = theme.bgColor || DEFAULT_THEME.bgColor
  const card = theme.cardBgColor || DEFAULT_THEME.cardBgColor
  const cardHover = theme.cardHoverBgColor || DEFAULT_THEME.cardHoverBgColor
  const text = theme.textColor || DEFAULT_THEME.textColor
  const muted = theme.mutedTextColor || DEFAULT_THEME.mutedTextColor
  const border = theme.borderColor || DEFAULT_THEME.borderColor
  const borderHover = theme.borderHoverColor || `rgba(${hexToRgb(primary)}, 0.35)`

  const success = theme.successColor || DEFAULT_THEME.successColor
  const warning = theme.warningColor || DEFAULT_THEME.warningColor
  const error = theme.errorColor || DEFAULT_THEME.errorColor
  const info = theme.infoColor || DEFAULT_THEME.infoColor

  root.style.setProperty('--color-primary', primary)
  root.style.setProperty('--color-primary-rgb', hexToRgb(primary, '6, 182, 212'))
  root.style.setProperty('--color-secondary', secondary)
  root.style.setProperty('--color-secondary-rgb', hexToRgb(secondary, '59, 130, 246'))
  root.style.setProperty('--color-accent', accent)
  root.style.setProperty('--color-accent-rgb', hexToRgb(accent, '139, 92, 246'))

  root.style.setProperty('--color-bg', bg)
  root.style.setProperty('--color-card', card)
  root.style.setProperty('--color-card-hover', cardHover)

  root.style.setProperty('--color-text', text)
  root.style.setProperty('--color-text-muted', muted)

  root.style.setProperty('--color-border', border)
  root.style.setProperty('--color-border-hover', borderHover)

  root.style.setProperty('--color-success', success)
  root.style.setProperty('--color-warning', warning)
  root.style.setProperty('--color-error', error)
  root.style.setProperty('--color-info', info)
}
