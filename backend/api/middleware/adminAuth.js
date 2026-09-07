import crypto from 'crypto'
import { readJson } from '../store.js'

const SETTINGS_FILE = 'settings.json'
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000

const getAdminPassword = () => {
  const settings = readJson(SETTINGS_FILE, {})
  const configuredPassword = process.env.ADMIN_PASSWORD || settings.adminPassword

  if (configuredPassword) return configuredPassword
  if (process.env.NODE_ENV !== 'production') return 'Admin123!'

  throw new Error('ADMIN_PASSWORD must be configured in production')
}

const sign = (payload, secret) =>
  crypto.createHmac('sha256', secret).update(payload).digest('base64url')

export const createAdminToken = (password = getAdminPassword()) => {
  const payload = `admin:${Date.now()}`
  return `${payload}.${sign(payload, password)}`
}

export const verifyAdminToken = (token) => {
  if (!token) return false

  const separator = token.lastIndexOf('.')
  if (separator === -1) return false

  const payload = token.slice(0, separator)
  const signature = token.slice(separator + 1)
  const timestamp = Number(payload.split(':')[1])

  if (!payload.startsWith('admin:') || !Number.isFinite(timestamp) || Date.now() - timestamp > TOKEN_TTL_MS) {
    return false
  }

  try {
    const expected = sign(payload, getAdminPassword())
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

export const requireAdmin = (req, res, next) => {
  const authorization = req.headers.authorization || ''
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : ''

  if (!verifyAdminToken(token)) {
    return res.status(401).json({ success: false, message: 'Admin authentication required' })
  }

  next()
}

