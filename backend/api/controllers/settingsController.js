import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { readJson, writeJson, UPLOADS_DIR } from '../store.js'

const SETTINGS_FILE = 'settings.json'

// Ensure the uploads folder exists (local / VPS / cPanel deployments).
// Wrapped in try/catch so this never crashes import on read-only hosts (Vercel).
try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  }
} catch (err) {
  console.warn('Uploads directory unavailable (read-only host):', err.message)
}

// Disk storage for resume uploads (works on Node VPS / cPanel / localhost).
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true })
      }
      cb(null, UPLOADS_DIR)
    } catch (err) {
      cb(err)
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf'
    cb(null, `resume-${Date.now()}${ext}`)
  },
})

export const resumeUploadMiddleware = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const allowed = ['.pdf', '.doc', '.docx']
    if (allowed.includes(ext) || file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF, DOC, and DOCX documents are allowed'))
    }
  },
}).single('resume')

const readSettings = () => readJson(SETTINGS_FILE, {})
const writeSettings = (data) => writeJson(SETTINGS_FILE, data)

/**
 * GET /api/settings - Public settings
 */
export const getSettings = (req, res) => {
  try {
    const settings = readSettings()
    const { adminPassword, ...safeSettings } = settings
    res.json({ success: true, data: safeSettings })
  } catch (error) {
    console.error('Error reading settings:', error)
    res.status(500).json({ success: false, message: 'Failed to read settings' })
  }
}

/**
 * POST /api/settings/admin/login - Admin Password authentication
 */
export const adminLogin = (req, res) => {
  try {
    const { password } = req.body
    const settings = readSettings()
    const expectedPassword = settings.adminPassword || process.env.ADMIN_PASSWORD || 'Admin123!'

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' })
    }

    if (password !== expectedPassword) {
      return res.status(401).json({ success: false, message: 'Invalid admin password' })
    }

    const token = Buffer.from(`admin_${Date.now()}_${expectedPassword}`).toString('base64')
    res.json({ success: true, token, message: 'Login successful' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Authentication error' })
  }
}

/**
 * POST /api/settings/admin/change-password - Update admin password
 */
export const changeAdminPassword = (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    const settings = readSettings()
    const expectedPassword = settings.adminPassword || process.env.ADMIN_PASSWORD || 'Admin123!'

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both current and new passwords are required' })
    }

    if (currentPassword !== expectedPassword) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long' })
    }

    settings.adminPassword = newPassword
    writeSettings(settings)

    const newToken = Buffer.from(`admin_${Date.now()}_${newPassword}`).toString('base64')
    res.json({ success: true, token: newToken, message: 'Admin password updated successfully' })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update admin password' })
  }
}

/**
 * POST /api/settings/admin/upload-resume - Upload Resume PDF
 */
export const uploadResume = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No resume document provided' })
  }

  try {
    const fileUrl = `/uploads/${req.file.filename}`
    const settings = readSettings()

    if (!settings.socials) settings.socials = {}
    settings.socials.resumeUrl = fileUrl
    writeSettings(settings)

    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      message: 'Resume PDF uploaded and saved successfully!',
    })
  } catch (err) {
    console.error('Error saving uploaded resume:', err)
    res.status(500).json({ success: false, message: 'Failed to process resume file upload' })
  }
}

/**
 * PUT /api/settings/admin/settings - Update theme, profile, or socials
 */
export const updateSettings = (req, res) => {
  try {
    const currentSettings = readSettings()
    const updated = {
      ...currentSettings,
      ...req.body,
    }

    writeSettings(updated)
    const { adminPassword, ...safeUpdated } = updated
    res.json({ success: true, data: safeUpdated, message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Error updating settings:', error)
    res.status(500).json({ success: false, message: 'Failed to update settings' })
  }
}
