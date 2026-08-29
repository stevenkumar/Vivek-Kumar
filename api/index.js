/**
 * Root API entry — dual-mode.
 * - Vercel Serverless: exports an async handler that Vercel invokes per request.
 * - Render / standalone (`node api/index.js`): boots the Express backend as a
 *   real HTTP server on process.env.PORT (Render injects PORT).
 * File-based JSON backend (no database).
 */
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Lazily load the shared backend Express app (same code for every host).
const loadApp = async () => {
  const { default: app } = await import('../backend/api/index.js')
  return app
}

// Whether this file is being executed directly (not imported by a runtime).
const isMain =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))

if (isMain && !process.env.VERCEL) {
  // Standalone (Render / localhost): start a real listening server.
  const app = await loadApp()
  const PORT = process.env.PORT || 5000
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT} (PID ${process.pid})`)
  })
}

// Vercel Serverless handler.
export default async (req, res) => {
  try {
    const app = await loadApp()
    return app(req, res)
  } catch (error) {
    console.error('🚀 API BOOTSTRAP ERROR:', error)
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'The backend failed to start.',
        error: process.env.NODE_ENV === 'development' ? error.message : error.toString(),
      })
    }
  }
}
