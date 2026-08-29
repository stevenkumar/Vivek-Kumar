import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, 'data')
const UPLOADS_DIR = path.join(__dirname, 'uploads')

/**
 * Ensure data and uploads folders exist. Wrapped in try/catch so it never
 * crashes at import time on read-only hosts (e.g. Vercel serverless function).
 */
const ensureDir = (dir) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  } catch (err) {
    console.warn(`Could not create directory ${dir}: ${err.message}`)
  }
}

ensureDir(DATA_DIR)
ensureDir(UPLOADS_DIR)

/**
 * Read a JSON file from the data directory. Returns fallback if missing/invalid.
 * Read-only — works on any host including Vercel (committed files are readable).
 */
export const readJson = (file, fallback) => {
  const target = path.join(DATA_DIR, file)
  try {
    if (fs.existsSync(target)) {
      return JSON.parse(fs.readFileSync(target, 'utf-8'))
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err)
  }
  return fallback
}

/**
 * Write a JSON file to the data directory.
 * Requires a writable filesystem (Node VPS / cPanel / localhost).
 */
export const writeJson = (file, data) => {
  const target = path.join(DATA_DIR, file)
  fs.writeFileSync(target, JSON.stringify(data, null, 2), 'utf-8')
}

export { DATA_DIR, UPLOADS_DIR }
