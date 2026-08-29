/**
 * Vercel Serverless Entry Point
 * File-based JSON backend (no database).
 * Uses dynamic import to catch any top-level initialization errors
 * and return them as JSON.
 */
export default async (req, res) => {
  try {
    // Dynamic import catches crashes in any imported backend modules
    const { default: app } = await import('../backend/api/index.js')

    // Express app is a function that can be used as a handler
    return app(req, res)
  } catch (error) {
    console.error('🚀 VERCEL BOOTSTRAP ERROR:', error)

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'The backend failed to start.',
        error: process.env.NODE_ENV === 'development' ? error.message : error.toString(),
        tip: 'Check your Vercel Logs for "🚀 VERCEL BOOTSTRAP ERROR"',
      })
    }
  }
}
